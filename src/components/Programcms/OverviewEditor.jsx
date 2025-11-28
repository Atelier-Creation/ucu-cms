import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ChevronsRight } from "lucide-react";

export default function OverviewEditor({
  sections = {},    // ← pass only Overview sections from API
  onSave,
  onNext,
  mode = "edit",
}) {
  const [data, setData] =  useState(() => sections || []);


  const handleChange = (index, newValue) => {
    const updated = [...data];
    updated[index].contentData = newValue;
    setData(updated);
  };

  const handleListChange = (sectionIndex, itemIndex, value) => {
    const updated = [...data];
    updated[sectionIndex].contentData[itemIndex] = value;
    setData(updated);
  };

  const addListItem = (sectionIndex) => {
    const updated = [...data];
    updated[sectionIndex].contentData.push("");
    setData(updated);
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    const updated = [...data];
    updated[sectionIndex].contentData.splice(itemIndex, 1);
    setData(updated);
  };

  const handleSave = () => {
    console.log("Updated Overview:", data);
    onSave && onSave(data);
    if (mode === "create" && onNext) onNext();
  };

  const renderField = (section, index) => {
    const { title, contentType, contentData } = section;

    switch (contentType) {
      case "text":
        return (
          <div key={index}>
            <label className="font-medium">{title}</label>
            <Input
              value={contentData}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        );

      case "list":
        return (
          <div key={index} className="space-y-2">
            <label className="font-medium">{title}</label>

            {contentData.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleListChange(index, i, e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  onClick={() => removeListItem(index, i)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={() => addListItem(index)}
            >
              + Add {title}
            </Button>
          </div>
        );

      case "image":
        return (
          <div key={index}>
            <label className="font-medium">{title}</label>
            <Input
              value={contentData}
              onChange={(e) => handleChange(index, e.target.value)}
            />

            {contentData && (
              <img
                src={contentData}
                alt="Preview"
                className="mt-3 rounded-md w-full max-w-md border"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview Editor</h2>

      <Card>
        <CardContent className="space-y-6 p-4">
          {data?.map((section, index) => (
            <div key={section._id} className="space-y-3">
              {renderField(section, index)}
              <Separator />
            </div>
          ))}

          <div className="text-right">
            <Button onClick={handleSave}>
              {mode === "edit" ? "Save Changes" : "Next"}
              {mode === "create" && <ChevronsRight className="ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
