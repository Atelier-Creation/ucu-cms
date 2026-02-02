import React, { useEffect, useState } from "react";
import { icons as Icons } from "lucide-react";
import { Input } from "@/components/ui/input";

const IconSearchPicker = ({ value, onSelect, columns = 6 }) => {
  const iconNames = Object.keys(Icons);

  const [search, setSearch] = useState(value || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const gridStyle = `grid ${
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-3"
      : columns === 4
      ? "grid-cols-4"
      : columns === 5
      ? "grid-cols-5"
      : "grid-cols-6"
  } gap-2 max-h-40 overflow-y-auto border rounded-md p-2`;

  const handleSelect = (name) => {
    onSelect(name);
    setSearch(name);
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search icon"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setDropdownOpen(true);
        }}
        onFocus={() => setDropdownOpen(true)}
      />

      {dropdownOpen && filteredIcons.length > 0 && (
        <div className={gridStyle}>
          {filteredIcons.slice(0, columns * 6).map((name) => {
            const Icon = Icons[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-muted text-[10px]"
              >
                <Icon className="w-5 h-5" />
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IconSearchPicker;
