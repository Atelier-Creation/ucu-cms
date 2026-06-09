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
import { getAllPrograms } from "@/Api/programApi";

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function isCareerRebootProgram(program) {
    if (program.programCategory === "career-reboot") return true;
    const text = `${program.programTitle || ""} ${program.subTitle || ""}`.toLowerCase();
    return text.includes("career reboot") || text.includes("women");
}

function CrpfwProgram() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState("fulltime");
    const [programs, setPrograms] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await getAllPrograms();
                setPrograms((Array.isArray(data) ? data : []).filter(isCareerRebootProgram));
            } catch (error) {
                console.error("Error fetching career reboot programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-foreground">
                    Career Reboot Program for Women
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
                                            navigate("/programs/Career-Reboot-Program-for-Women/create");
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
                <AccordionItem
                    value="page-0"
                    className="border border-border shadow-sm rounded-lg bg-muted/30"
                >
                    <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium bg-muted/50 hover:bg-muted transition cursor-pointer rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <span>Career Reboot Program for Women</span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="bg-gray-50 p-4 space-y-3 dark:bg-black">
                        {loading && <div className="text-sm text-muted-foreground">Loading programs...</div>}
                        {!loading && programs.length === 0 && (
                            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No Career Reboot programs are available in the database yet.
                            </div>
                        )}
                        {programs.map((program) => {
                            const link = `/programs/Career-Reboot-Program-for-Women/${slugify(program.programTitle)}/${program._id}`;
                            return (
                                <div key={program._id} className="flex items-center justify-between group">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit text-sm font-normal text-left cursor-pointer"
                                        onClick={() => navigate(link, { state: { programId: program._id } })}
                                    >
                                        {program.programTitle}
                                    </Button>
                                    <Pencil
                                        className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                                        onClick={() => navigate(link, { state: { programId: program._id } })}
                                    />
                                </div>
                            );
                        })}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default CrpfwProgram
