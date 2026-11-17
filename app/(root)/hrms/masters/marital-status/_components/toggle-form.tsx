'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterMaritalStatus } from '@/hooks/hrms/useMasters';
import { toggleMasterMaritalStatus } from '@/server/hrms/hrmsConfig/master/marital-status';
import type { IMasterMaritalStatusList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    ivrmmmS_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterMaritalStatusFormProps {
    rowData: IMasterMaritalStatusList;
    onClose: () => void;
}

export default function ToggleMasterMaritalStatusForm({ rowData, onClose }: ToggleMasterMaritalStatusFormProps) {
    const { refetchAll } = useMasterMaritalStatus();
    const isActive = rowData.ivrmmmS_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            ivrmmmS_Id: rowData.ivrmmmS_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterMaritalStatus(Number(rowData.ivrmmmS_Id));

            if (response?.success) {
                toast.success(response?.message || `Marital Status ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} marital status`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} marital status`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Marital Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ivrmmmS_Id', { valueAsNumber: true })} defaultValue={rowData.ivrmmmS_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ivrmmmS_MaritalStatus}</strong>?
                    </p>
                    <FormError>{errors.ivrmmmS_Id?.message}</FormError>
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
