'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDay } from '@/hooks/timetable/useMasters';
import { masterDaySchema } from '@/schemas/timetable/masters';
import { addOrUpdateMasterDay } from '@/server/timetable/masters/masterday';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDaySchema.addOrUpdate>;

interface AddMasterDayProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterDayForm({ onSuccess, className = '' }: AddMasterDayProps) {
    const { refetchAll } = useMasterDay();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDaySchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {}
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ttmD_DayName, ttmD_DayCode } = data;
            const payload = {
                ttmD_DayName: ttmD_DayName,
                ttmD_DayCode: ttmD_DayCode
            };

            console.log(payload);

            const response = await addOrUpdateMasterDay(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='space-y-4'>
                        <div className='flex flex-col items-center justify-center gap-4 md:flex-row'>
                            <div className='w-full md:w-auto'>
                                <InputText
                                    label='Day Name'
                                    required
                                    id='ttmD_DayName'
                                    {...register('ttmD_DayName')}
                                    error={errors.ttmD_DayName?.message}
                                    className='w-full transition-colors focus:ring-2 focus:ring-primary/20 md:w-[250px]'
                                />
                            </div>

                            <div className='w-full md:w-auto'>
                                <div className='group flex flex-col gap-1.5'>
                                    <InputText
                                        label='Day Code'
                                        required
                                        id='ttmD_DayCode'
                                        {...register('ttmD_DayCode')}
                                        error={errors.ttmD_DayCode?.message}
                                        className='w-full transition-colors focus:ring-2 focus:ring-primary/20 md:w-[250px]'
                                    />
                                </div>
                            </div>
                        </div>

                        {errors.root && <FormError className='text-center'>{errors.root.message}</FormError>}
                    </div>

                    {/* {errors.root && <FormError>{errors.root.message}</FormError>} */}
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save Master Day
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
