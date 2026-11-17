'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDepartment } from '@/hooks/hrms/useMasters';
import { toggleMasterDepartment } from '@/server/hrms/hrmsConfig/master/department';
import type { IMasterDepartmentList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmD_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterDepartmentFormProps {
    rowData: IMasterDepartmentList;
    onClose: () => void;
}

export default function ToggleMasterDepartmentForm({ rowData, onClose }: ToggleMasterDepartmentFormProps) {
    const { refetchAll } = useMasterDepartment();
    const isActive = rowData.hrmD_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmD_Id: rowData.hrmD_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterDepartment(Number(rowData.hrmD_Id));

            if (response?.success) {
                toast.success(response?.message || `Department ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} department`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} department`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Department Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmD_Id', { valueAsNumber: true })} defaultValue={rowData.hrmD_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmD_DepartmentName}</strong>?
                    </p>
                    <FormError>{errors.hrmD_Id?.message}</FormError>
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
