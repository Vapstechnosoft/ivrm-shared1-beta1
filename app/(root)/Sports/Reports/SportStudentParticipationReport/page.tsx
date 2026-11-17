'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentParticipationReport } from '@/hooks/sports/useStudentParticipationReport';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type SportStudentParticipationReportFormData, sportStudentParticipationReportSchema } from './schema';

export default function SportStudentParticipationReportPage() {
    const { initialData, reportData } = useStudentParticipationReport();
    const [reportGenerated, setReportGenerated] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<SportStudentParticipationReportFormData>({
        resolver: zodResolver(sportStudentParticipationReportSchema),
        defaultValues: {
            type: 'House',
            asmaY_Id: undefined,
            spccmH_Id: [],
            asmcL_Id: undefined,
            asmS_Id: []
        }
    });

    const reportType = watch('type');

    const onSubmit = (data: SportStudentParticipationReportFormData) => {
        reportData.mutate(data);
        setReportGenerated(true);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            .replace(/ /g, '-');
    };

    const columns = [
        { accessorKey: 'id', header: 'SL. No.', cell: ({ row }: any) => <div>{row.index + 1}</div> },
        { accessorKey: 'AMST_AdmNo', header: 'Adm. No.' },
        { accessorKey: 'AMST_Name', header: 'Student Name' },
        { accessorKey: 'ASMCL_ClassName', header: 'Class' },
        { accessorKey: 'ASMC_SectionName', header: 'Section' },
        { accessorKey: 'SPCCMH_HouseName', header: 'House Name' },
        {
            accessorKey: 'AMST_DOB',
            header: 'DOB',
            cell: ({ row }: any) => <div>{formatDate(row.original.AMST_DOB)}</div>
        },
        { accessorKey: 'SPCCMCL_CompitionLevel', header: 'Competition Category' },
        { accessorKey: 'SPCCMSCC_SportsCCName', header: 'Sports Name' },
        {
            accessorKey: 'SPCCE_StartDate',
            header: 'Sports Date',
            cell: ({ row }: any) => <div>{formatDate(row.original.SPCCE_StartDate)}</div>
        }
    ];

    if (initialData.isLoading) {
        return (
            <div className='flex h-full items-center justify-center'>
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    const academicYears = initialData.data?.data?.academicYears || [];
    const houses = initialData.data?.data?.houses || [];
    const classes = initialData.data?.data?.classes || [];
    const sections = initialData.data?.data?.sections || [];

    const houseOptions = houses.map((h) => ({
        label: h.label,
        value: h.id.toString()
    }));

    const sectionOptions = sections.map((s) => ({
        label: s.label,
        value: s.id.toString()
    }));

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Student Participation Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='mb-6 flex justify-center'>
                            <Controller
                                control={control}
                                name='type'
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setReportGenerated(false);
                                        }}
                                        defaultValue={field.value}
                                        className='flex space-x-4'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='House' id='r1' />
                                            <Label htmlFor='r1'>By House</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='CS' id='r2' />
                                            <Label htmlFor='r2'>By Class/Section</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='asmaY_Id'
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
                                {errors.asmaY_Id && <span className='text-destructive text-sm'>{errors.asmaY_Id.message}</span>}
                            </div>

                            {reportType === 'House' && (
                                <div className='space-y-2'>
                                    <Label>
                                        House Name <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='spccmH_Id'
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={houseOptions}
                                                onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                defaultValue={field.value?.map(String) || []}
                                                placeholder='Select House'
                                                variant='default'
                                                maxCount={3}
                                            />
                                        )}
                                    />
                                    {errors.spccmH_Id && <span className='text-destructive text-sm'>{errors.spccmH_Id.message}</span>}
                                </div>
                            )}

                            {reportType === 'CS' && (
                                <>
                                    <div className='space-y-2'>
                                        <Label>
                                            Class Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name='asmcL_Id'
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value?.toString()}>
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
                                        {errors.asmcL_Id && <span className='text-destructive text-sm'>{errors.asmcL_Id.message}</span>}
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>
                                            Section Name <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name='asmS_Id'
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={sectionOptions}
                                                    onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                    defaultValue={field.value?.map(String) || []}
                                                    placeholder='Select Section'
                                                    variant='default'
                                                    maxCount={3}
                                                />
                                            )}
                                        />
                                        {errors.asmS_Id && <span className='text-destructive text-sm'>{errors.asmS_Id.message}</span>}
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>House Name</Label>
                                        <Controller
                                            control={control}
                                            name='spccmH_Id'
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={houseOptions}
                                                    onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                    defaultValue={field.value?.map(String) || []}
                                                    placeholder='Select House'
                                                    variant='default'
                                                    maxCount={3}
                                                />
                                            )}
                                        />
                                        {errors.spccmH_Id && <span className='text-destructive text-sm'>{errors.spccmH_Id.message}</span>}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className='flex justify-center space-x-2'>
                            <Button type='submit' disabled={reportData.isPending}>
                                {reportData.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Report
                            </Button>
                            <Button
                                type='button'
                                variant='destructive'
                                onClick={() => {
                                    reset();
                                    setReportGenerated(false);
                                }}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {reportGenerated && reportData.data?.data && (
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle>Report Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={reportData.data.data}
                            totalItems={reportData.data.data.length}
                            //manualPagination={false}
                        />
                        <div className='mt-4 flex justify-end space-x-2'>
                            <Button onClick={() => window.print()}>Print</Button>
                            <Button variant='outline' onClick={() => toast.info('Excel export implementation pending')}>
                                Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
