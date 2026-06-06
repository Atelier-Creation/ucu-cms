import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getContactPageData, updateContactPageData } from "../Api/ContactPageApi";
import FileUploader from "@/components/FileUploader";

const defaultData = {
  hero: { bannerTitle: "Contact Us", bannerContent: "", bannerImage: [""] },
  introSection: { title: "" },
  visibility: {
    contactBoxes: true,
    contactForm: true,
    contactAccordion: true,
    indiaCenters: true,
    internationalCenters: true,
  },
  contactCard: [],
  contactAccordion: [],
  indiaCenter: [],
  internationalCenter: [],
};

const emptyCard = {
  tagName: "",
  title: "",
  iconImage: "map-pin",
  image: "",
  content: [""],
  link: "",
  buttonText: "Know More",
  isVisible: true,
};

const emptyAccordion = {
  title: "",
  isVisible: true,
  items: [{ name: "", role: "", phones: [""], email: "" }],
};

const emptyCenter = {
  tag: "UCU Centers",
  title: "",
  content: "",
  link: "",
  isVisible: true,
  states: [],
  countries: [],
};

const normalize = (data) => ({
  ...defaultData,
  ...(data || {}),
  hero: { ...defaultData.hero, ...(data?.hero || {}) },
  introSection: { ...defaultData.introSection, ...(data?.introSection || {}) },
  visibility: { ...defaultData.visibility, ...(data?.visibility || {}) },
  internationalCenter: data?.internationalCenter?.length
    ? data.internationalCenter
    : data?.iternationalCenter || [],
});

