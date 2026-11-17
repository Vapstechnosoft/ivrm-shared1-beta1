'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSportVenuewiseParticipationReport } from '@/hooks/sports/useSportVenuewiseParticipationReport';
import {
    type SportVenuewiseParticipationReportFormData,
    type SportVenuewiseReportData,
    sportVenuewiseParticipationReportSchema
} from '@/schemas/sports/transactions/sport-venuewise-participation-report';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function SportVenuewiseParticipationReportPage() {
    const { initialData, detailsData, sectionsData, reportData } = useSportVenuewiseParticipationReport();
    const [houseOptions, setHouseOptions] = useState<{ label: string; value: string }[]>([]);
    const [venueOptions, setVenueOptions] = useState<{ label: string; value: string }[]>([]);
    const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([]);
    const [sectionOptions, setSectionOptions] = useState<{ label: string; value: string }[]>([]);
    const [showReport, setShowReport] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<SportVenuewiseParticipationReportFormData>({
        resolver: zodResolver(sportVenuewiseParticipationReportSchema),
        defaultValues: {
            type: 'House',
            asmaY_Id: undefined,
            spccmeV_Id: [],
            spccmH_Id: [],
            asmcL_Id: undefined,
            asmS_Id: []
        }
    });

    const watchType = watch('type');
    const watchAcademicYear = watch('asmaY_Id');
    const watchClass = watch('asmcL_Id');

    // Fetch details (Classes, Houses, Venues) when Academic Year changes
    useEffect(() => {
        if (watchAcademicYear) {
            detailsData.mutate(
                { ASMAY_Id: watchAcademicYear },
                {
                    onSuccess: (res) => {
                        if (res.success && res.data) {
                            setClassOptions(res.data.classes.map((c) => ({ label: c.label, value: c.id.toString() })));
                            setHouseOptions(res.data.houses.map((h) => ({ label: h.label, value: h.id.toString() })));
                            setVenueOptions(res.data.venues.map((v) => ({ label: v.label, value: v.id.toString() })));
                        }
                    }
                }
            );
        } else {
            setClassOptions([]);
            setHouseOptions([]);
            setVenueOptions([]);
        }
    }, [watchAcademicYear]);

    // Fetch sections when Class changes
    useEffect(() => {
        if (watchAcademicYear && watchClass) {
            sectionsData.mutate(
                { ASMAY_Id: watchAcademicYear, asmcL_Id: watchClass },
                {
                    onSuccess: (res) => {
                        if (res.success && res.data) {
                            setSectionOptions(res.data.map((s) => ({ label: s.label, value: s.id.toString() })));
                        }
                    }
                }
            );
        } else {
            setSectionOptions([]);
        }
    }, [watchAcademicYear, watchClass]);

    const onSubmit = (data: SportVenuewiseParticipationReportFormData) => {
        reportData.mutate(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setShowReport(true);
                }
            }
        });
    };

    const onCancel = () => {
        reset();
        setShowReport(false);
        setHouseOptions([]);
        setVenueOptions([]);
        setClassOptions([]);
        setSectionOptions([]);
    };

    const columns: ColumnDef<SportVenuewiseReportData>[] = [
        { accessorKey: 'id', header: 'SL. No.', cell: ({ row }) => <div>{row.index + 1}</div> },
        { accessorKey: 'spccmH_HouseName', header: 'House Name' },
        { accessorKey: 'spccmeV_EventVenue', header: 'Venue' },
        { accessorKey: 'amsT_Name', header: 'Student Name' },
        { accessorKey: 'amsT_AdmNo', header: 'Adm. No.' },
        { accessorKey: 'asmcL_ClassName', header: 'Class' },
        { accessorKey: 'asmC_SectionName', header: 'Section' },
        { accessorKey: 'spccmE_EventName', header: 'Event' },
        { accessorKey: 'spccmscc_SportsCCName', header: 'Sports Name' },
        { accessorKey: 'spccE_StartDate', header: 'Event Date' }
    ];

    if (initialData.isLoading) {
        return (
            <div className='flex h-full items-center justify-center'>
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    const academicYears = initialData.data?.data?.academicYears || [];

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Venue Wise Participation Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='mb-4 flex justify-center'>
                            <Controller
                                control={control}
                                name='type'
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex space-x-4'>
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

                            {watchType === 'CS' && (
                                <>
                                    <div className='space-y-2'>
                                        <Label>
                                            Class <span className='text-red-500'>*</span>
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
                                                        {classOptions.map((cls) => (
                                                            <SelectItem key={cls.value} value={cls.value}>
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
                                            Section <span className='text-red-500'>*</span>
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
                                </>
                            )}

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

                            <div className='space-y-2'>
                                <Label>
                                    Venue Name <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name='spccmeV_Id'
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={venueOptions}
                                            onValueChange={(vals) => field.onChange(vals.map(Number))}
                                            defaultValue={field.value?.map(String) || []}
                                            placeholder='Select Venue'
                                            variant='default'
                                            maxCount={3}
                                        />
                                    )}
                                />
                                {errors.spccmeV_Id && <span className='text-destructive text-sm'>{errors.spccmeV_Id.message}</span>}
                            </div>
                        </div>

                        <div className='flex justify-center space-x-2'>
                            <Button type='submit' disabled={reportData.isPending}>
                                {reportData.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Report
                            </Button>
                            <Button type='button' variant='destructive' onClick={onCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {showReport && (
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle>Venue Wise Participation Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={reportData.data?.data || []}
                            totalItems={reportData.data?.data?.length || 0}
                            //manualPagination={false}
                        />
                        <div className='mt-4 flex justify-end space-x-2'>
                            <Button onClick={() => window.print()}>Print</Button>
                            <Button variant='outline'>Excel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
