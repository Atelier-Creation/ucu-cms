import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import RichTextEditor from "../../components/RichTextEditor";
import { getLeadershipPageBySlug, updateLeadershipPage } from "../../Api/AboutApi";

function LeadershipEditor() {
    const { slug } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        founderName: "",
        founderTitle: "",
        founderImage: "",
        founderDescription: "",
        teamTitle: "",
        teamMembers: []
    });

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const result = await getLeadershipPageBySlug(slug);
            if (result.success && result.data) {
                const fetchedData = result.data;
                // Migration: If old data structure exists but new one doesn't
                if (!fetchedData.leadershipTeams || fetchedData.leadershipTeams.length === 0) {
                    if (fetchedData.teamMembers && fetchedData.teamMembers.length > 0) {
                        fetchedData.leadershipTeams = [{
                            title: fetchedData.teamTitle || "Leadership Team",
                            members: fetchedData.teamMembers
                        }];
                    } else {
                        fetchedData.leadershipTeams = [];
                    }
                }
                setData(fetchedData);
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
            await updateLeadershipPage(slug, data);
            toast({ title: "Success", description: "Page updated successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    // --- Team Management Logic ---

    const addTeamSection = () => {
        const newTeam = { title: "New Team", members: [] };
        setData({ ...data, leadershipTeams: [...(data.leadershipTeams || []), newTeam] });
    };

    const removeTeamSection = (index) => {
        if (!window.confirm("Delete this entire team section?")) return;
        const newTeams = [...data.leadershipTeams];
        newTeams.splice(index, 1);
        setData({ ...data, leadershipTeams: newTeams });
    };

    const updateTeamTitle = (index, value) => {
        const newTeams = [...data.leadershipTeams];
        newTeams[index].title = value;
        setData({ ...data, leadershipTeams: newTeams });
    };

    const addMemberToTeam = (teamIndex) => {
        const newTeams = [...data.leadershipTeams];
        newTeams[teamIndex].members.push({ name: "", designation: "", image: "" });
        setData({ ...data, leadershipTeams: newTeams });
    };

    const updateMemberInTeam = (teamIndex, memberIndex, field, value) => {
        const newTeams = [...data.leadershipTeams];
        newTeams[teamIndex].members[memberIndex][field] = value;
        setData({ ...data, leadershipTeams: newTeams });
    };

    const removeMemberFromTeam = (teamIndex, memberIndex) => {
        const newTeams = [...data.leadershipTeams];
        newTeams[teamIndex].members.splice(memberIndex, 1);
        setData({ ...data, leadershipTeams: newTeams });
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Leadership Page</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Founder Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Founder Name</Label>
                            <Input value={data.founderName} onChange={(e) => setData({ ...data, founderName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={data.founderTitle} onChange={(e) => setData({ ...data, founderTitle: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description / Quote</Label>
                        <RichTextEditor value={data.founderDescription} onChange={(val) => setData({ ...data, founderDescription: val })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Founder Image</Label>
                        <FileUploader value={data.founderImage || ""} onChange={(url) => setData({ ...data, founderImage: url })} />
                    </div>
                </CardContent>
            </Card>

            {/* Multiple Teams Support */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Leadership Teams</h2>
                    <Button onClick={addTeamSection} variant="outline"><Plus className="w-4 h-4 mr-2" /> Add New Team Section</Button>
                </div>

                {data.leadershipTeams && data.leadershipTeams.length > 0 ? (
                    data.leadershipTeams.map((team, teamIndex) => (
                        <Card key={teamIndex} className="relative">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-4 right-4 z-10"
                                onClick={() => removeTeamSection(teamIndex)}
                            >
                                <Trash className="w-4 h-4 mr-2" /> Remove Section
                            </Button>
                            <CardHeader>
                                <CardTitle>Team Section {teamIndex + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input
                                        value={team.title}
                                        onChange={(e) => updateTeamTitle(teamIndex, e.target.value)}
                                        placeholder="e.g. Executive Team"
                                    />
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Label>Team Members</Label>
                                    <Button size="sm" variant="secondary" onClick={() => addMemberToTeam(teamIndex)}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Member
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    {team.members.map((member, memberIndex) => (
                                        <Card key={memberIndex} className="p-4 border bg-muted/20 relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                                                onClick={() => removeMemberFromTeam(teamIndex, memberIndex)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-xs">Name</Label>
                                                    <Input
                                                        value={member.name}
                                                        onChange={(e) => updateMemberInTeam(teamIndex, memberIndex, "name", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Designation</Label>
                                                    <Input
                                                        value={member.designation}
                                                        onChange={(e) => updateMemberInTeam(teamIndex, memberIndex, "designation", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Profile Image</Label>
                                                    <FileUploader
                                                        value={member.image || ""}
                                                        onChange={(url) => updateMemberInTeam(teamIndex, memberIndex, "image", url)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                {team.members.length === 0 && <p className="text-center text-muted-foreground py-4">No members in this team.</p>}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">No leadership teams added yet.</p>
                        <Button onClick={addTeamSection}><Plus className="w-4 h-4 mr-2" /> Create First Team</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LeadershipEditor;
