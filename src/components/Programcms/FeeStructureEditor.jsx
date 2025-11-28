import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Plus, Trash2 } from "lucide-react";
import EditableTable from "./EditableTable";

export default function FeeStructureEditor({ mode = "create", sections: initialSections = [], onNext, onSave }) {
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
    if (!Array.isArray(updated[sectionIndex].contentData)) updated[sectionIndex].contentData = [];
    updated[sectionIndex].contentData.push("New Note");
    setSections(updated);
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    const updated = [...sections];
    updated[sectionIndex].contentData = updated[sectionIndex].contentData.filter((_, i) => i !== itemIndex);
    setSections(updated);
  };

  const handleSave = () => {
    console.log(`${mode === "edit" ? "Updating" : "Saving"} fees:`, sections);
    if (onSave) onSave(sections);
    if (mode === "create" && onNext) onNext();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{mode === "edit" ? "Edit Fee Structure" : "Fee Structure Editor"}</h2>

      {sections.map((section, index) => (
        <div key={section._id || index} className="mb-4">
          <label className="font-semibold block mb-2">{section.title}</label>

          {section.contentType === "text" && (
            <Input
              value={section.contentData}
              onChange={(e) => handleSectionChange(index, e.target.value)}
              placeholder={section.title}
            />
          )}

          {section.contentType === "list" && (
            <div className="space-y-2">
              {section.contentData.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updatedList = [...section.contentData];
                      updatedList[i] = e.target.value;
                      handleSectionChange(index, updatedList);
                    }}
                  />
                  <Button variant="destructive" size="icon" onClick={() => removeListItem(index, i)}>
                    <Trash2 className="h-4 w-4 text-red-100" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addListItem(index)}>
                <Plus className="inline-block w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>
          )}

          {section.contentType === "table" && (
            <EditableTable
              initialData={section.contentData}
              onChange={(data) => handleSectionChange(index, data)}
            />
          )}

          {section.contentType === "pdf" && (
            <div>
              <Input
                value={section.contentData}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                placeholder="PDF URL"
              />
              {section.contentData && (
                <a href={section.contentData} target="_blank" className="text-blue-600 mt-1 block">
                  View PDF
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="text-right mt-4">
        <Button onClick={handleSave}>
          {mode === "edit" ? "Update & Next" : "Save & Next"} <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
