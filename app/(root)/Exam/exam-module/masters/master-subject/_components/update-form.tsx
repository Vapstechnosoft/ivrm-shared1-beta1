'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterSubject } from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubject } from '@/server/exam/exam-module/masters/subject';
import type { IMasterSubject } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectSchema.addOrUpdate>;

interface UpdateMasterSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSubject;
}

export default function UpdateMasterSubjectForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterSubjectFormProps) {
    const { refetchAll } = useMasterSubject();

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectSchema.addOrUpdate),
        mode: 'onTouched'
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [row]);

    // Initialize form with selected row safely
    useEffect(() => {
        if (row) {
            reset({
                ismS_Id: row.ismS_Id,
                ismS_SubjectName: row.ismS_SubjectName ?? '',
                ismS_IVRSSubjectName: row.ismS_IVRSSubjectName ?? '',
                ismS_SubjectCode: row.ismS_SubjectCode ?? '',
                ismS_SubjectNameNew: row.ismS_SubjectNameNew ?? '',
                ismS_PreadmFlag: row.ismS_PreadmFlag ? 1 : 0,
                ismS_AttendanceFlag: row.ismS_AttendanceFlag ?? true,
                ismS_BatchAppl: row.ismS_BatchAppl ? 1 : 0,
                ismS_ExamFlag: row.ismS_ExamFlag ? 1 : 0,
                ismS_LanguageFlg: row.ismS_LanguageFlg ? 1 : 0,
                ismS_AtExtraFeeFlg: row.ismS_AtExtraFeeFlg ? 1 : 0,
                ismS_TTFlag: row.ismS_TTFlag ? 1 : 0,
                ismS_ActiveFlag: 1
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const payload = {
                ...data,
                ismS_PreadmFlag: Number(data.ismS_PreadmFlag),
                ismS_AttendanceFlag: Boolean(data.ismS_AttendanceFlag),
                ismS_BatchAppl: Number(data.ismS_BatchAppl),
                ismS_ExamFlag: Number(data.ismS_ExamFlag),
                ismS_LanguageFlg: Number(data.ismS_LanguageFlg),
                ismS_AtExtraFeeFlg: Number(data.ismS_AtExtraFeeFlg),
                ismS_TTFlag: Number(data.ismS_TTFlag),
                ismS_ActiveFlag: 1
            };
            console.log('PAYLOAD:', payload);
            const response = await addOrUpdateMasterSubject(payload);

            if (response.success) {
                toast.success(response.message || 'Subject updated successfully');
                reset(payload);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update subject');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        if (row) {
            reset({
                ismS_Id: row.ismS_Id,
                ismS_SubjectName: row.ismS_SubjectName ?? '',
                ismS_IVRSSubjectName: row.ismS_IVRSSubjectName ?? '',
                ismS_SubjectCode: row.ismS_SubjectCode ?? '',
                ismS_SubjectNameNew: row.ismS_SubjectNameNew ?? '',
                ismS_PreadmFlag: row.ismS_PreadmFlag ? 1 : 0,
                ismS_AttendanceFlag: row.ismS_AttendanceFlag ?? true,
                ismS_BatchAppl: row.ismS_BatchAppl ? 1 : 0,
                ismS_ExamFlag: row.ismS_ExamFlag ? 1 : 0,
                ismS_LanguageFlg: row.ismS_LanguageFlg ? 1 : 0,
                ismS_AtExtraFeeFlg: row.ismS_AtExtraFeeFlg ? 1 : 0,
                ismS_TTFlag: row.ismS_TTFlag ? 1 : 0,
                ismS_ActiveFlag: 1
            });
        }
    };

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Text Fields */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                    <InputText label='Subject Name' required {...register('ismS_SubjectName')} error={errors.ismS_SubjectName?.message} />
                    <InputText
                        label='IVRS Name'
                        required
                        {...register('ismS_IVRSSubjectName')}
                        error={errors.ismS_IVRSSubjectName?.message}
                    />
                    <InputText label='Subject Code' required {...register('ismS_SubjectCode')} error={errors.ismS_SubjectCode?.message} />
                    <InputText label='New Subject Name' {...register('ismS_SubjectNameNew')} error={errors.ismS_SubjectNameNew?.message} />
                </div>
                {/* Flags */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {[
                        { key: 'ismS_PreadmFlag', label: 'Pre-Admission', isBoolean: false },
                        { key: 'ismS_AttendanceFlag', label: 'Attendance', isBoolean: true },
                        { key: 'ismS_BatchAppl', label: 'Batch Wise', isBoolean: false },
                        { key: 'ismS_ExamFlag', label: 'Exam', isBoolean: false },
                        { key: 'ismS_LanguageFlg', label: 'Language', isBoolean: false },
                        { key: 'ismS_AtExtraFeeFlg', label: 'Extra Fee', isBoolean: false },
                        { key: 'ismS_TTFlag', label: 'Time Table Flag', isBoolean: false }
                    ].map((flag) => (
                        <Controller
                            key={flag.key}
                            control={control}
                            name={flag.key as any}
                            render={({ field }) => (
                                <div className='group flex flex-col gap-1.5'>
                                    <Label htmlFor={flag.key}>
                                        {flag.label} <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <RadioGroup
                                        value={flag.isBoolean ? (field.value ? '1' : '0') : String(field.value)}
                                        onValueChange={(value) => {
                                            field.onChange(flag.isBoolean ? value === '1' : Number(value));
                                        }}
                                        className='flex gap-4'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='1' id={`${flag.key}_yes`} />
                                            <Label htmlFor={`${flag.key}_yes`}>Yes</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='0' id={`${flag.key}_no`} />
                                            <Label htmlFor={`${flag.key}_no`}>No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}
                        />
                    ))}
                </div>

                {/* Buttons */}
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
                            Update Master Subject
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
