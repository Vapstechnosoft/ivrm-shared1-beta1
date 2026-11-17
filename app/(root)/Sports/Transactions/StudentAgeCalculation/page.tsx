'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentAgeCalculation } from '@/hooks/sports/useStudentAgeCalculation';
import { type StudentAgeCalculationFormData, studentAgeCalculationSchema } from '@/schemas/sports/transactions/student-age-calculation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function StudentAgeCalculationPage() {
    const { initialData, studentsData, saveData, gridData } = useStudentAgeCalculation();
    const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<StudentAgeCalculationFormData>({
        resolver: zodResolver(studentAgeCalculationSchema),
        defaultValues: {
            ASMAY_Id: undefined,
            ASMCL_Id: undefined,
            ASMS_Id: undefined,
            student: [],
            Till_Date: undefined
        }
    });

    const watchClass = watch('ASMCL_Id');
    const watchSection = watch('ASMS_Id');
    const watchAcademicYear = watch('ASMAY_Id');

    useEffect(() => {
        if (watchAcademicYear && watchClass && watchSection) {
            studentsData.mutate(
                {
                    ASMAY_Id: watchAcademicYear,
                    AMST_Id: 0,
                    ASMCL_Id: watchClass,
                    ASMS_Id: watchSection
                },
                {
                    onSuccess: (res) => {
                        if (res.success && res.data) {
                            setStudentOptions(res.data.map((s) => ({ label: s.label, value: s.id.toString() })));
                        } else {
                            setStudentOptions([]);
                        }
                    }
                }
            );
        } else {
            setStudentOptions([]);
        }
    }, [watchAcademicYear, watchClass, watchSection]);

    const onSubmit = (data: StudentAgeCalculationFormData) => {
        saveData.mutate(data);
    };

    const onCancel = () => {
        reset();
        setStudentOptions([]);
    };

    const columns = [
        { accessorKey: 'id', header: 'SL. No.', cell: ({ row }: any) => <div>{row.index + 1}</div> },
        { accessorKey: 'asmaY_Year', header: 'Academic Year' },
        { accessorKey: 'studentName', header: 'Student Name' },
        { accessorKey: 'asmcL_ClassName', header: 'Class' },
        { accessorKey: 'asmC_SectionName', header: 'Section' },
        { accessorKey: 'age_Years', header: 'Age Year' },
        { accessorKey: 'age_Months', header: 'Month' },
        { accessorKey: 'age_Days', header: "Day's" }
    ];

    if (initialData.isLoading) {
        return (
            <div className='flex h-full items-center justify-center'>
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    const academicYears = initialData.data?.data?.academicYears || [];
    const classes = initialData.data?.data?.classes || [];
    const sections = initialData.data?.data?.sections || [];

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Age Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMAY_Id'
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Academic Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYears.map((year) => (
                                                    <SelectItem key={year.id} value={year.id.toString()}>
                                                        {year.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMAY_Id && <span className='text-destructive text-sm'>{errors.ASMAY_Id.message}</span>}
                            </div>

                            <div className='space-y-2'>
                                <Label>
                                    Class <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMCL_Id'
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Class' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                                        {cls.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMCL_Id && <span className='text-destructive text-sm'>{errors.ASMCL_Id.message}</span>}
                            </div>

                            <div className='space-y-2'>
                                <Label>
                                    Section <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='ASMS_Id'
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Section' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sections.map((sec) => (
                                                    <SelectItem key={sec.id} value={sec.id.toString()}>
                                                        {sec.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMS_Id && <span className='text-destructive text-sm'>{errors.ASMS_Id.message}</span>}
                            </div>

                            <div className='space-y-2'>
                                <Label>
                                    Student Name <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='student'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={studentOptions}
                                            onValueChange={(vals) => field.onChange(vals.map(Number))}
                                            defaultValue={field.value?.map(String) || []}
                                            placeholder='Select Student'
                                            variant='default'
                                            maxCount={3}
                                        />
                                    )}
                                />
                                {errors.student && <span className='text-destructive text-sm'>{errors.student.message}</span>}
                            </div>

                            <div className='space-y-2'>
                                <Label>
                                    Age Till Date <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='Till_Date'
                                    render={({ field }) => <DatePicker date={field.value} setDate={(date) => field.onChange(date)} />}
                                />
                                {errors.Till_Date && <span className='text-destructive text-sm'>{errors.Till_Date.message}</span>}
                            </div>
                        </div>

                        <div className='flex justify-center space-x-2'>
                            <Button type='submit' disabled={saveData.isPending}>
                                {saveData.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Save
                            </Button>
                            <Button type='button' variant='destructive' onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type='button' variant='secondary' onClick={() => window.print()}>
                                Print
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Age Calculated Record</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={gridData.data?.data || initialData.data?.data?.records || []}
                        totalItems={gridData.data?.data?.length || initialData.data?.data?.records?.length || 0}
                    //manualPagination={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
