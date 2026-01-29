import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FileUploader from "@/lib/FileUploader";
import { Trash2, Plus } from "lucide-react";

export default function ProgramHeaderEditor({ initialData, onSave, loading }) {
  const [data, setData] = useState({
    programImage: "",
    programTitle: "",
    subTitle: "",
    infoBoxesdata: [{}], // Array containing one object as per original schema inspection
  });

  const [newKey, setNewKey] = useState("");

  useEffect(() => {
    if (initialData) {
      // Ensure structure matches expectation
      setData({
        programImage: initialData.programImage || "",
        programTitle: initialData.programTitle || "",
        subTitle: initialData.subTitle || "",
        infoBoxesdata: Array.isArray(initialData.infoBoxesdata) && initialData.infoBoxesdata.length > 0
          ? initialData.infoBoxesdata
          : [{}],
      });
    }
  }, [initialData]);

  const handleInfoChange = (key, value) => {
    setData((prev) => {
      const updatedInfoBox = { ...prev.infoBoxesdata[0], [key]: value };
      return {
        ...prev,
        infoBoxesdata: [updatedInfoBox],
      };
    });
  };

  const handleAddInfoField = () => {
    if (!newKey.trim()) return;
    setData((prev) => {
      const updatedInfoBox = { ...prev.infoBoxesdata[0], [newKey]: "" };
      return {
        ...prev,
        infoBoxesdata: [updatedInfoBox],
      };
    });
    setNewKey("");
  };

  const handleDeleteInfoField = (key) => {
    setData((prev) => {
      const updatedInfoBox = { ...prev.infoBoxesdata[0] };
      delete updatedInfoBox[key];
      return {
        ...prev,
        infoBoxesdata: [updatedInfoBox],
      };
    });
  };

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      setData((prev) => ({
        ...prev,
        programImage: files[0].url,
      }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Program Header Section</h2>
        <p className="text-sm text-muted-foreground">
          Edit the banner section of the program page.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Banner Image */}
        <div className="space-y-2">
          <Label>Program Banner Image</Label>
          {data.programImage && (
            <div className="mb-2">
              <img
                src={data.programImage}
                alt="Banner Preview"
                className="w-full max-h-60 object-cover rounded-md border"
              />
            </div>
          )}
          <FileUploader
            multiple={false}
            accept="image/*"
            onUploaded={handleImageUpload}
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Program Title</Label>
          <Input
            value={data.programTitle}
            onChange={(e) => setData({ ...data, programTitle: e.target.value })}
            placeholder="Enter program title"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={data.subTitle}
            onChange={(e) => setData({ ...data, subTitle: e.target.value })}
            placeholder="Enter subtitle"
          />
        </div>

        {/* Info Boxes Dynamic Editor */}
        <div className="space-y-4 border rounded-md p-4">
          <Label className="text-lg font-semibold">Key Highlights (Info Boxes)</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.infoBoxesdata?.[0] || {}).map(([key, value]) => (
              key !== "_id" && (
                <div key={key} className="flex gap-2 items-end border p-3 rounded-md relative group">
                  <div className="w-full space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <Input
                      value={value}
                      onChange={(e) => handleInfoChange(key, e.target.value)}
                      placeholder={`Value for ${key}`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteInfoField(key)}
                    className="text-destructive hover:text-destructive hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            ))}
          </div>

          <div className="flex gap-2 items-end pt-2">
            <div className="space-y-2 flex-1 max-w-sm">
              <Label>Add New Field Key</Label>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. startDate"
              />
            </div>
            <Button onClick={handleAddInfoField} variant="secondary">
              <Plus className="mr-2 h-4 w-4" /> Add Field
            </Button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button onClick={() => onSave(data)} size="lg">Save Header Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
