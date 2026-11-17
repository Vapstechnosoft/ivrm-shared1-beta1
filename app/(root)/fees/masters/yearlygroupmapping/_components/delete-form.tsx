'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useMasterAllFeeHead } from '@/hooks/fees/useMasters';
import { deleteYearlyGroupMapping } from '@/server/fees/masters/yearly_group_mapping';
import type { IFeeGroupMapping } from '@/types/fees/masters/masters';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteMasterOnlinePaymentHeadGroupFormProps {
    rowData: IFeeGroupMapping;
    fyghM_Id: number;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DeleteMasterYearlyGroupForm({
    rowData,
    fyghM_Id,
    onClose,
    onSuccess
}: DeleteMasterOnlinePaymentHeadGroupFormProps) {
    const asmay_Id = rowData.asmaY_Id;
    const { refetchAll } = useMasterAllFeeHead(asmay_Id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await deleteYearlyGroupMapping(fyghM_Id);

            if (response?.success) {
                toast.success(`${rowData.fmG_GroupName} deleted successfully`);
                await refetchAll();
                onSuccess?.();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete record');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Online Payment Head Group Mapping'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5 '>
                    <Label>
                        Are you sure you want to delete <strong>{rowData.fmG_GroupName}</strong>?
                    </Label>

                    {/* <div className='bg-destructive/10 border border-destructive/30 rounded-md p-3 text-destructive text-sm'>
             This action cannot be undone. It will be permanently deleted
                    </div> */}
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
