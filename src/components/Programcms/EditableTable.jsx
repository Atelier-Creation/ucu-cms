import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, X } from "lucide-react";

export default function EditableTable() {
  const [headers, setHeaders] = useState(["Trimester 1", "Trimester 2", "Trimester 3"]);
  const [data, setData] = useState([
    ["Macro Economics", "Micro Economics", "Cost and Management Accounting"],
    ["Financial Accounting for Decision Making", "Financial Management-1", "Financial Management-2"],
  ]);

  const handleHeaderChange = (index, value) => {
    const updated = [...headers];
    updated[index] = value;
    setHeaders(updated);
  };

  const handleDataChange = (rowIndex, colIndex, value) => {
    const updated = [...data];
    updated[rowIndex][colIndex] = value;
    setData(updated);
  };

  const addColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setData(data.map(row => [...row, ""]));
  };

  const addRow = () => {
    setData([...data, headers.map(() => "")]);
  };

  const removeColumn = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
    setData(data.map(row => row.filter((_, i) => i !== index)));
  };

  const removeRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-4 rounded-2xl bg-white dark:bg-black/0">
      <div className="flex gap-2">
        <Button onClick={addColumn}>+ Add Column</Button>
        <Button onClick={addRow}>+ Add Row</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none">
            {headers.map((header, index) => (
              <TableHead key={index} className="relative">
                <Input
                  value={header}
                  onChange={(e) => handleHeaderChange(index, e.target.value)}
                  className="w-full font-semibold"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-3 -right-2 text-red-500"
                  onClick={() => removeColumn(index)}
                >
                  <X/>
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="border-none">
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex}>
                  <Input
                    value={cell}
                    onChange={(e) => handleDataChange(rowIndex, colIndex, e.target.value)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRow(rowIndex)}
                  className="bg-white text-red-500"
                >
                  <Trash2/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
