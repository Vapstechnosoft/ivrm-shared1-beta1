'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDepartment } from '@/hooks/library/useMasters';
import { masterDepartmentSchema } from '@/schemas/library/masters';
import { deactivateMasterDepartment } from '@/server/library/masters/department';
import type { IMasterDepartment } from '@/types/library/masters/department';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDepartmentSchema.delete>;

interface ToggleDepartmentFormProps {
    rowData: IMasterDepartment;
    onClose: () => void;
}

export default function ToggleDepartmentForm({ rowData, onClose }: ToggleDepartmentFormProps) {
    const { refetchAll } = useMasterDepartment();
    const isActive = rowData.lmD_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDepartmentSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            // Legacy deactiveY passes the whole user object
            // "apiService.create("MasterDepartment/deactiveY", user)"
            // So we should pass the whole object or at least what's needed.
            // My server action passes the payload directly.

            const payload = { ...rowData, lmD_Id: rowData.lmD_Id };
            const response = await deactivateMasterDepartment(payload);

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
        <AdaptiveDialog title='Toggle Department Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lmD_Id')} defaultValue={rowData.lmD_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmD_DepartmentName}</strong>?
                    </p>
                    <FormError>{errors.lmD_Id?.message}</FormError>
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
