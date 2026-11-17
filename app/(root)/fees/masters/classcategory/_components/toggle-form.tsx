'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterClassCategory } from '@/hooks/fees/useMasters';
import { masterClassCategorySchema } from '@/schemas/fees/masters';
import { toggleMasterclassCategory } from '@/server/fees/masters/class_category';
import type { IMasterCasteCategoryList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormFields = {
    fmcC_Id?: number | string;
};

interface toggleMasterclassCategoryFormProps {
    rowData: IMasterCasteCategoryList;
    onClose: () => void;
}

export default function toggleMasterclassCategoryForm({ rowData, onClose }: toggleMasterclassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();
    const isActive = rowData.fmcC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassCategorySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Try the form value first, then try common id fields from rowData.
            // const idToToggle = Number((data?.fmcC_Id as any) ?? (rowData as any).fmcC_Id);

            // if (!idToToggle) {
            //     toast.error('Invalid record id. Cannot update status.');
            //     return;
            // }

            const response = await toggleMasterclassCategory(Number(rowData.fmcC_Id));

            if (response.success) {
                toast.success(response.message || 'Status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Class Category Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    {/* Register as number so zod validation receives a number (not a string) */}
                    <input type='hidden' {...register('fmcC_Id')} value={rowData.fmcC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmcC_ClassCategoryName}</strong>?
                    </p>
                    <FormError>{errors.fmcC_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
