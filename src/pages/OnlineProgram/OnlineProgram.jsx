import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Mic, GraduationCap, Pencil, ChevronsRight } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OnlineProgramModal from "./OnlineProgramModal";

const iconMap = { Home, Mic, GraduationCap };

const fullTimeProgramsData = [
    {
        icon: "GraduationCap",
        pageTitle: "Online Program",
        sections: [
            {
                header: "Programs",
                submenu: [

                    { label: "Online Program Hero", editType: "modal" },
                    { label: "Online Program Stats", link: "/program/flexi/pgxpm" },
                    { label: "How to apply", link: "/program/flexi/pgxpm" },
                    { label: "Online Program Services", link: "/program/flexi/pgxpm" },
                    { label: "Our Collaborators", link: "/program/flexi/pgxpm" },
                ],
            },
        ],
    },
];

function OnlineProgram() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    const [selectedType, setSelectedType] = React.useState("fulltime");

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-foreground">
                    Online Program
                </h1>
            </div>

            {/* Accordion List */}
            <Accordion
                type="single"
                collapsible
                className="space-y-3"
                defaultValue="page-0"
            >
                {fullTimeProgramsData.map((page, pageIndex) => {
                    const Icon = iconMap[page.icon];
                    return (
                        <AccordionItem
                            key={pageIndex}
                            value={`page-${pageIndex}`}
                            className="border border-border shadow-sm rounded-lg bg-muted/30"
                        >
                            <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium bg-muted/50 hover:bg-muted transition cursor-pointer rounded-t-lg">
                                <div className="flex items-center gap-2">
                                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                                    <span>{page.pageTitle}</span>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="bg-gray-50 p-4 space-y-3 dark:bg-black">
                                {page.sections.map((section, i) => (
                                    <Accordion
                                        key={i}
                                        type="single"
                                        collapsible
                                        className="border-l pl-4 space-y-2"
                                    >
                                        {section.submenu.map((sub, j) =>
                                            sub.submenu ? (
                                                <AccordionItem
                                                    key={j}
                                                    value={`sub-${j}`}
                                                    className="border-l bg-background rounded-sm border-border pl-3 pr-3"
                                                >
                                                    <AccordionTrigger className="text-sm font-medium text-left hover:text-primary flex justify-between items-center cursor-pointer">
                                                        <span>{sub.label}</span>
                                                    </AccordionTrigger>

                                                    <AccordionContent className="flex flex-col gap-2">
                                                        {sub.submenu.map((nested, k) => (
                                                            <div
                                                                key={k}
                                                                className="flex items-center justify-between group"
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-fit text-sm font-normal text-left cursor-pointer"
                                                                    onClick={() => navigate(nested.link)}
                                                                >
                                                                    {nested.label}
                                                                </Button>
                                                                <Pencil
                                                                    className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                                                                    onClick={() => navigate(sub.link)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ) : (
                                                <div
                                                    key={j}
                                                    className="flex items-center justify-between group"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-fit text-sm font-normal text-left cursor-pointer"
                                                        onClick={() => navigate(sub.link)}
                                                    >
                                                        {sub.label}
                                                    </Button>
                                                    <Pencil
                                                        className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            if (sub.editType === "modal") {
                                                                setEditingItem(sub);
                                                                setOpen(true);
                                                            } else {
                                                                navigate(sub.link);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </Accordion>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <OnlineProgramModal
                isOpen={open}
                onClose={() => setOpen(false)}
                data={editingItem}
            />

        </div>
    );
}

export default OnlineProgram