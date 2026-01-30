import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAdmissionPageData, updateAdmissionPageData } from "../Api/AdmissionPageApi";
import { IconPicker } from "@/components/IconPicker";

export default function AdmissionPageCMS() {
    const [data, setData] = useState({
        hero: { title: "", description: "", badge: "", cards: [] },
        whyChoose: { title: "", subtitle: "", cards: [] },
        industry: { title: "", description: "", cards: [] },
        admissionProcess: { title: "", description: "", cards: [] },
        whoCanApply: { title: "", description: "", cards: [] },
        learningExperience: { title: "", description: "", cards: [] },
        faqSection: { title: "", faqs: [] },
        readyToApply: { title: "", description: "" }
    });
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getAdmissionPageData();
            if (result) {
                // Merge with default structure to avoid undefined errors
                setData(prev => ({
                    ...prev,
                    ...result,
                    hero: { ...prev.hero, ...result.hero },
                    whyChoose: { ...prev.whyChoose, ...result.whyChoose }
                }));
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to fetch data.", variant: "destructive" });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateAdmissionPageData(data);
            toast({ title: "Success", description: "Admission Page updated successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update Admission Page.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const updateSection = (section, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const addCard = (section) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                cards: [...(prev[section].cards || []), { title: "", description: "" }]
            }
        }));
    };

    const removeCard = (section, index) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                cards: prev[section].cards.filter((_, i) => i !== index)
            }
        }));
    };

    const updateCard = (section, index, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                cards: prev[section].cards.map((card, i) =>
                    i === index ? { ...card, [field]: value } : card
                )
            }
        }));
    };

    // Eligibility Functions
    const addEligibility = (section) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                eligibility: [...(prev[section].eligibility || []), { title: "", description: "" }]
            }
        }));
    };

    const removeEligibility = (section, index) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                eligibility: prev[section].eligibility.filter((_, i) => i !== index)
            }
        }));
    };

    const updateEligibility = (section, index, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                eligibility: prev[section].eligibility.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                )
            }
        }));
    };

    // Document Functions
    const addDocument = (section) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                documents: [...(prev[section].documents || []), ""]
            }
        }));
    };

    const removeDocument = (section, index) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                documents: prev[section].documents.filter((_, i) => i !== index)
            }
        }));
    };

    const updateDocument = (section, index, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                documents: prev[section].documents.map((doc, i) =>
                    i === index ? value : doc
                )
            }
        }));
    };

    // FAQ Functions
    const addFaq = (section) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                faqs: [...(prev[section].faqs || []), { question: "", answer: "" }]
            }
        }));
    };

    const removeFaq = (section, index) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                faqs: prev[section].faqs.filter((_, i) => i !== index)
            }
        }));
    };

    const updateFaq = (section, index, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                faqs: prev[section].faqs.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                )
            }
        }));
    };

    // Who Can Apply List Items Helper (Comma separated)
    const updateCardListItems = (section, index, value) => {
        const items = value.split(',').map(item => item.trim());
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                cards: prev[section].cards.map((card, i) =>
                    i === index ? { ...card, listItems: items } : card
                )
            }
        }));
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admission Page CMS</h1>
                <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </div>

            {/* Hero Section */}
            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={data.hero.title} onChange={(e) => updateSection("hero", "title", e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea value={data.hero.description} onChange={(e) => updateSection("hero", "description", e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Badge Text</label>
                        <Input value={data.hero.badge} onChange={(e) => updateSection("hero", "badge", e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Why Choose Section */}
            <Card>
                <CardHeader><CardTitle>Why Choose Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.whyChoose.title} onChange={(e) => updateSection("whyChoose", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Subtitle</label>
                            <Textarea value={data.whyChoose.subtitle} onChange={(e) => updateSection("whyChoose", "subtitle", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Why Choose Cards</h3>
                            <Button size="sm" variant="outline" onClick={() => addCard("whyChoose")}>+ Add Card</Button>
                        </div>
                        {data.whyChoose.cards && data.whyChoose.cards.map((card, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeCard("whyChoose", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Title" value={card.title || ""} onChange={(e) => updateCard("whyChoose", idx, "title", e.target.value)} />
                                    <Textarea placeholder="Description" value={card.description || ""} onChange={(e) => updateCard("whyChoose", idx, "description", e.target.value)} />
                                    <IconPicker value={card.icon} onChange={(val) => updateCard("whyChoose", idx, "icon", val)} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Industry Section */}
            <Card>
                <CardHeader><CardTitle>Industry Connect Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Badge</label>
                            <Input value={data.industry.badge} onChange={(e) => updateSection("industry", "badge", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.industry.title} onChange={(e) => updateSection("industry", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea value={data.industry.description} onChange={(e) => updateSection("industry", "description", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Industry Features</h3>
                            <Button size="sm" variant="outline" onClick={() => addCard("industry")}>+ Add Feature</Button>
                        </div>
                        {data.industry.cards && data.industry.cards.map((card, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeCard("industry", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Feature Title" value={card.title || ""} onChange={(e) => updateCard("industry", idx, "title", e.target.value)} />
                                    <Textarea placeholder="Feature Description" value={card.description || ""} onChange={(e) => updateCard("industry", idx, "description", e.target.value)} />
                                    <IconPicker value={card.icon} onChange={(val) => updateCard("industry", idx, "icon", val)} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Admission Process Section */}
            <Card>
                <CardHeader><CardTitle>Admission Process Section</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.admissionProcess.title} onChange={(e) => updateSection("admissionProcess", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea value={data.admissionProcess.description} onChange={(e) => updateSection("admissionProcess", "description", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Timeline Steps</h3>
                            <Button size="sm" variant="outline" onClick={() => addCard("admissionProcess")}>+ Add Step</Button>
                        </div>
                        {data.admissionProcess.cards && data.admissionProcess.cards.map((card, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeCard("admissionProcess", idx)}>X</Button>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <div className="bg-gray-100 p-2 rounded w-8 text-center font-bold">{idx + 1}</div>
                                        <Input placeholder="Step Title" value={card.title || ""} onChange={(e) => updateCard("admissionProcess", idx, "title", e.target.value)} className="flex-1" />
                                    </div>
                                    <Input placeholder="Date / Duration (e.g. November – March)" value={card.statValue || ""} onChange={(e) => updateCard("admissionProcess", idx, "statValue", e.target.value)} />
                                    <Textarea placeholder="Description" value={card.description || ""} onChange={(e) => updateCard("admissionProcess", idx, "description", e.target.value)} />
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Eligibility Criteria */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Eligibility Criteria</h3>
                            <Button size="sm" variant="outline" onClick={() => addEligibility("admissionProcess")}>+ Add Criteria</Button>
                        </div>
                        {data.admissionProcess.eligibility && data.admissionProcess.eligibility.map((item, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeEligibility("admissionProcess", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Criteria Title" value={item.title || ""} onChange={(e) => updateEligibility("admissionProcess", idx, "title", e.target.value)} />
                                    <Textarea placeholder="Description" value={item.description || ""} onChange={(e) => updateEligibility("admissionProcess", idx, "description", e.target.value)} />
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Required Documents */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Required Documents</h3>
                            <Button size="sm" variant="outline" onClick={() => addDocument("admissionProcess")}>+ Add Document</Button>
                        </div>
                        {data.admissionProcess.documents && data.admissionProcess.documents.map((doc, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input value={doc || ""} onChange={(e) => updateDocument("admissionProcess", idx, e.target.value)} />
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeDocument("admissionProcess", idx)}>X</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Who Can Apply Section */}
            <Card>
                <CardHeader><CardTitle>Who Can Apply Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Badge</label>
                            <Input value={data.whoCanApply.badge} onChange={(e) => updateSection("whoCanApply", "badge", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.whoCanApply.title} onChange={(e) => updateSection("whoCanApply", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Subtitle</label>
                            <Textarea value={data.whoCanApply.subtitle} onChange={(e) => updateSection("whoCanApply", "subtitle", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Candidate Profiles</h3>
                            <Button size="sm" variant="outline" onClick={() => addCard("whoCanApply")}>+ Add Profile</Button>
                        </div>
                        {data.whoCanApply.cards && data.whoCanApply.cards.map((card, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeCard("whoCanApply", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Profile Title" value={card.title || ""} onChange={(e) => updateCard("whoCanApply", idx, "title", e.target.value)} />
                                    <Textarea placeholder="Description" value={card.description || ""} onChange={(e) => updateCard("whoCanApply", idx, "description", e.target.value)} />
                                    <IconPicker value={card.icon} onChange={(val) => updateCard("whoCanApply", idx, "icon", val)} />
                                    <div>
                                        <label className="text-xs text-muted-foreground">List Items (comma separated)</label>
                                        <Input placeholder="Item 1, Item 2, Item 3" value={card.listItems ? card.listItems.join(", ") : ""} onChange={(e) => updateCardListItems("whoCanApply", idx, e.target.value)} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Learning Experience Section */}
            <Card>
                <CardHeader><CardTitle>Learning Experience Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.learningExperience.title} onChange={(e) => updateSection("learningExperience", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea value={data.learningExperience.description} onChange={(e) => updateSection("learningExperience", "description", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Faculty / Learning Cards</h3>
                            <Button size="sm" variant="outline" onClick={() => addCard("learningExperience")}>+ Add Card</Button>
                        </div>
                        {data.learningExperience.cards && data.learningExperience.cards.map((card, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeCard("learningExperience", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Name / Title" value={card.title || ""} onChange={(e) => updateCard("learningExperience", idx, "title", e.target.value)} />
                                    <Input placeholder="Role / Subtitle" value={card.subtitle || ""} onChange={(e) => updateCard("learningExperience", idx, "subtitle", e.target.value)} />
                                    <Input placeholder="Image URL" value={card.image || ""} onChange={(e) => updateCard("learningExperience", idx, "image", e.target.value)} />
                                    <Textarea placeholder="Quote / Description" value={card.description || ""} onChange={(e) => updateCard("learningExperience", idx, "description", e.target.value)} />
                                    <div>
                                        <label className="text-xs text-muted-foreground">Credentials (Main, Sub)</label>
                                        <Input placeholder="PhD in Management, 20+ years experience" value={card.listItems ? card.listItems.join(", ") : ""} onChange={(e) => updateCardListItems("learningExperience", idx, e.target.value)} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
                <CardHeader><CardTitle>FAQ Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={data.faqSection.title} onChange={(e) => updateSection("faqSection", "title", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea value={data.faqSection.description} onChange={(e) => updateSection("faqSection", "description", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Frequently Asked Questions</h3>
                            <Button size="sm" variant="outline" onClick={() => addFaq("faqSection")}>+ Add FAQ</Button>
                        </div>
                        {data.faqSection.faqs && data.faqSection.faqs.map((faq, idx) => (
                            <Card key={idx} className="p-4 border-dashed relative">
                                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeFaq("faqSection", idx)}>X</Button>
                                <div className="space-y-3">
                                    <Input placeholder="Question" value={faq.question || ""} onChange={(e) => updateFaq("faqSection", idx, "question", e.target.value)} />
                                    <Textarea placeholder="Answer" value={faq.answer || ""} onChange={(e) => updateFaq("faqSection", idx, "answer", e.target.value)} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Ready To Apply Section */}
            <Card>
                <CardHeader><CardTitle>Ready To Apply Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={data.readyToApply.title} onChange={(e) => updateSection("readyToApply", "title", e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea value={data.readyToApply.description} onChange={(e) => updateSection("readyToApply", "description", e.target.value)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
