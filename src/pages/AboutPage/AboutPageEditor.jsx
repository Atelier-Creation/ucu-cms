import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAboutPageData, updateAboutPageData } from "@/Api/AboutApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash, Save, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import HighlightableInput from "@/components/HighlightableInput";

export default function AboutPageEditor() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        title: "",
        slug: "",
        description: "",
        bannerImage: "",
        sections: []
    });

    useEffect(() => {
        if (slug) loadData();
    }, [slug]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getAboutPageData(slug);
            if (res.success && res.data) {
                setData(res.data);
            } else {
                toast({ title: "Error", description: "Page not found", variant: "destructive" });
                navigate("/about-us");
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load page data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateAboutPageData(slug, data);
            toast({ title: "Success", description: "Page saved successfully" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save page", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        setData(prev => ({
            ...prev,
            sections: [...(prev.sections || []), { type: "content", heading: "", content: "", image: "" }]
        }));
    };

    const removeSection = (index) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
        }));
    };

    const updateSection = (index, field, value) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.map((sec, i) => i === index ? { ...sec, [field]: value } : sec)
        }));
    };

    const addGalleryImage = (sectionIndex) => {
        setData(prev => {
            const newSections = [...prev.sections];
            if (!newSections[sectionIndex].gallery) newSections[sectionIndex].gallery = [];
            newSections[sectionIndex].gallery.push("");
            return { ...prev, sections: newSections };
        });
    };

    const updateGalleryImage = (sectionIndex, imageIndex, url) => {
        setData(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].gallery[imageIndex] = url;
            return { ...prev, sections: newSections };
        });
    };

    const removeGalleryImage = (sectionIndex, imageIndex) => {
        setData(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].gallery = newSections[sectionIndex].gallery.filter((_, i) => i !== imageIndex);
            return { ...prev, sections: newSections };
        });
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/about-us")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-1">
                        Edit Page: <span dangerouslySetInnerHTML={{ __html: data.title || '' }} />
                    </h1>
                    <p className="text-sm text-muted-foreground">/about/{data.pageSlug}</p>
                </div>
                <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Main Header</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Page Title (Display)</Label>
                        <HighlightableInput value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Banner Image</Label>
                        <FileUploader value={data.bannerImage || ""} onChange={(url) => setData({ ...data, bannerImage: url })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description / Intro Text</Label>
                        <Textarea className="min-h-[100px]" value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Content Sections</h2>
                    <Button variant="outline" onClick={addSection}>
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                </div>

                {(!data.sections || data.sections.length === 0) && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                        No sections added. Click "Add Section" to add content blocks.
                    </div>
                )}

                {data.sections && data.sections.map((section, idx) => (
                    <Card key={idx} className="relative group border-l-4" style={{
                        borderLeftColor:
                            section.type === 'timeline' ? '#3b82f6' :
                                section.type === 'stat' ? '#10b981' :
                                    section.type === 'team_member' ? '#f59e0b' :
                                        section.type === 'founder_profile' ? '#8b5cf6' :
                                            section.type === 'brand_logos' ? '#ec4899' :
                                                '#e5e7eb'
                    }}>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSection(idx)}>
                            <Trash className="w-4 h-4" />
                        </Button>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Section {idx + 1}</span>
                                <div className="w-[180px]">
                                    <Select
                                        value={section.type || "content"}
                                        onValueChange={(val) => updateSection(idx, "type", val)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="content">Content block</SelectItem>
                                            <SelectItem value="vision">Vision</SelectItem>
                                            <SelectItem value="mission">Mission</SelectItem>
                                            <SelectItem value="timeline">Timeline Event</SelectItem>
                                            <SelectItem value="stat">Stat / Counter</SelectItem>
                                            <SelectItem value="brand_logos">Brand Logos Grid</SelectItem>
                                            <SelectItem value="founder_profile">Founder Profile</SelectItem>
                                            <SelectItem value="team_member">Team Member</SelectItem>
                                            <SelectItem value="feature">Feature Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        {section.type === 'timeline' ? 'Year / Period (e.g. 1990-2009)' :
                                            section.type === 'stat' ? 'Count (e.g. 500)' :
                                                section.type === 'team_member' ? 'Name' :
                                                    section.type === 'founder_profile' ? 'Name' :
                                                        section.type === 'feature' ? 'Title' :
                                                            section.type === 'brand_logos' ? 'Section Title' :
                                                                'Heading (Use 🎨 to highlight)'}
                                    </Label>
                                    <HighlightableInput
                                        placeholder="Enter heading..."
                                        value={section.heading || ""}
                                        onChange={(e) => updateSection(idx, "heading", e.target.value)}
                                    />
                                </div>
                                {['stat', 'team_member', 'founder_profile'].includes(section.type) && (
                                    <div className="space-y-2">
                                        <Label>
                                            {section.type === 'stat' ? 'Suffix (e.g. + Years)' :
                                                'Job Title / Sub-Heading'}
                                        </Label>
                                        <Input
                                            placeholder="Enter text..."
                                            value={section.subHeading || ""}
                                            onChange={(e) => updateSection(idx, "subHeading", e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    {section.type === 'timeline' ? 'Description' :
                                        section.type === 'stat' ? 'Label Text' :
                                            'Content / Description'}
                                </Label>
                                <RichTextEditor
                                    className="min-h-[150px]"
                                    placeholder="Enter content..."
                                    value={section.content || ""}
                                    onChange={(value) => updateSection(idx, "content", value)}
                                />
                            </div>

                            {/* Standard Image for sections NOT using Gallery */}
                            {!['timeline', 'brand_logos'].includes(section.type) && (
                                <div className="space-y-2">
                                    <Label>Image (Optional)</Label>
                                    <FileUploader value={section.image || ""} onChange={(url) => updateSection(idx, "image", url)} />
                                </div>
                            )}

                            {/* Gallery for Timeline and Brand Logos */}
                            {['timeline', 'brand_logos'].includes(section.type) && (
                                <div className="space-y-2 border p-4 rounded-md bg-gray-50">
                                    <Label className="mb-2 block font-semibold">Gallery Images</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {section.gallery && section.gallery.map((img, imgIdx) => (
                                            <div key={imgIdx} className="relative">
                                                <FileUploader
                                                    value={img}
                                                    onChange={(url) => updateGalleryImage(idx, imgIdx, url)}
                                                    accept={section.type === 'brand_logos' ? "image/png" : "image/*"}
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6"
                                                    onClick={() => removeGalleryImage(idx, imgIdx)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => addGalleryImage(idx)} className="mt-2">
                                        <Plus className="w-3 h-3 mr-2" /> Add Image
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
