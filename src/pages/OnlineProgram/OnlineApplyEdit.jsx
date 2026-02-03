"use client";

import { useEffect, useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getStepById,
  updateStepById,
} from "@/Api/OnlineProgramApi/OnlineProgramApply";
import { useParams, useNavigate } from "react-router-dom";
import IconSearchPicker from "./IconSearchPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function OnlineApplyEdit() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!stepId) return;

    const fetchStep = async () => {
      try {
        const res = await getStepById(stepId);
        const step = res.data ?? res;

        setData({
          title: step.title || "",
          media: { type: "icon", value: step.iconName || "" },
          descType: step.descriptionPoints?.length ? "list" : "text",
          descText: "",
          descList: step.descriptionPoints?.length
            ? step.descriptionPoints
            : [""],
        });
      } catch {
        toast({ title: "Error", description: "Failed to load step" });
      }
    };

    fetchStep();
  }, [stepId]);

  const save = async () => {
    try {
      await updateStepById(stepId, {
        title: data.title,
        iconName: data.media.value,
        descriptionPoints:
          data.descType === "list"
            ? data.descList.filter(Boolean)
            : data.descText
            ? [data.descText]
            : [],
      });

      toast({ title: "Success", description: "Step updated" });
      navigate(-1);
    } catch {
      toast({ title: "Error", description: "Update failed" });
    }
  };

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back
      </Button>

      <Separator />

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Edit Step</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Media Picker */}
          <Label>Add Icon / Image</Label>
          <div className="space-y-2">
            <div className="flex gap-4 text-sm">
              {["icon", "url", "file"].map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={data.media.type === type}
                    onChange={() =>
                      setData({ ...data, media: { type, value: "" } })
                    }
                  />
                  {type}
                </label>
              ))}
            </div>

            {data.media.type === "icon" && (
              <IconSearchPicker
                value={data.media.value}
                onSelect={(v) =>
                  setData({ ...data, media: { type: "icon", value: v } })
                }
              />
            )}

            {data.media.type === "url" && (
              <Input
                placeholder="Image URL"
                value={data.media.value}
                onChange={(e) =>
                  setData({
                    ...data,
                    media: { type: "url", value: e.target.value },
                  })
                }
              />
            )}

            {data.media.type === "file" && (
              <Input type="file" accept="image/*" />
            )}
          </div>

          {/* Title */}
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) =>
              setData({ ...data, title: e.target.value })
            }
          />

          {/* Description */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Description</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={data.descType === "text" ? "default" : "outline"}
                  onClick={() =>
                    setData({
                      ...data,
                      descType: "text",
                      descList: [""],
                    })
                  }
                >
                  Text
                </Button>
                <Button
                  size="sm"
                  variant={data.descType === "list" ? "default" : "outline"}
                  onClick={() =>
                    setData({
                      ...data,
                      descType: "list",
                      descText: "",
                    })
                  }
                >
                  List
                </Button>
              </div>
            </div>

            {data.descType === "text" && (
              <Textarea
                value={data.descText}
                onChange={(e) =>
                  setData({ ...data, descText: e.target.value })
                }
              />
            )}

            {data.descType === "list" && (
              <div className="space-y-2">
                {data.descList.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={p}
                      placeholder={`Point ${i + 1}`}
                      onChange={(e) => {
                        const updated = [...data.descList];
                        updated[i] = e.target.value;
                        setData({ ...data, descList: updated });
                      }}
                    />
                    {data.descList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setData({
                            ...data,
                            descList: data.descList.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData({
                      ...data,
                      descList: [...data.descList, ""],
                    })
                  }
                >
                  + Add Point
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={save}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
