'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useSpecialFeeHead } from '@/hooks/fees/useMasters';
import { specialFeeHeadSchema } from '@/schemas/fees/masters';
import { toggleSpecialfeehead } from '@/server/fees/masters/specialfeehead';
import type { IspecialFeeHeadList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof specialFeeHeadSchema.delete>;

interface ToggleSpecialFeeHeadFormProps {
    rowData: IspecialFeeHeadList;
    onClose: () => void;
}

export default function ToggleSpecialFeeHeadForm({ rowData, onClose }: ToggleSpecialFeeHeadFormProps) {
    const { refetchAll } = useSpecialFeeHead();
    const isActive = rowData.fmsfhfH_ActiceFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(specialFeeHeadSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleSpecialfeehead(Number(rowData.fmsfhfH_Id));

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmsfhfH_Id')} defaultValue={rowData.fmsfhfH_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmsfH_Name}</strong>?
                    </p>
                    <FormError>{errors.fmsfhfH_Id?.message}</FormError>
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
