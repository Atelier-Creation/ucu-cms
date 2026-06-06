import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getSalesDiplomaPage, updateSalesDiplomaPage } from "../Api/SalesDiplomaPageApi";

const defaultData = {
  statsTitle: "Sales Diploma at a Glance",
  statsSubtitle: "A focused, corporate-connected pathway for early career sales talent.",
  stats: [],
};

const emptyStat = {
  value: "",
  label: "",
  note: "",
};

export default function SalesDiplomaPageCMS() {
  const [data, setData] = useState(defaultData);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getSalesDiplomaPage();
      setData({ ...defaultData, ...result, stats: result?.stats || [] });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch Sales Diploma CMS data.", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSalesDiplomaPage(data);
      setData({ ...defaultData, ...result, stats: result?.stats || [] });
      toast({ title: "Success", description: "Sales Diploma page updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save Sales Diploma page.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateStat = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    }));
  };

  const addStat = () => {
    setData((prev) => ({ ...prev, stats: [...(prev.stats || []), { ...emptyStat }] }));
  };

  const removeStat = (index) => {
    setData((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales Diploma CMS</h1>
          <p className="text-sm text-muted-foreground">
            Manage the number/stat boxes shown before Participant Organisations.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Stats Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Section Heading</label>
            <Input value={data.statsTitle || ""} onChange={(e) => updateField("statsTitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Section Subtext</label>
            <Textarea value={data.statsSubtitle || ""} onChange={(e) => updateField("statsSubtitle", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Number Boxes</CardTitle>
          <Button size="sm" variant="outline" onClick={addStat}>+ Add Stat</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.stats || []).map((stat, index) => (
            <Card key={index} className="p-4 border-dashed">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Stat {index + 1}</h3>
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeStat(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input value={stat.value || ""} onChange={(e) => updateStat(index, "value", e.target.value)} placeholder="Number, e.g. 6" />
                <Input value={stat.label || ""} onChange={(e) => updateStat(index, "label", e.target.value)} placeholder="Label, e.g. Months" />
                <Input value={stat.note || ""} onChange={(e) => updateStat(index, "note", e.target.value)} placeholder="Small note" />
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
