'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadDocument } from '@/server/document_upload';
import type { IDateItem, ITopic } from '@/types/lesson-planner/transactions/school-staff-period-mapping';
import { format } from 'date-fns';
import { Eye, FileUp, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MappingTableProps {
    dates: IDateItem[];
    topics: ITopic[];
    onSave: (data: any[]) => void;
    isLoading?: boolean;
}

export default function MappingTable({ dates, topics, onSave, isLoading }: MappingTableProps) {
    const [localDates, setLocalDates] = useState<IDateItem[]>(dates);
    const [isUploading, setIsUploading] = useState<number | null>(null);

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    // Keep local state in sync with props
    useEffect(() => {
        setLocalDates(dates);
    }, [dates]);

    const handleCheckboxChange = (index: number, checked: boolean) => {
        const updated = [...localDates];
        updated[index] = { ...updated[index], Selected: checked };
        setLocalDates(updated);
    };

    const handleTopicChange = (index: number, topicId: string) => {
        const updated = [...localDates];
        updated[index] = { ...updated[index], lpmT_Id: Number(topicId) };
        setLocalDates(updated);
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            return;
        }

        setIsUploading(index);
        const formData = new FormData();
        formData.append('File', file);
        formData.append('folder', 'Staff_Period_Mapping');

        try {
            const res: any = await uploadDocument(formData);
            let path = '';

            // Handle different possible response formats from uploadDocument
            if (typeof res === 'string') path = res;
            else if (res?.path) path = res.path;
            else if (res?.data) {
                if (Array.isArray(res.data) && res.data.length > 0) path = res.data[0].path || res.data[0];
                else if (typeof res.data === 'string') path = res.data;
                else if (res.data?.path) path = res.data.path;
            }

            if (path) {
                const updated = [...localDates];
                updated[index].estmanssH_AnswerSheet = file.name;
                updated[index].estmanssH_FileLocation = path;
                setLocalDates(updated);
                toast.success(`File "${file.name}" uploaded successfully`);
            } else {
                toast.error('File upload failed - No path returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(null);
            e.target.value = '';
        }
    };

    const handleSave = () => {
        const selected = localDates.filter((d) => {
            const isSelected = d.Selected;
            const topicId = findValue(d, ['lpmT_Id', 'LPMT_Id', 'topicId']);
            return isSelected && Number(topicId) > 0;
        });

        if (selected.length === 0) {
            toast.error('Please select at least one date and topic');
            return;
        }

        const payload = selected.map((d) => {
            const id = findValue(d, ['lplP_Id', 'LPLP_Id', 'mappingId']) || 0;
            const date = findValue(d, ['alldates', 'LPLP_LPDate', 'allDates', 'date']);
            const topicId = findValue(d, ['lpmT_Id', 'LPMT_Id', 'topicId']);
            const fileName = findValue(d, ['estmanssH_AnswerSheet', 'UnitFileAttachment', 'attachment', 'fileName']);
            const fileLocation = findValue(d, ['estmanssH_FileLocation', 'UnitFileLocation', 'location', 'filePath']);

            const item: any = {
                lplP_Id: Number(id)
            };

            if (Number(id) === 0 && date) {
                item.lplP_LPDate = format(new Date(date), 'yyyy-MM-dd');
            } else if (date) {
                item.lplP_LPDate = format(new Date(date), 'yyyy-MM-dd');
            }

            item.lpmT_Id = topicId?.toString();

            if (fileName) item.unitFileAttachment = fileName;
            if (fileLocation) item.unitFileLocation = fileLocation;

            return item;
        });

        onSave(payload);
    };

    return (
        <div className='space-y-4'>
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader className='bg-muted/50'>
                        <TableRow>
                            <TableHead className='w-[50px] text-center'>SL.NO.</TableHead>
                            <TableHead className='w-[50px] text-center'>Select</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className='min-w-[200px]'>Topic</TableHead>
                            <TableHead className='w-[150px]'>Attachment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {localDates.map((item, index) => {
                            const dateValue = findValue(item, ['alldates', 'LPLP_LPDate', 'allDates', 'date']);
                            const isTaken = findValue(item, ['lplP_ClassTakenFlg', 'LPLP_ClassTakenFlg', 'isClassTaken']) === 1;
                            const topicId = findValue(item, ['lpmT_Id', 'LPMT_Id', 'topicId']);
                            const location = findValue(item, ['estmanssH_FileLocation', 'UnitFileLocation', 'location', 'filePath']);

                            return (
                                <TableRow key={index}>
                                    <TableCell className='text-center'>{index + 1}</TableCell>
                                    <TableCell className='text-center'>
                                        <Checkbox
                                            checked={!!item.Selected}
                                            onCheckedChange={(checked) => handleCheckboxChange(index, !!checked)}
                                            disabled={isTaken}
                                        />
                                    </TableCell>
                                    <TableCell>{dateValue ? format(new Date(dateValue), 'yyyy-MM-dd') : '-'}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={topicId?.toString() || ''}
                                            onValueChange={(val: string) => handleTopicChange(index, val)}
                                            disabled={!item.Selected || isTaken}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Topic' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {topics.map((t) => {
                                                    const tId = findValue(t, ['lpmT_Id', 'LPMT_Id', 'topicId']);
                                                    const tName = findValue(t, ['lpmT_TopicName', 'LPMT_TopicName', 'topicName']);
                                                    return (
                                                        <SelectItem key={tId} value={tId?.toString() || ''}>
                                                            {tName}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <div className='relative'>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    disabled={!item.Selected || isUploading === index}
                                                    type='button'>
                                                    {isUploading === index ? (
                                                        <Loader2 className='h-4 w-4 animate-spin' />
                                                    ) : (
                                                        <FileUp className='h-4 w-4' />
                                                    )}
                                                </Button>
                                                <Input
                                                    type='file'
                                                    className='absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed'
                                                    accept='.pdf'
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(index, e)}
                                                    disabled={!item.Selected || isUploading !== null}
                                                />
                                            </div>
                                            {location && (
                                                <Button variant='ghost' size='icon' type='button' onClick={() => window.open(location)}>
                                                    <Eye className='h-4 w-4 text-primary' />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center'>
                <Button onClick={handleSave} disabled={isLoading} size='lg'>
                    <Save className='mr-2 h-4 w-4' /> Save Mapping
                </Button>
            </div>
        </div>
    );
}
