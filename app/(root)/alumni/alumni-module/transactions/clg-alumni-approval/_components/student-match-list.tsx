'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, X, UserCheck } from "lucide-react";
import { IStudentMatchDetails } from "@/types/alumni/clg-alumni-approval";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudentMatchListProps {
    data: IStudentMatchDetails[];
    onApprove: (alcmstId: number) => void;
    onCancel: () => void;
}

export default function StudentMatchList({ data, onApprove, onCancel }: StudentMatchListProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCheckboxChange = (id: number) => {
        if (selectedId === id) {
            setSelectedId(null);
        } else {
            setSelectedId(id);
        }
    };

    const handleApprove = () => {
        if (selectedId) {
            onApprove(selectedId);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Matched Student Records</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                    Matches Found: <span className="font-bold text-foreground">{data.length}</span>
                </p>
            </div>

            <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">Select</TableHead>
                            <TableHead className="text-center w-[60px]">SLNO</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Admission No</TableHead>
                            <TableHead className="text-center">Year Admitted</TableHead>
                            <TableHead>Course Admitted</TableHead>
                            <TableHead>Branch Admitted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => {
                                const id = item.alcmsT_Id || item.amcsT_ID || index;
                                let displayName = item.membername || item.amcsT_FirstName || "";
                                let displayAdmNo = item.alcmsT_AdmNo || "";

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
                                        <TableCell className="font-semibold">{displayName}</TableCell>
                                        <TableCell>{displayAdmNo}</TableCell>
                                        <TableCell className="text-center">{item.yeardmitted || 'N/A'}</TableCell>
                                        <TableCell>{item.courseadmitted || 'N/A'}</TableCell>
                                        <TableCell>{item.branchadmitted || 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t">
                <Button
                    onClick={handleApprove}
                    disabled={!selectedId}
                    className="min-w-[120px]"
                >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Approval
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
