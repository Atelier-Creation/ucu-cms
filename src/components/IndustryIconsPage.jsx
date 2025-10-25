import React, { useState } from "react";
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
import { Trash2, Pencil, Youtube, PanelsTopLeft } from "lucide-react";
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

const IndustryIconsPage = () => {
  const { toast } = useToast();
  const [icons, setIcons] = useState([
    {
      id: 1,
      youtubeLink: "https://youtu.be/ulaQhIpWY98",
      description: "Industry leader sharing insights on innovation and design.",
    },
  ]);

  const [newIcon, setNewIcon] = useState({ youtubeLink: "", description: "" });
  const [editIcon, setEditIcon] = useState(null);
  const getEmbedUrl = (url) => {
    try {
      // Match normal YouTube and short youtu.be URLs
      const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      return "";
    } catch {
      return "";
    }
  };

  const handleAdd = () => {
    if (!newIcon.youtubeLink || !newIcon.description) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        variant: "error",
      });
      return;
    }

    setIcons([
      ...icons,
      {
        id: Date.now(),
        youtubeLink: newIcon.youtubeLink,
        description: newIcon.description,
      },
    ]);
    setNewIcon({ youtubeLink: "", description: "" });
    toast({
      title: "Added",
      description: "New industry icon added successfully.",
      variant: "success",
    });
  };

  const handleDelete = (id) => {
    setIcons(icons.filter((icon) => icon.id !== id));
    toast({ title: "Deleted", description: "Industry icon removed." });
  };

  const handleEdit = () => {
    setIcons(icons.map((icon) => (icon.id === editIcon.id ? editIcon : icon)));
    setEditIcon(null);
    toast({
      title: "Updated",
      description: "Industry icon updated successfully.",
    });
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
            value={newIcon.youtubeLink}
            onChange={(e) =>
              setNewIcon({ ...newIcon, youtubeLink: e.target.value })
            }
          />
          <Textarea
            placeholder="Enter description for the video..."
            value={newIcon.description}
            onChange={(e) =>
              setNewIcon({ ...newIcon, description: e.target.value })
            }
          />
          <Button onClick={handleAdd} className="w-fit">
            Add
          </Button>
        </CardContent>
      </Card>
      <div className="flex items-center mb-3">
        <h2 className="text-lg m-0 font-semibold tracking-tight text-foreground">
          Industry Icons cards
        </h2>
      </div>
      <Separator />
      {/* List of Icons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {icons.map((icon) => (
          <Card key={icon.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                Industry Icon
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
                  {editIcon?.id === icon.id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Industry Icon</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        <Input
                          type="text"
                          placeholder="YouTube Video Link"
                          value={editIcon.youtubeLink}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              youtubeLink: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          value={editIcon.description}
                          onChange={(e) =>
                            setEditIcon({
                              ...editIcon,
                              description: e.target.value,
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
                  onClick={() => handleDelete(icon.id)}
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
                  src={getEmbedUrl(icon.youtubeLink)}
                  title="YouTube video"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {icon.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndustryIconsPage;
