import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, ChevronsRight } from "lucide-react";

export default function AdmissionsEditor({
  mode = "create", // "create" | "edit" | "view"
  initialData = null,
  onSave,
  onNext,
}) {
  const [data, setData] = useState({
    heading: "Admissions Process",
    description:
      "Manage and update the admissions details such as eligibility, process steps, and key dates.",
    eligibility: [
      "Bachelor’s degree with minimum 50% marks",
      "Valid CAT/XAT/GMAT/CMAT score",
    ],
    processSteps: [
      "Apply online through the official portal",
      "Shortlisting based on entrance exam score",
      "Personal Interview and Written Ability Test",
      "Final selection and offer letter issuance",
    ],
    importantDates: [
      { label: "Application Opens", value: "1st October 2025" },
      { label: "Application Closes", value: "15th March 2026" },
      { label: "Interviews", value: "April 2026" },
    ],
  });

  // 🧩 Load initial data if in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData(initialData);
    }
  }, [mode, initialData]);

  const isViewMode = mode === "view";

  // 🧩 Handlers
  const handleChange = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleListChange = (key, index, value) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }));

  const handleDateChange = (index, field, value) =>
    setData((prev) => ({
      ...prev,
      importantDates: prev.importantDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      ),
    }));

  const addItem = (key, newItem) =>
    setData((prev) => ({ ...prev, [key]: [...prev[key], newItem] }));

  const removeItem = (key, index) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));

  const handleSave = () => {
    if (onSave) onSave(data);
    else {
      console.log("Mock saved admissions data:", data);
      alert("Admissions data saved (mock)");
    }
    if (onNext) onNext();
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">
        {mode === "edit" ? "Edit Admissions" : "Admissions Editor"}
      </h2>

      <Card className='bg-transparent border-0 shadow-none'>
        <CardContent className="space-y-4 p-0">
          {/* Heading */}
          <div>
            <Label className="mb-2 block">Heading</Label>
            <Input
              value={data.heading}
              disabled={isViewMode}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="Enter admissions heading"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="mb-2 block">Description</Label>
            <Textarea
              rows={3}
              disabled={isViewMode}
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <Separator />

          {/* Eligibility */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
            {data.eligibility.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={item}
                  disabled={isViewMode}
                  onChange={(e) =>
                    handleListChange("eligibility", index, e.target.value)
                  }
                  placeholder={`Eligibility ${index + 1}`}
                />
                {!isViewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem("eligibility", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {!isViewMode && (
              <Button
                variant="secondary"
                onClick={() =>
                  addItem("eligibility", "New eligibility criterion")
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Eligibility
              </Button>
            )}
          </div>

          <Separator />

          {/* Process Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Process Steps</h3>
            {data.processSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={step}
                  disabled={isViewMode}
                  onChange={(e) =>
                    handleListChange("processSteps", index, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                />
                {!isViewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem("processSteps", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {!isViewMode && (
              <Button
                variant="secondary"
                onClick={() => addItem("processSteps", "New process step")}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Step
              </Button>
            )}
          </div>

          <Separator />

          {/* Important Dates */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Important Dates</h3>
            {data.importantDates.map((date, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={date.label}
                  disabled={isViewMode}
                  onChange={(e) =>
                    handleDateChange(index, "label", e.target.value)
                  }
                  placeholder="Label"
                />
                <Input
                  value={date.value}
                  disabled={isViewMode}
                  onChange={(e) =>
                    handleDateChange(index, "value", e.target.value)
                  }
                  placeholder="Value"
                />
                {!isViewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem("importantDates", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {!isViewMode && (
              <Button
                variant="secondary"
                onClick={() =>
                  addItem("importantDates", { label: "New Date", value: "TBD" })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Date
              </Button>
            )}
          </div>

          {/* Save Button */}
          {!isViewMode && (
            <div className="pt-4 text-right">
              <Button onClick={handleSave}>
                {mode === "edit" ? "Update & Next" : "Save & Next"}{" "}
                <ChevronsRight className="ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
