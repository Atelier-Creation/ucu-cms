import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import { getMDPsData, updateMDPsData } from "../Api/MDPsApi";

const defaultData = {
  title: "About the Program",
  paragraphs: [""],
  monthTitle: "October 2025",
  programs: [],
};

const emptyProgram = {
  dateLabel: "",
  month: "",
  programTitle: "",
  time: "",
  fees: "",
  brochureUrl: "",
  applyLink: "/contact-us",
};

export default function MDPsPage() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getMDPsData();
      if (result) {
        setData({
          ...defaultData,
          ...result,
          paragraphs: result.paragraphs?.length ? result.paragraphs : [result.content || ""],
          programs: result.programs || [],
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch MDPs data.", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateMDPsData(data);
      toast({ title: "Success", description: "MDPs page updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update MDPs page.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateParagraph = (index, value) => {
    setData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((paragraph, i) => (i === index ? value : paragraph)),
    }));
  };

  const updateProgram = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((program, i) =>
        i === index ? { ...program, [field]: value, pdf: field === "brochureUrl" ? value : program.pdf } : program
      ),
    }));
  };

  const addProgram = () => {
    setData((prev) => ({ ...prev, programs: [...prev.programs, { ...emptyProgram }] }));
  };

  const removeProgram = (index) => {
    setData((prev) => ({ ...prev, programs: prev.programs.filter((_, i) => i !== index) }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">MDPs Page CMS</h1>
          <p className="text-sm text-muted-foreground">
            Upload brochures here and set where each Apply Now button should lead.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Page Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Section Title</label>
            <Input value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Month Label</label>
            <Input value={data.monthTitle || ""} onChange={(e) => updateField("monthTitle", e.target.value)} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Intro Paragraphs</label>
              <Button size="sm" variant="outline" onClick={() => updateField("paragraphs", [...(data.paragraphs || []), ""])}>+ Add Paragraph</Button>
            </div>
            {(data.paragraphs || []).map((paragraph, index) => (
              <div className="flex gap-2" key={index}>
                <Textarea value={paragraph} onChange={(e) => updateParagraph(index, e.target.value)} />
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => updateField("paragraphs", data.paragraphs.filter((_, i) => i !== index))}>X</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>MDP Program Rows</CardTitle>
          <Button size="sm" variant="outline" onClick={addProgram}>+ Add Program</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.programs || []).map((program, index) => (
            <Card key={index} className="p-4 border-dashed">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Program {index + 1}</h3>
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeProgram(index)}>Remove</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input value={program.dateLabel || ""} onChange={(e) => updateProgram(index, "dateLabel", e.target.value)} placeholder="Date label, e.g. 22 - 23" />
                <Input value={program.month || ""} onChange={(e) => updateProgram(index, "month", e.target.value)} placeholder="Month, e.g. OCT" />
                <Input value={program.programTitle || ""} onChange={(e) => updateProgram(index, "programTitle", e.target.value)} placeholder="Program title" />
                <Input value={program.time || ""} onChange={(e) => updateProgram(index, "time", e.target.value)} placeholder="Time" />
                <Input value={program.fees || ""} onChange={(e) => updateProgram(index, "fees", e.target.value)} placeholder="Fees" />
                <Input value={program.applyLink || ""} onChange={(e) => updateProgram(index, "applyLink", e.target.value)} placeholder="Apply Now link, e.g. /contact-us" />
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">Brochure PDF / File</label>
                <FileUploader
                  accept="application/pdf,.pdf,image/*,.doc,.docx"
                  value={program.brochureUrl || program.pdf || ""}
                  onChange={(url) => updateProgram(index, "brochureUrl", url)}
                />
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
