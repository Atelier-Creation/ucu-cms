import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUploader from "../FileUploader";

export default function ProgramHeaderEditor() {
  const [data, setData] = useState({
    image: "",
    title: "Post Graduate Diploma in Management (PGDM)",
    subtitle: "Designed to empower future business leaders.",
    infoBoxes: [
      { label: "Applications Open", value: "2025-2027 Batch" },
      { label: "Duration", value: "2 Years (Full-time)" },
      { label: "Eligibility", value: "Graduation with 50% marks" },
      { label: "Download Brochure", value: "Brochure.pdf" },
    ],
  });

  const handleInfoChange = (index, field, value) => {
    const updated = [...data.infoBoxes];
    updated[index][field] = value;
    setData({ ...data, infoBoxes: updated });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Program Header Section</h2>
        <p className="text-sm text-muted-foreground">
          Edit the banner section of the program page.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Banner Image */}

        <div className="space-y-2">
        <Label>Upload Program Banner Image</Label>
        <FileUploader/>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Program Title</Label>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Enter program title"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            placeholder="Enter subtitle"
          />
        </div>

        {/* Info Boxes */}
        <div className="space-y-4">
          <Label>Info Boxes</Label>
          <div className="grid md:grid-cols-2 gap-4">
            {data.infoBoxes.map((box, index) => (
              <Card key={index} className="p-4 rounded-sm">
                <div className="space-y-2">
                  <Input
                    value={box.label}
                    onChange={(e) =>
                      handleInfoChange(index, "label", e.target.value)
                    }
                    placeholder="Label"
                  />
                  <Input
                    value={box.value}
                    onChange={(e) =>
                      handleInfoChange(index, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button onClick={() => console.log("Saved Data:", data)}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
