import { ChevronsRight, Plus, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FeeStructureEditor({ mode = "create", initialData = null, onNext }) {
  const defaultData = {
    program: "PGDM",
    indianFee: 1000000,
    internationalFee: 1600000,
    notes: [
      "The fee does not include hostel accommodation, mess, and other expenses.",
      "The Global Fast Track Immersion Program is not included.",
    ],
    hostel: [
      { category: "Girls - AC DOUBLE", fee: 125000 },
      { category: "Boys - AC DOUBLE", fee: 190000 },
      { category: "Boys - NON-AC DOUBLE", fee: 125000 },
    ],
    scholarships: [
      {
        title: "Merit cum Means Based Financial Assistance",
        description:
          "Awarded based on both academic merit and financial need. Covers a portion of the tuition fee.",
      },
      {
        title: "Budding Leadership Excellence Scholarship",
        description:
          "Recognizes students with exceptional leadership qualities, academic excellence, and social impact.",
      },
    ],
  };

  const [feeData, setFeeData] = useState(mode === "edit" && initialData ? initialData : defaultData);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFeeData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (field, value) =>
    setFeeData((prev) => ({ ...prev, [field]: value }));

  const handleArrayChange = (array, setArray, index, field, value) => {
    const updated = [...array];
    updated[index][field] = value;
    setArray(updated);
  };

  const handleSave = async () => {
    try {
      if (mode === "edit") {
        console.log("Updating Fee Structure:", feeData);
        alert("Fee structure updated successfully!");
      } else {
        console.log("Creating Fee Structure:", feeData);
        alert("Fee structure created successfully!");
      }
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert("Failed to save fee structure.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        {mode === "edit" ? "Edit Fee Structure" : "Create Fee Structure"}
      </h2>

      {/* ===== Program ===== */}
      <div>
        <label className="font-semibold block mb-2">Program</label>
        <Input
          value={feeData.program}
          onChange={(e) => handleChange("program", e.target.value)}
          placeholder="Enter program name"
        />
      </div>

      {/* ===== Indian / International Fees ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-2">
            Indian Participants Fee (INR)
          </label>
          <Input
            type="number"
            value={feeData.indianFee}
            onChange={(e) => handleChange("indianFee", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            International Participants Fee (INR)
          </label>
          <Input
            type="number"
            value={feeData.internationalFee}
            onChange={(e) => handleChange("internationalFee", e.target.value)}
          />
        </div>
      </div>

      {/* ===== Notes ===== */}
      <div>
        <label className="font-semibold block mb-2">Notes</label>
        {feeData.notes.map((note, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={note}
              onChange={(e) => {
                const updated = [...feeData.notes];
                updated[i] = e.target.value;
                handleChange("notes", updated);
              }}
            />
            <Button
              variant="destructive"
              onClick={() =>
                handleChange(
                  "notes",
                  feeData.notes.filter((_, idx) => idx !== i)
                )
              }
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => handleChange("notes", [...feeData.notes, ""])}
        >
          <Plus size={16} className="mr-1" /> Add Note
        </Button>
      </div>

      {/* ===== Hostel Fee ===== */}
      <div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Hostel Fee</h3>
        {feeData.hostel.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder="Category"
              value={row.category}
              onChange={(e) =>
                handleArrayChange(feeData.hostel, (updated) =>
                  handleChange("hostel", updated),
                  i,
                  "category",
                  e.target.value
                )
              }
            />
            <Input
              type="number"
              placeholder="Fee"
              value={row.fee}
              onChange={(e) =>
                handleArrayChange(feeData.hostel, (updated) =>
                  handleChange("hostel", updated),
                  i,
                  "fee",
                  e.target.value
                )
              }
            />
            <Button
              variant="destructive"
              onClick={() =>
                handleChange(
                  "hostel",
                  feeData.hostel.filter((_, idx) => idx !== i)
                )
              }
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            handleChange("hostel", [
              ...feeData.hostel,
              { category: "", fee: "" },
            ])
          }
        >
          <Plus size={16} className="mr-1" /> Add Hostel Row
        </Button>
      </div>

      {/* ===== Scholarships ===== */}
      <div>
        <h3 className="text-xl font-semibold mt-4 mb-2">Scholarships</h3>
        {feeData.scholarships.map((sch, i) => (
          <div key={i} className="border p-3 rounded mb-3">
            <Input
              placeholder="Title"
              value={sch.title}
              onChange={(e) => {
                const updated = [...feeData.scholarships];
                updated[i].title = e.target.value;
                handleChange("scholarships", updated);
              }}
            />
            <Textarea
              className="mt-2"
              rows={2}
              placeholder="Description"
              value={sch.description}
              onChange={(e) => {
                const updated = [...feeData.scholarships];
                updated[i].description = e.target.value;
                handleChange("scholarships", updated);
              }}
            />
            <div className="text-right mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleChange(
                    "scholarships",
                    feeData.scholarships.filter((_, idx) => idx !== i)
                  )
                }
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            handleChange("scholarships", [
              ...feeData.scholarships,
              { title: "", description: "" },
            ])
          }
        >
          <Plus size={16} className="mr-1" /> Add Scholarship
        </Button>
      </div>

      {/* ===== Save Button ===== */}
      <div className="pt-4 text-right">
        <Button onClick={handleSave}>
          {mode === "edit" ? "Update & Next" : "Save & Next"} <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
