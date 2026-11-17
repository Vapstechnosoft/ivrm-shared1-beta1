'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IAttachment } from '@/types/upload/reports/classwork-upload-report';
import { Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface ViewAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    attachments: IAttachment[];
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
                    <DialogTitle>ClassWork Attachment Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[60vh] overflow-y-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[60px] text-center'>SL.NO</TableHead>
                                <TableHead className='text-center'>File Name/URL</TableHead>
                                <TableHead className='text-center'>Attachment View</TableHead>
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
                                        <TableCell>{att.icwatT_FileName}</TableCell>
                                        <TableCell className='text-center'>
                                            {att.icW_Attachment !== 'HyperLink' && (
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => handlePreview(att.icwatT_Attachment)}
                                                >
                                                    <Eye className='h-4 w-4' />
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <a href={att.icwatT_Attachment} target='_blank' rel='noopener noreferrer'>
                                                <Button variant='ghost' size='icon'>
                                                    <Download className='h-4 w-4' />
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {previewUrl && (
                    <div className='mt-4 border-t pt-4'>
                        <h4 className='mb-2 font-semibold'>Preview</h4>
                        <div className='aspect-video w-full'>
                            <iframe src={previewUrl} className='h-full w-full' title='Attachment Preview' />
                        </div>
                        <Button className='mt-2' variant='outline' onClick={() => setPreviewUrl(null)}>
                            Close Preview
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
