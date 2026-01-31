import React, { useRef, useState, useCallback } from "react";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * A universal file uploader for images & documents.
 * Uploads directly to DigitalOcean Spaces via a presigned URL.
 *
 * Props:
 *  - label: string
 *  - value: string (uploaded file URL)
 *  - onChange: (url: string) => void
 *  - accept: string (e.g. "image/*,.pdf")
 *  - uploadUrl: string (backend presigned URL endpoint)
 */

export default function FileUploader({
  label = "Upload File",
  value,
  onChange,
  accept = "image/*,.pdf,.doc,.docx",
  uploadUrl = "/api/upload",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setError("");
      setUploading(true);

      try {
        // 1️⃣ Ask backend for presigned URL
        // Use environment variable for base URL + upload/presign endpoint
        const presignUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/presign`;

        const res = await fetch(presignUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type
          })
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const { uploadUrl, publicUrl } = await res.json();

        // 2️⃣ Upload file directly to DigitalOcean Space
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // 3️⃣ Notify parent
        onChange(publicUrl);
      } catch (err) {
        console.error(err);
        setError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [uploadUrl, onChange]
  );

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    await handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* <Label>{label}</Label> */}

      {value ? (
        <div className="flex items-center gap-3 border rounded-md p-2 bg-muted/20">
          {value.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
            <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ) : (
            <FileText className="w-8 h-8 text-muted-foreground" />
          )}
          <div className="flex-1 break-all text-sm">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {value.split("/").pop()}
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 py-12 text-center cursor-pointer transition-colors",
            dragOver ? "border-blue-500 bg-blue-50" : "border-muted-foreground/30"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-1" />
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Upload className="w-6 h-6 mb-1" />
              <p className="text-sm">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                Allowed: Images, PDFs, DOCs
              </p>
            </div>
          )}

          <input
            type="file"
            accept={accept}
            ref={inputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
