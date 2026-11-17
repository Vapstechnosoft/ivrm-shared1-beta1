'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterEmployeeType } from '@/hooks/hrms/useMasters';
import { toggleMasterEmployeeType } from '@/server/hrms/hrmsConfig/master/employee-type';
import type { IMasterEmployeeTypeList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmeT_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterEmployeeTypeFormProps {
    rowData: IMasterEmployeeTypeList;
    onClose: () => void;
}

export default function ToggleMasterEmployeeTypeForm({ rowData, onClose }: ToggleMasterEmployeeTypeFormProps) {
    const { refetchAll } = useMasterEmployeeType();
    const isActive = rowData.hrmeT_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmeT_Id: rowData.hrmeT_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterEmployeeType(Number(rowData.hrmeT_Id));

            if (response?.success) {
                toast.success(response?.message || `Employee Type ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} employee type`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} employee type`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Employee Type Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmeT_Id', { valueAsNumber: true })} defaultValue={rowData.hrmeT_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmeT_EmployeeType}</strong>?
                    </p>
                    <FormError>{errors.hrmeT_Id?.message}</FormError>
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
