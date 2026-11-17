'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterTimeSlab } from '@/hooks/library/useMasters';
import { masterTimeSlabSchema } from '@/schemas/library/masters';
import { deactivateMasterTimeSlab } from '@/server/library/masters/time-slab';
import type { IMasterTimeSlab } from '@/types/library/masters/time-slab';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTimeSlabSchema.delete>;

interface ToggleTimeSlabFormProps {
    rowData: IMasterTimeSlab;
    onClose: () => void;
}

export default function ToggleTimeSlabForm({ rowData, onClose }: ToggleTimeSlabFormProps) {
    const { refetchAll } = useMasterTimeSlab();
    const isActive = rowData.lfsE_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTimeSlabSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const payload = { ...rowData, lfsE_Id: rowData.lfsE_Id };
            const response = await deactivateMasterTimeSlab(payload);

            if (response.success) {
                toast.success(response.message || 'Record Status Updated Successfully!!!');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Time Slab Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lfsE_Id')} defaultValue={rowData.lfsE_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>
                            {rowData.lfsE_UserType} ({rowData.lfsE_FromDay} - {rowData.lfsE_ToDay || '∞'})
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.lfsE_Id?.message}</FormError>
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
