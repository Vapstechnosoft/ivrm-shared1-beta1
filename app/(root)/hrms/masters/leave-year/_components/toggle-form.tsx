'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterLeaveYear } from '@/hooks/hrms/useMasters';
import { toggleMasterLeaveYear } from '@/server/hrms/hrmsConfig/master/leave-year';
import type { IMasterLeaveYearList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmlY_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterLeaveYearFormProps {
    rowData: IMasterLeaveYearList;
    onClose: () => void;
}

export default function ToggleMasterLeaveYearForm({ rowData, onClose }: ToggleMasterLeaveYearFormProps) {
    const { refetchAll } = useMasterLeaveYear();
    const isActive = rowData.hrmlY_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmlY_Id: rowData.hrmlY_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterLeaveYear(Number(rowData.hrmlY_Id));

            if (response?.success) {
                toast.success(response?.message || `Leave Year ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} leave year`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} leave year`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Leave Year Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmlY_Id', { valueAsNumber: true })} defaultValue={rowData.hrmlY_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmlY_LeaveYear}</strong>?
                    </p>
                    <FormError>{errors.hrmlY_Id?.message}</FormError>
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
