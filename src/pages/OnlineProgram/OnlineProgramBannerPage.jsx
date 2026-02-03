import React, { useState, useEffect } from "react";
import { ArrowLeft, Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/Api/OnlineProgramApi/OnlineBannerApi";
import { useToast } from "@/components/ui/use-toast";

const OnlineProgramBannerPage = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();
  const [headerText, setHeaderText] = useState(""); // plain text
  const [previewHeader, setPreviewHeader] = useState(""); // HTML

  const [previewImage, setPreviewImage] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isUrlEntered, setIsUrlEntered] = useState(false);
  const [data, setData] = useState([]);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const banners = await getAllBanners();
      const bannerList = Array.isArray(banners) ? banners : banners.data || [];
      setData(bannerList);

      if (bannerList.length > 0) {
        // auto-fill the first banner in the form
        const firstBanner = bannerList[0];
        fillForm(firstBanner);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      toast({ title: "Error", description: "Fetching failed" });
    }
  };

  const fillForm = (banner) => {
    reset({
      header: banner.bannerTitle,
      description: banner.bannerContent,
    });
    setPreviewHeader(banner.bannerTitle);
    setPreviewImage(banner.bannerImage?.[0] || null);
    setCurrentBannerId(banner._id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setIsFileSelected(true);
      setIsUrlEntered(false); // disable URL input
    };
    reader.readAsDataURL(file);
  };
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreviewImage(url);
    setIsUrlEntered(url.trim() !== "");
    setIsFileSelected(url.trim() !== "" ? false : isFileSelected); // disable file if URL entered
  };
  const onSubmit = async (formData) => {
    try {
      setIsSaving(true);

      const payload = {
        bannerTitle: formData.header,
        bannerContent: formData.description,
        bannerImage: previewImage ? [previewImage] : [],
      };

      if (currentBannerId) {
        await updateBanner(currentBannerId, payload);
      } else {
        await createBanner(payload);
      }

      await fetchData();
      toast({ title: "Success", description: "Banner saved successfully!" });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 bg-card p-4 rounded-lg shadow-sm border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Online Program Banner</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span>/</span>
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/online-program")}>online program</span>
            <span>/</span>
            <span className="font-medium text-foreground">Online Program Banner</span>
          </div>
        </div>
      </div>

      {/* Banner Form */}
      <div className="mb-10 p-6 border rounded-xl bg-white dark:bg-black dark:text-white">
        <h3 className="text-lg font-semibold mb-4">Edit Banner</h3>

        {/* Image Upload */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium">Section Image</label>

          {/* File Upload */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUrlEntered} // disabled if URL entered
          />

          {/* OR URL Input */}
          <Input
            type="text"
            placeholder="Or enter image URL..."
            onChange={handleUrlChange}
            disabled={isFileSelected} // disabled if file selected
            value={isUrlEntered ? previewImage : ""}
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
                onClick={() => {
                  setPreviewImage(null);
                  setIsFileSelected(false);
                  setIsUrlEntered(false);
                }}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>



        {/* Header Input */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium">Header</label>
          <div className="flex items-center gap-2">
            <div
              id="onlineHeaderEditor"
              contentEditable
              className="w-full min-h-[40px] border rounded-md p-2 outline-none"
              onInput={(e) => {
                setPreviewHeader(e.currentTarget.innerHTML);
                setValue("header", e.currentTarget.innerHTML);
              }}
              dangerouslySetInnerHTML={{ __html: previewHeader }}
            />


            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();

                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;

                const range = selection.getRangeAt(0);
                if (range.collapsed) return;

                const span = document.createElement("span");
                span.style.color = "#5ac501";

                range.surroundContents(span);
                selection.removeAllRanges();

                const editor = document.getElementById("onlineHeaderEditor");
                setPreviewHeader(editor.innerHTML);
                setValue("header", editor.innerHTML);
              }}



            >
              <Highlighter size={16} />
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Select text and click <Highlighter size={14} className="inline-block" /> to highlight
          </p>

          {/* Live Preview */}
          <div className="mt-3 border rounded-md p-3 bg-gray-50 dark:bg-black/40">
            <p className="text-xs font-medium mb-1 text-gray-500">Preview:</p>
            <div
              className="text-base leading-tight"
              dangerouslySetInnerHTML={{ __html: previewHeader }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border rounded-md p-2 h-24 resize-none"
            placeholder="Write a short description..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (data.length > 0) fillForm(data[0]); // reset to first banner
            }}
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className={`${isSaving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineProgramBannerPage;
