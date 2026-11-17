'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDay } from '@/hooks/timetable/useMasters';
import { periodAllocationmasterPeriod } from '@/schemas/timetable/masters';
import { deactivatePeriod } from '@/server/timetable/masters/periodallocation';
import type { IPeriodAllocationMasterDay } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof periodAllocationmasterPeriod.delete>;

interface ToggleMasterPeriodFormProps {
    rowData: IPeriodAllocationMasterDay;
    onClose: () => void;
}

export default function ToggleMasterPeriodForm({ rowData, onClose }: ToggleMasterPeriodFormProps) {
    const { refetchAll } = useMasterDay();
    const isActive = rowData.ttmP_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(periodAllocationmasterPeriod.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deactivatePeriod(Number(rowData.ttmP_Id));

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
        <AdaptiveDialog title='Toggle Master Period' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ttmP_Id')} defaultValue={rowData.ttmP_Id} />
                    <p>Are you sure you want to {isActive ? 'deactivate' : 'activate'} this Master Period?</p>
                    <FormError>{errors.ttmP_Id?.message}</FormError>
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
