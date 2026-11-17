'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterSubject } from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubject } from '@/server/exam/exam-module/masters/subject';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectSchema.addOrUpdate>;

interface AddMasterSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterSubjectForm({ onSuccess, className = '' }: AddMasterSubjectFormProps) {
    const { refetchAll } = useMasterSubject();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectSchema.addOrUpdate),
        mode: 'onTouched',
        defaultValues: {
            ismS_PreadmFlag: 0,
            ismS_AttendanceFlag: true, // boolean
            ismS_BatchAppl: 0,
            ismS_ExamFlag: 0,
            ismS_LanguageFlg: 0,
            ismS_AtExtraFeeFlg: 0,
            ismS_TTFlag: 0,
            ismS_ActiveFlag: 1, // Add this
            ismS_SubjectName: '', // Add all string fields
            ismS_IVRSSubjectName: '',
            ismS_SubjectCode: '',
            ismS_SubjectNameNew: ''
        }
    });

    // Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Payload DATA:', data);
            const response = await addOrUpdateMasterSubject(data);

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

    const handleReset = () => reset();

    // Fetch and open order modal

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* Row 1 - Basic Info */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Subject Name'
                            required
                            id='ismS_SubjectName'
                            {...register('ismS_SubjectName')}
                            error={errors.ismS_SubjectName?.message}
                        />
                        <InputText
                            label='IVRS Subject Name'
                            required
                            id='ismS_IVRSSubjectName'
                            {...register('ismS_IVRSSubjectName')}
                            error={errors.ismS_IVRSSubjectName?.message}
                        />
                        <InputText
                            label='Subject Code'
                            required
                            id='ismS_SubjectCode'
                            {...register('ismS_SubjectCode')}
                            error={errors.ismS_SubjectCode?.message}
                        />
                        <InputText
                            label='Description'
                            required
                            id='ismS_SubjectNameNew'
                            {...register('ismS_SubjectNameNew')}
                            error={errors.ismS_SubjectNameNew?.message}
                        />
                    </div>
                    {/* Row 3 - Flags */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {[
                            { name: 'ismS_PreadmFlag', label: 'Pre-Admission Flag', isBoolean: false },
                            { name: 'ismS_AttendanceFlag', label: 'Attendance Flag', isBoolean: true },
                            { name: 'ismS_BatchAppl', label: 'Batch Wise Flag', isBoolean: false },
                            { name: 'ismS_ExamFlag', label: 'Exam Flag', isBoolean: false },
                            { name: 'ismS_LanguageFlg', label: 'Language Flag', isBoolean: false },
                            { name: 'ismS_AtExtraFeeFlg', label: 'Extra Fee Flag', isBoolean: false },
                            { name: 'ismS_TTFlag', label: 'Time Table Flag', isBoolean: false }
                        ].map((fieldDef) => (
                            <div key={fieldDef.name} className='group flex flex-col gap-1.5'>
                                <Label htmlFor={fieldDef.name}>
                                    {fieldDef.label} <span className='ml-1 text-red-500'>*</span>
                                </Label>

                                <Controller
                                    name={fieldDef.name as keyof FormFields}
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={fieldDef.isBoolean ? (field.value ? '1' : '0') : String(field.value ?? 0)}
                                            onValueChange={(value) => field.onChange(fieldDef.isBoolean ? value === '1' : Number(value))}
                                            className='flex gap-4'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='1' id={`${fieldDef.name}-yes`} />
                                                <Label htmlFor={`${fieldDef.name}-yes`}>Yes</Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='0' id={`${fieldDef.name}-no`} />
                                                <Label htmlFor={`${fieldDef.name}-no`}>No</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />

                                {errors[fieldDef.name as keyof FormFields] && (
                                    <FormError>{String(errors[fieldDef.name as keyof FormFields]?.message)}</FormError>
                                )}
                            </div>
                        ))}
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                            Save Subject
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
