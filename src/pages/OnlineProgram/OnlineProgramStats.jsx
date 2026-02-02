
import React, { useEffect, useState } from "react";
import { icons as Icons } from "lucide-react";
import {
    Plus,
    Trash2,
    Pencil,
    BarChart3,
    ImageIcon,
    List,
    PanelsTopLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { createOnlineStats, getAllOnlineStats, updateOnlineStat,deleteOnlineStat } from "@/Api/OnlineProgramApi/OnlineProgramStatsApi";
import toast from "react-hot-toast";
import IconSearchPicker from "./IconSearchPicker";

/* ---------------- CONSTANTS ---------------- */
const emptyForm = {
    media: { type: "icon", value: "" },
    count: "",
    label: "",
};

/* ---------------- COMPONENT ---------------- */
const OnlineProgramStats = () => {
    /* ✅ DEFAULT LIST WITH 2 EXAMPLES */
    const [stats, setStats] = useState([]);

    const [forms, setForms] = useState([emptyForm]);

    /* ---------- EDIT STATE ---------- */
    const [editOpen, setEditOpen] = useState(false);
    const [editingStat, setEditingStat] = useState(null);

    /* ---------- GET ONLINE STATS DATA ---------- */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllOnlineStats()
                console.log(response.data || response)
                setStats(response.data || response)
            } catch (error) {
                toast({ title: "Error", description: "Failed to fetch data" })
            }
        }
        fetchData()
    }, [])
    /* ---------- HELPERS ---------- */
    const updateForm = (index, key, value) => {
        const updated = [...forms];
        updated[index] = { ...updated[index], [key]: value };
        setForms(updated);
    };

    const updateMedia = (index, media) => {
        const updated = [...forms];
        updated[index].media = media;
        setForms(updated);
    };

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () =>
            updateMedia(index, { type: "file", value: reader.result });
        reader.readAsDataURL(file);
    };

    /* ---------- VALIDATION ---------- */
    const isFormComplete = (form) => {
        if (!form.count || !form.label) return false;
        if (!form.media?.type) return false;
        if (form.media.type !== "icon" && !form.media.value) return false;
        if (form.media.type === "icon" && !form.media.value) return false;
        return true;
    };

    /* ---------- ADD NEXT STAT (CONTROLLED) ---------- */
    const handleAddForm = () => {
        const lastForm = forms[forms.length - 1];
        if (!isFormComplete(lastForm)) return;
        setForms((prev) => [...prev, emptyForm]);
    };

    /* ---------- SAVE ALL ---------- */
    const handleSaveAll = async () => {
        const validStats = forms.filter(isFormComplete);

        if (!validStats.length) {
            toast({ title: "Incomplete", description: "Fill all required fields" });
            return;
        }
        try {
            const savedStats = []
            for (let stat of validStats) {
                const payload = {
                    count: stat.count,
                    content: stat.label,
                    iconImage: stat.media.type === "icon" ? [stat.media.value] :
                        stat.media.type === "url" ? [stat.media.value] :
                            stat.media.type === "file" ? [stat.media.value] :
                                [],
                }
                const res = await createOnlineStats(payload)
                savedStats.push(res.data || res)
            }
            setStats((prev) => [...prev, ...savedStats]);
            // Reset forms
            setForms([emptyForm]);

            toast({ title: "Success", description: "Stats saved successfully!" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save stats" });
        }
    };

    /* ---------- EDIT / DELETE ---------- */
    const handleEdit = (stat) => {
        let media = { type: "icon", value: "" };

        if (Array.isArray(stat.iconImage) && stat.iconImage.length > 0) {
            const val = stat.iconImage[0];
            if (Icons[val]) {
                media = { type: "icon", value: val };
            } else if (val.startsWith("data:")) {
                media = { type: "file", value: val };
            } else {
                media = { type: "url", value: val };
            }
        }

        setEditingStat({
            ...stat,
            media,
            content: stat.content || stat.label, // normalize label
        });
        setEditOpen(true);
    };


const handleUpdateStat = async () => {
  if (!editingStat) return;

  try {
    const payload = {
      count: editingStat.count,
      content: editingStat.content,
      iconImage:
        editingStat.media.type === "icon"
          ? [editingStat.media.value]
          : editingStat.media.type === "url"
          ? [editingStat.media.value]
          : editingStat.media.type === "file"
          ? [editingStat.media.value]
          : [],
    };

    // Call API to update
    await updateOnlineStat(editingStat._id, payload);

    // Update local state correctly
    setStats((prev) =>
      prev.map((s) =>
        s._id === editingStat._id
          ? { ...s, ...payload } // merge payload, keep other properties intact
          : s
      )
    );

    toast.success("Stat updated successfully!");
    setEditOpen(false);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update stat");
  }
};



const handleDelete = async (id) => {
    try {
        await deleteOnlineStat(id);
        setStats((prev) => prev.filter((s) => s._id !== id));
        toast({ title: "Deleted", description: "Stat deleted successfully" });
    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to delete stat" });
    }
};

    /* ---------- MEDIA RENDER ---------- */
    const renderMedia = (media) => {
        // If it's an array (from backend)
        if (Array.isArray(media) && media.length > 0) {
            const first = media[0];

            // Try to find it in lucide-react icons
            const Icon = Icons[first];
            if (Icon) {
                return <Icon className="w-6 h-6" />;
            }

            // If it's not an icon, assume it's an image URL
            return <img src={first} alt="icon" className="w-6 h-6" />;
        }

        // If it's an object (from form)
        if (media?.type === "icon") {
            const Icon = Icons[media.value];
            return Icon ? <Icon className="w-6 h-6" /> : <ImageIcon />;
        }

        if (media?.value) {
            return <img src={media.value} className="w-6 h-6" />;
        }

        return <ImageIcon />;
    };


    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/pages/home">
                            <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
                            Pages
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/pages/home">Home Page</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Online Program Stats</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/* HEADER */}
            <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">Online Program Stats</h1>
            </div>

            {/* MULTI ADD SECTION */}
            {forms.map((form, index) => (
                <div
                    key={index}
                    className="p-4 rounded-lg border bg-white space-y-4"
                >
                    <div className="flex gap-3 text-sm">
                        {["icon", "url", "file"].map((type) => (
                            <label key={type} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    checked={form.media.type === type}
                                    onChange={() =>
                                        updateMedia(index, { type, value: "" })
                                    }
                                />
                                {type}
                            </label>
                        ))}
                    </div>

                    {form.media.type === "icon" && (
                        <IconSearchPicker
                            value={form.media.value}
                            onSelect={(val) =>
                                updateMedia(index, { type: "icon", value: val })
                            }
                        />
                    )}

                    {form.media.type === "url" && (
                        <Input
                            placeholder="Image URL"
                            value={form.media.value}
                            onChange={(e) =>
                                updateMedia(index, {
                                    type: "url",
                                    value: e.target.value,
                                })
                            }
                        />
                    )}

                    {form.media.type === "file" && (
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, index)}
                        />
                    )}

                    <div className="flex gap-4">
                        <Input
                            placeholder="Count"
                            value={form.count}
                            onChange={(e) =>
                                updateForm(index, "count", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Description"
                            value={form.label}
                            onChange={(e) =>
                                updateForm(index, "label", e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleAddForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stats
                </Button>
                <Button onClick={handleSaveAll}>Save</Button>
            </div>

            {/* ---------------- LIST ---------------- */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                        Online Program Stats List
                    </h2>
                </div>

                {/* ✅ LIST HEADER (RESTORED) */}
                <div className="flex items-center justify-between px-4 py-2 rounded-md border bg-muted/60 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-10">
                        <div className="w-8 text-center">Icon</div>
                        <div className="min-w-[80px]">Count</div>
                        <div>Description</div>
                    </div>
                    <div className="w-16 text-right">Action</div>
                </div>

                {/* LIST ROWS */}
                {stats.map((stat) => (
                    <div
                        key={stat._id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted group"
                    >
                        <div className="flex items-center gap-10">
                            <div className="w-8 flex justify-center">
                                {renderMedia(stat.iconImage)}
                            </div>

                            <div className="min-w-[80px] font-bold text-primary">
                                {stat.count}
                            </div>

                            <p className="text-sm text-muted-foreground max-w-lg">
                                {stat.content}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(stat)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(stat._id)}
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


            {/* EDIT MODAL */}
            {/* EDIT MODAL */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Stat</DialogTitle>
                    </DialogHeader>

                    {editingStat && (
                        <div className="space-y-4">
                            {/* Media Type Selection */}
                            <div className="flex gap-3 text-sm">
                                {["icon", "url", "file"].map((type) => (
                                    <label key={type} className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            checked={editingStat.media?.type === type}
                                            onChange={() =>
                                                setEditingStat({
                                                    ...editingStat,
                                                    media: { type, value: editingStat.media.value || "" }, // keep previous value if switching
                                                })
                                            }
                                        />
                                        {type}
                                    </label>
                                ))}

                            </div>

                            {/* Media Input */}
                            {editingStat.media?.type === "icon" && (
                                <IconSearchPicker
                                    value={editingStat.media.value}
                                    columns={3}
                                    onSelect={(val) =>
                                        setEditingStat({
                                            ...editingStat,
                                            media: { type: "icon", value: val },
                                        })
                                    }
                                />
                            )}

                            {editingStat.media?.type === "url" && (
                                <Input
                                    placeholder="Image URL"
                                    value={editingStat.media.value}
                                    onChange={(e) =>
                                        setEditingStat({
                                            ...editingStat,
                                            media: { type: "url", value: e.target.value },
                                        })
                                    }
                                />
                            )}

                            {editingStat.media?.type === "file" && (
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () =>
                                            setEditingStat({
                                                ...editingStat,
                                                media: { type: "file", value: reader.result },
                                            });
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            )}

                            {/* Count & Description */}
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Count"
                                    value={editingStat.count}
                                    onChange={(e) =>
                                        setEditingStat({ ...editingStat, count: e.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Description"
                                    value={editingStat.content || editingStat.label}
                                    onChange={(e) =>
                                        setEditingStat({ ...editingStat, content: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStat}>Update</Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default OnlineProgramStats;
