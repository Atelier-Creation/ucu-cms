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
import { Plus, Pencil, Trash, FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAboutNavigation, createAboutNavigation, updateAboutNavigation, deleteAboutNavigation } from "@/Api/AboutApi";
import { useToast } from "@/components/ui/use-toast";

function AboutSubmenuPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState("");
    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const result = await getAboutNavigation();
            if (result.success) {
                setPages(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async () => {
        if (!pageTitle.trim()) return;
        try {
            await createAboutNavigation({ title: pageTitle });
            toast({ title: "Success", description: "Page created" });
            setIsCreateDialogOpen(false);
            setPageTitle("");
            fetchPages();
        } catch (error) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to create page", variant: "destructive" });
        }
    };

    const openRenameDialog = (page) => {
        setSelectedPage(page);
        setPageTitle(page.title);
        setIsRenameDialogOpen(true);
    };

    const handleRenamePage = async () => {
        if (!selectedPage || !pageTitle.trim()) return;
        try {
            await updateAboutNavigation(selectedPage._id, { title: pageTitle });
            toast({ title: "Success", description: "Page renamed" });
            setIsRenameDialogOpen(false);
            setPageTitle("");
            fetchPages();
        } catch (error) {
            toast({ title: "Error", description: "Failed to rename page", variant: "destructive" });
        }
    };

    const handleDeletePage = async (id) => {
        if (!window.confirm("Are you sure? This will delete the page and all its content.")) return;
        try {
            await deleteAboutNavigation(id);
            toast({ title: "Success", description: "Page deleted" });
            fetchPages();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete page", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">About Us Pages</h1>
                    <p className="text-muted-foreground text-sm">Manage dynamic pages under the About Us section.</p>
                </div>
                <Button onClick={() => { setPageTitle(""); setIsCreateDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Create New Page
                </Button>
            </div>

            <div className="border rounded-md bg-white p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Core Pages</h2>
                {pages.find(p => p.slug === 'main-about-ucu') ? (
                    <div className="flex items-center justify-between p-3 border rounded bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Main About UCU Page</h3>
                                <p className="text-sm text-gray-500">The main landing page for About Us (/about-ucu)</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/about-us/edit/main-about-ucu`)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit Content
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-3 border rounded bg-yellow-50">
                        <div>
                            <h3 className="font-medium text-yellow-800">Main Page Not Initialized</h3>
                            <p className="text-sm text-yellow-600">Create the database entry to enable editing for the main About page.</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={async () => {
                                try {
                                    await createAboutNavigation({ title: "Main About UCU" });
                                    toast({ title: "Success", description: "Main page initialized" });
                                    fetchPages();
                                } catch (e) {
                                    toast({ title: "Error", description: "Failed to initialize", variant: "destructive" });
                                }
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Initialize Main Page
                        </Button>
                    </div>
                )}
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Page Title</TableHead>
                            <TableHead>Slug (URL)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && pages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                    No pages found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {pages.filter(p => p.slug !== 'main-about-ucu').map((page) => (
                            <TableRow key={page._id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    {page.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground">/about/{page.slug}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/about-us/edit/${page.slug}`)}>
                                        <Pencil className="w-3 h-3 mr-1" /> Edit Content
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openRenameDialog(page)}>
                                        Rename
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeletePage(page._id)}>
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
                        <DialogTitle>Create New About Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Page Title</Label>
                            <Input placeholder="e.g. Our History" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreatePage}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Dialog */}
            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New Page Title</Label>
                            <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                            <p className="text-xs text-yellow-600">Warning: Changing the name will also update the URL slug!</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleRenamePage}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AboutSubmenuPage;
