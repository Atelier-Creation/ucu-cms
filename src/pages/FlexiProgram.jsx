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

const iconMap = { Home, Mic, GraduationCap };

const fullTimeProgramsData = [
    {
        icon: "GraduationCap",
        pageTitle: "Flexi Programs",
        sections: [
            {
                header: "Programs",
                submenu: [

                    { label: "PGPM Flex", link: "/program/flexi/pgpm-flex/1" },
                    { label: "PGXPM", link: "/program/flexi/pgxpm/2" },
                ],
            },
        ],
    },
];

function FlexiProgram() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState("fulltime");

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-foreground">
                    Flexi Programs
                </h1>
                <div className="ml-2 text-right">
                    <Dialog open={open} onOpenChange={setOpen} className='bg-white'>
                        <DialogTrigger asChild>
                            <Button>Add Program</Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-sm bg-white">
                            <DialogHeader>
                                <DialogTitle>Select Program Type</DialogTitle>
                            </DialogHeader>

                            <div className="py-4">
                                <RadioGroup
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-100 hover:border-green-500 transition">
                                        <RadioGroupItem value="fulltime" id="fulltime" />
                                        <Label htmlFor="fulltime" className="flex-col items-start cursor-pointer">
                                            <div className="font-semibold flex items-start gap-2">
                                                Full Time Program
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Traditional classroom-based programs with a structured academic schedule.
                                            </p>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-100 hover:border-green-500 transition">
                                        <RadioGroupItem value="flex" id="flex" />
                                        <Label htmlFor="flex" className="flex-col items-start cursor-pointer">
                                            <div className="font-semibold flex items-start gap-2">
                                                <p>Flex Program</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Designed for working professionals with flexible class timings.
                                            </p>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <DialogFooter>
                                <Button
                                    onClick={() => {
                                        setOpen(false);
                                        if (selectedType === "fulltime") {
                                            navigate("/program/fulltime/create");
                                        } else {
                                            navigate("/program/fulltime/create");
                                        }
                                    }}
                                >
                                    Continue<ChevronsRight className="inline-block" />
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
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
                                                                    onClick={() => navigate(nested.link)}
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
                                                        onClick={() => navigate(sub.link)}
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
        </div>
    );
}

export default FlexiProgram