"use client";
import React, { useMemo, useState, useEffect } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export default function SlateEditor({ value, onChange }) {
  // Create a new editor instance on every render is usually bad, but here we need to ensure
  // robustness against external state changes. Ideally, we should use a stable editor.
  const editor = useMemo(() => withReact(createEditor()), []);

  // Parse value safely
  const parsedValue = useMemo(() => {
    const DEFAULT_VALUE = [{ type: "paragraph", children: [{ text: "" }] }];

    if (value === undefined || value === null || value === "") return DEFAULT_VALUE;

    if (typeof value === 'object') {
      if (Array.isArray(value) && value.length > 0) return value;
      return DEFAULT_VALUE;
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_VALUE;
    } catch (e) {
      return [{ type: "paragraph", children: [{ text: String(value) }] }];
    }
  }, [value]);

  // We simply key the Slate component on the stringified value to force a full re-mount
  // when the parent passes completely new content (like loading from DB).
  // This is a "brute force" way ensuring initialValue is always correct for the new instance.
  // For standard typing, the internal state handles it.
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Only force update if the incoming value is significantly different from what we might have
    // This part is tricky with Slate.
    // A simpler approach for this CMS use-case: 
    // If the data is empty or loading, we might want to reset.
    // But let's try a stable initial load pattern.
  }, []);

  return (
    // We use a key to force re-mounting if the external 'value' changes drastically (e.g. page load)
    // However, we want to avoid remounting on every keystroke.
    // The previous implementation was mostly correct but 'initialValue' in Slate is only read ONCE.
    // To support async data loading, we must render Slate ONLY when we have data, OR use the key trick.
    <Slate
      key={JSON.stringify(parsedValue)} // Force remount when external data changes
      editor={editor}
      initialValue={parsedValue}
      onChange={(newValue) => {
        if (onChange) onChange(JSON.stringify(newValue));
      }}
    >
      <Editable
        className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Type your message here..."
      />
    </Slate>
  );
}
