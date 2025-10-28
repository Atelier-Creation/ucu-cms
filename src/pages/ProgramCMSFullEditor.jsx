import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill-new"; // npm i react-quill
import "react-quill-new/dist/quill.snow.css";

// shadcn/ui components (assumes your project already provides these)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// icons
import { Pencil, ImageIcon, Save } from "lucide-react";

/**
 * ProgramCMS_FullEditor.jsx
 * Single-file React component (preview-ready) that provides a fully functional
 * CMS editor UI for a Program Page (PGDM / Executive / Industry) using
 * Vite + React + Tailwind + shadcn/ui. It includes:
 * - Header editor (title, subtitle, banner image)
 * - Tabs editor (Overview, Curriculum, Fees...)
 * - Sections editor using Accordion with rich-text editing (ReactQuill)
 * - Image uploads (client-side preview + optional Cloudinary upload hook)
 * - Live preview pane (desktop & mobile width toggles) with watermark overlay
 * - Save / Publish (mocked) and Export to JSON
 *
 * NOTE: to run this file you will need to install: react-quill, react-hook-form
 * and ensure your shadcn/ui components exist at the specified paths.
 */

const DEFAULT = {
  title: "PGDM (Post Graduate Diploma in Management)",
  subtitle: "A two-year full time program for early-career professionals",
  banner: null,
  tabs: ["Overview", "Curriculum", "Fees and Scholarships", "Admissions", "Placements"],
  sections: [
    {
      key: "about",
      heading: "About Programs",
      content:
        "<p>The two-year PGDM is meticulously designed for high-potential professionals with less than three years of work experience. With a sharp focus on industry integration and outcome-driven learning...</p>",
    },
    {
      key: "objective",
      heading: "Objective",
      content:
        "<ul><li>Empower students with robust conceptual foundations and interpersonal acumen.</li><li>Deliver a pedagogical experience that harmonizes academic rigor with industry relevance.</li></ul>",
    },
  ],
};

export default function ProgramCMSFullEditor() {
  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: DEFAULT,
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [sections, setSections] = useState(DEFAULT.sections);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const bannerFileRef = useRef(null);

  // watch title/subtitle (for live preview)
  const title = watch("title");
  const subtitle = watch("subtitle");

  useEffect(() => {
    // initialize form state
    reset(DEFAULT);
    setSections(DEFAULT.sections);
  }, []);

  async function handleBannerChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview locally
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);

    // optional: upload to Cloudinary or your media endpoint here
    // await uploadToCloudinary(file)
    setValue("banner", file);
  }

  function addSection() {
    const key = "custom-" + Date.now();
    const newSection = { key, heading: "New Section", content: "<p>Edit content...</p>" };
    setSections((s) => [...s, newSection]);
  }

  function updateSectionContent(key, html) {
    setSections((s) => s.map((sec) => (sec.key === key ? { ...sec, content: html } : sec)));
  }

  function updateSectionHeading(key, heading) {
    setSections((s) => s.map((sec) => (sec.key === key ? { ...sec, heading } : sec)));
  }

  function removeSection(key) {
    setSections((s) => s.filter((sec) => sec.key !== key));
  }

  async function onSave(data) {
    setSaving(true);
    try {
      // prepare payload
      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        // banner: data.banner (file) -> in real scenario upload and save url
        tabs: data.tabs,
        sections,
      };

      // mock save delay
      await new Promise((res) => setTimeout(res, 700));

      console.log("Saved payload:", payload);
      // show success dialog
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function exportJSON() {
    const payload = { title: title, subtitle, sections };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-") || "program"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // renderers
  function SectionEditor({ section }) {
    return (
      <div className="border border-border rounded-md p-3 bg-card">
        <div className="flex items-center gap-3 mb-2">
          <Input
            value={section.heading}
            onChange={(e) => updateSectionHeading(section.key, e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" onClick={() => removeSection(section.key)}>
            Remove
          </Button>
        </div>
        <Controller
          control={control}
          name={`section-${section.key}`}
          defaultValue={section.content}
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              value={section.content}
              onChange={(html) => updateSectionContent(section.key, html)}
              modules={{ toolbar: [["bold", "italic"], ["link"], [{ list: "bullet" }]] }}
            />
          )}
        />
      </div>
    );
  }

  // Live preview component
  function LivePreview() {
    // watermark tiling
    const watermark = "www.UCU.co.in";

    return (
      <div className={`relative rounded-lg overflow-hidden border border-border bg-white ${mobilePreview ? "w-[390px]" : "w-full"}`}>
        {/* Banner */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          {bannerPreview ? (
            <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
          ) : (
            <div className="text-muted-foreground">Banner preview</div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>

          <div className="mt-4">
            {sections.map((sec) => (
              <div key={sec.key} className="mb-6">
                <h3 className="text-xl font-semibold">{sec.heading}</h3>
                <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: sec.content }} />
              </div>
            ))}
          </div>
        </div>

        {/* Tiled Watermark Overlay */}
        {/* <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gridAutoRows: "80px",
              transform: "rotate(-30deg)",
              gap: "20px",
              width: "140%",
              height: "140%",
            }}
            className="text-[10px] text-muted-foreground flex-wrap"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                {watermark}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT: Editor */}
      <div className="w-2/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Program Editor</h2>
          <div className="flex gap-2">
            <Button onClick={() => setMobilePreview((s) => !s)} variant="ghost">
              Toggle Mobile
            </Button>
            <Button onClick={exportJSON} variant="outline">
              Export JSON
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title")} />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input {...register("subtitle")} />
          </div>

          <div>
            <Label>Banner Image</Label>
            <div className="flex items-center gap-3">
              <input ref={bannerFileRef} type="file" accept="image/*" onChange={handleBannerChange} />
              <Button variant="ghost" onClick={() => bannerFileRef.current && bannerFileRef.current.click()}>
                <ImageIcon className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>
            {bannerPreview && <img src={bannerPreview} alt="banner" className="mt-2 w-full h-36 object-cover rounded" />}
          </div>

          <div>
            <Label>Tabs (comma separated)</Label>
            <Controller
              control={control}
              name="tabs"
              defaultValue={DEFAULT.tabs}
              render={({ field }) => (
                <Input
                  value={field.value.join(", ")}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((s) => s.trim()))}
                />
              )}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sections</Label>
              <Button onClick={addSection} size="sm" variant="outline">
                + Add
              </Button>
            </div>

            <div className="space-y-3">
              {sections.map((s) => (
                <Accordion key={s.key} type="single" collapsible>
                  <AccordionItem value={s.key}>
                    <AccordionTrigger className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Pencil className="w-4 h-4" />
                        <span>{s.heading}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SectionEditor section={s} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => reset(DEFAULT)}>
              Reset
            </Button>
          </div>
        </form>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="w-3/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <div className="text-sm text-muted-foreground">Auto-updates as you edit</div>
        </div>

        <LivePreview />
      </div>

      {/* Success dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <h3 className="text-lg font-semibold">Saved</h3>
          <p className="mt-2">Program content saved successfully (mock save).</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
