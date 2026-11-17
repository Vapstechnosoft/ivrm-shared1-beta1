'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterTermsHeadDueDate } from '@/hooks/fees/useMasters';
import { masterTermFeeHeadDuedateSchema } from '@/schemas/fees/masters';
import { deleteFeeTermHeadDueDate } from '@/server/fees/masters/fee-term-head-duedate';
import type { IMasterTermFeeHeadDueDateList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermFeeHeadDuedateSchema.delete>;

interface ToggleMasterTermFeeHeadDueDateFormProps {
    rowData: IMasterTermFeeHeadDueDateList;
    onClose: () => void;
}

export default function ToggleMasterTermFeeHeadDueDateForm({ rowData, onClose }: ToggleMasterTermFeeHeadDueDateFormProps) {
    const { refetchAll } = useMasterTermsHeadDueDate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermFeeHeadDuedateSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteFeeTermHeadDueDate(Number(rowData.fmtfhdD_Id));
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
                    <input type='hidden' {...register('fmtfhdD_Id')} defaultValue={rowData.fmtfhdD_Id} />
                    <p>
                        Are you sure you want to <strong>Permanently Delete the Selected Record</strong>?
                    </p>
                    <FormError>{typeof errors.fmtfhdD_Id?.message === 'string' ? errors.fmtfhdD_Id?.message : null}</FormError>
                    <FormError>{typeof errors.root?.message === 'string' ? errors.root?.message : null}</FormError>
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
