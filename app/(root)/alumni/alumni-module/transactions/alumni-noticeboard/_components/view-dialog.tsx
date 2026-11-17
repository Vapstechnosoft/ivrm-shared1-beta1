'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { viewAlumniNoticeBoard } from '@/server/alumni/alumni-notice-board';
import type { IAlumniNoticeBoard } from '@/types/alumni/alumni-notice-board';
import { Eye, FileIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ViewAttachmentDialogProps {
    rowData: IAlumniNoticeBoard;
    onClose: () => void;
}

export default function ViewAttachmentDialog({ rowData, onClose }: ViewAttachmentDialogProps) {
    const [attachments, setAttachments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAttachments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response: any = await viewAlumniNoticeBoard(rowData.alntB_Id);
            // Handling various response structures
            console.info('View Dialog Response:', response);
            if (response?.attachementlist) {
                setAttachments(response.attachementlist);
            } else if (response?.attachment_Array) {
                setAttachments(response.attachment_Array);
            } else if (Array.isArray(response)) {
                setAttachments(response);
            } else if (response?.success && Array.isArray(response?.data)) {
                // Correctly handle the case where data is the array of files
                setAttachments(response.data);
            } else if (response?.data?.attachementlist) {
                setAttachments(response.data.attachementlist);
            } else if (response?.data?.attachment_Array) {
                setAttachments(response.data.attachment_Array);
            } else {
                // Fallback to what's already in rowData if API fails or returns empty
                setAttachments(rowData.attachment_Array || []);
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error: any) {
            toast.error('Failed to load attachments');
            setAttachments(rowData.attachment_Array || []);
        } finally {
            setIsLoading(false);
        }
    }, [rowData.alntB_Id, rowData.attachment_Array]);

    useEffect(() => {
        fetchAttachments();
    }, [fetchAttachments]);

    return (
        <AdaptiveDialog title={`Attachments: ${rowData.alntB_Title}`} isOpen={true} onClose={onClose}>
            <AdaptiveBody className='min-h-[200px]'>
                {isLoading ? (
                    <div className='flex h-full items-center justify-center py-10'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    </div>
                ) : attachments.length > 0 ? (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {attachments.map((file, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50'>
                                <div className='flex items-center gap-3 overflow-hidden'>
                                    <div className='rounded bg-primary/10 p-2'>
                                        <FileIcon className='h-5 w-5 text-primary' />
                                    </div>
                                    <div className='flex flex-col overflow-hidden'>
                                        <span className='max-w-[150px] truncate font-medium text-sm'>
                                            {file.alntbfL_FileName || `Attachment ${index + 1}`}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    href={file.alntbfL_FilePath}
                                    {...({ target: '_blank', rel: 'noopener noreferrer' } as any)}>
                                    <Eye className='mr-2 h-4 w-4' />
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex h-full flex-col items-center justify-center py-10 text-muted-foreground'>
                        <FileIcon className='mb-2 h-12 w-12 opacity-20' />
                        <p>No attachments found for this notice.</p>
                    </div>
                )}
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button variant='outline' onClick={onClose}>
                    Close
                </Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
