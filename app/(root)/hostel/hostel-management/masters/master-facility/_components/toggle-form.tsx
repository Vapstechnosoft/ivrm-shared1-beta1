'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterFacility } from '@/hooks/hostel/useMasterFacility';
import { masterFacilityDeleteSchema } from '@/schemas/hostel/masters';
import { IMasterFacility } from '@/schemas/hostel/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { toggleMasterFacility } from '@/server/hostel/hostel-management/masters/facility';

type FormFields = z.infer<typeof masterFacilityDeleteSchema>;

interface ToggleMasterFacilityFormProps {
    rowData: IMasterFacility;
    onClose: () => void;
}

export default function ToggleMasterFacilityForm({ rowData, onClose }: ToggleMasterFacilityFormProps) {
    const { refetchAll } = useMasterFacility();
    const isActive = rowData.hlmftY_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterFacilityDeleteSchema),
        defaultValues: {
            hlmftY_Id: rowData?.hlmftY_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const response = await toggleMasterFacility(Number(formData.hlmftY_Id));
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                reset();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const closeDialog = () => {
        reset();
        onClose();
    };

    return (
        <AdaptiveDialog title='Toggle Master Facility Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hlmftY_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hlmftY_FacilityName}</strong>?
                    </p>
                    {errors.hlmftY_Id && <FormError>{errors.hlmftY_Id.message}</FormError>}
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
