import React, { useState, useEffect } from "react";
import { Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "@/Api/OnlineProgramApi/OnlineBannerApi";
const OnlineProgramModal = ({
  isOpen,
  onClose,
  defaultHeader = "",
  defaultImage = null,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const [previewHeader, setPreviewHeader] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [data, setData] = useState([])
  const [editingdata, setEditingData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchdata()
  }, [])

  const fetchdata = async () => {
    try {
      const data = await getAllBanners()
      console.log("Fetched Banners:", data);
      setData(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }

  const onSubmit = async (formData) => {
    try {
      setIsSaving(true);

      const payload = {
        bannerTitle: formData.header,
        bannerContent: formData.description,
        bannerImage: previewImage ? [previewImage] : [],
      };

      if (editingdata) {
        await updateBanner(editingdata._id, payload);
      } else {
        await createBanner(payload);
      }

      // 🔄 fetch fresh data
      const updatedData = await getAllBanners();
      const banners = Array.isArray(updatedData)
        ? updatedData
        : updatedData.data || [];

      setData(banners);

      // 🧠 get latest updated item
      const latestItem = editingdata
        ? banners.find(b => b._id === editingdata._id)
        : banners[banners.length - 1];

      onClose();

      setTimeout(() => {
        setEditingData(latestItem);

        reset({
          header: latestItem?.bannerTitle || "",
          description: latestItem?.bannerContent || "",
        });

        setPreviewHeader(latestItem?.bannerTitle || "");
        setPreviewImage(latestItem?.bannerImage?.[0] || null);

        setDialogOpen(true);
      }, 300);

    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };



  const handleEdit = (item) => {
    setEditingData(item);

    reset({
      header: item.bannerTitle,
      description: item.bannerContent,
    });

    setPreviewHeader(item.bannerTitle);
    setPreviewImage(item.bannerImage?.[0] || null);
    setDialogOpen(true);
  };


  const handleDelete = async (id) => {
    await deleteBanner(id);
    await fetchdata();
  };



  // ✅ Load default data when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewHeader(defaultHeader);
      setPreviewImage(defaultImage);
      setValue("header", defaultHeader);
    }
  }, [isOpen, defaultHeader, defaultImage, setValue]);

  if (!isOpen) return null;

  // ✅ Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
                value={previewHeader.replace(/<[^>]+>/g, "")}
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

                  if (start === end) return;

                  const value = previewHeader;

                  const selectedText = value.slice(start, end);
                  const before = value.slice(0, start);
                  const after = value.slice(end);

                  const highlightTag = `<span style="color:#5ac501;">${selectedText}</span>`;
                  const newValue = before + highlightTag + after;

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
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full border rounded-md p-2 h-24 resize-none"
              placeholder="Write a short description..."
            />
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
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg
    ${isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
  `}
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default OnlineProgramModal;
