'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterRouteSchedule } from '@/hooks/transport/transportmodule/usemasters';
import { masterRouteScheduleSchema } from '@/schemas/transport/masters';
import { saveMasterRouteSchedule } from '@/server/transport/transport-module/masters/route-schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterRouteScheduleSchema.addOrUpdate>;

interface AddRouteScheduleFormProps {
    onSuccess?: () => void;
    className?: string; // Consistent with other forms
}

export default function AddRouteScheduleForm({ onSuccess, className = '' }: AddRouteScheduleFormProps) {
    const { refetchAll } = useMasterRouteSchedule();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterRouteScheduleSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            TRRSC_ScheduleName: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await saveMasterRouteSchedule(data);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Schedule Name'
                            required
                            id='TRRSC_ScheduleName'
                            {...register('TRRSC_ScheduleName')}
                            error={errors.TRRSC_ScheduleName?.message}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
