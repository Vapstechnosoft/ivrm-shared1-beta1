'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterExam } from '@/hooks/exam/exammodule/usemasters';
import { masterExamSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterExam } from '@/server/exam/exam-module/masters/exam';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterExamSchema.addOrUpdate>;

interface AddMasterExamFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterExamForm({ onSuccess, className = '' }: AddMasterExamFormProps) {
    const { refetchAll } = useMasterExam();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterExamSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emE_Id: 0,
            emE_ExamName: '',
            emE_ExamCode: '',
            emE_ExamDescription: '',
            emE_IVRSExamName: '',
            emE_FinalExamFlag: false,
            emE_SujectwiseMarksPublishFlg: false
        }
    });
    //  Add or Update Exam
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                emE_FinalExamFlag: Boolean(data.emE_FinalExamFlag),
                emE_SujectwiseMarksPublishFlg: Boolean(data.emE_SujectwiseMarksPublishFlg)
            };

            const response = await addOrUpdateMasterExam(payload);

            if (response.success) {
                toast.success(response.message || 'Exam added successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add exam');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();
    // Fetch and open order modal
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* Exam Basic Info */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText label='Exam Name' required {...register('emE_ExamName')} error={errors.emE_ExamName?.message} />
                        <InputText
                            label='IVRS Exam Name'
                            required
                            {...register('emE_IVRSExamName')}
                            error={errors.emE_IVRSExamName?.message}
                        />
                        <InputText
                            label='Exam Description'
                            required
                            {...register('emE_ExamDescription')}
                            error={errors.emE_ExamDescription?.message}
                        />
                        <InputText label='Exam Code' required {...register('emE_ExamCode')} error={errors.emE_ExamCode?.message} />
                    </div>

                    {/* Exam Flags */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {[
                            { name: 'emE_FinalExamFlag', label: 'Final Exam' },
                            { name: 'emE_SujectwiseMarksPublishFlg', label: 'Subject Wise Marks Publish' }
                        ].map((fieldDef) => (
                            <div key={fieldDef.name} className='flex flex-col gap-1.5'>
                                <Label htmlFor={fieldDef.name}>
                                    {fieldDef.label} <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name={fieldDef.name as keyof FormFields}
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? 'true' : 'false'}
                                            onValueChange={(val) => field.onChange(val === 'true')}
                                            className='flex gap-4'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='true' id={`${fieldDef.name}-yes`} />
                                                <Label htmlFor={`${fieldDef.name}-yes`}>Yes</Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='false' id={`${fieldDef.name}-no`} />
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
                            Save Exam
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
