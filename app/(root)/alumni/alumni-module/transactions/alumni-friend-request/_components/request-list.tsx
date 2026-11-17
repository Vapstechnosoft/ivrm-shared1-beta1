'use client';

import ViewProfileModal from '@/app/(root)/alumni/alumni-module/transactions/alumni-friend-request/_components/view-profile-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sendFriendRequest } from '@/server/alumni/alumni-friend-request';
import type { IAlumniFriendRequest } from '@/types/alumni/alumni-friend-request';
import { Eye, Loader2, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface RequestListProps {
    data: IAlumniFriendRequest[];
    isLoading: boolean;
    onRefresh: () => void;
}

export default function RequestList({ data, isLoading, onRefresh }: RequestListProps) {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [viewingAlumniId, setViewingAlumniId] = useState<number | null>(null);
    const [viewingAlumniName, setViewingAlumniName] = useState<string>('');
    const [isSending, setIsSending] = useState(false);

    // Selectable items are those that have NOT yet received a request (checktru is false)
    const selectableData = useMemo(() => data.filter((d) => !d.checktru), [data]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(selectableData.map((d) => d.ALMST_Id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        const next = new Set(selectedRows);
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
        setSelectedRows(next);
    };

    const isAllSelected = selectableData.length > 0 && selectedRows.size === selectableData.length;

    const handleSendRequests = async () => {
        if (selectedRows.size === 0) {
            toast.error('Please select at least one record');
            return;
        }

        setIsSending(true);
        try {
            const requestalumni = Array.from(selectedRows).map((id) => ({ almsT_Id: id }));
            const res = await sendFriendRequest({
                requestalumni
            });
            if (res.success) {
                toast.success('Friend requests sent successfully');
                setSelectedRows(new Set());
                onRefresh();
            } else {
                toast.error(res.message || 'Failed to send requests');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading && data.length === 0) {
        return (
            <div className='flex justify-center p-12'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }

    if (data.length === 0) {
        return <div className='py-12 text-center text-muted-foreground'>No alumni found based on your search.</div>;
    }

    return (
        <div className='space-y-4'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-12 text-center'>
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={(v) => handleSelectAll(!!v)}
                                    // Disable select all if there are no selectable items
                                    disabled={selectableData.length === 0}
                                />
                            </TableHead>
                            <TableHead>SL NO</TableHead>
                            <TableHead>Alumni Name</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-center'>View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, idx) => (
                            <TableRow key={row.ALMST_Id}>
                                <TableCell className='text-center'>
                                    <Checkbox
                                        // Disable if request already sent (checktru is true)
                                        disabled={row.checktru}
                                        checked={selectedRows.has(row.ALMST_Id)}
                                        onCheckedChange={(v) => handleSelectRow(row.ALMST_Id, !!v)}
                                    />
                                </TableCell>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className='font-medium'>{row.studentname}</TableCell>
                                <TableCell>{row.ASMAY_Year}</TableCell>
                                <TableCell>
                                    {row.ALSFRND_AcceptFlag === 'ACCEPT' ? (
                                        <span className='font-medium text-green-600 italic' title='Accepted'>
                                            Accepted
                                        </span>
                                    ) : row.ALSFRND_AcceptFlag === 'REJECT' ? (
                                        <span className='font-medium text-red-600 italic' title='Rejected'>
                                            Rejected
                                        </span>
                                    ) : row.ALSFRND_RequestDate ? (
                                        <span className='font-medium text-pink-600 italic' title='Requesting...'>
                                            Requesting...
                                        </span>
                                    ) : (
                                        <span className='text-muted-foreground text-xs italic'>-</span>
                                    )}
                                </TableCell>
                                <TableCell className='text-center'>
                                    {row.ALSFRND_AcceptFlag === 'ACCEPT' && (
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                                setViewingAlumniId(row.ALMST_Id);
                                                setViewingAlumniName(row.studentname);
                                            }}
                                            className='text-primary hover:bg-primary/5 hover:text-primary/80'>
                                            <Eye className='mr-1 h-4 w-4' /> View
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className='flex justify-center border-t pt-4'>
                <Button
                    size='lg'
                    onClick={handleSendRequests}
                    disabled={selectedRows.size === 0 || isSending}
                    className='min-w-[200px]'
                    isLoading={isSending}>
                    <Send className='mr-2 h-4 w-4' /> Send Request
                </Button>
            </div>

            {viewingAlumniId && (
                <ViewProfileModal alumniId={viewingAlumniId} alumniName={viewingAlumniName} onClose={() => setViewingAlumniId(null)} />
            )}
        </div>
    );
}
