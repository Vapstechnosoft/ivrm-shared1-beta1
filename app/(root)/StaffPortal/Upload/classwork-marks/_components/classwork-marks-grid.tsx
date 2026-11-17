'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Download, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import type { ITopic, IStudentMarks, IStudentUploadDetail, IClassWorkMarksSave } from '@/types/staff-portal/classwork-marks';
import { toast } from 'sonner';

interface ClassWorkMarksGridProps {
    topicList: ITopic[];
    onTopicSelect: (topicId: number) => void;
    studentList: IStudentMarks[];
    onSave: (data: IClassWorkMarksSave) => void;
    onViewStudentUpload: (data: { AMST_Id: number; ICW_Id: number; ICWUPL_Id: number }) => Promise<{ viewstudentupload: IStudentUploadDetail[] }>;
}

export default function ClassWorkMarksGrid({
    topicList,
    onTopicSelect,
    studentList,
    onSave,
    onViewStudentUpload
}: ClassWorkMarksGridProps) {
    const [selectedTopic, setSelectedTopic] = useState<string>('0');
    const [students, setStudents] = useState<IStudentMarks[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [studentUploads, setStudentUploads] = useState<IStudentUploadDetail[]>([]);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    // Sync studentList prop to local state when it changes
    React.useEffect(() => {
        setStudents(studentList.map(s => ({ ...s, checkedvalue: s.ICWUPL_Marks ? true : false })));
    }, [studentList]);

    const handleTopicChange = (val: string) => {
        setSelectedTopic(val);
        onTopicSelect(Number(val));
    };

    const handleCheck = (index: number, checked: boolean) => {
        const newStudents = [...students];
        newStudents[index].checkedvalue = checked;
        setStudents(newStudents);
    };

    const handleMarksChange = (index: number, val: string) => {
        const newStudents = [...students];
        newStudents[index].ICWUPL_Marks = val;
        setStudents(newStudents);
    };

    const handleRemarksChange = (index: number, val: string) => {
        const newStudents = [...students];
        newStudents[index].ICWUPL_StaffRemarks = val;
        setStudents(newStudents);
    };

    // File upload simulation - in real app would use a handler to upload first or stick file obj in state
    // Here we'll just log or set a dummy 'uploaded' state visual
    const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newStudents = [...students];
            newStudents[index].FileName1 = e.target.files[0].name;
            // newStudents[index].ICW_FilePath1 = URL.createObjectURL(e.target.files[0]); // Mock path
            // In real scenario we upload here or before save.
            setStudents(newStudents);
        }
    };

    const handleSave = () => {
        const selected = students.filter(s => s.checkedvalue);
        if (selected.length === 0) {
            toast.error('Select at least one student');
            return;
        }

        const payload: IClassWorkMarksSave = {
            getclasswork_list_array: selected.map(s => ({
                AMST_Id: s.AMST_Id,
                ICW_Id: s.ICW_Id,
                Marks: s.ICWUPL_Marks,
                ICWUPL_FileName: s.FileName1,
                ICWUPL_StaffUplaod: s.ICW_FilePath1, // Needs real path from upload
                ICWUPL_StaffRemarks: s.ICWUPL_StaffRemarks,
                ICWUPL_Id: s.ICWUPL_Id
            }))
        };
        onSave(payload);
    };

    const viewUploads = async (student: IStudentMarks) => {
        try {
            const res = await onViewStudentUpload({
                AMST_Id: student.AMST_Id,
                ICW_Id: student.ICW_Id,
                ICWUPL_Id: student.ICWUPL_Id
            });
            setStudentUploads(res.viewstudentupload || []);
            setUploadDialogOpen(true);
        } catch (e) { console.error(e); }
    };

    const filteredStudents = students.filter(s =>
        s.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ICW_Topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Topic Selection & Search</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                        <div className="w-full md:w-1/3">
                            <Label>Topic</Label>
                            <Select value={selectedTopic} onValueChange={handleTopicChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">All</SelectItem>
                                    {topicList.map(t => (
                                        <SelectItem key={t.ICW_Id} value={String(t.ICW_Id)}>{t.ICW_Topic}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-1/3">
                            <Input placeholder="Search Student..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {students.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Student List</CardTitle></CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Select</TableHead>
                                        <TableHead>SL No</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Sub Topic</TableHead>
                                        <TableHead>Upload Date</TableHead>
                                        <TableHead className="text-center">Student Upload</TableHead>
                                        <TableHead>Marks</TableHead>
                                        <TableHead>Staff Upload</TableHead>
                                        <TableHead>Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((s, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Checkbox checked={s.checkedvalue} onCheckedChange={(c) => handleCheck(i, c as boolean)} />
                                            </TableCell>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{s.studentname}</TableCell>
                                            <TableCell>{s.ISMS_SubjectName}</TableCell>
                                            <TableCell>{s.ICW_Topic}</TableCell>
                                            <TableCell>{s.ICW_SubTopic}</TableCell>
                                            <TableCell>{s.ICWUPL_Date ? format(new Date(s.ICWUPL_Date), 'dd/MM/yyyy') : '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <Button variant="ghost" size="sm" onClick={() => viewUploads(s)}>
                                                    <Eye className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="w-20"
                                                    value={s.ICWUPL_Marks || ''}
                                                    onChange={e => handleMarksChange(i, e.target.value)}
                                                    disabled={!s.checkedvalue}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {s.checkedvalue && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={`file-${i}`} className="cursor-pointer bg-blue-600 text-white px-2 py-1 rounded text-xs text-center">
                                                            Upload
                                                            <Input id={`file-${i}`} type="file" className="hidden" onChange={e => handleFileSelect(i, e)} />
                                                        </Label>
                                                        {s.FileName1 && <span className="text-xs truncate max-w-[100px]">{s.FileName1}</span>}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Textarea
                                                    className="min-h-[40px]"
                                                    value={s.ICWUPL_StaffRemarks || ''}
                                                    onChange={e => handleRemarksChange(i, e.target.value)}
                                                    disabled={!s.checkedvalue}
                                                    placeholder="Remarks"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button onClick={handleSave}>Save Marks</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Student Uploads</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        {studentUploads.map((u, i) => (
                            <div key={i} className="flex justify-between items-center border p-2">
                                <span>{u.icwupL_FileName}</span>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={u.icwupL_Attachment} target="_blank" rel="noreferrer">View</a>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={u.icwupL_Attachment} download>Download</a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {studentUploads.length === 0 && <p className="text-center text-muted-foreground">No uploads found.</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
