import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Pencil, ChevronsRight } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { getAllPrograms } from "@/Api/programApi";
import FileUploader from "@/lib/FileUploader";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function FullTimePrograms() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("fulltime");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploaded = (files) => {
    console.log("Uploaded files:", files);
    setUploadedFiles(files); 
  };

  // ✅ Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllPrograms();

        // assuming all returned are full-time
        setPrograms(data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Full Time Programs
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Program</Button>
          </DialogTrigger>

          <DialogContent className="max-w-sm bg-white">
            <DialogHeader>
              <DialogTitle>Select Program Type</DialogTitle>
            </DialogHeader>

            <RadioGroup
              value={selectedType}
              onValueChange={setSelectedType}
              className="space-y-3 py-4"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-100">
                <RadioGroupItem value="fulltime" id="fulltime" />
                <Label htmlFor="fulltime">
                  <b>Full Time Program</b>
                  <p className="text-sm text-muted-foreground">
                    Traditional on-campus program
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-100">
                <RadioGroupItem value="flex" id="flex" />
                <Label htmlFor="flex">
                  <b>Flex Program</b>
                  <p className="text-sm text-muted-foreground">
                    For working professionals
                  </p>
                </Label>
              </div>
            </RadioGroup>

            <DialogFooter>
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate(
                    selectedType === "fulltime"
                      ? "/program/fulltime/create"
                      : "/program/flex/create"
                  );
                }}
              >
                Continue <ChevronsRight className="ml-1 w-4 h-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
       {/* <FileUploader
        uploadPresignUrl={`${import.meta.env.VITE_API_BASE_URL}/upload/presign`}
        accept="image/*,application/pdf"
        maxSizeMB={20}
        multiple={true}
        onUploaded={handleUploaded}
      />

      <div className="mt-4 space-y-2">
        {uploadedFiles.map((file, i) => (
          <div key={i} className="text-sm">
            ✅ {file.name} →  
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline ml-2"
            >
              View File
            </a>
            <img src={file.url} alt={file.name} />
          </div>
        ))}
          </div> */}

      {/* Loading */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 border rounded-lg bg-muted"
            >
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && programs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-10 border rounded-lg bg-muted/40">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>

          <h3 className="font-semibold text-lg">No Programs Available</h3>

          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            You haven’t added any full-time programs yet. Start by creating your
            first program.
          </p>

          <Button
            className="mt-4"
            onClick={() => navigate("/program/fulltime/create")}
          >
            + Add First Program
          </Button>
        </div>
      )}

      {/* Accordion */}
      {!loading && programs.length > 0 && (
        <Accordion type="single" collapsible className="space-y-3" defaultValue="programs">
          <AccordionItem value="programs" className="border border-border shadow-sm rounded-lg bg-muted/30 p-2">
            <AccordionTrigger className="flex justify-between items-center px-2 py-3 font-medium bg-muted/50 hover:bg-muted transition cursor-pointer rounded-t-lg">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Full Time Programs
              </div>
            </AccordionTrigger>

            <AccordionContent className="bg-gray-50 p-4 space-y-3 dark:bg-black">
              {programs.map((program) => {
                const slug = slugify(program.programTitle);

                return (
                  <div
                    key={program._id}
                    className="flex justify-between items-center p-2 border bg-white hover:bg-gray-50 cursor-pointer rounded-md group"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit text-sm font-normal text-left cursor-pointer"
                      onClick={() =>
                        
                        navigate(`/program/fulltime/${slug}/${program._id}`, {
                          state: { programId: program._id },
                        })
                      }
                    >
                      {program.programTitle}
                    </Button>

                    <Pencil
                      className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                      onClick={() =>
                        navigate(`/program/fulltime/${slug}/${program._id}`)
                      } 
                    />
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

export default FullTimePrograms;
