import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronsRight, Plus, Trash2 } from "lucide-react";
import EditableTable from "./EditableTable";
import EditorMock from "../EditorMock";

export default function CurriculumEditor({ mode = "create", sections: initialSections = [], onSave, onNext }) {
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    if (initialSections) setSections(initialSections);
  }, [initialSections]);

  const handleSectionChange = (index, value) => {
    const updated = [...sections];
    updated[index].contentData = value;
    setSections(updated);
  };

  const addListItem = (sectionIndex) => {
    const updated = [...sections];
    if (!Array.isArray(updated[sectionIndex].contentData)) {
      updated[sectionIndex].contentData = [];
    }
    updated[sectionIndex].contentData.push("New Item");
    setSections(updated);
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    const updated = [...sections];
    updated[sectionIndex].contentData = updated[sectionIndex].contentData.filter((_, i) => i !== itemIndex);
    setSections(updated);
  };

  const handleSave = () => {
    console.log(`${mode === "edit" ? "Updating" : "Saving"} curriculum:`, sections);
    if (onSave) onSave(sections);
    if (mode === "create" && onNext) onNext();
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{mode === "edit" ? "Edit Curriculum" : "Curriculum Editor"}</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          {sections.map((section, index) => (
            <div key={section._id || index} className="mb-4">
              <label className="block font-medium mb-1">{section.title}</label>

              {section.contentType === "text" && (
                <Input
                  value={section.contentData}
                  onChange={(e) => handleSectionChange(index, e.target.value)}
                  placeholder={`Enter ${section.title}`}
                />
              )}

              {section.contentType === "list" && (
                <div className="space-y-2">
                  {section.contentData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const updatedList = [...section.contentData];
                          updatedList[i] = e.target.value;
                          handleSectionChange(index, updatedList);
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeListItem(index, i)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addListItem(index)}
                    className="mt-1"
                  >
                    <Plus className="inline-block mr-1 w-4 h-4" />
                    Add Item
                  </Button>
                </div>
              )}

              {section.contentType === "table" && <EditableTable initialData={section.contentData} onChange={(data) => handleSectionChange(index, data)} />}

              {section.contentType === "image" && (
                <div className="space-y-2">
                  <Input
                    value={section.contentData}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    placeholder="Paste image URL"
                  />
                  {section.contentData && <img src={section.contentData} className="rounded-lg border mt-2" alt="Preview" />}
                </div>
              )}

              <Separator />
            </div>
          ))}

          <div className="text-right mt-6">
            <Button onClick={handleSave}>
              {mode === "edit" ? "Save Changes" : "Next"} {mode === "create" && <ChevronsRight />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
