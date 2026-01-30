import React, { useState, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

const allIconNames = Object.keys(FaIcons);

export function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = useMemo(() => {
        if (!searchTerm) return allIconNames.slice(0, 100); // Show first 100 initially
        return allIconNames
            .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 100); // Limit results for performance
    }, [searchTerm]);

    const SelectedIcon = value && FaIcons[value] ? FaIcons[value] : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {SelectedIcon ? (
                        <span className="flex items-center gap-2">
                            <SelectedIcon className="h-4 w-4" />
                            {value}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">Select Icon...</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2 border-b">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search icons..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="h-[300px] p-2">
                    <div className="grid grid-cols-5 gap-2">
                        {filteredIcons.map((iconName) => {
                            const Icon = FaIcons[iconName];
                            return (
                                <Button
                                    key={iconName}
                                    variant="ghost"
                                    className="h-10 w-10 p-2 hover:bg-slate-100"
                                    onClick={() => {
                                        onChange(iconName);
                                        setOpen(false);
                                    }}
                                    title={iconName}
                                >
                                    <Icon className="h-6 w-6" />
                                </Button>
                            );
                        })}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-5 text-center text-sm text-gray-500 py-4">
                                No icons found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
