import React, { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { Loader2, Plus, Trash, Save, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import RichTextEditor from "../../components/RichTextEditor";
import { getIndustryApproachPageBySlug, updateIndustryApproachPage } from "../../Api/AboutApi";

// Icon options matching frontend
const ICON_OPTIONS = [
    "Rocket", "Timer", "GraduationCap", "BadgeCheck",
    "Target", "TestTube2", "RefreshCcw", "Users", "Building2"
];

function IndustryApproachEditor() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const featuresRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    // Dirty tracking
    const [isDirty, setIsDirty] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const [data, setData] = useState({
        heroImage: "",
        heroTitle: "",
        contentTitle: "",
        contentDescription: "",
        features: []
    });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleBack = () => {
        if (isDirty) {
            setPendingNavigation("/about-us");
            setShowExitDialog(true);
        } else {
            navigate("/about-us");
        }
    };

    const confirmLeave = () => {
        if (pendingNavigation) navigate(pendingNavigation);
    };

    const confirmSaveAndLeave = async () => {
        await handleSave();
        if (pendingNavigation) navigate(pendingNavigation);
    };

    const updateData = (newData) => {
        setData(newData);
        setIsDirty(true);
    };

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const result = await getIndustryApproachPageBySlug(slug);
            if (result.success && result.data) {
                setData(result.data);
                setIsDirty(false);
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateIndustryApproachPage(slug, data);
            toast({ title: "Success", description: "Page updated successfully" });
            setIsDirty(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (shouldScroll && featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: "smooth" });
            setShouldScroll(false);
        }
    }, [data.features, shouldScroll]);

    const addFeature = () => {
        updateData({
            ...data,
            features: [...data.features, { title: "", description: "", icon: "Rocket" }]
        });
        setShouldScroll(true);
    };

    const updateFeature = (index, field, value) => {
        const updatedFeatures = [...data.features];
        updatedFeatures[index][field] = value;
        updateData({ ...data, features: updatedFeatures });
    };

    const removeFeature = (index) => {
        const updated = data.features.filter((_, i) => i !== index);
        updateData({ ...data, features: updated });
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <UnsavedChangesDialog
                open={showExitDialog}
                onOpenChange={setShowExitDialog}
                onLeave={confirmLeave}
                onSave={confirmSaveAndLeave}
            />
            <div className="flex items-center gap-4 bg-card p-4 rounded-lg shadow-sm border">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Edit Industry Approach Page</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="hover:underline cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
                        <span>/</span>
                        <span className="hover:underline cursor-pointer" onClick={handleBack}>About Us</span>
                        <span>/</span>
                        <span className="font-medium text-foreground">{slug}</span>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Hero Title</Label>
                        <Input value={data.heroTitle} onChange={(e) => updateData({ ...data, heroTitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Hero Banner Image</Label>
                        <FileUploader value={data.heroImage || ""} onChange={(url) => updateData({ ...data, heroImage: url })} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Introduction Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input value={data.contentTitle} onChange={(e) => updateData({ ...data, contentTitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <RichTextEditor value={data.contentDescription} onChange={(val) => updateData({ ...data, contentDescription: val })} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Features / Approach Points</CardTitle>
                    <Button size="sm" onClick={addFeature}><Plus className="w-4 h-4 mr-2" /> Add Feature</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {data.features.map((feature, index) => (
                            <div key={index} className="p-4 border rounded bg-card relative flex gap-4 items-start">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                                    onClick={() => removeFeature(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>

                                <div className="w-1/6 min-w-[120px]">
                                    <Label className="mb-2 block">Icon</Label>
                                    <Select
                                        value={feature.icon}
                                        onValueChange={(val) => updateFeature(index, "icon", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ICON_OPTIONS.map(icon => (
                                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <Label>Title</Label>
                                        <Input value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <RichTextEditor value={feature.description} onChange={(val) => updateFeature(index, "description", val)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={featuresRef} />
                    </div>
                    {data.features.length === 0 && <p className="text-center text-muted-foreground py-4">No features added.</p>}
                </CardContent>
            </Card>
        </div>
    );
}

export default IndustryApproachEditor;
