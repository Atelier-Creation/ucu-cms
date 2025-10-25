"use client";

import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  return date ? !isNaN(date.getTime()) : false;
}

export function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : undefined);
  const [month, setMonth] = useState(date);
  const [inputValue, setInputValue] = useState(value ? formatDate(date) : "");

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex gap-2">
        <Input
          value={inputValue}
          placeholder="Select date"
          className="pr-10"
          onChange={(e) => {
            const d = new Date(e.target.value);
            setInputValue(e.target.value);
            if (isValidDate(d)) {
              setDate(d);
              setMonth(d);
              onChange(d.toISOString().split("T")[0]);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                setDate(d);
                const formatted = formatDate(d);
                setInputValue(formatted);
                onChange(d.toISOString().split("T")[0]);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
