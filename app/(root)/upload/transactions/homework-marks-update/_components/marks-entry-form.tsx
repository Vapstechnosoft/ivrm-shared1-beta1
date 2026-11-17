'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { IHomeWork, IHomeWorkMarksList, IHomeWorkMarks } from '@/schemas/upload/transactions/ivrm-homework.schema';
import { fetchHomeWorkMarksList, saveHomeWorkMarks } from '@/server/upload/transactions/ivrm-homework/server-action';
import { Eye, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MarksEntryForm() {
    const { selectedRow } = useFormContext<IHomeWork>();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadStudents = async () => {
            if (selectedRow?.ihW_Id) {
                setIsLoading(true);
                try {
                    const result = await fetchHomeWorkMarksList({
                        asmaY_Id: selectedRow.asmaY_Id,
                        asmcL_Id: selectedRow.asmcL_Id,
                        asmS_Id: 0, // Injected or from row
                    } as any);
                    setStudents(result.gethomework_list || []);
                } catch (error) {
                    toast.error('Failed to load students');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadStudents();
    }, [selectedRow]);

    const handleMarksChange = (index: number, value: string) => {
        const updated = [...students];
        updated[index].IHWUPL_Marks = value;
        setStudents(updated);
    };

    const handleRemarksChange = (index: number, value: string) => {
        const updated = [...students];
        updated[index].IHWUPL_StaffRemarks = value;
        setStudents(updated);
    };

    const handleCheckChange = (index: number, checked: boolean) => {
        const updated = [...students];
        updated[index].checkedvalue = checked;
        setStudents(updated);
    };

    const onSave = async () => {
        const checkedStudents = students.filter(s => s.checkedvalue);
        if (checkedStudents.length === 0) {
            toast.warning('Please select at least one student');
            return;
        }

        try {
            const result = await saveHomeWorkMarks({
                ihW_Id: selectedRow?.ihW_Id,
                students: checkedStudents
            });
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to save marks');
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className='space-y-4'>
            <div className='overflow-x-auto rounded-md border'>
                <table className='w-full text-sm'>
                    <thead className='bg-muted'>
                        <tr>
                            <th className='p-3 text-center'>
                                <Checkbox
                                    onCheckedChange={(checked) => {
                                        setStudents(students.map(s => ({ ...s, checkedvalue: checked })));
                                    }}
                                />
                            </th>
                            <th className='p-3 text-left'>Student Name</th>
                            <th className='p-3 text-left'>Roll No</th>
                            <th className='p-3 text-left'>Adm No</th>
                            <th className='p-3 text-center'>View Attachment</th>
                            <th className='p-3 text-left'>Marks</th>
                            <th className='p-3 text-left'>Staff Upload</th>
                            <th className='p-3 text-left'>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className='border-t hover:bg-muted/50'>
                                <td className='p-3 text-center'>
                                    <Checkbox
                                        checked={student.checkedvalue}
                                        onCheckedChange={(checked) => handleCheckChange(index, checked as boolean)}
                                    />
                                </td>
                                <td className='p-3'>{student.studentname}</td>
                                <td className='p-3'>{student.rollyo}</td>
                                <td className='p-3'>{student.admNo}</td>
                                <td className='p-3 text-center'>
                                    {student.studentUploads?.length > 0 ? (
                                        <Button variant="ghost" size="sm" className='text-primary'>
                                            <Eye className='h-4 w-4 mr-1' /> View
                                        </Button>
                                    ) : '---'}
                                </td>
                                <td className='p-3'>
                                    <Input
                                        className='w-20'
                                        value={student.IHWUPL_Marks || ''}
                                        onChange={(e) => handleMarksChange(index, e.target.value)}
                                    />
                                </td>
                                <td className='p-3'>
                                    <Button variant="outline" size="sm" className='flex items-center'>
                                        <Upload className='h-3 w-3 mr-1' /> Upload
                                    </Button>
                                </td>
                                <td className='p-3'>
                                    <Input
                                        value={student.IHWUPL_StaffRemarks || ''}
                                        onChange={(e) => handleRemarksChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex justify-end'>
                <Button onClick={onSave} className='bg-green-600 hover:bg-green-700'>
                    <Save className='h-4 w-4 mr-2' /> Save Marks
                </Button>
            </div>
        </div>
    );
}

function Loader2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
