'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { INoticeBoardAttachment } from '@/types/upload/reports/noticeboard-report';
import { Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface ViewAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    attachments: INoticeBoardAttachment[];
}

export const ViewAttachmentModal = ({ isOpen, onClose, attachments }: ViewAttachmentModalProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handlePreview = (url: string) => {
        setPreviewUrl(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-4xl'>
                <DialogHeader>
                    <DialogTitle>Notice Board AttachmentDetails</DialogTitle>
                </DialogHeader>

                <div className='max-h-[60vh] overflow-y-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[60px] text-center'>SLNO</TableHead>
                                <TableHead>File Name/URL</TableHead>
                                <TableHead className='text-center'>View/Click</TableHead>
                                <TableHead className='text-center'>Download</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className='text-center'>
                                        No attachments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attachments.map((att, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='text-center'>{index + 1}</TableCell>
                                        <TableCell>{att.intbfL_FileName}</TableCell>
                                        <TableCell className='text-center'>
                                            {att.intB_Attachment === 'HyperLink' ? (
                                                <a
                                                    href={att.intbfL_FilePath}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-primary hover:underline'
                                                >
                                                    Click Here
                                                </a>
                                            ) : (
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handlePreview(att.intbfL_FilePath)}
                                                >
                                                    <Eye className='h-4 w-4' />
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {att.intB_Attachment !== 'HyperLink' ? (
                                                <a href={att.intbfL_FilePath} target='_blank' rel='noopener noreferrer'>
                                                    <Button variant='ghost' size='icon'>
                                                        <Download className='h-4 w-4' />
                                                    </Button>
                                                </a>
                                            ) : (
                                                '--'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {previewUrl && (
                    <div className='mt-4 border-t pt-4'>
                        <div className='mb-2 flex items-center justify-between'>
                            <h4 className='font-semibold'>Preview</h4>
                            <Button variant='outline' size='sm' onClick={() => setPreviewUrl(null)}>
                                Close Preview
                            </Button>
                        </div>
                        <div className='aspect-video w-full rounded border'>
                            <iframe src={previewUrl} className='h-full w-full' title='Attachment Preview' />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
