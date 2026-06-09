import React from "react";
import { ChevronsRight } from "lucide-react";
import ProgramSectionBuilder from "./ProgramSectionBuilder";

export default function OverviewEditor({
  sections = [],
  onSave,
  onNext,
  mode = "edit",
}) {
  const handleSave = (data) => {
    onSave?.(data);
    if (mode === "create" && onNext) onNext();
  };

  return (
    <ProgramSectionBuilder
      title="Overview Content Sections"
      description="Build the program overview with meaningful sections like about, image/text, card grids, stats, timelines, galleries, CTAs, and FAQs."
      sections={sections}
      onSave={handleSave}
      saveLabel={mode === "edit" ? "Save Overview Changes" : "Next Step"}
      nextIcon={mode === "create" ? <ChevronsRight className="ml-2 h-4 w-4" /> : null}
    />
  );
}
