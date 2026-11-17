'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterCourse } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterCourse } from '@/server/hrms/hrmsConfig/master/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.course.add>;

interface AddCourseFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddCourseForm({ onSuccess, className = '' }: AddCourseFormProps) {
    const { refetchAll } = useMasterCourse();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.course.add),
        mode: 'onChange',
        defaultValues: {
            hrmC_Order: undefined as any
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                hrmC_Id: 0,
                hrmC_QulaificationName: data.hrmC_QulaificationName?.trim(),
                hrmC_QualificationDesc: data.hrmC_QualificationDesc?.trim(),
                hrmC_Order: Number(data.hrmC_Order) || 0,
                hrmC_DefaultQualFag: data.hrmC_DefaultQualFag,
                hrmC_SpecialisationFlag: data.hrmC_SpecialisationFlag,
                hrmC_ActiveFlag: true
            };
            const response = await addOrUpdateMasterCourse(payload);

            if (response?.success) {
                toast.success(response?.message || 'Course saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save course');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save course');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Qualification Name'
                            required
                            id='hrmC_QulaificationName'
                            placeholder='Enter qualification name'
                            maxLength={100}
                            {...register('hrmC_QulaificationName')}
                            error={errors.hrmC_QulaificationName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />

                        <InputTextarea
                            label='Description'
                            required
                            id='hrmC_QualificationDesc'
                            placeholder='Enter description'
                            maxLength={150}
                            {...register('hrmC_QualificationDesc')}
                            error={errors.hrmC_QualificationDesc?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                            minHeight={20}
                        />

                        <Controller
                            name='hrmC_Order'
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    label='Order'
                                    id='hrmC_Order'
                                    placeholder='Enter order'
                                    value={field.value ?? undefined}
                                    onChange={(value) => {
                                        const numValue = value !== null && value !== undefined && !Number.isNaN(value) ? Number(value) : undefined;
                                        field.onChange(numValue);
                                    }}
                                    onBlur={field.onBlur}
                                    error={errors.hrmC_Order?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            )}
                        />

                        <div className='flex items-center gap-4 pt-7'>
                            <div className='flex items-center gap-2'>
                                <Controller
                                    name='hrmC_DefaultQualFag'
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id='default-qualification-checkbox'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <label
                                    htmlFor='default-qualification-checkbox'
                                    className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    Default Qualification
                                </label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Controller
                                    name='hrmC_SpecialisationFlag'
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox id='has-specialization-checkbox' checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <label
                                    htmlFor='has-specialization-checkbox'
                                    className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    Has Specialization
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
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
                            Save Course
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
