'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { IStudentPromotion, IPromotionRemarksSave } from '@/types/staff-portal/promotion-remarks';

interface PromotionRemarksGridProps {
    studentList: IStudentPromotion[];
    onSave: (data: IPromotionRemarksSave) => Promise<void>;
    filterData: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number };
}

const REMARKS_OPTIONS = [
    "Has made good academic and/or social progress has been made this semester.",
    "Puts evident effort into his work as he completes assignments.",
    "Must try to complete his assignments in time.",
    "Requires to persevere to improve his academic performance.",
    "Needs to refine his social behavioural pattern.",
    "Needs to pay attention to personal grooming.",
    "Should try for greater academic heights, given that he is a high achiever.",
    "Should work up to his potential in order to secure better grades.",
    "Should improve his English Language skills by reading story Books.",
    "Needs to improve in English/Mathematics to augment his grades.",
    "Must aim at improving his grades as he has immense potential.",
    "Must focus on subject and subject in order to improve his performance in class."
];

export default function PromotionRemarksGrid({
    studentList,
    onSave,
    filterData
}: PromotionRemarksGridProps) {
    const [students, setStudents] = useState<IStudentPromotion[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        setStudents(studentList);
    }, [studentList]);

    const handleCheckAll = (checked: boolean) => {
        setSelectAll(checked);
        const newStudents = students.map(s => ({ ...s, checkedvalue: checked }));
        setStudents(newStudents);
    };

    const handleCheck = (index: number, checked: boolean) => {
        const newStudents = [...students];
        newStudents[index].checkedvalue = checked;
        setStudents(newStudents);
        setSelectAll(newStudents.every(s => s.checkedvalue));
    };

    const handlePromotionNameChange = (index: number, val: string) => {
        const newStudents = [...students];
        newStudents[index].eprD_PromotionName = val;
        setStudents(newStudents);
    };

    const handleRemarksSelect = (index: number, val: string) => {
        const newStudents = [...students];
        newStudents[index].model = val;
        newStudents[index].eprD_Remarks = val;
        setStudents(newStudents);
    };

    const handleRemarksChange = (index: number, val: string) => {
        const newStudents = [...students];
        newStudents[index].eprD_Remarks = val;
        setStudents(newStudents);
    };

    // Sort helper
    const filteredStudents = students.filter(s =>
        s.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.amsT_Admno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        const selected = students.filter(s => s.checkedvalue);
        if (selected.length === 0) {
            toast.error('Select at least one student');
            return;
        }

        // Basic validation for selected
        for (const s of selected) {
            if (!s.eprD_PromotionName) {
                toast.error(`Enter Promotion/Conduct for ${s.studentname}`);
                return;
            }
            if (!s.eprD_Remarks) {
                toast.error(`Enter Remarks for ${s.studentname}`);
                return;
            }
        }

        setIsSaving(true);
        try {
            await onSave({
                ASMAY_Id: filterData.ASMAY_Id,
                ASMCL_Id: filterData.ASMCL_Id,
                ASMS_Id: filterData.ASMS_Id,
                EME_Id: 0,
                examtype: 1, // Hardcoded as per requirement for this page
                examtype_temp: selected.map(s => ({
                    amsT_Id: s.amsT_Id,
                    eprD_PromotionName: s.eprD_PromotionName,
                    eprD_Remarks: s.eprD_Remarks,
                    eprD_ClassPromoted: s.eprD_ClassPromoted,
                    eprD_Id: s.eprD_Id || 0
                }))
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Student List</CardTitle>
                    <div className="w-1/3">
                        <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">SLNo</TableHead>
                                <TableHead className="text-center">
                                    <Checkbox checked={selectAll} onCheckedChange={(c) => handleCheckAll(c as boolean)} />
                                </TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Adm.No</TableHead>
                                <TableHead>Roll.No</TableHead>
                                <TableHead>Result Details</TableHead>
                                <TableHead>Conduct (Promotion Name)</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s, i) => (
                                <TableRow key={s.amsT_Id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox checked={s.checkedvalue} onCheckedChange={(c) => handleCheck(i, c as boolean)} />
                                    </TableCell>
                                    <TableCell>{s.studentname}</TableCell>
                                    <TableCell>{s.amsT_Admno}</TableCell>
                                    <TableCell>{s.amaY_RollNo}</TableCell>
                                    <TableCell>
                                        <div className="text-xs space-y-1">
                                            <div className="flex justify-between"><span>Obtained:</span> <span className="font-bold">{s.obtainedmarks}</span></div>
                                            <div className="flex justify-between"><span>Max:</span> <span className="font-bold">{s.totalmaxmarks}</span></div>
                                            <div className="flex justify-between"><span>%:</span> <span className="font-bold">{s.percentage}</span></div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={s.eprD_PromotionName || ''}
                                            onChange={e => handlePromotionNameChange(i, e.target.value)}
                                            disabled={!s.checkedvalue}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2 min-w-[300px]">
                                            <Select value={s.model} onValueChange={(v) => handleRemarksSelect(i, v)} disabled={!s.checkedvalue}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select Remark" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {REMARKS_OPTIONS.map((opt, idx) => (
                                                        <SelectItem key={idx} value={opt} className="text-xs">{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Textarea
                                                value={s.eprD_Remarks || ''}
                                                onChange={e => handleRemarksChange(i, e.target.value)}
                                                disabled={!s.checkedvalue}
                                                rows={3}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-center mt-4 gap-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
