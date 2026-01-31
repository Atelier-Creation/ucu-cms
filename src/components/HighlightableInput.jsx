import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

/**
 * An input component that allows selecting text and applying a highlight color (green) span.
 * Used for Main Headings to create the colored span effect.
 */
export default function HighlightableInput({ value, onChange, placeholder, className }) {
    const inputRef = useRef(null);

    const applyHighlight = () => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;

        // No text selected
        if (start === end) return;

        const currentValue = value || "";
        const selectedText = currentValue.substring(start, end);

        // Wrap selected text in span
        const newValue =
            currentValue.substring(0, start) +
            `<span style="color: #5ac501;">${selectedText}</span>` +
            currentValue.substring(end);

        onChange({ target: { value: newValue } });
    };

    return (
        <div className="flex gap-2">
            <Input
                ref={inputRef}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={applyHighlight}
                title="Highlight selected text green"
            >
                <Palette className="w-4 h-4 text-[#5ac501]" />
            </Button>
        </div>
    );
}
