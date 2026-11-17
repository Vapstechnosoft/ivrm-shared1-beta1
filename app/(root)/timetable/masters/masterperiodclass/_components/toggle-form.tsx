'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterDay } from '@/hooks/timetable/useMasters';
import { masterPeriodClassSchema } from '@/schemas/timetable/masters';
import { deactivatePeriodClass } from '@/server/timetable/masters/periodallocation';
import type { IMasterPeriodClassList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterPeriodClassSchema.delete>;

interface ToggleMasterPeriodClassFormProps {
    rowData: IMasterPeriodClassList;
    onClose: () => void;
}

export default function ToggleMasterPeriodClassForm({ rowData, onClose }: ToggleMasterPeriodClassFormProps) {
    const { refetchAll } = useMasterDay();
    const isActive = rowData.ttmpC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterPeriodClassSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deactivatePeriodClass(Number(rowData.ttmpC_Id));

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
        <AdaptiveDialog title='Toggle Master Period Class' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ttmpC_Id')} defaultValue={rowData.ttmpC_Id} />
                    <p>Are you sure you want to {isActive ? 'deactivate' : 'activate'} this Master Period Class?</p>
                    <FormError>{errors.ttmpC_Id?.message}</FormError>
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
