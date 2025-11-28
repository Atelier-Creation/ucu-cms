import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, UploadCloud, Paperclip } from "lucide-react";
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/upload`;

/**
 * Props:
 * - uploadPresignUrl: string (e.g. "/api/upload/presign")
 * - accept: string (optional) mime types e.g. "image/*,application/pdf"
 * - maxSizeMB: number (optional)
 * - multiple: boolean
 * - onUploaded(files) -> callback with array of uploaded file metadata
 */
export default function FileUploader({
  uploadPresignUrl = `${BASE_URL}/presign`,
  accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSizeMB = 10,
  multiple = true,
  onUploaded = () => {},
}) {
  const [files, setFiles] = useState([]); // { id, file, preview, progress, status, uploadedUrl }
  const inputRef = useRef(null);

  function humanSize(bytes) {
    if (!bytes) return "0 B";
    const s = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + " " + s[i];
  }

  function handleFilesSelected(fileList) {
    const arr = Array.from(fileList).map((file) => {
      // basic validations
      const maxBytes = maxSizeMB * 1024 * 1024;
      const isTooLarge = file.size > maxBytes;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return {
        id,
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        name: file.name,
        size: file.size,
        formattedSize: humanSize(file.size),
        progress: 0,
        status: isTooLarge ? "error" : "pending",
        error: isTooLarge ? `File exceeds ${maxSizeMB} MB` : null,
        uploadedUrl: null,
        cancelToken: null, // axios cancel token
      };
    });

    setFiles((f) => (multiple ? [...f, ...arr] : [...arr]));
    // start uploads for valid files
    arr.forEach((item) => {
      if (item.status === "pending") uploadFile(item);
    });
  }

  async function uploadFile(item) {
    try {
      // set status uploading early
      setFiles((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "uploading" } : p))
      );

      // Request presigned url from backend
      const meta = {
        filename: item.file.name,
        contentType: item.file.type || "application/octet-stream",
        size: item.file.size,
      };
      const res = await axios.post(uploadPresignUrl, meta);
      // expected: { uploadUrl, publicUrl, key }
      const { uploadUrl, publicUrl } = res.data;

      // upload via PUT (some DO Spaces may require content-type header)
      const source = axios.CancelToken.source();
      setFiles((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, cancelToken: source } : p))
      );

      await axios.put(uploadUrl, item.file, {
        headers: {
          "Content-Type": item.file.type || "application/octet-stream",
        },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setFiles((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, progress } : p))
          );
        },
        cancelToken: source.token,
      });

      // success - mark uploaded
      setFiles((prev) => {
        const updated = prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                status: "uploaded",
                progress: 100,
                uploadedUrl: publicUrl,
              }
            : p
        );

        const uploadedFiles = updated
          .filter((f) => f.status === "uploaded")
          .map((f) => ({
            name: f.name,
            size: f.size,
            url: f.uploadedUrl,
          }));

        onUploaded(uploadedFiles);

        return updated;
      });
    } catch (err) {
      console.error("Upload error:", err);
      const msg = axios.isCancel(err)
        ? "Upload cancelled"
        : err?.response?.data?.message || "Upload failed";
      setFiles((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "error", error: msg } : p
        )
      );
    }
  }

  function removeFile(id) {
    const f = files.find((x) => x.id === id);
    if (!f) return;
    // cancel if uploading
    if (f.cancelToken) f.cancelToken.cancel("User cancelled");
    // revoke preview url
    if (f.preview) URL.revokeObjectURL(f.preview);
    setFiles((prev) => prev.filter((x) => x.id !== id));
  }



  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      handleFilesSelected(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white hover:border-primary transition"
          >
            <UploadCloud className="w-8 h-8 text-primary mb-2" />
            <div className="text-sm font-medium">Drag & drop files here</div>
            <div className="text-xs text-muted-foreground mt-1">or</div>

            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" onClick={() => inputRef.current.click()}>
                <Paperclip className="w-4 h-4 mr-2" /> Choose file
                {multiple ? "s" : ""}
              </Button>
              <div className="text-xs text-muted-foreground ml-2">
                Accepts: images, PDF, DOCX. Max {maxSizeMB} MB
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
          </div>

          {/* file list */}
          <div className="grid gap-3">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 border rounded-md bg-muted/30"
              >
                {/* preview */}
                <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground px-2 text-center">
                      {f.name.split(".").pop().toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.formattedSize}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {f.status === "uploading" && (
                        <div className="text-xs text-muted-foreground">
                          {f.progress}%
                        </div>
                      )}
                      {f.status === "error" && (
                        <div className="text-xs text-red-600">Error</div>
                      )}
                      {f.status === "uploaded" && (
                        <div className="text-xs text-green-600">Uploaded</div>
                      )}
                      <button
                        onClick={() => removeFile(f.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div className="mt-2">
                    <Progress value={f.progress} className="h-2" />
                    {f.error && (
                      <div className="text-xs text-red-500 mt-1">{f.error}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-sm text-muted-foreground p-3 text-center">
                No files added yet.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
