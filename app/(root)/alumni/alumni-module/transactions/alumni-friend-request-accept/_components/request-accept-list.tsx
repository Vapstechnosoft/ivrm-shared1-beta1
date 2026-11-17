'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { handleFriendRequestAction } from '@/server/alumni/alumni-friend-request';
import type { IAlumniFriendRequest } from '@/types/alumni/alumni-friend-request';
import { CheckCircle, Eye, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ViewProfileModal from './view-profile-modal';

interface RequestAcceptListProps {
    data: IAlumniFriendRequest[];
    isLoading: boolean;
    onRefresh: () => void;
}

export default function RequestAcceptList({ data, isLoading, onRefresh }: RequestAcceptListProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [viewingAlumni, setViewingAlumni] = useState<{ id: number; name: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const selectableIds = data.map((item) => item.ALMST_Id);

    const toggleSelectAll = () => {
        if (selectedIds.length === data.length && data.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectableIds);
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleAction = async (action: 'Accept' | 'Cancel') => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one request');
            return;
        }

        setIsProcessing(true);
        try {
            // Need to find the request dates for the selected IDs
            const requestData = selectedIds.map((id) => {
                const item = data.find((d) => d.ALMST_Id === id);
                return {
                    ALMST_Id: id,
                    ALSFRND_RequestDate: item?.ALSFRND_RequestDate || new Date().toISOString()
                };
            });

            const res = await handleFriendRequestAction({
                action: action,
                requestalumniaccept: requestData
            });

            if (res.success) {
                toast.success(action === 'Accept' ? 'Friend requests accepted successfully' : 'Requests canceled successfully');
                setSelectedIds([]);
                onRefresh();
            } else {
                toast.error(res.message || 'Action failed');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex h-48 items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-muted/50'>
                            <TableHead className='w-12 text-center'>
                                <Checkbox
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className='w-16 text-center'>SL No</TableHead>
                            <TableHead>Alumni Name</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-center'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                                    No incoming friend requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => {
                                return (
                                    <TableRow key={`${item.ALMST_Id}-${index}`}>
                                        <TableCell className='text-center'>
                                            <Checkbox
                                                checked={selectedIds.includes(item.ALMST_Id)}
                                                onCheckedChange={() => toggleSelect(item.ALMST_Id)}
                                            />
                                        </TableCell>
                                        <TableCell className='text-center'>{index + 1}</TableCell>
                                        <TableCell className='font-medium'>{item.studentname}</TableCell>
                                        <TableCell>{item.ASMAY_Year}</TableCell>
                                        <TableCell>
                                            {item.ALSFRND_AcceptedDate ? (
                                                item.ALSFRND_AcceptFlag === 'ACCEPT' ? (
                                                    <Badge variant='outline' className='border-green-200 bg-green-50 text-green-600'>
                                                        <CheckCircle className='mr-1 h-3 w-3' /> Accepted
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant='outline'
                                                        className='border-destructive/20 bg-destructive/5 text-destructive'>
                                                        <XCircle className='mr-1 h-3 w-3' /> Rejected
                                                    </Badge>
                                                )
                                            ) : (
                                                <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-600'>
                                                    In Progress
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => setViewingAlumni({ id: item.ALMST_Id, name: item.studentname })}
                                                title='View Profile'>
                                                <Eye className='h-4 w-4 text-primary' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center gap-4 pt-4'>
                <Button
                    onClick={() => handleAction('Accept')}
                    disabled={selectedIds.length === 0 || isProcessing}
                    className='min-w-[150px] bg-primary'>
                    {isProcessing ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <CheckCircle className='mr-2 h-4 w-4' />}
                    Accept Request
                </Button>
                <Button
                    variant='outline'
                    onClick={() => handleAction('Cancel')}
                    disabled={selectedIds.length === 0 || isProcessing}
                    className='min-w-[150px] border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700'>
                    {isProcessing ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <XCircle className='mr-2 h-4 w-4' />}
                    Cancel Request
                </Button>
            </div>

            {viewingAlumni && (
                <ViewProfileModal alumniId={viewingAlumni.id} alumniName={viewingAlumni.name} onClose={() => setViewingAlumni(null)} />
            )}
        </div>
    );
}