export default function ContactPageCMS() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getContactPageData();
      setData(normalize(result));
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch Contact page data.", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateContactPageData({
        ...data,
        iternationalCenter: data.internationalCenter,
      });
      toast({ title: "Success", description: "Contact page updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update Contact page.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateNested = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateArrayItem = (key, index, field, value) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (key, item) => {
    setData((prev) => ({ ...prev, [key]: [...(prev[key] || []), item] }));
  };

  const removeArrayItem = (key, index) => {
    setData((prev) => ({ ...prev, [key]: prev[key].filter((_, itemIndex) => itemIndex !== index) }));
  };

  const updateCardContent = (cardIndex, lineIndex, value) => {
    setData((prev) => ({
      ...prev,
      contactCard: prev.contactCard.map((card, index) =>
        index === cardIndex
          ? { ...card, content: card.content.map((line, idx) => (idx === lineIndex ? value : line)) }
          : card
      ),
    }));
  };

  const updateAccordionItem = (sectionIndex, itemIndex, field, value) => {
    setData((prev) => ({
      ...prev,
      contactAccordion: prev.contactAccordion.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, i) => (i === itemIndex ? { ...item, [field]: value } : item)),
            }
          : section
      ),
    }));
  };

  const updateAccordionPhone = (sectionIndex, itemIndex, phoneIndex, value) => {
    setData((prev) => ({
      ...prev,
      contactAccordion: prev.contactAccordion.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, i) =>
                i === itemIndex
                  ? { ...item, phones: item.phones.map((phone, p) => (p === phoneIndex ? value : phone)) }
                  : item
              ),
            }
          : section
      ),
    }));
  };

  const updateCenterPlace = (key, placeKey, centerIndex, placeIndex, field, value) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((center, idx) =>
        idx === centerIndex
          ? {
              ...center,
              [placeKey]: (center[placeKey] || []).map((place, p) =>
                p === placeIndex ? { ...place, [field]: value } : place
              ),
            }
          : center
      ),
    }));
  };

  const addCenterPlace = (key, placeKey, centerIndex) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((center, idx) =>
        idx === centerIndex
          ? { ...center, [placeKey]: [...(center[placeKey] || []), { name: "", image: "", poc: { name: "", contact: "", email: "" } }] }
          : center
      ),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Page CMS</h1>
        <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Hero & Intro</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={data.hero.bannerTitle || ""} onChange={(e) => updateNested("hero", "bannerTitle", e.target.value)} placeholder="Hero title" />
          <Textarea value={data.hero.bannerContent || ""} onChange={(e) => updateNested("hero", "bannerContent", e.target.value)} placeholder="Hero content" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Image</label>
            <FileUploader
              accept="image/*"
              value={data.hero.bannerImage?.[0] || ""}
              onChange={(url) => updateNested("hero", "bannerImage", [url])}
            />
          </div>
          <Textarea value={data.introSection.title || ""} onChange={(e) => updateNested("introSection", "title", e.target.value)} placeholder="Intro paragraph" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Show / Hide Sections</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.visibility).map(([key, value]) => (
            <label className="flex items-center justify-between rounded border p-3" key={key}>
              <span className="font-medium">{key}</span>
              <Switch checked={value} onCheckedChange={(checked) => updateNested("visibility", key, checked)} />
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Boxes</CardTitle>
          <Button size="sm" variant="outline" onClick={() => addArrayItem("contactCard", { ...emptyCard })}>+ Add Box</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.contactCard.map((card, index) => (
            <Card key={index} className="p-4 border-dashed">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Box {index + 1}</h3>
                <div className="flex gap-3 items-center">
                  <Switch checked={card.isVisible !== false} onCheckedChange={(checked) => updateArrayItem("contactCard", index, "isVisible", checked)} />
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeArrayItem("contactCard", index)}>Remove</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input value={card.tagName || ""} onChange={(e) => updateArrayItem("contactCard", index, "tagName", e.target.value)} placeholder="Label" />
                <Input value={card.title || ""} onChange={(e) => updateArrayItem("contactCard", index, "title", e.target.value)} placeholder="Title" />
                <select className="border rounded-md px-3 py-2" value={card.iconImage || "map-pin"} onChange={(e) => updateArrayItem("contactCard", index, "iconImage", e.target.value)}>
                  <option value="map-pin">Map pin</option>
                  <option value="mail">Mail</option>
                  <option value="phone">Phone</option>
                </select>
                <Input value={card.link || ""} onChange={(e) => updateArrayItem("contactCard", index, "link", e.target.value)} placeholder="Link" />
                <Input value={card.buttonText || ""} onChange={(e) => updateArrayItem("contactCard", index, "buttonText", e.target.value)} placeholder="Button text" />
              </div>
              <div className="space-y-2 mt-3">
                <label className="text-sm font-medium">Box Image</label>
                <FileUploader
                  accept="image/*"
                  value={card.image || ""}
                  onChange={(url) => updateArrayItem("contactCard", index, "image", url)}
                />
              </div>
              <div className="space-y-2 mt-3">
                {(card.content || []).map((line, lineIndex) => (
                  <div className="flex gap-2" key={lineIndex}>
                    <Input value={line} onChange={(e) => updateCardContent(index, lineIndex, e.target.value)} placeholder="Content line" />
                    <Button size="sm" variant="ghost" onClick={() => updateArrayItem("contactCard", index, "content", card.content.filter((_, i) => i !== lineIndex))}>X</Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => updateArrayItem("contactCard", index, "content", [...(card.content || []), ""])}>+ Add Line</Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Accordion Contacts</CardTitle>
          <Button size="sm" variant="outline" onClick={() => addArrayItem("contactAccordion", { ...emptyAccordion })}>+ Add Section</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.contactAccordion.map((section, sectionIndex) => (
            <Card className="p-4 border-dashed" key={sectionIndex}>
              <div className="flex gap-3 items-center mb-3">
                <Input value={section.title || ""} onChange={(e) => updateArrayItem("contactAccordion", sectionIndex, "title", e.target.value)} placeholder="Section title" />
                <Switch checked={section.isVisible !== false} onCheckedChange={(checked) => updateArrayItem("contactAccordion", sectionIndex, "isVisible", checked)} />
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeArrayItem("contactAccordion", sectionIndex)}>Remove</Button>
              </div>
              {(section.items || []).map((item, itemIndex) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-3 mb-3" key={itemIndex}>
                  <Input value={item.name || ""} onChange={(e) => updateAccordionItem(sectionIndex, itemIndex, "name", e.target.value)} placeholder="Name / Location" />
                  <Input value={item.role || ""} onChange={(e) => updateAccordionItem(sectionIndex, itemIndex, "role", e.target.value)} placeholder="Role" />
                  <Input value={item.email || ""} onChange={(e) => updateAccordionItem(sectionIndex, itemIndex, "email", e.target.value)} placeholder="Email" />
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => updateArrayItem("contactAccordion", sectionIndex, "items", section.items.filter((_, i) => i !== itemIndex))}>Remove Contact</Button>
                  {(item.phones || []).map((phone, phoneIndex) => (
                    <Input key={phoneIndex} value={phone} onChange={(e) => updateAccordionPhone(sectionIndex, itemIndex, phoneIndex, e.target.value)} placeholder="Phone" />
                  ))}
                  <Button size="sm" variant="outline" onClick={() => updateAccordionItem(sectionIndex, itemIndex, "phones", [...(item.phones || []), ""])}>+ Add Phone</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => updateArrayItem("contactAccordion", sectionIndex, "items", [...(section.items || []), { name: "", role: "", phones: [""], email: "" }])}>+ Add Contact</Button>
            </Card>
          ))}
        </CardContent>
      </Card>

      <CenterEditor title="India Regional Centers" dataKey="indiaCenter" placeKey="states" centers={data.indiaCenter} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} updateArrayItem={updateArrayItem} updateCenterPlace={updateCenterPlace} addCenterPlace={addCenterPlace} />
      <CenterEditor title="International Centers" dataKey="internationalCenter" placeKey="countries" centers={data.internationalCenter} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} updateArrayItem={updateArrayItem} updateCenterPlace={updateCenterPlace} addCenterPlace={addCenterPlace} />
    </div>
  );
}

