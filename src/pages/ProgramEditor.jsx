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
import { useLocation, Link, useParams } from "react-router-dom";
import { createProgram, getProgramById, updateProgram } from "@/Api/programApi";

export default function ProgramEditor({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [programData, setProgramData] = useState(initialData || {});
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { id: paramId } = useParams();
  const programId  = location.state?.programId || paramId;
console.log(programId,mode);
  useEffect(() => {
  if (mode === "edit" && programId) {
    setLoading(true);
    getProgramById(programId)
      .then((data) => {
        console.log(data)
        setProgramData(data);
      })
      .catch((err) => console.error("Error loading program:", err))
      .finally(() => setLoading(false));
  }
}, [mode, programId]);

  const excludedSegments = ["program", "fulltime"];

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !excludedSegments.includes(segment.toLowerCase()));
  // Example: ["program", "fulltime", "pgdm"]

  const formattedPath = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
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

  const handleSubmit = async () => {
    try {
      if (mode === "edit") {
        await updateProgram(programId, programData);
        alert("Program updated successfully ✅");
      } else {
        await createProgram(programData);
        alert("Program created successfully ✅");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
  const overviewData = programData.tabs?.find(tab => tab.tabName === "Overview");
const curriculumData = programData.tabs?.find(tab => tab.tabName === "Curriculum");
const feesData = programData.tabs?.find(tab => tab.tabName === "Fees Structure");


  return (
    <div className="space-y-6 px-1 sm:px-6">
      {/* Breadcrumb */}
      <div className="overflow-x-auto">
        <Breadcrumb className="min-w-max sm:min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathnames.map((segment, index) => {
              const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
              const isLast = index === pathnames.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {mode === "edit" && initialData?.title
                          ? initialData.title
                          : formattedPath(segment)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={routeTo}>{formattedPath(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
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
        initialData={programData}
        loading={loading}
        onSave={(data) => handleSectionSave("header", data)}
      />

      {/* Tabs Section */}
      <Card>
        <CardContent className="p-0">
          <Label className="pl-4 sm:pl-6 pb-3 sm:pb-4 font-bold text-lg sm:text-2xl">
            Tabs Management
          </Label>

          {/* Sticky Scrollable Tabs (Mobile-friendly) */}
          <div className="z-20 bg-white dark:bg-black/0">
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
                    bg-gray-100 dark:bg-black/0 px-4 sm:px-2 
                    whitespace-nowrap h-12 mb-2 gap-4
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
                  sections={overviewData?.sections || []}
                  loading={loading}
                  onNext={() => handleNextTab("curriculum")}
                  onSave={(data) => handleSectionSave("overview", data)}
                />
              </TabsContent>

              <TabsContent value="curriculum">
                <CurriculumEditor
                  mode={mode}
                  sections={curriculumData?.sections || []}
                  onNext={() => handleNextTab("fees")}
                  onSave={(data) => handleSectionSave("curriculum", data)}
                />
              </TabsContent>

              <TabsContent value="fees">
                <FeeStructureEditor
                  mode={mode}
                  sections={feesData?.sections}
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
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white dark:text-black rounded-md hover:bg-primary/90"
        >
          {mode === "edit" ? "Update Program" : "Create Program"}
        </button>
      </div>
    </div>
  );
}
