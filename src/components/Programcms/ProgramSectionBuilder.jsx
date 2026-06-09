import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlignLeft,
  BarChart3,
  Columns2,
  FileText,
  GalleryHorizontal,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Megaphone,
  Plus,
  Table2,
  Trash2,
} from "lucide-react";
import EditableTable from "./EditableTable";

const SECTION_TYPES = [
  {
    value: "content",
    label: "Content Section",
    description: "Heading, subtitle, body copy, and optional image.",
    icon: AlignLeft,
  },
  {
    value: "imageText",
    label: "Image + Text",
    description: "Two-column section with image and supporting copy.",
    icon: Columns2,
  },
  {
    value: "cardGrid",
    label: "Card Grid",
    description: "Repeated cards for features, outcomes, modules, or benefits.",
    icon: LayoutGrid,
  },
  {
    value: "statGrid",
    label: "Stats Grid",
    description: "Numbers, labels, and short descriptions.",
    icon: BarChart3,
  },
  {
    value: "accordion",
    label: "Accordion / FAQ",
    description: "Expandable question-answer or topic-detail list.",
    icon: HelpCircle,
  },
  {
    value: "timeline",
    label: "Timeline / Process",
    description: "Ordered steps for admissions, roadmap, or schedule.",
    icon: List,
  },
  {
    value: "table",
    label: "Table",
    description: "Editable rows and columns for curriculum or fee details.",
    icon: Table2,
  },
  {
    value: "gallery",
    label: "Gallery",
    description: "Multiple image URLs with optional captions.",
    icon: GalleryHorizontal,
  },
  {
    value: "cta",
    label: "CTA Section",
    description: "Call-to-action title, text, button label, and link.",
    icon: Megaphone,
  },
  {
    value: "text",
    label: "Simple Text",
    description: "Legacy single text field.",
    icon: FileText,
  },
  {
    value: "list",
    label: "Simple List",
    description: "Legacy list field.",
    icon: List,
  },
  {
    value: "image",
    label: "Image",
    description: "Legacy single image URL.",
    icon: ImageIcon,
  },
  {
    value: "pdf",
    label: "PDF Link",
    description: "Legacy document URL.",
    icon: FileText,
  },
];

const typeMap = new Map(SECTION_TYPES.map((type) => [type.value, type]));

