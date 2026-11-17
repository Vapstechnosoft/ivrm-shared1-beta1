'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useFeeOtherStudent } from '@/hooks/fees/useMasters';
import { deleteFeeOtherStudent } from '@/server/fees/masters/fee_other_student';
import type { MasterFeeOtherStudentType } from '@/types/fees/masters/masters';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteFeeOtherStudentFormProps {
    rowData: MasterFeeOtherStudentType;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DeleteFeeOtherStudentForm({ rowData, onClose, onSuccess }: DeleteFeeOtherStudentFormProps) {
    const { refetchAll } = useFeeOtherStudent();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await deleteFeeOtherStudent(rowData.fmosT_Id);

            if (response.success) {
                toast.success(`${rowData.fmosT_StudentName} deleted successfully`);
                await refetchAll();
                onSuccess?.();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to delete record');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Fee Other Student'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5 '>
                    <Label>
                        Are you sure you want to delete <strong>{rowData.fmosT_StudentName}</strong>?
                    </Label>
                </AdaptiveBody>

                <AdaptiveFooter className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={closeDialog}
                        disabled={isSubmitting}
                        className='w-fit transition-all duration-200 hover:scale-105'>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        variant='destructive'
                        className='w-fit transition-all duration-200 hover:scale-105'>
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
