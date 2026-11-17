'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deleteAdmissionForm } from '@/server/admission/admission-form/admission';
import type { IadmissionStudentApplicationList } from '@/types/admission/admission';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DeleteMasterClassForm({ row, cell }: { row?: any; cell?: any }) {
    const data = cell?.getValue ? cell.getValue() : row;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IadmissionStudentApplicationList | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpen = () => {
        setSelectedRow(data);
        setIsDialogOpen(true);
    };

    function closeDialog() {
        setIsDialogOpen(false);
        setSelectedRow(null);
    }

    async function onDelete() {
        try {
            setIsDeleting(true);
            // prefer common id shapes: amsT_Id, AMST_Id, amst_Id, amsTId, id
            const id = Number(selectedRow?.amsT_Id ?? 0) || 0;

            if (!id) return toast.error('Unable to determine admission id for delete');

            const response: any = await deleteAdmissionForm(id as number);

            if (response?.success) {
                toast.success(response.message ?? 'Deleted successfully');
                closeDialog();
                // best-effort refresh
                window.location.reload();
            } else {
                toast.error(response?.message ?? 'Delete failed');
            }
        } catch (error: any) {
            toast.error(error?.message ?? 'Delete failed');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex items-center gap-2 rounded-md px-2 py-1 transition-all duration-200 hover:bg-gray-50'>
                        <Button type='button' variant='ghost' size='sm' onClick={handleOpen} className='p-1'>
                            <Trash2 className='h-4 w-4 text-red-600' />
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            {selectedRow && (
                <AdaptiveDialog title='Delete Admission' isOpen={isDialogOpen} onClose={closeDialog}>
                    <div className='flex flex-col gap-4'>
                        <AdaptiveBody className='flex flex-col gap-5'>
                            <p>Are you sure you want to delete {selectedRow.studentName}?</p>
                        </AdaptiveBody>
                        <AdaptiveFooter>
                            <Button variant='secondary' onClick={closeDialog} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button type='button' onClick={onDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </AdaptiveFooter>
                    </div>
                </AdaptiveDialog>
            )}
        </>
    );
}
