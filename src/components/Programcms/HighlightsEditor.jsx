import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ICON_OPTIONS = [
  { value: "Lightbulb", label: "Lightbulb (Overview)" },
  { value: "Book", label: "Book (Learning)" },
  { value: "Suitcase", label: "Suitcase (Tie-ups)" },
  { value: "Sun", label: "Sun (Summer Internship)" },
  { value: "Award", label: "Award (Achievements)" },
  { value: "Briefcase", label: "Briefcase (Career)" },
  { value: "Users", label: "Users (Cohort)" },
  { value: "MapPin", label: "Map Pin (Campus)" },
];

export default function HighlightsEditor({ highlights: initialHighlights = [], onSave }) {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    if (initialHighlights) {
      setHighlights(initialHighlights);
    }
  }, [initialHighlights]);

  const handleChange = (index, field, value) => {
    const updated = [...highlights];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    // Auto-generate id/slug from label if id is empty
    if (field === "label" && !updated[index].id) {
      updated[index].id = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    setHighlights(updated);
  };

  const handleAddHighlight = () => {
    const newHighlight = {
      id: "",
      label: "New Highlight",
      iconName: "Lightbulb",
      title: "New Highlight Title",
      text: `<ul class="clear-div ms-3">
  <li>First benefit point</li>
  <li>Second benefit point</li>
</ul>`,
    };
    setHighlights([...highlights, newHighlight]);
  };

  const handleDeleteHighlight = (index) => {
    if (confirm("Are you sure you want to delete this highlight tab?")) {
      const updated = highlights.filter((_, i) => i !== index);
      setHighlights(updated);
    }
  };

  const handleSave = () => {
    console.log("Saving Highlights:", highlights);
    if (onSave) {
      onSave(highlights);
    }
    alert("Highlights saved locally in form data! Make sure to click 'Update Program' at the bottom of the page to publish.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Program Highlights Tabs</h2>
          <p className="text-sm text-muted-foreground">
            Configure the custom tabs displayed on the left side of the Highlights section.
          </p>
        </div>
        <Button onClick={handleAddHighlight} className="flex items-center gap-2">
          <Plus size={16} /> Add Highlight Tab
        </Button>
      </div>

      <div className="space-y-6">
        {highlights.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-gray-50">
            No custom highlights added yet. Click "Add Highlight Tab" to begin.
          </div>
        )}

        {highlights.map((highlight, index) => (
          <Card key={index} className="border-l-4 border-l-green-500 relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-md font-semibold">
                Tab #{index + 1}: {highlight.label || "Untitled Tab"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteHighlight(index)}
              >
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tab Label (Left Menu button)</Label>
                  <Input
                    value={highlight.label}
                    onChange={(e) => handleChange(index, "label", e.target.value)}
                    placeholder="e.g. Learning Experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tab Slug ID (Auto-generated)</Label>
                  <Input
                    value={highlight.id || ""}
                    onChange={(e) => handleChange(index, "id", e.target.value)}
                    placeholder="e.g. learning-experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Menu Icon</Label>
                  <Select
                    value={highlight.iconName || "Lightbulb"}
                    onValueChange={(val) => handleChange(index, "iconName", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Details Card Title (Right Content Header)</Label>
                <Input
                  value={highlight.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  placeholder="e.g. Value-adds Inside Classrooms"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">
                    Details Card Content (HTML/Lists Supported)
                  </Label>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <HelpCircle size={12} />
                    Supports HTML tags like &lt;ul&gt;, &lt;li&gt;, &lt;h4&gt;, etc.
                  </span>
                </div>
                <Textarea
                  value={highlight.text}
                  onChange={(e) => handleChange(index, "text", e.target.value)}
                  placeholder="Enter HTML content..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {highlights.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            Save Highlights Locally
          </Button>
        </div>
      )}
    </div>
  );
}
