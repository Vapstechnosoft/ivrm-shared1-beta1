
'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, CheckCircle, XCircle, Search as SearchIcon } from 'lucide-react';
import type { IStudentTransactionSearchResponse, IStudentInfo } from '@/types/staff-portal/student-transaction-cce';

interface ListProps {
    data: IStudentTransactionSearchResponse;
    onSave: (students: IStudentInfo[], flag: 'S' | 'V') => void;
    onCancel: () => void;
}

export default function StudentTransactionList({ data, onSave, onCancel }: ListProps) {
    const { studentList, getsaveddata, exammaster } = data;
    const [localStudents, setLocalStudents] = useState<IStudentInfo[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [checkAll, setCheckAll] = useState(true);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        // Verification status check
        if (exammaster && exammaster.length > 0) {
            if ((exammaster[0].TotalMarksCount || 0) > 0) {
                setHide(true);
            }
        }

        // Initialize students with saved data
        const initialized = studentList.map(student => {
            const saved = getsaveddata?.find(s => s.amsT_Id === student.amsT_Id);
            if (saved) {
                return {
                    ...student,
                    checked: true,
                    ECSACTT_Score: saved.ecsactT_Score || saved.ecsT_Score || "",
                    ECSACTT_Id: saved.ecsactT_Id,
                    ECST_Id: saved.ecsT_Id,
                    areaName: saved.ecactA_Id || saved.ecsA_Id
                };
            }
            return { ...student, checked: true }; // Default checked as per Angular
        });
        setLocalStudents(initialized);
    }, [studentList, getsaveddata, exammaster]);

    const handleCheckAll = (val: boolean) => {
        setCheckAll(val);
        setLocalStudents(prev => prev.map(s => ({ ...s, checked: val })));
    };

    const handleStudentToggle = (id: number, val: boolean) => {
        setLocalStudents(prev => prev.map(s => {
            if (s.amsT_Id === id) return { ...s, checked: val };
            return s;
        }));
    };

    const handleScoreChange = (id: number, val: string) => {
        setLocalStudents(prev => prev.map(s => {
            if (s.amsT_Id === id) return { ...s, ECSACTT_Score: val };
            return s;
        }));
    };

    const filteredStudents = localStudents.filter(s =>
        s.studentName.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchValue.toLowerCase())
    );

    const scores = ["A+", "A", "B", "C", "D", "AB"];

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20 p-4 rounded-lg border border-primary/5">
                <div className="flex gap-4 items-center">
                    <span className="text-sm font-medium">Record Count: <span className="text-primary font-bold">{localStudents.length}</span></span>
                    {searchValue && (
                        <span className="text-sm font-medium">Filtered: <span className="text-primary font-bold">{filteredStudents.length}</span></span>
                    )}
                </div>
                <div className="relative w-full md:w-80">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search student list..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={checkAll}
                                    onCheckedChange={(val) => handleCheckAll(val === true)}
                                    disabled={hide}
                                />
                            </TableHead>
                            <TableHead className="w-[60px] text-center">SL.NO.</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Reg. No.</TableHead>
                            <TableHead className="text-center">Roll No.</TableHead>
                            <TableHead className="w-[180px] text-center">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, idx) => (
                                <TableRow key={student.amsT_Id} className={!student.checked ? "opacity-50 grayscale" : ""}>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={student.checked}
                                            onCheckedChange={(val) => handleStudentToggle(student.amsT_Id, val === true)}
                                            disabled={hide}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                                    <TableCell className="font-medium text-primary/80">{student.studentName}</TableCell>
                                    <TableCell>{student.regNumber}</TableCell>
                                    <TableCell className="text-center">{student.rollNumber}</TableCell>
                                    <TableCell className="text-center">
                                        <Select
                                            value={student.ECSACTT_Score || ""}
                                            onValueChange={(val) => handleScoreChange(student.amsT_Id, val)}
                                            disabled={!student.checked || hide}
                                        >
                                            <SelectTrigger className="h-9 w-32 mx-auto">
                                                <SelectValue placeholder="--Select--" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {scores.map(sc => <SelectItem key={sc} value={sc}>{sc}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No records found matching search criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {hide && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center gap-2 text-destructive font-semibold">
                    <XCircle className="h-5 w-5" />
                    Records are verified and frozen. Changes are not allowed.
                </div>
            )}

            <div className="flex justify-center gap-6 py-4">
                <Button
                    onClick={() => onSave(localStudents, 'S')}
                    disabled={hide}
                    className="flex items-center gap-2 px-10 min-w-[140px] bg-primary hover:bg-primary/90"
                >
                    <Save className="h-4 w-4" />
                    Save
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onSave(localStudents, 'V')}
                    disabled={hide}
                    className="flex items-center gap-2 px-10 min-w-[140px] border-primary text-primary hover:bg-primary/5"
                >
                    <CheckCircle className="h-4 w-4" />
                    Verify
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-10 min-w-[140px] hover:bg-muted"
                >
                    <XCircle className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}
