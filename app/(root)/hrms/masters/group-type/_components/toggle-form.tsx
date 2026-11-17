'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterGroupType } from '@/hooks/hrms/useMasters';
import { toggleMasterGroupType } from '@/server/hrms/hrmsConfig/master/group-type';
import type { IMasterGroupTypeList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmgT_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterGroupTypeFormProps {
    rowData: IMasterGroupTypeList;
    onClose: () => void;
}

export default function ToggleMasterGroupTypeForm({ rowData, onClose }: ToggleMasterGroupTypeFormProps) {
    const { refetchAll } = useMasterGroupType();
    const isActive = rowData.hrmgT_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmgT_Id: rowData.hrmgT_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterGroupType(Number(rowData.hrmgT_Id));

            if (response?.success) {
                toast.success(response?.message || `Group Type ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                const retrunMsg = (response as any)?.retrunMsg || '';
                if (
                    retrunMsg === 'Mapped' ||
                    retrunMsg.includes('in use') ||
                    retrunMsg.includes('cannot') ||
                    retrunMsg.includes('assigned')
                ) {
                    toast.error('Cannot deactivate - Group Type is currently assigned/in use');
                } else {
                    toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} group type`);
                }
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} group type`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Group Type Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmgT_Id', { valueAsNumber: true })} defaultValue={rowData.hrmgT_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmgT_EmployeeGroupType}</strong>?
                    </p>
                    <FormError>{errors.hrmgT_Id?.message}</FormError>
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
