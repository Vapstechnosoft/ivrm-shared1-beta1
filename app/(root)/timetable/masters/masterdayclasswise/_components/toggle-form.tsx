'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDayClasswiseDetails } from '@/hooks/timetable/useMasters';
import { masterDayClasswiseSchema } from '@/schemas/timetable/masters';
import { ToggleMasterDayClasswise } from '@/server/timetable/masters/masterdayclasswise';
import type { IMasterDayClassWise } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDayClasswiseSchema.delete>;

interface ToggleMasterDayFormProps {
    rowData: IMasterDayClassWise;
    onClose: () => void;
}

export default function ToggleMasterDayClasswiseForm({ rowData, onClose }: ToggleMasterDayFormProps) {
    const { refetchAll } = useMasterDayClasswiseDetails();
    const isActive = rowData.ttmdC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDayClasswiseSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await ToggleMasterDayClasswise(Number(rowData.ttmdC_Id));

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
        <AdaptiveDialog title='Toggle Master Day Classwise' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ttmdC_Id')} defaultValue={rowData.ttmdC_Id} />
                    <p>Are you sure you want to {isActive ? 'deactivate' : 'activate'} the selected Row</p>
                    <FormError>{errors.ttmdC_Id?.message}</FormError>
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
