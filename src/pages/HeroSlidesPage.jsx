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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Trash2, Edit2, Plus, PanelsTopLeft } from "lucide-react";
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

// --- Initial Hero Data ---
const heroData = [
  {
    header: `Guided by Industry & <span class="text-green-500">Academic</span> Icons`,
    para: `Every program is co-created and co-delivered by academia and industry—where faculty and industry CXOs collaborate to build future-ready, job-relevant learning experiences for students.`,
    image: bannerImage,
  },
  {
    header: `Future Ready Programs for <span class="text-green-500">Emerging Industry</span> Sectors`,
    para: `From GCC and FinTech to Healthcare and Semiconductor industries, our specialised programs are expertly tailored to empower talent to lead innovation and deliver transformative strategies from day one.`,
    image: bannerImage,
  },
  {
    header: `<span class="text-green-500">Business Advisory</span> Council`,
    para: `Our Business Advisory Council (BAC) anchors UCU’s strategic vision—shaping curriculum, guiding long-term direction, and ensuring every program delivers tangible career value from day one.`,
    image: bannerImage,
  },
];

// --- Mock API ---
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

  const { register, handleSubmit, reset, setValue } = useForm();

  // Seed data on first load
  useEffect(() => {
    localStorage.setItem("heroSlides", "");
    const loadSlides = async () => {
      const stored = await fetchSlides();
      if (stored.length === 0) {
        const seeded = heroData.map((d, i) => ({
          id: Date.now() + i,
          header: d.header,
          description: d.para,
          image: d.image,
          applyLink: "",
          brochureLink: "",
        }));
        await saveSlides(seeded);
        setSlides(seeded);
      } else {
        setSlides(stored);
      }
    };
    loadSlides();
  }, []);

  const onSubmit = async (data) => {
    if (data.image instanceof File) {
      const reader = new FileReader();
      reader.onload = async () => {
        data.image = reader.result;
        await saveSlideData(data);
      };
      reader.readAsDataURL(data.image);
    } else {
      await saveSlideData(data);
    }
  };

  const saveSlideData = async (data) => {
    let updatedSlides;
    if (editingSlide) {
      updatedSlides = slides.map((s) =>
        s.id === editingSlide.id ? { ...s, ...data, id: editingSlide.id } : s
      );
    } else {
      updatedSlides = [...slides, { ...data, id: Date.now() }];
    }

    await saveSlides(updatedSlides);
    setSlides(updatedSlides);
    setDialogOpen(false);
    setEditingSlide(null);
    setPreviewImage(null);
    reset();
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    reset(slide);
    setPreviewImage(slide.image || null);
    setDialogOpen(true);
  };

  const handleDelete = async (slideId) => {
    const updatedSlides = slides.filter((s) => s.id !== slideId);
    await saveSlides(updatedSlides);
    setSlides(updatedSlides);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

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

      <h1 className="text-3xl font-bold">
        Hero Slides Management
      </h1>

      {/* Add Slide Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mb-4 flex items-center gap-2">
            <Plus size={16} /> Add Slide
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Edit Slide" : "Add New Slide"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1">
                Header (HTML supported)
              </label>
              <Input {...register("header")} placeholder="Enter header text" />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full border border-gray-300 rounded-md p-2 h-20"
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 h-24 w-full object-cover rounded"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Apply Link</label>
              <Input {...register("applyLink")} placeholder="/apply" />
            </div>

            <div>
              <label className="text-sm font-medium">Brochure Link</label>
              <Input
                {...register("brochureLink")}
                placeholder="/brochure.pdf"
              />
            </div>

            <Button type="submit" className="mt-2 w-full">
              {editingSlide ? "Update Slide" : "Add Slide"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.header }}
                    className="font-medium"
                  />
                </TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={slide.description}
                >
                  {slide.description}
                </TableCell>

                <TableCell>
                  {slide.image && (
                    <img
                      src={slide.image}
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
                    onClick={() => handleDelete(slide.id)}
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
