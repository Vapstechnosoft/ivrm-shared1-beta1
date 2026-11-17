'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileDown, Users, Search as SearchIcon } from "lucide-react";
import { IAlumniSearchResult } from "@/types/alumni/clg-alumni-student-search";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { InputText } from "@/components/ui/extension/input-text";

interface SearchResultsTableProps {
    data: IAlumniSearchResult[];
    onExport: (selectedData: IAlumniSearchResult[]) => void;
}

export default function SearchResultsTable({ data, onExport }: SearchResultsTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const filteredData = useMemo(() => {
        if (!searchValue) return data;
        const lower = searchValue.toLowerCase();
        return data.filter(item =>
            item.firstname.toLowerCase().includes(lower) ||
            item.admno.toLowerCase().includes(lower) ||
            item.coursename.toLowerCase().includes(lower) ||
            item.branchname.toLowerCase().includes(lower)
        );
    }, [data, searchValue]);

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredData.map(item => Number(item.alcmst_id || 0)));
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(i => i !== id));
        }
    };

    const handleExport = () => {
        const selectedData = data.filter(item => selectedIds.includes(Number(item.alcmst_id || 0)));
        if (selectedData.length === 0) {
            alert("Please select at least one record to export.");
            return;
        }
        onExport(selectedData);
    };

    const allChecked = filteredData.length > 0 && selectedIds.length === filteredData.length;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Search Results</p>
                        <p className="text-xs text-muted-foreground">
                            Found {data.length} records | Selected {selectedIds.length}
                        </p>
                    </div>
                </div>
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <InputText
                        placeholder="Quick search results..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            <ScrollArea className="h-[500px] border rounded-xl overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-20 backdrop-blur-sm">
                        <TableRow className="border-b transition-none">
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={allChecked}
                                    onCheckedChange={(v) => handleToggleAll(!!v)}
                                />
                            </TableHead>
                            <TableHead className="w-[60px] text-center">SLNO</TableHead>
                            <TableHead className="min-w-[200px]">Student Name</TableHead>
                            <TableHead className="min-w-[120px]">Adm No</TableHead>
                            <TableHead className="min-w-[150px]">Course Name</TableHead>
                            <TableHead className="min-w-[150px]">Branch Name</TableHead>
                            <TableHead className="w-[80px]">Sem</TableHead>
                            <TableHead className="w-[120px] text-center">DOB</TableHead>
                            <TableHead className="w-[80px]">Sex</TableHead>
                            <TableHead className="min-w-[180px]">Email</TableHead>
                            <TableHead className="w-[120px]">Mobile No</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                                    No records matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item, index) => {
                                const itemId = Number(item.alcmst_id || index); // Fallback to index if alcmst_id is missing
                                return (
                                    <TableRow
                                        key={itemId}
                                        className={`${selectedIds.includes(itemId) ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"} transition-colors`}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedIds.includes(itemId)}
                                                onCheckedChange={(v) => handleToggleOne(itemId, !!v)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell className="font-semibold">
                                            {`${item.firstname} ${item.middlename || ""} ${item.lastname || ""}`}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{item.admno}</TableCell>
                                        <TableCell>{item.coursename}</TableCell>
                                        <TableCell>{item.branchname}</TableCell>
                                        <TableCell>{item.semname}</TableCell>
                                        <TableCell className="text-center uppercase tracking-tighter text-xs">
                                            {item.dob ? format(new Date(item.dob), 'dd/MM/yyyy') : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium">{item.sex}</TableCell>
                                        <TableCell className="text-xs truncate max-w-[180px]" title={item.emailid}>
                                            {item.emailid}
                                        </TableCell>
                                        <TableCell className="text-xs font-mono">{item.mobileno}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex justify-center pt-2">
                <Button
                    variant="outline"
                    onClick={handleExport}
                    disabled={selectedIds.length === 0}
                    className="min-w-[160px] border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export to Excel
                </Button>
            </div>
        </div>
    );
}
