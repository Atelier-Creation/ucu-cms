import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Trash2, Edit2, Plus, PanelsTopLeft, Highlighter } from "lucide-react";
import { Card } from "@/components/ui/card";
import bannerImage from "@/assets/banner1.jpeg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from "@/Api/HomeApi";
// --- Initial Hero Data ---


const fetchSlides = async () =>
  JSON.parse(localStorage.getItem("heroSlides") || "[]");

const saveSlides = async (slides) => {
  localStorage.setItem("heroSlides", JSON.stringify(slides));
  return slides;
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewHeader, setPreviewHeader] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  // ✅ Fetch banners from backend
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const data = await getBanners();
      console.log("Fetched Banners:", data); // 👀 check the shape
      setSlides(Array.isArray(data) ? data : data.data || []); // ✅ fix
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };


  // ✅ Handle Add/Edit form submit
const onSubmit = async (data) => {
  try {
    const payload = {
      bannerTitle: data.header,
      bannerContent: data.description,
      bannerImage: previewImage ? [previewImage] : [],
      applyLink: data.applyLink || "/apply",
      pdf: data.brochureLink || "/brochure.pdf",
    };

    if (editingSlide) {
      await updateBanner(editingSlide._id, payload);
    } else {
      await createBanner(payload);
    }

    await fetchSlides();
    setDialogOpen(false);
    setEditingSlide(null);
    reset();
    setPreviewImage(null);
  } catch (error) {
    console.error("Error saving banner:", error);
  }
};


  // ✅ Edit
  const handleEdit = (slide) => {
    setEditingSlide(slide);
    reset({
      header: slide.bannerTitle,
      description: slide.bannerContent,
    });
    setPreviewImage(slide.bannerImage?.[0] || null);
    setPreviewHeader(slide.bannerTitle);
    setDialogOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await deleteBanner(id);
    await fetchSlides();
  };

  // ✅ Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Undo highlight shortcut
  useEffect(() => {
    const handleUndo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        setUndoStack((prev) => {
          if (!prev.length) return prev;
          const newStack = [...prev];
          const lastValue = newStack.pop();
          setValue("header", lastValue);
          setPreviewHeader(lastValue);
          const input = document.getElementById("headerInput");
          if (input) input.value = lastValue;
          return newStack;
        });
      }
    };
    window.addEventListener("keydown", handleUndo);
    return () => window.removeEventListener("keydown", handleUndo);
  }, [setValue]);


  return (
    <div className="p-6 space-y-6">
      {/* ✅ Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pages/home/none">
              <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
              Pages
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pages/home">Home Page</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hero Slides</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Hero Slides Management</h1>

      {/* Add / Edit Slide Sheet */}
      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" className="mb-4 flex items-center gap-2">
            <Plus size={16} /> Add Slide
          </Button>
        </SheetTrigger>

        {/* Adaptive side — bottom for mobile, right for desktop */}
        <SheetContent
          side={window.innerWidth < 768 ? "bottom" : "right"}
          className="w-full sm:max-w-[480px] h-auto sm:h-full p-6 overflow-y-auto"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-semibold text-foreground">
              {editingSlide ? "Edit Slide" : "Add New Slide"}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              Fill out the details for your hero section content.
            </p>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-muted/5  rounded-lg"
          >
            {/* Header Field with Highlight */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Header (supports HTML)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  {...register("header")}
                  id="headerInput"
                  placeholder="Enter header text..."
                  onChange={(e) => setValue("header", e.target.value)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById("headerInput");
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const value = input.value;
                    if (start === end) return;
                    setUndoStack((prev) => [...prev, value]);

                    const selectedText = value.slice(start, end);
                    const before = value.slice(0, start);
                    const after = value.slice(end);

                    const highlightTag = `<span class='text-green-500'>${selectedText}</span>`;
                    const alreadyHighlighted = value.includes(highlightTag);
                    const newValue = alreadyHighlighted
                      ? value.replace(highlightTag, selectedText)
                      : before + highlightTag + after;

                    input.value = newValue;
                    setValue("header", newValue);
                    setPreviewHeader(newValue);
                  }}
                >
                  <Highlighter size={16} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Select text and click “<Highlighter size={16} className="inline-block" />” to make it green.
              </p>

              {/* ✅ Live Preview */}
              <div className="mt-3 border rounded-md p-3 bg-background/60">
                <p className="text-xs font-medium mb-1 text-muted-foreground">
                  Preview:
                </p>
                <div
                  className="text-base leading-tight"
                  dangerouslySetInnerHTML={{ __html: previewHeader || "" }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full border rounded-md p-2 h-24 resize-none"
                placeholder="Write a short description..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 h-28 w-full object-cover rounded-md border"
                />
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Apply Link</label>
                <Input {...register("applyLink")} placeholder="/apply" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brochure Link</label>
                <Input
                  {...register("brochureLink")}
                  placeholder="/brochure.pdf"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" className="w-full">
                {editingSlide ? "Update Slide" : "Add Slide"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Slides Table */}
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sections</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(slides) && slides.map((slide) => (
              <TableRow key={slide._id}>
                <TableCell>
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.bannerTitle }}
                    className="font-medium"
                  />
                </TableCell>

                <TableCell
                  className="max-w-[200px] truncate"
                  title={slide.bannerContent}
                >
                  {slide.bannerContent}
                </TableCell>

                <TableCell>
                  {slide.bannerImage?.[0] && (
                    <img
                      src={slide.bannerImage[0]}
                      alt="slide"
                      className="h-12 w-24 object-cover rounded"
                    />
                  )}
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(slide._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Card>
    </div>
  );
}