function updatePlacePocValue(place, field, value) {
  return {
    ...place,
    poc: {
      ...(place.poc || {}),
      [field]: value,
    },
  };
}

function CenterEditor({ title, dataKey, placeKey, centers, addArrayItem, removeArrayItem, updateArrayItem, updateCenterPlace, addCenterPlace }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" variant="outline" onClick={() => addArrayItem(dataKey, { ...emptyCenter, [placeKey]: [] })}>+ Add Center Section</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {centers.map((center, centerIndex) => (
          <Card className="p-4 border-dashed" key={centerIndex}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input value={center.tag || ""} onChange={(e) => updateArrayItem(dataKey, centerIndex, "tag", e.target.value)} placeholder="Tag" />
              <Input value={center.title || ""} onChange={(e) => updateArrayItem(dataKey, centerIndex, "title", e.target.value)} placeholder="Title" />
              <Input value={center.link || ""} onChange={(e) => updateArrayItem(dataKey, centerIndex, "link", e.target.value)} placeholder="Link" />
              <div className="flex gap-3 items-center">
                <span>Visible</span>
                <Switch checked={center.isVisible !== false} onCheckedChange={(checked) => updateArrayItem(dataKey, centerIndex, "isVisible", checked)} />
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeArrayItem(dataKey, centerIndex)}>Remove</Button>
              </div>
            </div>
            <Textarea className="mt-3" value={center.content || ""} onChange={(e) => updateArrayItem(dataKey, centerIndex, "content", e.target.value)} placeholder="Description" />
            <div className="space-y-2 mt-4">
              {(center[placeKey] || []).map((place, placeIndex) => (
                <div className="grid grid-cols-1 gap-2 border rounded p-3" key={placeIndex}>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                    <Input value={place.name || ""} onChange={(e) => updateCenterPlace(dataKey, placeKey, centerIndex, placeIndex, "name", e.target.value)} placeholder="Name" />
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => updateArrayItem(dataKey, centerIndex, placeKey, center[placeKey].filter((_, i) => i !== placeIndex))}>Remove</Button>
                  </div>
                  <FileUploader
                    accept="image/*"
                    value={place.image || ""}
                    onChange={(url) => updateCenterPlace(dataKey, placeKey, centerIndex, placeIndex, "image", url)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={place.poc?.name || ""}
                      onChange={(e) => updateArrayItem(dataKey, centerIndex, placeKey, center[placeKey].map((item, itemIndex) => itemIndex === placeIndex ? updatePlacePocValue(item, "name", e.target.value) : item))}
                      placeholder="POC name"
                    />
                    <Input
                      value={place.poc?.contact || ""}
                      onChange={(e) => updateArrayItem(dataKey, centerIndex, placeKey, center[placeKey].map((item, itemIndex) => itemIndex === placeIndex ? updatePlacePocValue(item, "contact", e.target.value) : item))}
                      placeholder="POC contact"
                    />
                    <Input
                      value={place.poc?.email || ""}
                      onChange={(e) => updateArrayItem(dataKey, centerIndex, placeKey, center[placeKey].map((item, itemIndex) => itemIndex === placeIndex ? updatePlacePocValue(item, "email", e.target.value) : item))}
                      placeholder="POC email"
                    />
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => addCenterPlace(dataKey, placeKey, centerIndex)}>+ Add Item</Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
