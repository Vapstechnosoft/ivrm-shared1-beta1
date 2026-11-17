'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterClassCategory } from '@/hooks/fees/useMasters';
import { masterClassCategorySchema } from '@/schemas/fees/masters';
import { deleteMasterclassCategory } from '@/server/fees/masters/class_category';
import type { IMasterCasteCategoryList } from '@/types/fees/masters/masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassCategorySchema.delete>;

interface DelteClassCategoryFormProps {
    rowData: IMasterCasteCategoryList;
    onClose: () => void;
}

export default function DelteClassCategoryForm({ rowData, onClose }: DelteClassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();

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

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteMasterclassCategory(Number(rowData.fmcC_Id));
            if (response?.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Delete Class Category' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmcC_Id')} defaultValue={rowData.fmcC_Id} />
                    <p>Are you sure you want to permanently delete the Selected Data</p>
                    <FormError>{errors.fmcC_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
