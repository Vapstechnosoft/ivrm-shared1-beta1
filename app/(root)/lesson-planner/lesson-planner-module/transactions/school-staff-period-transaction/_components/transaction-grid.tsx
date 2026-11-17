'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadDocument } from '@/server/document_upload';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ISchoolStaffPeriodTransactionGridItem } from '../../../../../../../types/lesson-planner/transactions/school-staff-period-transaction';

export default function TransactionGrid({
    data,
    onSave,
    onCancel
}: {
    data: ISchoolStaffPeriodTransactionGridItem[];
    onSave: (items: ISchoolStaffPeriodTransactionGridItem[]) => void;
    onCancel: () => void;
}) {
    const [items, setItems] = useState<ISchoolStaffPeriodTransactionGridItem[]>(data);

    const handleCheckboxChange = (index: number, checked: boolean) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], Selected: checked };
        setItems(newItems);
    };

    const handleDateChange = (index: number, dateString: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], lpcswA_TakenDate: dateString };
        setItems(newItems);
    };

    const handleFileUpload = async (index: number, file: File) => {
        if (file.size > 5242880) {
            // 5MB
            toast.error('File size should be less than 5 MB');
            return;
        }
        if (file.type !== 'application/pdf') {
            toast.error('Kindly Select Only PDF Format');
            return;
        }

        const formData = new FormData();
        formData.append('File', file);

        try {
            const response: any = await uploadDocument(formData);
            const path = response.data || response; // Handle both wrapped and direct cases
            const newItems = [...items];
            newItems[index] = {
                ...newItems[index],
                estmanssH_FileLocation: path,
                estmanssH_AnswerSheet: file.name
            };
            setItems(newItems);
            toast.success('File Uploaded');
        } catch (e) {
            toast.error('File Upload Failed');
        }
    };

    const handleViewFile = (path: string) => {
        if (path) window.open(path, '_blank');
    };

    const handleSubmit = () => {
        const selected = items.filter((i) => i.Selected);
        if (selected.length === 0) {
            toast.error('Select At least One Transaction To Save');
            return;
        }
        // Validate date
        if (selected.some((i) => !i.lpcswA_TakenDate)) {
            toast.error('Select Date for selected items');
            return;
        }
        onSave(selected);
    };

    return (
        <div className='space-y-4'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[50px]'>SL.NO.</TableHead>
                            <TableHead className='w-[50px] text-center'>Select</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead>Completed Date</TableHead>
                            <TableHead>Upload File</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={`row-${index}`}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className='text-center'>
                                    <Checkbox
                                        checked={item.Selected || false}
                                        onCheckedChange={(checked) => handleCheckboxChange(index, checked === true)}
                                    />
                                </TableCell>
                                <TableCell>{item.alldates ? format(new Date(item.alldates), 'yyyy-MM-dd') : ''}</TableCell>
                                <TableCell>{item.topicname}</TableCell>
                                <TableCell>
                                    <Input
                                        type='date'
                                        disabled={!item.Selected}
                                        value={item.lpcswA_TakenDate ? format(new Date(item.lpcswA_TakenDate), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleDateChange(index, e.target.value)}
                                        min={item.minDatedof ? format(new Date(item.minDatedof), 'yyyy-MM-dd') : undefined}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <div className='relative'>
                                            <Input
                                                type='file'
                                                accept='.pdf'
                                                disabled={!item.Selected}
                                                className='w-[200px]'
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) handleFileUpload(index, e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                        {item.estmanssH_FileLocation && (
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='text-red-500 hover:bg-red-50 hover:text-red-700'
                                                onClick={() => handleViewFile(item.estmanssH_FileLocation!)}>
                                                <Eye className='h-4 w-4' />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center gap-2'>
                <Button onClick={handleSubmit}>Save</Button>
                <Button variant='outline' onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
