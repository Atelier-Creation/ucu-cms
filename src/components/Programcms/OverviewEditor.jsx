import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ChevronsRight, Plus, Image as ImageIcon, Type, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function OverviewEditor({
  sections = [],
  onSave,
  onNext,
  mode = "edit",
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(sections || []);
  }, [sections]);

  // -- Field Updates --
  const handleChange = (index, newValue) => {
    const updated = [...data];
    updated[index].contentData = newValue;
    setData(updated);
  };

  const handleTitleChange = (index, newTitle) => {
    const updated = [...data];
    updated[index].title = newTitle;
    setData(updated);
  };

  const handleListChange = (sectionIndex, itemIndex, value) => {
    const updated = [...data];
    updated[sectionIndex].contentData[itemIndex] = value;
    setData(updated);
  };

  const addListItem = (sectionIndex) => {
    const updated = [...data];
    if (!Array.isArray(updated[sectionIndex].contentData)) {
      updated[sectionIndex].contentData = [];
    }
    updated[sectionIndex].contentData.push("");
    setData(updated);
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    const updated = [...data];
    updated[sectionIndex].contentData.splice(itemIndex, 1);
    setData(updated);
  };

  // -- Section Management --
  const handleAddSection = (type) => {
    const newSection = {
      title: "New Section",
      contentType: type,
      contentData: type === "list" ? [""] : "",
    };
    setData([...data, newSection]);
  };

  const handleDeleteSection = (index) => {
    if (confirm("Are you sure you want to delete this section?")) {
      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    }
  };

  const handleSave = () => {
    onSave && onSave(data);
    if (mode === "create" && onNext) onNext();
  };

  const renderField = (section, index) => {
    const { contentType, contentData } = section;

    switch (contentType) {
      case "text":
        return (
          <div className="space-y-2">
            <Label>Content (Text)</Label>
            <Textarea
              value={contentData}
              onChange={(e) => handleChange(index, e.target.value)}
              rows={4}
            />
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            <Label>List Items</Label>
            {(Array.isArray(contentData) ? contentData : []).map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleListChange(index, i, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => removeListItem(index, i)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem(index)}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </div>
        );

      case "image":
        return (
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={contentData}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {contentData && (
              <div className="mt-2 border rounded-md p-2 bg-gray-50">
                <img
                  src={contentData}
                  alt="Preview"
                  className="rounded-md max-h-60 object-contain mx-auto"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-red-500">Unknown Content Type: {contentType}</div>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview Sections</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAddSection("text")}>
            <Type className="h-4 w-4 mr-2" /> Text
          </Button>
          <Button variant="outline" onClick={() => handleAddSection("list")}>
            <List className="h-4 w-4 mr-2" /> List
          </Button>
          <Button variant="outline" onClick={() => handleAddSection("image")}>
            <ImageIcon className="h-4 w-4 mr-2" /> Image
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {data.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
            No sections added yet. Click buttons above to add content.
          </div>
        )}

        {data.map((section, index) => (
          <Card key={index} className="relative group border-l-4 border-l-primary">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                    Section {index + 1} - {section.contentType}
                  </Label>
                  <Input
                    value={section.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="font-semibold text-lg"
                    placeholder="Section Title"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteSection(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>

              <Separator />

              {renderField(section, index)}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4 flex justify-end bg-white/80 backdrop-blur-sm p-4 border rounded-lg shadow-lg">
        <Button onClick={handleSave} size="lg" className="shadow-md">
          {mode === "edit" ? "Save Overview Changes" : "Next Step"}
          {mode === "create" && <ChevronsRight className="ml-2 w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
