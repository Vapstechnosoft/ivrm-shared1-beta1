'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDesignation } from '@/hooks/hrms/useMasters';
import { toggleMasterDesignation } from '@/server/hrms/hrmsConfig/master/designation';
import type { IMasterDesignationList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmdeS_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterDesignationFormProps {
    rowData: IMasterDesignationList;
    onClose: () => void;
}

export default function ToggleMasterDesignationForm({ rowData, onClose }: ToggleMasterDesignationFormProps) {
    const { refetchAll } = useMasterDesignation();
    const isActive = rowData.hrmdeS_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmdeS_Id: rowData.hrmdeS_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterDesignation(Number(rowData.hrmdeS_Id));

            if (response?.success) {
                toast.success(response?.message || `Designation ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} designation`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} designation`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Designation Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmdeS_Id', { valueAsNumber: true })} defaultValue={rowData.hrmdeS_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmdeS_DesignationName}</strong>?
                    </p>
                    <FormError>{errors.hrmdeS_Id?.message}</FormError>
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
