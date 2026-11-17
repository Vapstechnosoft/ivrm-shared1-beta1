'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputText } from "@/components/ui/extension/input-text";
import { Plus, Minus, Search, Trash2 } from "lucide-react";
import { IAlumniSearchCriteriaRow } from "@/types/alumni/clg-alumni-student-search";
import { useState } from "react";

interface SearchCriteriaBuilderProps {
    onSearch: (criteria: IAlumniSearchCriteriaRow[]) => void;
    onClear: () => void;
}

const FIELDS = [
    { value: "ALCMST_FirstName", name: "First Name" },
    { value: "ALCMST_RegistrationNo", name: "Reg No" },
    { value: "ALCMST_AdmNo", name: "Admission No" },
    { value: "ALCMST_MobileNo", name: "Mobile No" },
    { value: "ALCMST_Sex", name: "Sex" },
    { value: "ALCMST_Date", name: "Date" },
    { value: "ALCMST_emailId", name: "Email id" },
    { value: "ALCMST_FatherName", name: "Father Name" },
    { value: "ALCMST_MotherName", name: "Mother Name" },
    { value: "StudentName", name: "Student Name" }
];

const OPERATORS = [
    { value: "=", name: "Equal to" },
    { value: "!=", name: "Not Equal to" },
    { value: "like", name: "Like" },
    { value: ">", name: "Greater than" },
    { value: "<", name: "Less than" },
];

const CONDITIONS = [
    { value: "AND", name: "AND" },
    { value: "OR", name: "OR" },
];

export default function SearchCriteriaBuilder({ onSearch, onClear }: SearchCriteriaBuilderProps) {
    const [rows, setRows] = useState<IAlumniSearchCriteriaRow[]>([
        { id: crypto.randomUUID(), field: "", operator: "", value: "", condition: "AND" }
    ]);

    const addRow = () => {
        setRows([...rows, { id: crypto.randomUUID(), field: "", operator: "", value: "", condition: "AND" }]);
    };

    const removeRow = (index: number) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index: number, updates: Partial<IAlumniSearchCriteriaRow>) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], ...updates };
        setRows(newRows);
    };

    const handleSearch = () => {
        const validRows = rows.filter(r => r.field && r.operator && r.value);
        if (validRows.length === 0) {
            alert("Please provide at least one complete search criterion.");
            return;
        }
        onSearch(rows);
    };

    const handleClear = () => {
        setRows([{ id: crypto.randomUUID(), field: "", operator: "", value: "", condition: "AND" }]);
        onClear();
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b text-sm font-medium text-muted-foreground">
                            <th className="py-2 px-2 text-left">Field *</th>
                            <th className="py-2 px-2 text-left">Operator *</th>
                            <th className="py-2 px-2 text-left">Value *</th>
                            <th className="py-2 px-2 text-left">Condition</th>
                            <th className="py-2 px-2 text-center w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rows.map((row, index) => (
                            <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-2 min-w-[150px]">
                                    <Select value={row.field} onValueChange={(v) => updateRow(index, { field: v })}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FIELDS.map(f => (
                                                <SelectItem key={f.value} value={f.value}>{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className="py-3 px-2 min-w-[150px]">
                                    <Select value={row.operator} onValueChange={(v) => updateRow(index, { operator: v })}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OPERATORS.map(o => (
                                                <SelectItem key={o.value} value={o.value}>{o.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className="py-3 px-2 min-w-[200px]">
                                    <InputText
                                        value={row.value}
                                        onChange={(e) => updateRow(index, { value: e.target.value })}
                                        placeholder="Enter value"
                                        className="h-9 border-muted-foreground/20 focus-visible:ring-primary/20"
                                    />
                                </td>
                                <td className="py-3 px-2 min-w-[100px]">
                                    {index < rows.length - 1 && (
                                        <Select value={row.condition} onValueChange={(v) => updateRow(index, { condition: v })}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CONDITIONS.map(c => (
                                                    <SelectItem key={c.value} value={c.value}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                                            onClick={addRow}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        {rows.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                                onClick={() => removeRow(index)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-3 pt-4 border-t border-dashed">
                <Button onClick={handleSearch} className="min-w-[120px] shadow-sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
                <Button variant="outline" onClick={handleClear} className="min-w-[100px] border-muted-foreground/30 text-muted-foreground hover:bg-muted/50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                </Button>
            </div>
        </div>
    );
}
