import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Mic, GraduationCap, Pencil, ChevronsRight, User2, Plus, Trash, Link as LinkIcon, ExternalLink } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdvisoryNavigation, createAdvisoryNavigation, updateAdvisoryNavigation, deleteAdvisoryNavigation } from "@/Api/AdvisoryNavigationApi";
import { useToast } from "@/components/ui/use-toast";

const iconMap = { Home, Mic, User2 };

function CouncilSubmenuPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [navData, setNavData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog state for adding Groups/Single Councils
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [newItemType, setNewItemType] = useState("group"); // 'group' or 'link'
    const [newGroupTitle, setNewGroupTitle] = useState("");

    // Dialog state for adding Items (Councils inside Group)
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
            console.log(result)
            if (result.success) {
                setNavData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
            toast({ title: "Error", description: "Failed to load menu", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTopLevel = async () => {
        if (!newGroupTitle.trim()) return;
        try {
            const payload = {
                title: newGroupTitle.trim(),
                icon: "User2",
                type: newItemType,
                sections: newItemType === 'group' ? [{
                    header: "Advisory",
                    items: []
                }] : []
            };

            // If link, we might auto-generate a link slug, or leave it for later edit?
            // For now, let's auto-generate based on title
            if (newItemType === 'link') {
                const slug = newGroupTitle.trim().replace(/\s+/g, '-');
                payload.link = `/advisory/${slug}`;
            }

            await createAdvisoryNavigation(payload);
            toast({ title: "Success", description: newItemType === 'group' ? "Group created" : "Council created" });
            setIsGroupDialogOpen(false);
            setNewGroupTitle("");
            fetchNavigation();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
        }
    };

    const handleDeleteGroup = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this item and all its contents?")) return;
        try {
            await deleteAdvisoryNavigation(id);
            toast({ title: "Success", description: "Deleted successfully" });
            fetchNavigation();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const handleAddItemToGroup = async () => {
        if (!newItemTitle.trim() || !targetGroupId) return;

        const group = navData.find(g => g._id === targetGroupId);
        if (!group) return;

        const slug = newItemTitle.trim().replace(/\s+/g, '-');
        const newItem = {
            label: newItemTitle.trim(),
            link: `/advisory/${slug}`
        };

        const updatedSections = [...(group.sections || [])];
        if (updatedSections.length === 0) {
            updatedSections.push({ header: "Advisory", items: [] });
        }
        updatedSections[0].items.push(newItem);

        try {
            await updateAdvisoryNavigation(targetGroupId, { ...group, sections: updatedSections });
            toast({ title: "Success", description: "Council added to group" });
            setIsItemDialogOpen(false);
            setNewItemTitle("");
            fetchNavigation();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add council", variant: "destructive" });
        }
    };

    const handleDeleteItemFromGroup = async (e, groupId, itemIndex) => {
        e.stopPropagation();
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
                    <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
            </div>

            {!loading && navData.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No Advisory Groups found. Create one to get started.</p>
                </div>
            )}

            <div className="space-y-3">
                {navData.map((page) => {
                    const Icon = iconMap[page.icon] || User2;

                    // IF GROUP
                    if (page.type === 'group' || (!page.type && page.sections?.length > 0)) {
                        return (
                            <Accordion
                                key={page._id}
                                type="single"
                                collapsible
                                className="border border-border shadow-sm rounded-lg bg-white"
                            >
                                <AccordionItem value={`page-${page._id}`} className="border-0">
                                    <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium hover:bg-muted/50 transition cursor-pointer rounded-t-lg group">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <span>{page.title} <span className="text-xs text-muted-foreground font-normal ml-2">(Group)</span></span>
                                        </div>
                                        <Button
                                            size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => handleDeleteGroup(e, page._id)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </AccordionTrigger>

                                    <AccordionContent className="bg-gray-50/50 p-4 space-y-3 border-t">
                                        <div className="flex justify-end mb-2">
                                            <Button size="sm" variant="outline" onClick={() => {
                                                setTargetGroupId(page._id);
                                                setIsItemDialogOpen(true);
                                            }}>
                                                <Plus className="w-3 h-3 mr-1" /> Add Council
                                            </Button>
                                        </div>

                                        {(page.sections || []).map((section, i) => (
                                            <div key={i} className="pl-4 border-l-2 border-primary/20 space-y-2">
                                                {section.items.map((sub, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center justify-between group bg-white p-3 rounded-md border shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <div
                                                            className="flex items-center gap-2 cursor-pointer"
                                                            onClick={() => navigate(sub.link)}
                                                        >
                                                            <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                                                            <span className="text-sm font-medium">{sub.label}</span>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => navigate(sub.link)}>
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => handleDeleteItemFromGroup(e, page._id, j)}>
                                                                <Trash className="w-4 h-4" />
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
                            </Accordion>
                        );
                    }
                    // IF SINGLE ITEM
                    else {
                        return (
                            <div key={page._id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{page.title}</h3>
                                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">{page.link || "No link assigned"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(page.link)}>
                                        <ExternalLink className="w-4 h-4 mr-2" /> Open Page
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 opacity-60 group-hover:opacity-100"
                                        onClick={(e) => handleDeleteGroup(e, page._id)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            {/* Create Group/Item Dialog */}
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Advisory Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Entry Type</Label>
                            <Select value={newItemType} onValueChange={setNewItemType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="group">Group (Contains multiple Councils)</SelectItem>
                                    <SelectItem value="link">Single Council (Direct Link)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder={newItemType === 'group' ? "e.g. Technology Advisory" : "e.g. Business Advisory Council"}
                                value={newGroupTitle}
                                onChange={(e) => setNewGroupTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCreateTopLevel}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Item Inside Group Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Council to Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Council Name</Label>
                            <Input
                                placeholder="e.g. AI Ethics Council"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">This will generate a page at /advisory/Council-Name</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddItemToGroup}>Add Council</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CouncilSubmenuPage;