import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash, FileText, Users, Building2, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    getAboutNavigation, createAboutNavigation, updateAboutNavigation, deleteAboutNavigation,
    getLeadershipPages, createLeadershipPage, deleteLeadershipPage,
    getIndustryApproachPages, createIndustryApproachPage, deleteIndustryApproachPage,
    getFounderMessagePages, createFounderMessagePage, deleteFounderMessagePage
} from "@/Api/AboutApi";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

function AboutSubmenuPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    // Data collections
    const [genericPages, setGenericPages] = useState([]);
    const [leadershipPages, setLeadershipPages] = useState([]);
    const [industryPages, setIndustryPages] = useState([]);
    const [founderPages, setFounderPages] = useState([]);

    // Dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState("");
    const [pageType, setPageType] = useState("generic"); // generic, leadership, industry, founder

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [gen, lead, ind, fnd] = await Promise.all([
                getAboutNavigation(),
                getLeadershipPages(),
                getIndustryApproachPages(),
                getFounderMessagePages()
            ]);

            if (gen.success) setGenericPages(gen.data);
            if (lead.success) setLeadershipPages(lead.data);
            if (ind.success) setIndustryPages(ind.data);
            if (fnd.success) setFounderPages(fnd.data);
        } catch (error) {
            console.error("Failed to fetch pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async () => {
        if (!pageTitle.trim()) return;
        try {
            const payload = { title: pageTitle };
            let result;

            if (pageType === "generic") {
                result = await createAboutNavigation(payload);
            } else if (pageType === "leadership") {
                result = await createLeadershipPage(payload);
            } else if (pageType === "industry") {
                result = await createIndustryApproachPage(payload);
            } else if (pageType === "founder") {
                result = await createFounderMessagePage(payload);
            }

            toast({ title: "Success", description: `${pageType} page created` });
            setIsCreateDialogOpen(false);
            setPageTitle("");
            fetchAll();
        } catch (error) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to create page", variant: "destructive" });
        }
    };

    const handleDelete = async (id, type, slug) => {
        if (!window.confirm("Are you sure? This will delete the page.")) return;
        try {
            if (type === "generic") await deleteAboutNavigation(id);
            else if (type === "leadership") await deleteLeadershipPage(id);
            else if (type === "industry") await deleteIndustryApproachPage(id);
            else if (type === "founder") await deleteFounderMessagePage(id);

            toast({ title: "Success", description: "Page deleted" });
            fetchAll();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete page", variant: "destructive" });
        }
    };

    // Combine all pages for table display
    const allPages = [
        ...genericPages.map(p => ({ ...p, type: 'generic', editUrl: `/about-us/edit/${p.slug}` })),
        ...leadershipPages.map(p => ({ ...p, type: 'leadership', editUrl: `/about-us/leadership/${p.slug}` })),
        ...industryPages.map(p => ({ ...p, type: 'industry', editUrl: `/about-us/industry-approach/${p.slug}` })),
        ...founderPages.map(p => ({ ...p, type: 'founder', editUrl: `/about-us/founder-message/${p.slug}` }))
    ];

    const getTypeBadge = (type) => {
        switch (type) {
            case 'generic': return <Badge variant="outline">Generic</Badge>;
            case 'leadership': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Leadership</Badge>;
            case 'industry': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Industry</Badge>;
            case 'founder': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Founder</Badge>;
            default: return <Badge>Unknown</Badge>;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'generic': return <FileText className="w-4 h-4 text-gray-500" />;
            case 'leadership': return <Users className="w-4 h-4 text-purple-500" />;
            case 'industry': return <Building2 className="w-4 h-4 text-green-500" />;
            case 'founder': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">About Us / Specialized Pages</h1>
                    <p className="text-muted-foreground text-sm">Manage all pages including Leadership, Founder Message, etc.</p>
                </div>
                <Button onClick={() => { setPageTitle(""); setPageType("generic"); setIsCreateDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Create New Page
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Page Title</TableHead>
                            <TableHead>Slug (URL)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && allPages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    No pages found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {allPages.map((page) => (
                            <TableRow key={`${page.type}-${page._id}`}>
                                <TableCell>{getTypeBadge(page.type)}</TableCell>
                                <TableCell className="font-medium flex items-center gap-2">
                                    {getTypeIcon(page.type)}
                                    {page.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground">.../{page.slug}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(page.editUrl)}>
                                        <Pencil className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(page._id, page.type, page.slug)}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Page Type</Label>
                            <Select value={pageType} onValueChange={setPageType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="generic">Generic Page (Standard CMS)</SelectItem>
                                    <SelectItem value="leadership">Leadership Page</SelectItem>
                                    <SelectItem value="industry">Industry Approach Page</SelectItem>
                                    <SelectItem value="founder">Founder Message Page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Page Title</Label>
                            <Input placeholder="e.g. Board of Directors" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreatePage}>Create Page</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AboutSubmenuPage;