function emptyContent(type) {
  switch (type) {
    case "content":
      return { subtitle: "", body: "", image: "", imageAlt: "" };
    case "imageText":
      return { eyebrow: "", body: "", image: "", imageAlt: "", imagePosition: "left", buttonText: "", link: "" };
    case "cardGrid":
      return { columns: 3, cards: [{ title: "", description: "", image: "", icon: "", link: "" }] };
    case "statGrid":
      return { stats: [{ value: "", label: "", description: "" }] };
    case "accordion":
      return { items: [{ title: "", content: "" }] };
    case "timeline":
      return { steps: [{ label: "", title: "", description: "" }] };
    case "table":
      return { headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "gallery":
      return { images: [{ url: "", alt: "", caption: "" }] };
    case "cta":
      return { eyebrow: "", body: "", buttonText: "", link: "", image: "" };
    case "list":
      return [""];
    default:
      return "";
  }
}

function normalizeSection(section, index) {
  const type = section.contentType || "content";
  const contentData = section.contentData ?? emptyContent(type);
  return {
    title: section.title || `Section ${index + 1}`,
    contentType: type,
    contentData,
  };
}

function updateArrayItem(items, itemIndex, patch) {
  return items.map((item, index) => (index === itemIndex ? { ...item, ...patch } : item));
}

export default function ProgramSectionBuilder({
  title = "Content Sections",
  description = "Choose the type of page section you need, then fill in its fields.",
  sections = [],
  onChange,
  onSave,
  saveLabel = "Save Sections",
  nextIcon = null,
}) {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("content");

  useEffect(() => {
    setData((sections || []).map(normalizeSection));
  }, [sections]);

  const selectedMeta = useMemo(() => typeMap.get(selectedType), [selectedType]);

  const commit = (next) => {
    setData(next);
    onChange?.(next);
  };

  const updateSection = (index, patch) => {
    const next = data.map((section, sectionIndex) =>
      sectionIndex === index ? { ...section, ...patch } : section
    );
    commit(next);
  };

  const updateContent = (index, patch) => {
    const section = data[index];
    const current = section.contentData || emptyContent(section.contentType);
    const nextContent = Array.isArray(current) ? patch : { ...current, ...patch };
    updateSection(index, { contentData: nextContent });
  };

  const addSection = () => {
    const meta = typeMap.get(selectedType);
    commit([
      ...data,
      {
        title: meta?.label || "New Section",
        contentType: selectedType,
        contentData: emptyContent(selectedType),
      },
    ]);
  };

  const deleteSection = (index) => {
    if (!confirm("Delete this section?")) return;
    commit(data.filter((_, sectionIndex) => sectionIndex !== index));
  };

  const changeSectionType = (index, nextType) => {
    const meta = typeMap.get(nextType);
    updateSection(index, {
      title: data[index].title || meta?.label || "New Section",
      contentType: nextType,
      contentData: emptyContent(nextType),
    });
  };

  const addRepeaterItem = (sectionIndex, key, blankItem) => {
    const section = data[sectionIndex];
    const items = section.contentData?.[key] || [];
    updateContent(sectionIndex, { [key]: [...items, blankItem] });
  };

  const updateRepeaterItem = (sectionIndex, key, itemIndex, patch) => {
    const section = data[sectionIndex];
    const items = section.contentData?.[key] || [];
    updateContent(sectionIndex, { [key]: updateArrayItem(items, itemIndex, patch) });
  };

  const deleteRepeaterItem = (sectionIndex, key, itemIndex) => {
    const section = data[sectionIndex];
    const items = section.contentData?.[key] || [];
    updateContent(sectionIndex, { [key]: items.filter((_, index) => index !== itemIndex) });
  };

  const renderLegacyList = (section, sectionIndex) => {
    const items = Array.isArray(section.contentData) ? section.contentData : [];
    return (
      <div className="space-y-2">
        <Label>List Items</Label>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => {
                const next = [...items];
                next[itemIndex] = event.target.value;
                updateSection(sectionIndex, { contentData: next });
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => updateSection(sectionIndex, { contentData: items.filter((_, index) => index !== itemIndex) })}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => updateSection(sectionIndex, { contentData: [...items, ""] })}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
    );
  };

  const renderSectionFields = (section, sectionIndex) => {
    const value = section.contentData || emptyContent(section.contentType);

    if (section.contentType === "text") {
      return (
        <Textarea
          rows={5}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => updateSection(sectionIndex, { contentData: event.target.value })}
          placeholder="Write section content"
        />
      );
    }

    if (section.contentType === "list") return renderLegacyList(section, sectionIndex);

    if (section.contentType === "image" || section.contentType === "pdf") {
      return (
        <div className="space-y-2">
          <Input
            value={typeof value === "string" ? value : ""}
            onChange={(event) => updateSection(sectionIndex, { contentData: event.target.value })}
            placeholder={section.contentType === "pdf" ? "PDF URL" : "Image URL"}
          />
          {section.contentType === "image" && value && (
            <img src={value} alt="" className="max-h-56 rounded-md border object-contain" />
          )}
        </div>
      );
    }

    if (section.contentType === "table") {
      return (
        <EditableTable
          initialData={value}
          onChange={(tableData) => updateSection(sectionIndex, { contentData: tableData })}
        />
      );
    }

    if (section.contentType === "content" || section.contentType === "imageText") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {section.contentType === "imageText" && (
            <div className="space-y-2">
              <Label>Eyebrow</Label>
              <Input value={value.eyebrow || ""} onChange={(event) => updateContent(sectionIndex, { eyebrow: event.target.value })} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={value.subtitle || ""} onChange={(event) => updateContent(sectionIndex, { subtitle: event.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Body</Label>
            <Textarea rows={5} value={value.body || ""} onChange={(event) => updateContent(sectionIndex, { body: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={value.image || ""} onChange={(event) => updateContent(sectionIndex, { image: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Image Alt</Label>
            <Input value={value.imageAlt || ""} onChange={(event) => updateContent(sectionIndex, { imageAlt: event.target.value })} />
          </div>
          {section.contentType === "imageText" && (
            <>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={value.buttonText || ""} onChange={(event) => updateContent(sectionIndex, { buttonText: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input value={value.link || ""} onChange={(event) => updateContent(sectionIndex, { link: event.target.value })} />
              </div>
            </>
          )}
        </div>
      );
    }

    if (section.contentType === "cardGrid") {
      const cards = value.cards || [];
      return (
        <div className="space-y-4">
          <div className="max-w-40 space-y-2">
            <Label>Columns</Label>
            <Input type="number" min="1" max="4" value={value.columns || 3} onChange={(event) => updateContent(sectionIndex, { columns: Number(event.target.value) })} />
          </div>
          {cards.map((card, itemIndex) => (
            <div key={itemIndex} className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <Input placeholder="Card title" value={card.title || ""} onChange={(event) => updateRepeaterItem(sectionIndex, "cards", itemIndex, { title: event.target.value })} />
              <Input placeholder="Icon name" value={card.icon || ""} onChange={(event) => updateRepeaterItem(sectionIndex, "cards", itemIndex, { icon: event.target.value })} />
              <Textarea className="md:col-span-2" placeholder="Description" value={card.description || ""} onChange={(event) => updateRepeaterItem(sectionIndex, "cards", itemIndex, { description: event.target.value })} />
              <Input placeholder="Image URL" value={card.image || ""} onChange={(event) => updateRepeaterItem(sectionIndex, "cards", itemIndex, { image: event.target.value })} />
              <Input placeholder="Link" value={card.link || ""} onChange={(event) => updateRepeaterItem(sectionIndex, "cards", itemIndex, { link: event.target.value })} />
              <Button variant="ghost" className="w-fit text-red-600" onClick={() => deleteRepeaterItem(sectionIndex, "cards", itemIndex)}>
                <Trash2 className="h-4 w-4" />
                Remove Card
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addRepeaterItem(sectionIndex, "cards", { title: "", description: "", image: "", icon: "", link: "" })}>
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      );
    }

    if (section.contentType === "statGrid") {
      const stats = value.stats || [];
      return (
        <RepeaterFields
          items={stats}
          addLabel="Add Stat"
          fields={["value", "label", "description"]}
          onAdd={() => addRepeaterItem(sectionIndex, "stats", { value: "", label: "", description: "" })}
          onChange={(itemIndex, patch) => updateRepeaterItem(sectionIndex, "stats", itemIndex, patch)}
          onDelete={(itemIndex) => deleteRepeaterItem(sectionIndex, "stats", itemIndex)}
        />
      );
    }

    if (section.contentType === "accordion") {
      const items = value.items || [];
      return (
        <RepeaterFields
          items={items}
          addLabel="Add Accordion Item"
          fields={["title", "content"]}
          multilineFields={["content"]}
          onAdd={() => addRepeaterItem(sectionIndex, "items", { title: "", content: "" })}
          onChange={(itemIndex, patch) => updateRepeaterItem(sectionIndex, "items", itemIndex, patch)}
          onDelete={(itemIndex) => deleteRepeaterItem(sectionIndex, "items", itemIndex)}
        />
      );
    }

    if (section.contentType === "timeline") {
      const steps = value.steps || [];
      return (
        <RepeaterFields
          items={steps}
          addLabel="Add Step"
          fields={["label", "title", "description"]}
          multilineFields={["description"]}
          onAdd={() => addRepeaterItem(sectionIndex, "steps", { label: "", title: "", description: "" })}
          onChange={(itemIndex, patch) => updateRepeaterItem(sectionIndex, "steps", itemIndex, patch)}
          onDelete={(itemIndex) => deleteRepeaterItem(sectionIndex, "steps", itemIndex)}
        />
      );
    }

    if (section.contentType === "gallery") {
      const images = value.images || [];
      return (
        <RepeaterFields
          items={images}
          addLabel="Add Image"
          fields={["url", "alt", "caption"]}
          onAdd={() => addRepeaterItem(sectionIndex, "images", { url: "", alt: "", caption: "" })}
          onChange={(itemIndex, patch) => updateRepeaterItem(sectionIndex, "images", itemIndex, patch)}
          onDelete={(itemIndex) => deleteRepeaterItem(sectionIndex, "images", itemIndex)}
        />
      );
    }

    if (section.contentType === "cta") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Eyebrow" value={value.eyebrow || ""} onChange={(event) => updateContent(sectionIndex, { eyebrow: event.target.value })} />
          <Input placeholder="Button text" value={value.buttonText || ""} onChange={(event) => updateContent(sectionIndex, { buttonText: event.target.value })} />
          <Textarea className="md:col-span-2" rows={4} placeholder="CTA body" value={value.body || ""} onChange={(event) => updateContent(sectionIndex, { body: event.target.value })} />
          <Input placeholder="Button link" value={value.link || ""} onChange={(event) => updateContent(sectionIndex, { link: event.target.value })} />
          <Input placeholder="Image URL" value={value.image || ""} onChange={(event) => updateContent(sectionIndex, { image: event.target.value })} />
        </div>
      );
    }

    return <div className="text-sm text-red-600">Unknown section type: {section.contentType}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[260px]">
              <SelectValue placeholder="Select section type" />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addSection}>
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {selectedMeta && (
        <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedMeta.label}:</span> {selectedMeta.description}
        </div>
      )}

      {data.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed py-12 text-center text-sm text-muted-foreground">
          Select a section type above and add your first section.
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={data.map((_, index) => `section-${index}`)} className="space-y-4">
          {data.map((section, index) => {
            const meta = typeMap.get(section.contentType);
            const Icon = meta?.icon || AlignLeft;
            return (
              <AccordionItem key={`${section.contentType}-${index}`} value={`section-${index}`} className="rounded-lg border bg-white px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 text-left">
                      <div className="truncate font-semibold">{section.title || meta?.label || "Untitled Section"}</div>
                      <div className="text-xs text-muted-foreground">{meta?.label || section.contentType}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="mb-4 border-l-4 border-l-primary">
                    <CardContent className="space-y-4 p-4">
                      <div className="grid gap-4 md:grid-cols-[1fr_260px_auto] md:items-end">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input value={section.title || ""} onChange={(event) => updateSection(index, { title: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Section Type</Label>
                          <Select value={section.contentType} onValueChange={(value) => changeSectionType(index, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SECTION_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteSection(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator />
                      {renderSectionFields(section, index)}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <div className="sticky bottom-4 flex justify-end rounded-lg border bg-white/90 p-4 shadow-lg backdrop-blur">
        <Button onClick={() => onSave?.(data)} size="lg">
          {saveLabel}
          {nextIcon}
        </Button>
      </div>
    </div>
  );
}

function RepeaterFields({
  items,
  fields,
  multilineFields = [],
  addLabel,
  onAdd,
  onChange,
  onDelete,
}) {
  return (
    <div className="space-y-4">
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
          {fields.map((field) => {
            const label = field.replace(/([A-Z])/g, " $1").replace(/^\w/, (char) => char.toUpperCase());
            return (
              <div key={field} className={multilineFields.includes(field) ? "space-y-2 md:col-span-2" : "space-y-2"}>
                <Label>{label}</Label>
                {multilineFields.includes(field) ? (
                  <Textarea value={item[field] || ""} onChange={(event) => onChange(itemIndex, { [field]: event.target.value })} />
                ) : (
                  <Input value={item[field] || ""} onChange={(event) => onChange(itemIndex, { [field]: event.target.value })} />
                )}
              </div>
            );
          })}
          <Button variant="ghost" className="w-fit text-red-600" onClick={() => onDelete(itemIndex)}>
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}
