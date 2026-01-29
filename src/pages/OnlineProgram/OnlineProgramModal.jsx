import React, { useState, useEffect } from "react";
import { Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const OnlineProgramModal = ({
  isOpen,
  onClose,
  defaultHeader = "",
  defaultImage = null,
}) => {
  const { register, setValue } = useForm();

  const [previewHeader, setPreviewHeader] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [undoStack, setUndoStack] = useState([]);

  // ✅ Load default data when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewHeader(defaultHeader);
      setPreviewImage(defaultImage);
      setValue("header", defaultHeader);
    }
  }, [isOpen, defaultHeader, defaultImage, setValue]);

  if (!isOpen) return null;

  // ✅ Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white dark:bg-black dark:text-white rounded-xl shadow-2xl border border-gray-100 dark:border-[#26262680] overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#26262680] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Online Program Hero
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* ✅ Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Image</label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {previewImage && (
              <div className="relative mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-28 w-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ✅ Header Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Header
            </label>

            <div className="flex items-center gap-2">
              <Input
                {...register("header")}
                id="onlineHeaderInput"
                placeholder="Enter header text..."
                value={previewHeader}
                onChange={(e) => {
                  setPreviewHeader(e.target.value);
                  setValue("header", e.target.value);
                }}
              />

              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();

                  const input = document.getElementById("onlineHeaderInput");
                  if (!input) return;

                  const start = input.selectionStart;
                  const end = input.selectionEnd;
                  const value = input.value;

                  if (start === end) return;

                  setUndoStack((prev) => [...prev, value]);

                  const selectedText = value.slice(start, end);
                  const before = value.slice(0, start);
                  const after = value.slice(end);

                  const highlightTag = `<span style="color:#5ac501;">${selectedText}</span>`;
                  const newValue = before + highlightTag + after;

                  input.value = newValue;
                  setPreviewHeader(newValue);
                  setValue("header", newValue);
                }}
              >
                <Highlighter size={16} />
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Select text and click{" "}
              <Highlighter size={14} className="inline-block" /> to highlight
            </p>

            {/* ✅ Live Preview */}
            <div className="mt-3 border rounded-md p-3 bg-gray-50 dark:bg-black/40">
              <p className="text-xs font-medium mb-1 text-gray-500">
                Preview:
              </p>
              <div
                className="text-base leading-tight"
                dangerouslySetInnerHTML={{ __html: previewHeader }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-black flex justify-end gap-3 border-t border-gray-100 dark:border-[#26262680]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineProgramModal;
