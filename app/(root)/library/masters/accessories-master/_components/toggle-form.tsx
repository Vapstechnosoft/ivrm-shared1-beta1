'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterAccessories } from '@/hooks/library/useMasters';
import { masterAccessoriesSchema } from '@/schemas/library/masters';
import { deactivateMasterAccessories } from '@/server/library/masters/accessories';
import type { IMasterAccessories } from '@/types/library/masters/accessories';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterAccessoriesSchema.delete>;

interface ToggleAccessoriesFormProps {
    rowData: IMasterAccessories;
    onClose: () => void;
}

export default function ToggleAccessoriesForm({ rowData, onClose }: ToggleAccessoriesFormProps) {
    const { refetchAll } = useMasterAccessories();
    const isActive = rowData.lmaC_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterAccessoriesSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const payload = { ...rowData, lmaC_Id: rowData.lmaC_Id };
            const response = await deactivateMasterAccessories(payload);

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
        <AdaptiveDialog title='Toggle Accessories Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lmaC_Id')} defaultValue={rowData.lmaC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmaC_AccessoriesName}</strong>?
                    </p>
                    <FormError>{errors.lmaC_Id?.message}</FormError>
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
