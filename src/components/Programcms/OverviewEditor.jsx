import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronsRight, Trash2 } from "lucide-react";

export default function OverviewEditor({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onNext,
}) {
  const [overview, setOverview] = useState({
    title: "PGDM Overview",
    description:
      "A new-age curriculum co-created with industry leaders, focusing on employability and corporate needs.",
    image: "https://placehold.co/1200x400",
    highlights: [
      "Industry Co-created Curriculum",
      "Global Faculty",
      "Leadership Development",
    ],
  });

  useEffect(() => {
    if (initialData) {
      setOverview((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setOverview((prev) => ({ ...prev, [field]: value }));
  };

  const handleHighlightChange = (index, value) => {
    const updated = [...overview.highlights];
    updated[index] = value;
    setOverview((prev) => ({ ...prev, highlights: updated }));
  };

  const addHighlight = () => {
    setOverview((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  const removeHighlight = (index) => {
    const updated = overview.highlights.filter((_, i) => i !== index);
    setOverview((prev) => ({ ...prev, highlights: updated }));
  };

  const handleSave = () => {
    console.log(`${mode === "edit" ? "Updating" : "Creating"} overview:`, overview);

    if (onSave) onSave(overview);

    // For create mode, optionally continue to next tab
    if (onNext && mode === "create") onNext();
  };

  return (
    <div className="space-y-6 p-1 md-p-6">
      <h1 className="text-2xl font-bold">
        {mode === "edit" ? "Edit Overview" : "Overview Editor"}
      </h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <Input
              value={overview.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter program title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <Textarea
              rows={4}
              value={overview.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter program description"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium mb-1">Image URL</label>
            <Input
              value={overview.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="Paste image URL or mock path"
            />
            {overview.image && (
              <div className="mt-3">
                <img
                  src={overview.image}
                  alt="Overview Preview"
                  className="rounded-lg border"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Highlights */}
          <div>
            <label className="block font-medium mb-2">Key Highlights</label>
            {overview.highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleHighlightChange(index, e.target.value)
                  }
                  placeholder={`Highlight ${index + 1}`}
                />
                <Button
                  variant="goast"
                  onClick={() => removeHighlight(index)}
                >
                  <Trash2 color="red"/>
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addHighlight}>
              + Add Highlight
            </Button>
          </div>

          {/* Save / Next */}
          <div className="pt-4 text-right">
            <Button onClick={handleSave}>
              {mode === "edit" ? "Save Changes" : "Next"}{" "}
              {mode === "create" && <ChevronsRight />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
