'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Label } from '@/components/ui/extension/field';
import { useMasterYearlyCategory } from '@/hooks/fees/useMasters';
import { toggleMasterclassYearlyCategory } from '@/server/fees/masters/class_yearly_category'; // Using same API
import type { IMasterClassYearlyList } from '@/types/fees/masters/masters';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteMasterClassFormProps {
    rowData: IMasterClassYearlyList;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DeleteMasterClassForm({ rowData, onClose, onSuccess }: DeleteMasterClassFormProps) {
    const { refetch, refetchAll } = useMasterYearlyCategory();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Prefer the yearly-class category id (fyccC_Id) but accept common variants.
            // Use the yearly-class category id from the table: prefer `fyccC_Id` (or `FYCC_Id`).
            // Do NOT fall back to `fmcC_Id` here — the API expects the yearly category id (fyccC_Id).
            const idToToggle = Number((rowData as any).fyccC_Id ?? (rowData as any).FYCC_Id ?? 0);

            if (!idToToggle) {
                setIsSubmitting(false);
                toast.error('Invalid record id. Cannot delete.');
                return;
            }

            const response = await toggleMasterclassYearlyCategory(idToToggle);

            if (response?.success) {
                // pick a friendly name field from the row for the success message
                const itemName =
                    (rowData as any).fmcC_ClassCategoryName ??
                    (rowData as any).fmcC_ConcessionName ??
                    (rowData as any).fmcC_ClassCategoryName ??
                    'Record';
                toast.success(`${itemName} successfully deleted`);
                // refetch from local hook and call parent success handler (if provided)
                try {
                    await refetch();
                    onSuccess?.(); // Move this inside try block to ensure it only runs after successful refetch
                } catch (e) {
                    console.warn('Local refetch failed after delete:', e);
                    onSuccess?.();
                }

                onSuccess?.();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete category');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Error deleting master class category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title={'Delete Master Class Category'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <Label>
                        Are you sure you want to delete{' '}
                        <strong>
                            {rowData.fmcC_ClassCategoryName} ({rowData.asmaY_Year})
                        </strong>
                        ?
                    </Label>
                    <div className='text-muted-foreground text-sm'>
                        Classes: {(() => {
                            try {
                                const parsed = JSON.parse(rowData.asmcL_ClassName);
                                return Array.isArray(parsed) ? parsed.join(', ') : rowData.asmcL_ClassName;
                            } catch {
                                return rowData.asmcL_ClassName;
                            }
                        })()}
                    </div>
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
