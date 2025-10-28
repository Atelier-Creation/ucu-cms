import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, ChevronsRight } from "lucide-react";

export default function PlacementEditor({
  mode = "create",
  initialData = null,
  onSave,
  onNext,
}) {
  const [data, setData] = useState({
    main: {
      heading: "UCU Chennai: Gateway to the World of Opportunity",
      description:
        "Through its expansive network of 2000+ leading corporations—spanning both national champions and global giants—UCU Chennai unlocks high-impact career pathways for every student.",
    },
    internship: {
      title: "Internship Placement Process",
      content: [
        "The Corporate Autumn/Summer Internship is a mandatory credit component...",
        "Pre-Placement Offer (PPO): 40-50% of the batch gets placed...",
      ],
      timeline: [
        { label: "Batch", value: "Class of 2025-27" },
        { label: "Period (2 months)", value: "April-May 2026" },
      ],
    },
    finalPlacement: {
      title: "Final Placement Process",
      content: ["The final placement process focuses on securing full-time job roles..."],
      timeline: [{ label: "Batch", value: "Class of 2025-27" }],
    },
    careerServices: [
      {
        head: "Mock interviews and group discussion preparations",
        image: "https://www.spjimr.org/wp-content/uploads/2022/09/c2e511cc.webp",
        para: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
    ],
    highlights: [
      { number: "224", para: "Participant Companies" },
      { number: "150", para: "Total PPOs" },
    ],
    recruiters: ["Amazon", "KPMG", "EY"],
    contact: [
      {
        name: "UCU",
        role: "Director - Career Services",
        email: "ucu@gmail.com",
        phone: "9876543210",
      },
    ],
  });

  const isViewMode = mode === "view";

  // 🔁 Load initialData if editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData(initialData);
    }
  }, [mode, initialData]);

  // 🧩 Handlers
  const handleChange = (path, value) => {
    const keys = path.split(".");
    setData((prev) => {
      const newData = { ...prev };
      let ref = newData;
      keys.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayChange = (key, index, field, value) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) =>
        i === index ? (field ? { ...item, [field]: value } : value) : item
      ),
    }));

  const addItem = (key, newItem) =>
    setData((prev) => ({ ...prev, [key]: [...prev[key], newItem] }));

  const removeItem = (key, index) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));

  const handleSave = () => {
    if (onSave) onSave(data);
    else {
      console.log("Placement Data Saved:", data);
      alert("Placement Data Saved (mock)");
    }
    if (onNext) onNext();
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">
        {mode === "edit" ? "Edit Placement Details" : "Placement Editor"}
      </h2>

      {/* === Main Section === */}
      <Card>
        <CardHeader>
          <CardTitle>Main Placement Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={data.main.heading}
              disabled={isViewMode}
              onChange={(e) => handleChange("main.heading", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              disabled={isViewMode}
              value={data.main.description}
              onChange={(e) => handleChange("main.description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* === Tabs for Internship / Final Placement === */}
      <Card>
        <CardHeader>
          <CardTitle>Placement Process</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="internship">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="internship">Internship</TabsTrigger>
              <TabsTrigger value="finalPlacement">Final Placement</TabsTrigger>
            </TabsList>

            {/* === Internship === */}
            <TabsContent value="internship">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {data.internship.title}
                </h3>
                {data.internship.content.map((para, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      rows={2}
                      disabled={isViewMode}
                      value={para}
                      onChange={(e) =>
                        handleArrayChange("internship.content", i, null, e.target.value)
                      }
                    />
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        onClick={() => removeItem("internship.content", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isViewMode && (
                  <Button
                    variant="secondary"
                    onClick={() => addItem("internship.content", "New paragraph")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Paragraph
                  </Button>
                )}

                <Separator />
                <h3 className="font-semibold">Timeline</h3>
                {data.internship.timeline.map((row, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={row.label}
                      disabled={isViewMode}
                      onChange={(e) =>
                        handleArrayChange("internship.timeline", i, "label", e.target.value)
                      }
                      placeholder="Label"
                    />
                    <Input
                      value={row.value}
                      disabled={isViewMode}
                      onChange={(e) =>
                        handleArrayChange("internship.timeline", i, "value", e.target.value)
                      }
                      placeholder="Value"
                    />
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem("internship.timeline", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isViewMode && (
                  <Button
                    onClick={() =>
                      addItem("internship.timeline", { label: "New", value: "TBD" })
                    }
                  >
                    + Add Timeline Row
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* === Final Placement === */}
            <TabsContent value="finalPlacement">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {data.finalPlacement.title}
                </h3>
                {data.finalPlacement.content.map((para, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      rows={2}
                      disabled={isViewMode}
                      value={para}
                      onChange={(e) =>
                        handleArrayChange("finalPlacement.content", i, null, e.target.value)
                      }
                    />
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        onClick={() => removeItem("finalPlacement.content", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isViewMode && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      addItem("finalPlacement.content", "New paragraph")
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Paragraph
                  </Button>
                )}

                <Separator />
                <h3 className="font-semibold">Timeline</h3>
                {data.finalPlacement.timeline.map((row, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={row.label}
                      disabled={isViewMode}
                      onChange={(e) =>
                        handleArrayChange("finalPlacement.timeline", i, "label", e.target.value)
                      }
                      placeholder="Label"
                    />
                    <Input
                      value={row.value}
                      disabled={isViewMode}
                      onChange={(e) =>
                        handleArrayChange("finalPlacement.timeline", i, "value", e.target.value)
                      }
                      placeholder="Value"
                    />
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem("finalPlacement.timeline", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isViewMode && (
                  <Button
                    onClick={() =>
                      addItem("finalPlacement.timeline", { label: "New", value: "TBD" })
                    }
                  >
                    + Add Timeline Row
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* === Career Services === */}
      <Card>
        <CardHeader>
          <CardTitle>Career Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.careerServices.map((item, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              <Input
                value={item.head}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("careerServices", i, "head", e.target.value)
                }
                placeholder="Title"
              />
              <Input
                value={item.image}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("careerServices", i, "image", e.target.value)
                }
                placeholder="Image URL"
              />
              <Textarea
                rows={2}
                disabled={isViewMode}
                value={item.para}
                onChange={(e) =>
                  handleArrayChange("careerServices", i, "para", e.target.value)
                }
              />
              {!isViewMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("careerServices", i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isViewMode && (
            <Button
              variant="secondary"
              onClick={() =>
                addItem("careerServices", {
                  head: "New Service",
                  image: "",
                  para: "Description...",
                })
              }
            >
              + Add Service
            </Button>
          )}
        </CardContent>
      </Card>

      {/* === Recruiters === */}
      <Card>
        <CardHeader>
          <CardTitle>Top Recruiters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recruiters.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={r}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("recruiters", i, null, e.target.value)
                }
              />
              {!isViewMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("recruiters", i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isViewMode && (
            <Button onClick={() => addItem("recruiters", "New Recruiter")}>
              + Add Recruiter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* === Contact === */}
      <Card>
        <CardHeader>
          <CardTitle>Placement Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.contact.map((c, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              <Input
                value={c.name}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("contact", i, "name", e.target.value)
                }
                placeholder="Name"
              />
              <Input
                value={c.role}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("contact", i, "role", e.target.value)
                }
                placeholder="Role"
              />
              <Input
                value={c.email}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("contact", i, "email", e.target.value)
                }
                placeholder="Email"
              />
              <Input
                value={c.phone}
                disabled={isViewMode}
                onChange={(e) =>
                  handleArrayChange("contact", i, "phone", e.target.value)
                }
                placeholder="Phone"
              />
              {!isViewMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("contact", i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isViewMode && (
            <Button
              onClick={() =>
                addItem("contact", {
                  name: "New Contact",
                  role: "Role",
                  email: "",
                  phone: "",
                })
              }
            >
              + Add Contact
            </Button>
          )}
        </CardContent>
      </Card>

      {/* === Save Button === */}
      {!isViewMode && (
        <div className="text-right">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-800 text-white rounded-sm"
          >
            {mode === "edit" ? "Update & Next" : "Save & Next"}{" "}
            <ChevronsRight className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
