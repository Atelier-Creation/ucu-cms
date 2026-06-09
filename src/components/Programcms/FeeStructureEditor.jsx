import React from "react";
import { ChevronsRight } from "lucide-react";
import ProgramSectionBuilder from "./ProgramSectionBuilder";

export default function FeeStructureEditor({
  mode = "create",
  sections = [],
  onNext,
  onSave,
}) {
  const handleSave = (data) => {
    onSave?.(data);
    if (mode === "create" && onNext) onNext();
  };

  return (
    <ProgramSectionBuilder
      title={mode === "edit" ? "Edit Fee Sections" : "Fee Structure Sections"}
      description="Create fee tables, payment notes, scholarship cards, PDF links, installment timelines, or application CTAs."
      sections={sections || []}
      onSave={handleSave}
      saveLabel={mode === "edit" ? "Save Fee Changes" : "Save & Next"}
      nextIcon={mode === "create" ? <ChevronsRight className="ml-2 h-4 w-4" /> : null}
    />
  );
}
