import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useParams } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import RichTextEditor from "../../components/RichTextEditor";
import { getFounderMessagePageBySlug, updateFounderMessagePage } from "../../Api/AboutApi";

function FounderMessageEditor() {
    const { slug } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        if (slug) fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const result = await getFounderMessagePageBySlug(slug);
            if (result.success && result.data) {
                setData(result.data);
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
        } catch (error) {
            toast({ title: "Error", description: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Founder Message Page</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Header Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Page Heading</Label>
                        <Input value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Founder Name</Label>
                            <Input value={data.founderName} onChange={(e) => setData({ ...data, founderName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Founder Title</Label>
                            <Input value={data.founderTitle} onChange={(e) => setData({ ...data, founderTitle: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Organization Name</Label>
                        <Input value={data.founderOrg} onChange={(e) => setData({ ...data, founderOrg: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Founder Image</Label>
                        <FileUploader value={data.founderImage || ""} onChange={(url) => setData({ ...data, founderImage: url })} />
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
                            onChange={(newValue) => setData({ ...data, messageContent: newValue })}
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
                            <Input value={data.signatureName} onChange={(e) => setData({ ...data, signatureName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Signature Title</Label>
                            <Input value={data.signatureTitle} onChange={(e) => setData({ ...data, signatureTitle: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Signature Organization</Label>
                        <Input value={data.signatureOrg} onChange={(e) => setData({ ...data, signatureOrg: e.target.value })} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default FounderMessageEditor;
