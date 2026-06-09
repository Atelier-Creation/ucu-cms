import React from "react";
import { ChevronsRight } from "lucide-react";
import ProgramSectionBuilder from "./ProgramSectionBuilder";

export default function CurriculumEditor({
  mode = "create",
  sections = [],
  onSave,
  onNext,
}) {
  const handleSave = (data) => {
    onSave?.(data);
    if (mode === "create" && onNext) onNext();
  };

  return (
    <ProgramSectionBuilder
      title={mode === "edit" ? "Edit Curriculum Sections" : "Curriculum Sections"}
      description="Add curriculum modules, trimester tables, learning journeys, module cards, reading lists, or process timelines."
      sections={sections}
      onSave={handleSave}
      saveLabel={mode === "edit" ? "Save Curriculum Changes" : "Save & Next"}
      nextIcon={mode === "create" ? <ChevronsRight className="ml-2 h-4 w-4" /> : null}
    />
  );
}
