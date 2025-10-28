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
import ProgramHeaderEditor from "@/components/Programcms/ProgramHeaderEditor";
import { Label } from "@/components/ui/label";
import { PanelsTopLeft } from "lucide-react";

export default function ProgramEditor({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [programData, setProgramData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) setProgramData(initialData);
  }, [initialData]);

  const handleNextTab = (next) => setActiveTab(next);

  const handleSectionSave = (section, data) => {
    setProgramData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(programData);
    else console.log("Program data saved:", programData);
  };

  return (
    <div className="space-y-6 px-1 sm:px-6">
      {/* Breadcrumb */}
      <div className="overflow-x-auto">
        <Breadcrumb className="min-w-max sm:min-w-0">
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
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Edit Program" : "Create New Program"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Manage all sections of the program page from a single dashboard.
        </p>
      </div>

      {/* Program Header Section */}
      <ProgramHeaderEditor
        mode={mode}
        initialData={programData?.header}
        onSave={(data) => handleSectionSave("header", data)}
      />

      {/* Tabs Section */}
      <Card>
        <CardContent className="p-0">
          <Label className="pl-4 sm:pl-6 pb-3 sm:pb-4 font-bold text-lg sm:text-2xl">
            Tabs Management
          </Label>

          {/* Sticky Scrollable Tabs (Mobile-friendly) */}
          <div className="z-20 bg-white">
            <div
              className="
                overflow-x-auto no-scrollbar 
                overscroll-contain 
                touch-pan-x 
                border-b border-gray-200
              "
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className="
                    flex sm:grid sm:grid-cols-5 
                    w-max sm:w-[90%] mx-auto sm:mx-10 
                    bg-gray-100 px-4 sm:px-6 
                    whitespace-nowrap
                  "
                >
                  <TabsTrigger
                    value="overview"
                    className="cursor-pointer text-sm sm:text-base"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="curriculum"
                    className="cursor-pointer text-sm sm:text-base"
                  >
                    Curriculum
                  </TabsTrigger>
                  <TabsTrigger
                    value="fees"
                    className="cursor-pointer text-sm sm:text-base"
                  >
                    Fee Structure
                  </TabsTrigger>
                  <TabsTrigger
                    value="admissions"
                    className="cursor-pointer text-sm sm:text-base"
                  >
                    Admissions
                  </TabsTrigger>
                  <TabsTrigger
                    value="placement"
                    className="cursor-pointer text-sm sm:text-base"
                  >
                    Placement
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-3 sm:px-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-end sm:items-center gap-3 mt-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          {mode === "edit" ? "Update Program" : "Create Program"}
        </button>
      </div>
    </div>
  );
}
