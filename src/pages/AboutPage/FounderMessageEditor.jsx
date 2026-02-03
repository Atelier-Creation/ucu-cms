import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import RichTextEditor from "../../components/RichTextEditor";
import { getFounderMessagePageBySlug, updateFounderMessagePage } from "../../Api/AboutApi";

import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";

function FounderMessageEditor() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Unsaved Changes Logic
    const [isDirty, setIsDirty] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);

    // Mock pendingNavigation to always go back to parent for now
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const [data, setData] = useState({
        heading: "",
        founderName: "",
        founderTitle: "",
        founderOrg: "",
        founderImage: "",
        messageContent: "",
        signatureName: "",
        signatureTitle: "",
        signatureOrg: ""
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
            const result = await getFounderMessagePageBySlug(slug);
            if (result.success && result.data) {
                setData(result.data);
                // Reset dirty after load
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
            await updateFounderMessagePage(slug, data);
            toast({ title: "Success", description: "Page updated successfully" });
            setIsDirty(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
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
                    <h1 className="text-2xl font-bold">Edit Founder Message Page</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="hover:underline cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
                        <span>/</span>
                        <span className="hover:underline cursor-pointer" onClick={handleBack}>About Us</span>
                        <span>/</span>
                        <span className="font-medium text-foreground">Founder Message</span>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Header Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Page Heading</Label>
                        <Input value={data.heading} onChange={(e) => updateData({ ...data, heading: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Founder Name</Label>
                            <Input value={data.founderName} onChange={(e) => updateData({ ...data, founderName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Founder Title</Label>
                            <Input value={data.founderTitle} onChange={(e) => updateData({ ...data, founderTitle: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Organization Name</Label>
                        <Input value={data.founderOrg} onChange={(e) => updateData({ ...data, founderOrg: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Founder Image</Label>
                        <FileUploader value={data.founderImage || ""} onChange={(url) => updateData({ ...data, founderImage: url })} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Message Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Message Body</Label>
                        <RichTextEditor
                            value={data.messageContent}
                            onChange={(newValue) => updateData({ ...data, messageContent: newValue })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Signature Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Signature Name</Label>
                            <Input value={data.signatureName} onChange={(e) => updateData({ ...data, signatureName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Signature Title</Label>
                            <Input value={data.signatureTitle} onChange={(e) => updateData({ ...data, signatureTitle: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Signature Organization</Label>
                        <Input value={data.signatureOrg} onChange={(e) => updateData({ ...data, signatureOrg: e.target.value })} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default FounderMessageEditor;
