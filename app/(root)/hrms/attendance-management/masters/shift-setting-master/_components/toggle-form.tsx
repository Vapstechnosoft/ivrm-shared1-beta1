'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useShiftSettingMaster } from '@/hooks/hrms/attendance-management/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { toggleShiftSettingMaster } from '@/server/hrms/attendance-management/masters/shift-setting-master';
import type { IMasterShiftSettingList } from '@/types/hrms/attendance-management/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.shiftSettingMaster.delete>;

interface ToggleShiftSettingMasterFormProps {
    rowData: IMasterShiftSettingList;
    onClose: () => void;
}

export default function ToggleShiftSettingMasterForm({ rowData, onClose }: ToggleShiftSettingMasterFormProps) {
    const { refetchAll } = useShiftSettingMaster();
    const isActive = rowData.FOMS_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.shiftSettingMaster.delete),
        mode: 'onChange',
        defaultValues: {
            fomsT_Id: Number(rowData.FOMST_Id) || 0
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleShiftSettingMaster(Number(rowData.FOMS_Id));

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
        <AdaptiveDialog title='Toggle Shift Setting Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input
                        type='hidden'
                        {...register('fomsT_Id', {
                            valueAsNumber: true,
                            value: Number(rowData.FOMST_Id) || 0
                        })}
                    />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.FOMS_ShiftName}</strong>?
                    </p>
                    <FormError>{errors.fomsT_Id?.message}</FormError>
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
