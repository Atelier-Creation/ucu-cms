import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronsRight, Plus, Trash2 } from "lucide-react";

export default function CurriculumEditor({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onNext,
}) {
  const [curriculum, setCurriculum] = useState({
    heading: "PGDM Curriculum and Programme Structure",
    intro:
      "A new-age curriculum co-created with the Industry, keeping corporate needs and employability at the forefront.",
    years: [
      {
        title: "Year 1",
        points: [
          "Core management foundation courses",
          "Experiential learning: ADMAP, Abhyudaya, DoCC, SOS",
          "Corporate internship preparation",
        ],
      },
      {
        title: "Year 2",
        points: [
          "Major and minor specializations",
          "Corporate internships and electives",
          "Global Fast Track (GFT) immersion module",
        ],
      },
    ],
    majors: [
      "Operations & Supply Chain",
      "Information Management",
      "Marketing",
      "Finance",
      "HR & OB",
      "Business Analytics & AI",
    ],
    minors: ["Fin-Tech", "GCC", "Consulting", "Manufacturing", "Semiconductor"],
  });

  // Load data in edit mode
  useEffect(() => {
    if (initialData) {
      setCurriculum((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleFieldChange = (field, value) => {
    setCurriculum((prev) => ({ ...prev, [field]: value }));
  };

  const handleYearChange = (index, key, value) => {
    const updatedYears = [...curriculum.years];
    updatedYears[index][key] = value;
    setCurriculum((prev) => ({ ...prev, years: updatedYears }));
  };

  const addYear = () => {
    setCurriculum((prev) => ({
      ...prev,
      years: [...prev.years, { title: "New Year", points: [] }],
    }));
  };

  const removeYear = (index) => {
    const updatedYears = curriculum.years.filter((_, i) => i !== index);
    setCurriculum((prev) => ({ ...prev, years: updatedYears }));
  };

  const addPoint = (yearIndex) => {
    const updatedYears = [...curriculum.years];
    updatedYears[yearIndex].points.push("New point");
    setCurriculum((prev) => ({ ...prev, years: updatedYears }));
  };

  const removePoint = (yearIndex, pointIndex) => {
    const updatedYears = [...curriculum.years];
    updatedYears[yearIndex].points = updatedYears[yearIndex].points.filter(
      (_, i) => i !== pointIndex
    );
    setCurriculum((prev) => ({ ...prev, years: updatedYears }));
  };

  const handleSave = () => {
    console.log(`${mode === "edit" ? "Updating" : "Saving"} curriculum:`, curriculum);

    if (onSave) onSave(curriculum);

    if (mode === "create" && onNext) onNext();
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        {mode === "edit" ? "Edit Curriculum" : "Curriculum Editor"}
      </h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          {/* Heading */}
          <div>
            <label className="block font-medium mb-1">Heading</label>
            <Input
              value={curriculum.heading}
              onChange={(e) => handleFieldChange("heading", e.target.value)}
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block font-medium mb-1">Introduction</label>
            <Textarea
              rows={3}
              value={curriculum.intro}
              onChange={(e) => handleFieldChange("intro", e.target.value)}
            />
          </div>

          <Separator />

          {/* Programme Years */}
          <h2 className="text-lg font-semibold mt-4">Programme Years</h2>
          {curriculum.years.map((year, yIndex) => (
            <Card key={yIndex} className="mt-3">
              <CardContent className="space-y-3 px-3">
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeYear(yIndex)}
                    title="Remove Year"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Input
                    value={year.title}
                    onChange={(e) =>
                      handleYearChange(yIndex, "title", e.target.value)
                    }
                    placeholder="Year title"
                  />
                </div>

                {year.points.map((p, pIndex) => (
                  <div key={pIndex} className="flex items-center ml-6">
                    <Input
                      className="mt-2 w-[95%]"
                      value={p}
                      onChange={(e) => {
                        const updated = [...year.points];
                        updated[pIndex] = e.target.value;
                        handleYearChange(yIndex, "points", updated);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePoint(yIndex, pIndex)}
                      title="Remove Point"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}

                <Button
                  className="bg-gray-700 hover:bg-gray-900 text-white cursor-pointer rounded-sm"
                  onClick={() => addPoint(yIndex)}
                >
                  <Plus className="inline-block text-white" />
                  Add Point
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            className="bg-gray-700 hover:bg-gray-900 text-white cursor-pointer rounded-sm"
            onClick={addYear}
          >
            <Plus className="inline-block text-white" />
            Add Year
          </Button>

          <Separator />

          {/* Majors */}
          <h2 className="text-lg font-semibold mt-4">Majors</h2>
          {curriculum.majors.map((m, i) => (
            <Input
              key={i}
              className="mb-2"
              value={m}
              onChange={(e) => {
                const updated = [...curriculum.majors];
                updated[i] = e.target.value;
                setCurriculum((prev) => ({ ...prev, majors: updated }));
              }}
            />
          ))}
          <Button
            className="bg-gray-700 hover:bg-gray-900 text-white cursor-pointer rounded-sm"
            onClick={() =>
              setCurriculum((prev) => ({
                ...prev,
                majors: [...prev.majors, "New Major"],
              }))
            }
          >
            <Plus className="inline-block text-white" />
            Add Major
          </Button>

          <Separator />

          {/* Minors */}
          <h2 className="text-lg font-semibold mt-4">Minors</h2>
          {curriculum.minors.map((m, i) => (
            <Input
              key={i}
              className="mb-2"
              value={m}
              onChange={(e) => {
                const updated = [...curriculum.minors];
                updated[i] = e.target.value;
                setCurriculum((prev) => ({ ...prev, minors: updated }));
              }}
            />
          ))}
          <Button
            className="bg-gray-700 hover:bg-gray-900 text-white cursor-pointer rounded-sm"
            onClick={() =>
              setCurriculum((prev) => ({
                ...prev,
                minors: [...prev.minors, "New Minor"],
              }))
            }
          >
            <Plus className="inline-block text-white" />
            Add Minor
          </Button>

          {/* Footer */}
          <div className="text-right mt-6">
            <Button onClick={handleSave}>
              {mode === "edit" ? "Save Changes" : "Next"}{" "}
              {mode === "create" &&  <ChevronsRight />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
