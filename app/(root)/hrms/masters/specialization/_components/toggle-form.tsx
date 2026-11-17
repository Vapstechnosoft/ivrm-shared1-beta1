'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterSpecialization } from '@/hooks/hrms/useMasters';
import { toggleMasterSpecialization } from '@/server/hrms/hrmsConfig/master/specialization';
import type { IMasterSpecializationList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmspL_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterSpecializationFormProps {
    rowData: IMasterSpecializationList;
    onClose: () => void;
}

export default function ToggleMasterSpecializationForm({ rowData, onClose }: ToggleMasterSpecializationFormProps) {
    const { refetchAll } = useMasterSpecialization();
    const isActive = rowData.hrmspL_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmspL_Id: rowData.hrmspL_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterSpecialization(Number(rowData.hrmspL_Id));

            if (response?.success) {
                toast.success(response?.message || `Specialization ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} specialization`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} specialization`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Specialization Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmspL_Id', { valueAsNumber: true })} defaultValue={rowData.hrmspL_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmspL_SpecialisationName}</strong>
                        ?
                    </p>
                    <FormError>{errors.hrmspL_Id?.message}</FormError>
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
