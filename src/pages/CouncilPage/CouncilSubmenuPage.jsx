import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Mic, GraduationCap, Pencil, ChevronsRight, User2, Plus, Trash, Check } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdvisoryNavigation, createAdvisoryNavigation, updateAdvisoryNavigation, deleteAdvisoryNavigation } from "@/Api/AdvisoryNavigationApi";
import { useToast } from "@/components/ui/use-toast";

const iconMap = { Home, Mic, User2 };

function CouncilSubmenuPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [navData, setNavData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog state for adding Groups
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [newGroupTitle, setNewGroupTitle] = useState("");

    // Dialog state for adding Items (Councils)
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState(null);
    const [newItemTitle, setNewItemTitle] = useState("");

    useEffect(() => {
        fetchNavigation();
    }, []);

    const fetchNavigation = async () => {
        setLoading(true);
        try {
            const result = await getAdvisoryNavigation();
            if (result.success) {
                // If empty, fallback to default or allow empty
                setNavData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
            toast({ title: "Error", description: "Failed to load menu", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupTitle.trim()) return;
        try {
            const payload = {
                title: newGroupTitle.trim(),
                icon: "User2",
                sections: [{
                    header: "Advisory", // Default header
                    items: []
                }]
            };
            await createAdvisoryNavigation(payload);
            toast({ title: "Success", description: "Group created" });
            setIsGroupDialogOpen(false);
            setNewGroupTitle("");
            fetchNavigation();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create group", variant: "destructive" });
        }
    };

    const handleDeleteGroup = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this group and all its councils?")) return;
        try {
            await deleteAdvisoryNavigation(id);
            toast({ title: "Success", description: "Group deleted" });
            fetchNavigation();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete group", variant: "destructive" });
        }
    };

    const handleAddItem = async () => {
        if (!newItemTitle.trim() || !targetGroupId) return;

        const group = navData.find(g => g._id === targetGroupId);
        if (!group) return;

        const slug = newItemTitle.trim().replace(/\s+/g, '-');
        const newItem = {
            label: newItemTitle.trim(),
            link: `/advisory/${slug}`
        };

        // Deep copy struct
        const updatedSections = [...group.sections];
        if (updatedSections.length === 0) {
            updatedSections.push({ header: "Advisory", items: [] });
        }
        updatedSections[0].items.push(newItem);

        try {
            await updateAdvisoryNavigation(targetGroupId, { ...group, sections: updatedSections });
            toast({ title: "Success", description: "Council added" });
            setIsItemDialogOpen(false);
            setNewItemTitle("");
            fetchNavigation();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add council", variant: "destructive" });
        }
    };

    const handleDeleteItem = async (e, groupId, itemIndex) => {
        e.stopPropagation();
        // Since sections[0] is default...
        if (!window.confirm("Delete this council link?")) return;

        const group = navData.find(g => g._id === groupId);
        if (!group) return;

        const updatedSections = [...group.sections];
        if (updatedSections.length > 0) {
            updatedSections[0].items.splice(itemIndex, 1);
        }

        try {
            await updateAdvisoryNavigation(groupId, { ...group, sections: updatedSections });
            toast({ title: "Success", description: "Council deleted" });
            fetchNavigation();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete council", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Advisory Councils
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage Advisory Councils and Groups</p>
                </div>
                <Button onClick={() => setIsGroupDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Advisory Group
                </Button>
            </div>

            {/* Helper if empty */}
            {!loading && navData.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No Advisory Groups found. Create one to get started.</p>
                </div>
            )}

            {/* Accordion List */}
            <Accordion
                type="single"
                collapsible
                className="space-y-3"
            >
                {navData.map((page, pageIndex) => {
                    const Icon = iconMap[page.icon] || User2;
                    return (
                        <AccordionItem
                            key={page._id}
                            value={`page-${page._id}`}
                            className="border border-border shadow-sm rounded-lg bg-muted/30"
                        >
                            <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium bg-muted/50 hover:bg-muted transition cursor-pointer rounded-t-lg group">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <span>{page.title}</span>
                                </div>
                                {/* Stop propagation to prevent accordion toggle when clicking delete */}
                                <Button
                                    size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-red-500"
                                    onClick={(e) => handleDeleteGroup(e, page._id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </AccordionTrigger>

                            <AccordionContent className="bg-gray-50 p-4 space-y-3 dark:bg-black">
                                <div className="flex justify-end mb-2">
                                    <Button size="sm" variant="outline" onClick={() => {
                                        setTargetGroupId(page._id);
                                        setIsItemDialogOpen(true);
                                    }}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Council
                                    </Button>
                                </div>

                                {page.sections.map((section, i) => (
                                    <div key={i} className="pl-4 border-l space-y-2">
                                        {/* <h4 className="text-xs font-semibold text-muted-foreground uppercase">{section.header}</h4> */}
                                        {section.items.map((sub, j) => (
                                            <div
                                                key={j}
                                                className="flex items-center justify-between group bg-white p-2 rounded border"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-fit text-sm font-normal text-left cursor-pointer"
                                                    onClick={() => navigate(sub.link)}
                                                >
                                                    {sub.label}
                                                </Button>
                                                <div className="flex gap-1 opacity-60 group-hover:opacity-100">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(sub.link)}>
                                                        <Pencil className="w-4 h-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={(e) => handleDeleteItem(e, page._id, j)}>
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {section.items.length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">No councils here yet.</p>
                                        )}
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            {/* Create Group Dialog */}
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Advisory Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Group Title</Label>
                            <Input
                                placeholder="e.g. Technology Advisory Council"
                                value={newGroupTitle}
                                onChange={(e) => setNewGroupTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateGroup}>Create Group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Council Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Council Name</Label>
                            <Input
                                placeholder="e.g. AI Ethics Council"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">This will generate a page at /advisory/AI-Ethics-Council</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddItem}>Add Council</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CouncilSubmenuPage;