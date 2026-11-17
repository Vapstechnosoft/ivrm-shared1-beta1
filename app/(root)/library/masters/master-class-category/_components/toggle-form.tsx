'use client';

import { AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { useMasterClassCategory } from '@/hooks/library/useMasters';
import { deactivateMasterClassCategory } from '@/server/library/masters/class-category';
import type { IMasterClassCategory } from '@/types/library/masters/class-category';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ToggleClassCategoryFormProps {
    rowData: IMasterClassCategory;
    onClose: () => void;
}

export default function ToggleClassCategoryForm({ rowData, onClose }: ToggleClassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();

    const mutation = useMutation({
        mutationFn: deactivateMasterClassCategory,
        onSuccess: async (data) => {
            if (data.returnval) {
                toast.success(`Record ${rowData.lmcC_ActiveFlag ? 'Deactivated' : 'Activated'} Successfully!!!`);
                await refetchAll();
                onClose();
            } else {
                toast.error(`Record Not ${rowData.lmcC_ActiveFlag ? 'Deactivated' : 'Activated'} Successfully!!!`);
            }
        },
        onError: (error) => {
            toast.error('Failed to update status');
            console.error(error);
        }
    });

    const handleConfirm = () => {
        mutation.mutate(rowData);
    };

    return (
        <AdaptiveDialog
            title={rowData.lmcC_ActiveFlag ? 'Deactivate Class Category' : 'Activate Class Category'}
            isOpen={true}
            onClose={onClose}>
            <div className='flex flex-col gap-4'>
                <p>
                    Are you sure you want to {rowData.lmcC_ActiveFlag ? 'deactivate' : 'activate'} the record{' '}
                    <span className='font-bold'>{rowData.lmcC_CategoryName}</span>?
                </p>
                <div className='flex justify-end gap-4'>
                    <Button variant='outline' onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant={rowData.lmcC_ActiveFlag ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={mutation.isPending}>
                        {mutation.isPending
                            ? rowData.lmcC_ActiveFlag
                                ? 'Deactivating...'
                                : 'Activating...'
                            : rowData.lmcC_ActiveFlag
                                ? 'Yes, Deactivate'
                                : 'Yes, Activate'}
                    </Button>
                </div>
            </div>
        </AdaptiveDialog>
    );
}
