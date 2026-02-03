import React, { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash, FileText, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

function OnlineProgram() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    // Local static data
    const localGenericPages = [
        { _id: "g1", title: "Online Program Hero", slug: "banner" },
        { _id: "g2", title: "Online Program Stats", slug: "stats" },
        { _id: "g3", title: "How to apply", slug: "apply" },
    ];

    const [genericPages, setGenericPages] = useState([]);

    // Dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        setLoading(true);
        setGenericPages(localGenericPages);
        setLoading(false);
    }, []);

    const handleCreatePage = () => {
        if (!pageTitle.trim()) return;

        const newPage = {
            _id: `g-${Date.now()}`,
            title: pageTitle,
            slug: pageTitle.toLowerCase().replace(/\s+/g, "-"),
        };

        setGenericPages(prev => [...prev, newPage]);
        toast({ title: "Success", description: "Page created" });
        setIsCreateDialogOpen(false);
        setPageTitle("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-card p-4 rounded-lg shadow-sm border">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">Online Program</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="hover:underline cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
                        <span>/</span>
                        <span className="font-medium text-foreground">Online Program</span>
                    </div>
                </div>
            </div>

            <div className="border rounded-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Page Title</TableHead>
                            <TableHead>Slug (URL)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && genericPages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                    No pages found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {genericPages.map((page) => (
                            <TableRow key={page._id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    {page.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground">.../{page.slug}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/online-program/${page.slug}`)}>
                                        <Pencil className="w-3 h-3 mr-1" /> Edit
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

export default OnlineProgram;
