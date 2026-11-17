'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ViewFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    files: any[];
    type: string;
}

export default function ViewFilesModal({ isOpen, onClose, files, type }: ViewFilesModalProps) {
    const getFileIcon = (fileName: string) => {
        // Logic to return icon based on extension if needed
        return null;
    };

    const openFile = (url: string, fileName: string) => {
        // Logic to open file. For cloud hosted files, window.open might suffice.
        // For documents (doc, xls, ppt), we might need the office viewer link as in legacy code.
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext || '')) {
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`, '_blank');
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>View Uploaded Files - {type}</DialogTitle>
                </DialogHeader>

                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-muted'>
                                <th className='border p-2 text-center'>SL.NO</th>
                                <th className='border p-2 text-left'>File Name</th>
                                <th className='border p-2 text-center'>View</th>
                                {/* Action (Delete) logic is usually for edit mode, not view-only, but legacy had delete here? 
                                    Legacy had delete in "VIEW UPLOADED FILE" modal. 
                                    If we need delete here, we need a handler. For now, assume read-only or add delete later.
                                */}
                            </tr>
                        </thead>
                        <tbody>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <tr key={file.lpmtR_Id || index} className='hover:bg-muted/50'>
                                        <td className='border p-2 text-center'>{index + 1}</td>
                                        <td className='border p-2'>{file.lpmtR_FileName}</td>
                                        <td className='border p-2 text-center'>
                                            <Button
                                                variant='link'
                                                onClick={() => openFile(file.lpmtR_Resources, file.lpmtR_FileName)}
                                                className='text-blue-600 underline'>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className='p-4 text-center'>
                                        No files found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
