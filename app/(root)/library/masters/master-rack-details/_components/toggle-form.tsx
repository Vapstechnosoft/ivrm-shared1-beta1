'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterRackDetails } from '@/hooks/library/useMasters';
import { masterRackDetailsSchema } from '@/schemas/library/masters';
import { deactivateMasterRack } from '@/server/library/masters/rack-details';
import type { IMasterRackDetails } from '@/types/library/masters/rack-details';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterRackDetailsSchema.delete>;

interface ToggleRackFormProps {
    rowData: IMasterRackDetails;
    onClose: () => void;
}

export default function ToggleRackForm({ rowData, onClose }: ToggleRackFormProps) {
    const { refetchAll } = useMasterRackDetails();
    const isActive = rowData.lmrA_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterRackDetailsSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const payload = { ...rowData, lmrA_Id: rowData.lmrA_Id };
            const response = await deactivateMasterRack(payload);

            if (response.returnval) {
                toast.success('Record Status Updated Successfully!!!');
                refetchAll();
                closeDialog();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Rack Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lmrA_Id')} defaultValue={rowData.lmrA_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmrA_Location}</strong>?
                    </p>
                    <FormError>{errors.lmrA_Id?.message}</FormError>
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
