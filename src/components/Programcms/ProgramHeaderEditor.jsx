import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FileUploader from "@/lib/FileUploader";

export default function ProgramHeaderEditor({ initialData, onSave,loading  }) {
  const [data, setData] = useState({
    image: "",
    programTitle: "",
    subTitle: "",
    infoBoxesdata: [],
  });

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const handleInfoObjectChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      infoBoxesdata: {
        ...prev.infoBoxesdata,
        [key]: value,
      },
    }));
  };

  const labelMap = {
    applicationOpen: "Application Open",
    duration: "Program Duration",
    eligibility: "Eligibility",
    downloadBrochure: "Download Brochure",
  };

  if (loading) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Banner image skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Info Boxes Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </Card>
          ))}
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-32 rounded-md" />

      </CardContent>
    </Card>
  );
}


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
          <FileUploader />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Program Title</Label>
          <Input
            value={data?.programTitle}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Enter program title"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={data?.subTitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            placeholder="Enter subtitle"
          />
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.infoBoxesdata?.[0] || {}).map(
            ([key, value], index) =>
              key !== "_id" && (
                <Card key={index} className="p-4 rounded-sm">
                  <div className="space-y-2">
                    {/* Label */}
                    <Input
                      value={labelMap[key] || key}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />

                    {/* Value */}
                    <Input
                      value={value}
                      placeholder="Enter value"
                      onChange={(e) =>
                        handleInfoObjectChange(key, e.target.value)
                      }
                    />
                  </div>
                </Card>
              )
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button onClick={() => onSave(data)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
