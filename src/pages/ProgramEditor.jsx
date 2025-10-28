import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import OverviewEditor from "@/components/Programcms/OverviewEditor";
import CurriculumEditor from "@/components/Programcms/CurriculumEditor";
import FeeStructureEditor from "@/components/Programcms/FeeStructureEditor";
import AdmissionsEditor from "@/components/Programcms/AdmissionsEditor";
import PlacementEditor from "@/components/Programcms/PlacementEditor";
import { PanelsTopLeft } from "lucide-react";
import ProgramHeaderEditor from "@/components/Programcms/ProgramHeaderEditor";
import { Label } from "@/components/ui/label";

export default function ProgramEditor({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [programData, setProgramData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setProgramData(initialData);
    }
  }, [initialData]);

  const handleNextTab = (next) => {
    setActiveTab(next);
  };

  const handleSectionSave = (section, data) => {
    setProgramData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(programData);
    } else {
      console.log("Program data saved:", programData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/programs/fulltime">
              Full Time Programs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {mode === "edit" && initialData?.title
                ? initialData.title
                : "New Program"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Edit Program" : "Create New Program"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all sections of the program page from a single dashboard.
        </p>
      </div>

      <ProgramHeaderEditor
        mode={mode}
        initialData={programData?.header}
        onSave={(data) => handleSectionSave("header", data)}
      />

      {/* Tabs Section */}
      <Card>
        <CardContent className="p-0">
          <Label className="pl-6 pb-4 font-bold text-2xl">Tabs Management</Label>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-[90%] mx-10 px-4 bg-gray-100">
              <TabsTrigger value="overview" className="cursor-pointer">
                Overview
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="cursor-pointer">
                Curriculum
              </TabsTrigger>
              <TabsTrigger value="fees" className="cursor-pointer">
                Fee Structure
              </TabsTrigger>
              <TabsTrigger value="admissions" className="cursor-pointer">
                Admissions
              </TabsTrigger>
              <TabsTrigger value="placement" className="cursor-pointer">
                Placement
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <div className="px-6">
              <TabsContent value="overview">
                <OverviewEditor
                  mode={mode}
                  initialData={programData?.overview}
                  onNext={() => handleNextTab("curriculum")}
                  onSave={(data) => handleSectionSave("overview", data)}
                />
              </TabsContent>

              <TabsContent value="curriculum">
                <CurriculumEditor
                  mode={mode}
                  initialData={programData?.curriculum}
                  onNext={() => handleNextTab("fees")}
                  onSave={(data) => handleSectionSave("curriculum", data)}
                />
              </TabsContent>

              <TabsContent value="fees">
                <FeeStructureEditor
                  mode={mode}
                  initialData={programData?.fees}
                  onNext={() => handleNextTab("admissions")}
                  onSave={(data) => handleSectionSave("fees", data)}
                />
              </TabsContent>

              <TabsContent value="admissions">
                <AdmissionsEditor
                  mode={mode}
                  initialData={programData?.admissions}
                  onNext={() => handleNextTab("placement")}
                  onSave={(data) => handleSectionSave("admissions", data)}
                />
              </TabsContent>

              <TabsContent value="placement">
                <PlacementEditor
                  mode={mode}
                  initialData={programData?.placement}
                  onSave={(data) => handleSectionSave("placement", data)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          {mode === "edit" ? "Update Program" : "Create Program"}
        </button>
      </div>
    </div>
  );
}
