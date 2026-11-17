'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterTermsPeriod } from '@/hooks/fees/useMasters';
import { masterTermPeriodSchema } from '@/schemas/fees/masters';
import { deleteMasterTermPeriod } from '@/server/fees/masters/fee_terms_period';
import type { IMasterTermsPeriodList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermPeriodSchema.delete>;

interface DeleteMasterTermsPeriodFormProps {
    rowData: IMasterTermsPeriodList;
    onClose: () => void;
}

export default function DeleteMasterTermsPeriodForm({ rowData, onClose }: DeleteMasterTermsPeriodFormProps) {
    const { refetchAll } = useMasterTermsPeriod();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermPeriodSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteMasterTermPeriod(Number(rowData.fmtP_Id));

            if (response?.success) {
                toast.success(response.message || 'Deleted successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete');
            }
        } catch (error: any) {
            toast.error(error.message ?? 'Failed to delete');
        }
    };

    return (
        <AdaptiveDialog title='Delete Fee Group Grouping' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmtP_Id')} defaultValue={rowData.fmtP_Id} />
                    <p>
                        Are you sure you want to <strong>permanently delete</strong> Selected Data
                    </p>
                    <FormError>{errors.fmtP_Id?.message}</FormError>
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
