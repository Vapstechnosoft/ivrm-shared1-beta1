'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterGender } from '@/hooks/hrms/useMasters';
import { toggleMasterGender } from '@/server/hrms/hrmsConfig/master/gender';
import type { IMasterGenderList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    ivrmmG_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterGenderFormProps {
    rowData: IMasterGenderList;
    onClose: () => void;
}

export default function ToggleMasterGenderForm({ rowData, onClose }: ToggleMasterGenderFormProps) {
    const { refetchAll } = useMasterGender();
    const isActive = rowData.ivrmmG_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            ivrmmG_Id: rowData.ivrmmG_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterGender(Number(rowData.ivrmmG_Id));

            if (response?.success) {
                toast.success(response?.message || `Gender ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} gender`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} gender`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Gender Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ivrmmG_Id', { valueAsNumber: true })} defaultValue={rowData.ivrmmG_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ivrmmG_GenderName}</strong>?
                    </p>
                    <FormError>{errors.ivrmmG_Id?.message}</FormError>
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
