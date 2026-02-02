"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import IconSearchPicker from "./IconSearchPicker";
import { Label } from "@/components/ui/label";
import { icons as Icons, ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
const createEmptyStep = () => ({
    media: { type: "icon", value: "" },
    title: "",
    descType: "text",
    descText: "",
    descList: [""],
});

const OnlineProgramApply = () => {
    const { toast } = useToast();

    const [steps, setSteps] = useState([createEmptyStep()]);
    const [currentStep, setCurrentStep] = useState(0);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState(null);
    const updateMedia = (stepIndex, media) => {
        const updated = steps.map((s, i) => (i === stepIndex ? { ...s, media } : s));
        setSteps(updated);
    };
    const saveEdit = () => {
        const updated = [...steps];
        updated[editIndex] = editData;
        setSteps(updated);
        setEditIndex(null);
        toast({ title: "Updated", description: "Step updated successfully" });
    };
    const handleFileUpload = (e, stepIndex) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            updateMedia(stepIndex, { type: "file", value: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const addPoint = (stepIndex) => {
        const updated = steps.map((s, i) =>
            i === stepIndex ? { ...s, descList: [...s.descList, ""] } : s
        );
        setSteps(updated);
    };

    const updatePoint = (stepIndex, pointIndex, value) => {
        const updated = steps.map((s, i) =>
            i === stepIndex
                ? { ...s, descList: s.descList.map((p, j) => (j === pointIndex ? value : p)) }
                : s
        );
        setSteps(updated);
    };

    const removePoint = (stepIndex, pointIndex) => {
        const updated = steps.map((s, i) =>
            i === stepIndex ? { ...s, descList: s.descList.filter((_, j) => j !== pointIndex) } : s
        );
        setSteps(updated);
    };

    const handleSave = () => {
        toast({ title: "Saved", description: `Step ${currentStep + 1} saved.` });
    };

    const handleNextStep = () => {
        const stepData = steps[currentStep];

        // Validation
        if (!stepData.title) {
            toast({ title: "Error", description: "Title is required" });
            return;
        }
        if (
            (stepData.descType === "text" && !stepData.descText) ||
            (stepData.descType === "list" && stepData.descList.every((p) => p.trim() === ""))
        ) {
            toast({ title: "Error", description: "Description is required" });
            return;
        }

        const nextStepIndex = currentStep + 1;
        const updatedSteps = [...steps];

        if (nextStepIndex === steps.length) {
            updatedSteps.push(createEmptyStep());
        } else {
            updatedSteps[nextStepIndex] = createEmptyStep();
        }

        setSteps(updatedSteps);
        setCurrentStep(nextStepIndex);
    };
    const openEditModal = (index) => {
        setEditIndex(index);
        setEditData(JSON.parse(JSON.stringify(steps[index])));
    };
    const handleBackStep = () => {
        if (currentStep === 0) return;
        setCurrentStep(currentStep - 1);
    };

    const current = steps[currentStep];
    const renderStepMedia = (media) => {
        if (!media) return <ImageIcon className="w-6 h-6" />;

        // ICON
        if (media.type === "icon" && media.value) {
            const IconComponent = Icons[media.value];
            return IconComponent ? (
                <IconComponent className="w-6 h-6 text-primary" />
            ) : (
                <ImageIcon className="w-6 h-6" />
            );
        }

        // IMAGE (URL or FILE)
        if ((media.type === "url" || media.type === "file") && media.value) {
            return (
                <img
                    src={media.value}
                    alt="step media"
                    className="w-full h-full object-contain"
                />
            );
        }

        return <ImageIcon className="w-6 h-6" />;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-primary" />
                    How To Apply
                </h1>
                <div>
                    Step {currentStep + 1} of {steps.length}
                </div>
            </div>

            <Separator />

            <Card key={currentStep} className="rounded-xl">
                <CardHeader>
                    <CardTitle>Step {currentStep + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Media Picker */}
                    <Label>Add Icon / Image</Label>
                    <div className="space-y-2">
                        <div className="flex gap-4 text-sm">
                            {["icon", "url", "file"].map((type) => (
                                <label key={type} className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        checked={current.media.type === type}
                                        onChange={() => updateMedia(currentStep, { type, value: "" })}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>

                        {current.media.type === "icon" && (
                            <IconSearchPicker
                                value={current.media.value}
                                onSelect={(val) => updateMedia(currentStep, { type: "icon", value: val })}
                            />
                        )}

                        {current.media.type === "url" && (
                            <Input
                                placeholder="Image URL"
                                value={current.media.value}
                                onChange={(e) => updateMedia(currentStep, { type: "url", value: e.target.value })}
                            />
                        )}

                        {current.media.type === "file" && (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, currentStep)}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <Label>Title</Label>
                    <Input
                        placeholder="Title"
                        value={current.title}
                        onChange={(e) => {
                            const updated = steps.map((s, i) =>
                                i === currentStep ? { ...s, title: e.target.value } : s
                            );
                            setSteps(updated);
                        }}
                    />

                    {/* Description */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center mt-3">
                            <Label>Description</Label>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant={current.descType === "text" ? "default" : "outline"}
                                    onClick={() => {
                                        const updated = steps.map((s, i) =>
                                            i === currentStep ? { ...s, descType: "text", descList: [""] } : s
                                        );
                                        setSteps(updated);
                                    }}
                                >
                                    Text
                                </Button>
                                <Button
                                    type="button"
                                    variant={current.descType === "list" ? "default" : "outline"}
                                    onClick={() => {
                                        const updated = steps.map((s, i) =>
                                            i === currentStep ? { ...s, descType: "list", descList: [""] } : s
                                        );
                                        setSteps(updated);
                                    }}
                                >
                                    List
                                </Button>
                            </div>
                        </div>

                        {current.descType === "text" && (
                            <Textarea
                                placeholder="Description"
                                value={current.descText}
                                onChange={(e) => {
                                    const updated = steps.map((s, i) =>
                                        i === currentStep ? { ...s, descText: e.target.value } : s
                                    );
                                    setSteps(updated);
                                }}
                            />
                        )}

                        {current.descType === "list" && (
                            <div className="space-y-2">
                                {current.descList.map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder={`Point ${index + 1}`}
                                            value={point}
                                            onChange={(e) => updatePoint(currentStep, index, e.target.value)}
                                        />
                                        {current.descList.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => removePoint(currentStep, index)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addPoint(currentStep)}>
                                    + Add Point
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={handleBackStep} className="bg-gray-100 text-black border">
                            Back
                        </Button>
                        <div className="flex gap-2">
                            <Button onClick={handleSave} className="bg-blue-500 text-white">
                                Save
                            </Button>
                            <Button onClick={handleNextStep} className="bg-green-500 text-white">
                                Next Step
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Updated Steps List using Card & Button */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Sequence of Steps</h2>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        {steps.length} Total Steps
                    </span>
                </div>

                {/* ---------------- STEPS LIST ---------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {steps.map((step, index) => (
                        <Card key={index} className="rounded-xl border hover:shadow-md">
                            <CardContent className="flex justify-between items-start pt-6">
                                <div className="flex gap-4 justify-between items-start">
                                    <div className="flex flex-col gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                            {renderStepMedia(step.media)}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {step.title || `Untitled Step ${index + 1}`}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {step.descType === "text"
                                                    ? step.descText || "No description"
                                                    : step.descList
                                                        .filter(Boolean)
                                                        .join(", ") || "No list items"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(index)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteStep(index)}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ---------------- EDIT MODAL ---------------- */}
                <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Edit Step</DialogTitle>
                        </DialogHeader>

                        {editData && (
                            <div className="space-y-5">

                                {/* -------- MEDIA PICKER -------- */}
                                <div className="space-y-2">
                                    <Label>Add Icon / Image</Label>

                                    <div className="flex gap-4 text-sm">
                                        {["icon", "url", "file"].map((type) => (
                                            <label key={type} className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    checked={editData.media.type === type}
                                                    onChange={() =>
                                                        setEditData({
                                                            ...editData,
                                                            media: { type, value: "" },
                                                        })
                                                    }
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>

                                    {editData.media.type === "icon" && (
                                        <IconSearchPicker
                                            value={editData.media.value}
                                            onSelect={(val) =>
                                                setEditData({
                                                    ...editData,
                                                    media: { type: "icon", value: val },
                                                })
                                            }
                                        />
                                    )}

                                    {editData.media.type === "url" && (
                                        <Input
                                            placeholder="Image URL"
                                            value={editData.media.value}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    media: { type: "url", value: e.target.value },
                                                })
                                            }
                                        />
                                    )}

                                    {editData.media.type === "file" && (
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = () =>
                                                    setEditData({
                                                        ...editData,
                                                        media: { type: "file", value: reader.result },
                                                    });
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                    )}
                                </div>

                                {/* -------- TITLE -------- */}
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={editData.title}
                                        onChange={(e) =>
                                            setEditData({ ...editData, title: e.target.value })
                                        }
                                    />
                                </div>

                                {/* -------- DESCRIPTION TYPE -------- */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label>Description</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={editData.descType === "text" ? "default" : "outline"}
                                                onClick={() =>
                                                    setEditData({
                                                        ...editData,
                                                        descType: "text",
                                                        descText: editData.descText || "",
                                                    })
                                                }
                                            >
                                                Text
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={editData.descType === "list" ? "default" : "outline"}
                                                onClick={() =>
                                                    setEditData({
                                                        ...editData,
                                                        descType: "list",
                                                        descList: editData.descList.length
                                                            ? editData.descList
                                                            : [""],
                                                    })
                                                }
                                            >
                                                List
                                            </Button>
                                        </div>
                                    </div>

                                    {/* -------- TEXT -------- */}
                                    {editData.descType === "text" && (
                                        <Textarea
                                            value={editData.descText}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    descText: e.target.value,
                                                })
                                            }
                                        />
                                    )}

                                    {/* -------- LIST -------- */}
                                    {editData.descType === "list" && (
                                        <div className="space-y-2">
                                            {editData.descList.map((point, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Input
                                                        value={point}
                                                        placeholder={`Point ${i + 1}`}
                                                        onChange={(e) => {
                                                            const updated = [...editData.descList];
                                                            updated[i] = e.target.value;
                                                            setEditData({
                                                                ...editData,
                                                                descList: updated,
                                                            });
                                                        }}
                                                    />
                                                    {editData.descList.length > 1 && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                const updated = editData.descList.filter(
                                                                    (_, idx) => idx !== i
                                                                );
                                                                setEditData({
                                                                    ...editData,
                                                                    descList: updated,
                                                                });
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setEditData({
                                                        ...editData,
                                                        descList: [...editData.descList, ""],
                                                    })
                                                }
                                            >
                                                + Add Point
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditIndex(null)}>
                                Cancel
                            </Button>
                            <Button onClick={saveEdit}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>


        </div>
    );
};

export default OnlineProgramApply;
