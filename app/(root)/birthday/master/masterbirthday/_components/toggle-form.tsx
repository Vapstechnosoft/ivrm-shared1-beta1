'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterEventCoe } from '@/hooks/coe/usemMaster';
import { masterEventCoeSchema } from '@/schemas/coe/master';
import { toggleUploadEvent } from '@/server/coe/masters/masterevent';
import type { MasterEventCoe } from '@/types/coe/masterevent';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof masterEventCoeSchema.delete>;
interface ToggleEventFormProps {
    rowData: MasterEventCoe;
    onClose: () => void;
}

export default function ToggleEventForm({ rowData, onClose }: ToggleEventFormProps) {
    const payload = {
        asmaY_Id: 176
    };
    const { refetchAll } = useMasterEventCoe();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterEventCoeSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            console.log('deacticepayload', rowData);
            const response = await toggleUploadEvent(Number(rowData.coemE_Id,),rowData.coee_Id);
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
        <AdaptiveDialog title='Master Event Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('coemE_Id')} defaultValue={rowData.coemE_Id} />
                    <p>
                        Are you sure you want to {rowData.coemE_ActiveFlag ? 'deactivate' : 'activate'}{' '}
                        <strong>{rowData.coemE_ActiveFlag}</strong>?
                    </p>

                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={rowData.coemE_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.coemE_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
