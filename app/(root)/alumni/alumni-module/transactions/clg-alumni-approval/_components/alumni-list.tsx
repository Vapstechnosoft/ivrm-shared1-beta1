'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, X, Users, Loader2 } from "lucide-react";
import { IClgAlumniApprovalDetails } from "@/types/alumni/clg-alumni-approval";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlumniListProps {
    data: IClgAlumniApprovalDetails[];
    onSearch: (id: number, membername: string) => void;
    onCancel: () => void;
    onFilter: (query: string) => void;
    isFiltering: boolean;
}

export default function AlumniList({ data, onSearch, onCancel, onFilter, isFiltering }: AlumniListProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCheckboxChange = (id: number) => {
        if (selectedId === id) {
            setSelectedId(null);
        } else {
            setSelectedId(id);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 gap-4">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Total Pending Alumni: <span className="font-bold text-foreground">{data.length}</span>
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                        onChange={(e) => onFilter(e.target.value)}
                    />
                    {isFiltering && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </div>

            <ScrollArea className="h-[400px] border rounded-md">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">Select</TableHead>
                            <TableHead className="text-center w-[60px]">SLNO</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="text-center">Year Admitted</TableHead>
                            <TableHead className="text-center">Year Left</TableHead>
                            <TableHead>Course Admitted</TableHead>
                            <TableHead>Course Left</TableHead>
                            <TableHead>Branch Admitted</TableHead>
                            <TableHead>Branch Left</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => {
                                const id = item.alcsreg_id || item.amcsT_ID || index;
                                // Parse name and admno from amcsT_FirstName if needed (Format: "NAME :ADMNO")
                                let displayName = item.membername || item.amcsT_FirstName || "";
                                let displayAdmNo = "";
                                if (!item.membername && item.amcsT_FirstName?.includes(" :")) {
                                    const parts = item.amcsT_FirstName.split(" :");
                                    displayName = parts[0].trim();
                                    displayAdmNo = parts[1].trim();
                                }

                                return (
                                    <TableRow key={id} className={selectedId === id ? "bg-primary/5" : ""}>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedId === id}
                                                onCheckedChange={() => handleCheckboxChange(id as number)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-semibold">
                                            <div className="flex flex-col">
                                                <span>{displayName}</span>
                                                {displayAdmNo && (
                                                    <span className="text-[10px] text-muted-foreground font-normal bg-muted px-1.5 py-0.5 rounded w-fit mt-1 uppercase tracking-wider">
                                                        {displayAdmNo}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{item.admitted_year || item.alcsreG_AdmittedYear || 'N/A'}</TableCell>
                                        <TableCell className="text-center">{item.left_year || item.alcsreG_LeftYear || 'N/A'}</TableCell>
                                        <TableCell>{item.admit_course || item.amcO_CourseName || 'N/A'}</TableCell>
                                        <TableCell>{item.left_course || 'N/A'}</TableCell>
                                        <TableCell>{item.admit_branch || item.amB_BranchName || 'N/A'}</TableCell>
                                        <TableCell>{item.left_branch || 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t">
                <Button
                    onClick={() => {
                        const selectedItem = data.find(item => (item.alcsreg_id || item.amcsT_ID) === selectedId);
                        if (selectedItem) {
                            onSearch(selectedId!, selectedItem.membername || selectedItem.amcsT_FirstName || "");
                        }
                    }}
                    disabled={!selectedId}
                    className="min-w-[120px]"
                >
                    <Search className="mr-2 h-4 w-4" />
                    Search Match
                </Button>
                <Button
                    variant="destructive"
                    onClick={onCancel}
                    className="min-w-[120px]"
                >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}
