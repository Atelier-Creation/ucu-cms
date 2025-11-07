import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Pencil, PanelsTopLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  createIndustryIcon,
  getAllIndustryIcon,
  updateIndustryIcon,
  deleteIndustryIcon,
} from "@/Api/IndustryIconApi";

const IndustryIconsPage = () => {
  const { toast } = useToast();
  const [icons, setIcons] = useState([]);
  const [newIcon, setNewIcon] = useState({
    VideoUrl: "",
    author: "",
    authorProf: "",
    authorDesc: "",
  });
  const [editIcon, setEditIcon] = useState(null);

  const getEmbedUrl = (url) => {
    try {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match && match[1]
        ? `https://www.youtube.com/embed/${match[1]}`
        : "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllIndustryIcon();
        setIcons(res.data || res);
      } catch {
        toast({ title: "Error", description: "Failed to fetch data..." });
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    const { VideoUrl, author, authorDesc, authorProf } = newIcon;
    if (!VideoUrl || !author || !authorDesc || !authorProf) {
      toast({
        title: "Error",
        description: "All Fields Are Required",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await createIndustryIcon(newIcon);
      setIcons([...icons, res.data || res]);
      setNewIcon({ VideoUrl: "", author: "", authorDesc: "", authorProf: "" });
      toast({ title: "Success", description: "Industry icon added." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add industry icon.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIndustryIcon(id);
      setIcons(icons.filter((icon) => icon._id !== id));
      toast({ title: "Deleted", description: "Industry icon removed." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete industry icon.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    try {
      const res = await updateIndustryIcon(editIcon._id, editIcon);
      setIcons(
        icons.map((icon) =>
          icon._id === editIcon._id ? res.data || res : icon
        )
      );
      setEditIcon(null);
      toast({ title: "Updated", description: "Icon updated successfully." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to edit industry icon.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
            <BreadcrumbPage>Industry Icon Speak</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Industry Icons Management
        </h1>
      </div>

      <Separator />

      {/* Add Form */}
      <Card className="border-border rounded-xl">
        <CardHeader>
          <CardTitle>Add New Industry Icon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            placeholder="Enter YouTube Video Link"
            value={newIcon.VideoUrl}
            onChange={(e) =>
              setNewIcon({ ...newIcon, VideoUrl: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Enter Author name"
            value={newIcon.author}
            onChange={(e) =>
              setNewIcon({ ...newIcon, author: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Enter Author professional"
            value={newIcon.authorProf}
            onChange={(e) =>
              setNewIcon({ ...newIcon, authorProf: e.target.value })
            }
          />
          <Textarea
            placeholder="Enter description for the video..."
            value={newIcon.authorDesc}
            onChange={(e) =>
              setNewIcon({ ...newIcon, authorDesc: e.target.value })
            }
          />
          <Button onClick={handleAdd} className="w-fit">
            Add
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Industry Icons Cards
        </h2>
      </div>
      <Separator />

      {/* List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {icons.map((icon) => (
          <Card key={icon._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                {icon.author}
              </CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditIcon(icon)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  {editIcon?._id === icon._id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Industry Icon</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        <Input
                          type="text"
                          placeholder="YouTube Video Link"
                          value={editIcon.VideoUrl}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              VideoUrl: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Author Name"
                          value={editIcon.author}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              author: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Profession"
                          value={editIcon.authorProf}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              authorProf: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          value={editIcon.authorDesc}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              authorDesc: e.target.value,
                            })
                          }
                        />
                        <Button onClick={handleEdit}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(icon._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="aspect-video rounded-md overflow-hidden border">
                <iframe
                  width="100%"
                  height="200"
                  src={getEmbedUrl(icon.VideoUrl)}
                  title={icon.author}
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {icon.authorDesc}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {icon.authorProf}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndustryIconsPage;
