'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { examMarksCalculationSchemaSchema } from '@/schemas/exam/exam-module/exam-mark-calculation';
import { getExamCalculation } from '@/server/exam/exam-module/calculation/exam-mark-calculation';
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist
} from '@/server/exam/exam-module/reports/cumulative-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
// biome-ignore lint/style/useImportType: <explanation>
import { z } from 'zod';

type FormFields = z.infer<typeof examMarksCalculationSchemaSchema.addOrUpdate>;

export default function ExamMarksCalculationForm() {
    const methods = useForm<FormFields>({
        resolver: zodResolver(examMarksCalculationSchemaSchema.addOrUpdate),
        defaultValues: {
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: 0
        }
    });

    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { isSubmitting } = formState;

    const selectedYear = useWatch({ control, name: 'asmaY_Id' });
    const selectedClass = useWatch({ control, name: 'asmcL_Id' });
    const selectedSection = useWatch({ control, name: 'asmS_Id' });

    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);

    const { data: academicData } = useAcademicYearDropdown();

    useEffect(() => {
        if (academicData?.data) {
            setAcademicYears(academicData.data);
        }
    }, [academicData]);

    // Load Classes
    useEffect(() => {
        if (!selectedYear || selectedYear === 0) {
            setClasses([]);
            setSections([]);
            setExams([]);
            setValue('asmcL_Id', 0);
            setValue('asmS_Id', 0);
            setValue('emE_Id', 0);
            return;
        }
        (async () => {
            try {
                const { data } = await getClassDropDownByAcademicYearlist(selectedYear);
                setClasses(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load classes');
                setClasses([]);
            }
        })();
    }, [selectedYear, setValue]);

    // Load Sections
    useEffect(() => {
        if (!selectedYear || !selectedClass || selectedClass === 0) {
            setSections([]);
            setExams([]);
            setValue('asmS_Id', 0);
            setValue('emE_Id', 0);
            return;
        }
        (async () => {
            try {
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(selectedYear, selectedClass);
                setSections(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load sections');
                setSections([]);
            }
        })();
    }, [selectedYear, selectedClass, setValue]);

    // Load Exams
    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSection || selectedSection === 0) {
            setExams([]);
            setValue('emE_Id', 0);
            return;
        }
        (async () => {
            try {
                const { data } = await getExamsDropDownByAcademicYearandClassandSectionlist(selectedYear, selectedClass, selectedSection);
                setExams(Array.isArray(data) ? data : []);
            } catch {
                toast.error('Failed to load exams');
                setExams([]);
            }
        })();
    }, [selectedYear, selectedClass, selectedSection, setValue]);

    const onSubmit = async (data: FormFields) => {
        try {
            console.log(data.asmS_Id, data.asmcL_Id, data.asmaY_Id, data.emE_Id);
            const response = await getExamCalculation(data.asmaY_Id, data.asmcL_Id, data.asmS_Id, data.emE_Id);
            console.log('response', response);

            // Handle API response based on C# implementation
            if (response.success) {
                toast.success(response.message || 'Exam marks calculated successfully!');
                // Optionally reset form after successful calculation
                // reset();
            } else {
                toast.error(response.message || 'Calculation failed');
            }
        } catch (error: any) {
            console.error('Calculation error:', error);
            toast.error(error?.message || 'An error occurred during calculation');
        }
    };

    const handleCancel = () => {
        reset();
        toast.info('Form cleared');
    };

    return (
        <>
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
                <div className='p-6'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>
                            {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-6'>
                                    <Controller
                                        name='asmaY_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            // biome-ignore lint/nursery/useSortedClasses: <explanation>
                                            <div className='flex flex-col sm:flex-row gap-3'>
                                                <Label className='w-32 font-medium'>
                                                    Academic Year <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Select
                                                        onValueChange={(v) => field.onChange(Number(v))}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Academic Year' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {academicYears.map((y) => (
                                                                <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                                                    {y.asmaY_Year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='asmcL_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            // biome-ignore lint/nursery/useSortedClasses: <explanation>
                                            <div className='flex flex-col sm:flex-row gap-3'>
                                                <Label className='w-32 font-medium'>
                                                    Class <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Select
                                                        disabled={!selectedYear || selectedYear === 0}
                                                        onValueChange={(v) => field.onChange(Number(v))}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Class' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {classes.map((c) => (
                                                                <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                                                    {c.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='asmS_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            // biome-ignore lint/nursery/useSortedClasses: <explanation>
                                            <div className='flex flex-col sm:flex-row gap-3'>
                                                <Label className='w-32 font-medium'>
                                                    Section <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Select
                                                        disabled={!selectedClass || selectedClass === 0}
                                                        onValueChange={(v) => field.onChange(Number(v))}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Section' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sections.map((s) => (
                                                                <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                                                    {s.asmC_SectionName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name='emE_Id'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            // biome-ignore lint/nursery/useSortedClasses: <explanation>
                                            <div className='flex flex-col sm:flex-row gap-3'>
                                                <Label className='w-32 font-medium'>
                                                    Exam Name <span className='text-red-500'>*</span>
                                                </Label>
                                                <div className='flex-1'>
                                                    <Select
                                                        disabled={!selectedSection || selectedSection === 0}
                                                        onValueChange={(v) => field.onChange(Number(v))}
                                                        value={field.value ? String(field.value) : ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Exam Name' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {exams.map((e) => (
                                                                <SelectItem key={e.emE_Id} value={String(e.emE_Id)}>
                                                                    {e.emE_ExamName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className='flex items-center justify-center'>
                                    <div className='text-center text-muted-foreground'>
                                        <Calculator className='mx-auto h-16 w-16 text-gray-400' />
                                        <p className='mt-4'>Select all fields to calculate exam marks</p>
                                    </div>
                                </div>
                            </div>

                            <hr className='my-8' />

                            <div className='flex justify-center gap-4'>
                                <Button type='submit' disabled={isSubmitting} className='min-w-[160px]'>
                                    <Calculator className='mr-2 h-4 w-4' />
                                    {isSubmitting ? 'Calculating...' : 'Calculation'}
                                </Button>
                                <Button type='button' variant='outline' onClick={handleCancel}>
                                    <RotateCcw className='mr-2 h-4 w-4' />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    );
}
