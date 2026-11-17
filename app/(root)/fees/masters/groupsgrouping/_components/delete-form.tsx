'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterFeeGroupGrouping } from '@/hooks/fees/useMasters';
import { masterGroupsGroupingSchema } from '@/schemas/fees/masters';
import { deleteGroupGrouping } from '@/server/fees/masters/groupsgrouping';
import type { IMasterGroupsGrouping } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterGroupsGroupingSchema.delete>;

interface DeleteMasterFeeGroupGroupingFormProps {
    rowData: IMasterGroupsGrouping;
    onClose: () => void;
}

export default function DeleteMasterFeeGroupGroupingForm({ rowData, onClose }: DeleteMasterFeeGroupGroupingFormProps) {
    const { refetchAll } = useMasterFeeGroupGrouping();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGroupsGroupingSchema.delete),
        mode: 'onChange',
        defaultValues: {
            fmgG_Id: rowData.fmgG_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteGroupGrouping(Number(rowData.fmgG_Id));
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
                    <input type='hidden' {...register('fmgG_Id', { value: rowData.fmgG_Id })} />
                    <p>
                        Are you sure you want to <strong>permanently delete</strong> the group <strong>{rowData.fmgG_GroupName}</strong>?
                    </p>
                    <FormError>{errors.fmgG_Id?.message}</FormError>
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
