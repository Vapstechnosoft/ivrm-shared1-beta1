'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterGradeDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { gradeSlabReportSchema } from '@/schemas/exam/exam-module/reports';
import { getReportDetails } from '@/server/exam/exam-module/reports/grade-slab-report';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

// Define FormFields type based on schema
type FormFields = z.infer<typeof gradeSlabReportSchema.addOrUpdate>;

interface ReportFormProps {
    onReportGenerated: (data: any, institution: any) => void;
    onReset: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onReportGenerated, onReset }) => {
    const [grades, setGrades] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const { data: gradeData, error: gradeError, isLoading: gradeLoading } = useMasterGradeDropdownList();

    const methods = useForm<FormFields>({
        resolver: zodResolver(gradeSlabReportSchema.addOrUpdate),
        mode: 'all',
        defaultValues: {
            type: '1',
            emgR_Id: '0'
        }
    });

    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { isSubmitting } = formState;

    // Watch specific fields to trigger reset
    const watchType = useWatch({ control, name: 'type' });
    const watchGrade = useWatch({ control, name: 'emgR_Id' });

    // Store previous values to avoid unnecessary resets on re-renders
    const prevValues = React.useRef({ type: watchType, grade: watchGrade });
    useEffect(() => {
        if (gradeError) {
            toast.error(gradeError.message || 'Error fetching grades');
            setGrades([]);
        } else if (gradeData?.data && Array.isArray(gradeData.data)) {
            console.info(gradeData);
            const formattedGrades: IMasterGrade[] = gradeData.data.map((item: any) => ({
                emgR_Id: item.emgR_Id?.toString() ?? '',
                emgR_GradeName: item.emgR_GradeName ?? '',
                emgR_MarksPerFlag: item.emgR_MarksPerFlag ?? 'm',
                emgR_ActiveFlag: item.emgR_ActiveFlag ?? true,
                grade_list: [],
                mI_Id: item.mI_Id
            }));
            setGrades(formattedGrades);
            if (formattedGrades.length === 0) {
                toast.info('No Grades found');
            }
            setInitialLoading(false);
        } else {
            setGrades([]);
        }
    }, [gradeData, gradeError]);
    // Trigger reset ONLY when form values actually change
    useEffect(() => {
        const isTypeChanged = prevValues.current.type !== watchType;
        const isGradeChanged = prevValues.current.grade !== watchGrade;

        if (isTypeChanged || isGradeChanged) {
            onReset();
            prevValues.current = { type: watchType, grade: watchGrade };
        }
    }, [watchType, watchGrade, onReset]);

    // Handle Type Change logic for clearing grade
    useEffect(() => {
        // Update ref if type changes to avoid double reset trigger if we change value manually here?
        // Actually, setValue will trigger another render and effect run, so we need to be careful.
        // But since we updated prevValues in the previous effect, it should be fine.

        if (watchType === '1') {
            // Avoid dependency loop by checking if it's already what we want
            // setValue('emgR_Id', '') is safe.
            setValue('emgR_Id', '0');
        }
    }, [watchType, setValue]);

    const onSubmit = async (values: FormFields) => {
        try {
            console.log('Grade Slab Report payload:', values);
            const [{ data: result }, institutionRes] = await Promise.all([
                getReportDetails(values),
                getMasterInstitution()
            ]);
            const safeData = Array.isArray(result) ? result : [];
            console.info(safeData);
            onReportGenerated(safeData, institutionRes?.success ? institutionRes.data : null);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleCancel = () => {
        reset({
            //type: '1',
            emgR_Id: '0'
        });
        onReset();
    };

    if (initialLoading) {
        return (
            <div className='flex justify-center p-4'>
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    return (
        <div className='mx-auto w-full rounded-lg border border-gray-200 bg-white p-4 shadow-md'>
            <div className='mb-4 flex items-center justify-between border-b pb-2'>
                <h3 className='font-semibold text-gray-800 text-lg'>Grade Slab Report</h3>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Radio Buttons for Type */}
                        <div className='flex items-center justify-center rounded-md bg-gray-50 p-4'>
                            <Controller
                                control={control}
                                name='type'
                                render={({ field }) => (
                                    <div className='flex flex-col space-y-3'>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className='flex flex-row space-x-6'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='1' id='r1' />
                                                <Label htmlFor='r1' className='cursor-pointer font-medium'>
                                                    All
                                                </Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='2' id='r2' />
                                                <Label htmlFor='r2' className='cursor-pointer font-medium'>
                                                    Individual
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Grade Selection */}
                        <div className='flex items-center'>
                            <Controller
                                control={control}
                                name='emgR_Id'
                                render={({ field, fieldState }) => (
                                    <div className='flex w-full flex-col gap-2'>
                                        <div className='flex items-center gap-2'>
                                            <Label className='w-1/4 text-right font-medium text-sm'>
                                                Grade <span className='text-red-500'>*</span>
                                            </Label>
                                            <div className='w-3/4'>
                                                <Select
                                                    key={field.value}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={watchType === '1'}>
                                                    <SelectTrigger className={watchType === '1' ? 'bg-gray-100' : ''}>
                                                        <SelectValue placeholder='Select Grade' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {gradeLoading ? (
                                                            <SelectItem value='0' disabled>
                                                                Grades are loading...
                                                            </SelectItem>
                                                        ) : grades.length === 0 ? (
                                                            <SelectItem value='0' disabled>
                                                                No Grades found
                                                            </SelectItem>
                                                        ) : (
                                                            grades.map((grade: any) => (
                                                                <SelectItem key={grade.emgR_Id} value={String(grade.emgR_Id)}>
                                                                    {grade.emgR_GradeName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {/* Error Message with margin to align with input */}
                                        <div className='pl-[25%]'>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex justify-center gap-4 border-t pt-4'>
                        <Button type='submit' disabled={isSubmitting} className='flex w-fit'>
                            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Report
                        </Button>
                        <Button type='button' variant='outline' onClick={handleCancel} className='flex w-fit'>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
