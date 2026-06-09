import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, X } from "lucide-react";

const defaultTable = {
  headers: ["Column 1", "Column 2"],
  rows: [["", ""]],
};

function normalizeTable(initialData) {
  if (Array.isArray(initialData)) {
    return {
      headers: initialData[0] || defaultTable.headers,
      rows: initialData.slice(1).length ? initialData.slice(1) : defaultTable.rows,
    };
  }

  return {
    headers: initialData?.headers?.length ? initialData.headers : defaultTable.headers,
    rows: initialData?.rows?.length ? initialData.rows : defaultTable.rows,
  };
}

export default function EditableTable({ initialData, onChange }) {
  const [headers, setHeaders] = useState(defaultTable.headers);
  const [data, setData] = useState(defaultTable.rows);

  useEffect(() => {
    const table = normalizeTable(initialData);
    setHeaders(table.headers);
    setData(table.rows);
  }, [initialData]);

  const emitChange = (nextHeaders, nextRows) => {
    onChange?.({ headers: nextHeaders, rows: nextRows });
  };

  const handleHeaderChange = (index, value) => {
    const updated = [...headers];
    updated[index] = value;
    setHeaders(updated);
    emitChange(updated, data);
  };

  const handleDataChange = (rowIndex, colIndex, value) => {
    const updated = [...data];
    updated[rowIndex][colIndex] = value;
    setData(updated);
    emitChange(headers, updated);
  };

  const addColumn = () => {
    const nextHeaders = [...headers, `Column ${headers.length + 1}`];
    const nextRows = data.map(row => [...row, ""]);
    setHeaders(nextHeaders);
    setData(nextRows);
    emitChange(nextHeaders, nextRows);
  };

  const addRow = () => {
    const nextRows = [...data, headers.map(() => "")];
    setData(nextRows);
    emitChange(headers, nextRows);
  };

  const removeColumn = (index) => {
    const nextHeaders = headers.filter((_, i) => i !== index);
    const nextRows = data.map(row => row.filter((_, i) => i !== index));
    setHeaders(nextHeaders);
    setData(nextRows);
    emitChange(nextHeaders, nextRows);
  };

  const removeRow = (index) => {
    const nextRows = data.filter((_, i) => i !== index);
    setData(nextRows);
    emitChange(headers, nextRows);
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
