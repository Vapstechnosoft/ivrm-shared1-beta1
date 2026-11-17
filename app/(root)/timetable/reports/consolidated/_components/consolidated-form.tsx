'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
//import { Combobox } from '@/components/ui/combobox';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { consolidatedReportSchema } from '@/schemas/timetable/reports';
import { getClassByCategory } from '@/server/timetable/masters/perioddistribution';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormFields = z.infer<typeof consolidatedReportSchema.search>;

interface ConsolidatedFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
}

export default function ConsolidatedForm({ initialData, onSubmit }: ConsolidatedFormProps) {
    const [classList, setClassList] = useState<any[]>([]);

    // Initial lists from props
    const academicList = initialData?.acayear || [];
    const categoryList = initialData?.cateoglst || [];
    const staffList = initialData?.stafflst || [];
    const periodList = initialData?.periodslst || [];
    const daysList = initialData?.dayslst_fix || [];
    const sectionList = initialData?.sectionlists || [];

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(consolidatedReportSchema.search),
        defaultValues: {
            type: 'ST',
            rpttyp: 'SAWC',
            rpttypai: false
        }
    });

    const watchedType = watch('type');
    const watchedAcademicYear = watch('asmaY_Id');
    const watchedCategory = watch('ttmC_Id');

    // Fetch classes when Category changes
    useEffect(() => {
        const fetchClasses = async () => {
            setValue('classId', []); // Reset classes
            if (watchedAcademicYear && watchedCategory) {
                try {
                    const res = await getClassByCategory({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory
                    });
                    if (res && (res as any).classbycategory) {
                        setClassList((res as any).classbycategory);
                    } else {
                        setClassList([]);
                    }
                } catch (err) {
                    console.error('Error fetching classes', err);
                    setClassList([]);
                }
            } else {
                setClassList([]);
            }
        };
        // Only fetch if Type is 'ST' where Category is used, or if needed for others
        if (watchedType === 'ST') {
            fetchClasses();
        }
    }, [watchedAcademicYear, watchedCategory, watchedType, setValue]);

    const onFormSubmit = (data: FormFields) => {
        const payload = {
            ASMAY_Id: data.asmaY_Id,
            TYPE: data.type,
            TTMC_Id: data.ttmC_Id,
            rpttyp: data.rpttyp,
            rpttypairods: data.rpttypai,
            // Map IDs to expected backend format (e.g. array of objects)
            classdss: data.classId?.map((id) => ({ asmcL_Id: id, claslis: true })) || [],
            sectiondss: data.sectionId?.map((id) => ({ asmS_Id: id, secs: true })) || [],
            stfidss: data.staffId?.map((id) => ({ hrmE_Id: id, stf: true })) || [],
            dayidss: data.dayId?.map((id) => ({ ttmD_Id: id, sayy: true })) || [],
            periodidss: data.periodId?.map((id) => ({ ttmP_Id: id, ppr: true })) || [],
            TTMD_Id: data.singleDayId,
            TTMP_Id: data.singlePeriodId
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6 rounded-lg border bg-white p-6 shadow-sm'>
            {/* Report Type Selection */}
            <div className='space-y-4'>
                <Label className='font-semibold text-base'>Report Type</Label>
                <Controller
                    control={control}
                    name='type'
                    render={({ field }) => (
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='ST' id='r1' /> <Label htmlFor='r1'>STAFF WISE DETAILS</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='STD' id='r2' /> <Label htmlFor='r2'>STAFF DAY WISE</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='CSUB' id='r3' /> <Label htmlFor='r3'>CLASS SUBJECT</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='STSUB' id='r4' /> <Label htmlFor='r4'>STAFF SUBJECT</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='SPW' id='r5' /> <Label htmlFor='r5'>STAFF PERIOD WISE WORKLOAD</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='STFP' id='r6' /> <Label htmlFor='r6'>STAFF FREE PERIOD</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='PSTF' id='r7' /> <Label htmlFor='r7'>PERIOD WISE STAFF FREE</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='SPC' id='r8' /> <Label htmlFor='r8'>STAFF-PERIOD CONSOLIDATED</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='CSPC' id='r9' /> <Label htmlFor='r9'>CLASS-SECTION PERIOD CONSOLIDATED</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='RMR' id='r10' /> <Label htmlFor='r10'>ROOM-WISE REPORT</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='ATG' id='r11' />{' '}
                                <Label htmlFor='r11'>STAFF WORKLOAD AFTER TIMETABLE GENERATION</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>

            <div className='grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Common Field: Academic Year */}
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
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicList.map((item: any) => (
                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                            {item.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <span className='text-red-500 text-sm'>{errors.asmaY_Id.message}</span>}
                </div>

                {/* Specific for ST */}
                {watchedType === 'ST' && (
                    <>
                        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                            <div className='flex items-center space-x-2'>
                                <Controller
                                    control={control}
                                    name='rpttypai'
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id='rpttypai' />
                                    )}
                                />
                                <Label htmlFor='rpttypai'>Teacher Master</Label>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Category <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='ttmC_Id'
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryList.map((item: any) => (
                                                <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                    {item.ttmC_CategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ttmC_Id && <span className='text-red-500 text-sm'>{errors.ttmC_Id.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Class <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='classId'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={classList.map((c: any) => ({ label: c.asmcL_ClassName, value: c.asmcL_Id.toString() }))}
                                        defaultValue={(field.value || []).map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                        placeholder='Select Classes'
                                    />
                                )}
                            />
                            {errors.classId && <span className='text-red-500 text-sm'>{errors.classId.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Section <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='sectionId'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={sectionList.map((s: any) => ({ label: s.asmC_SectionName, value: s.asmS_Id.toString() }))}
                                        defaultValue={(field.value || []).map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                        placeholder='Select Sections'
                                    />
                                )}
                            />
                            {errors.sectionId && <span className='text-red-500 text-sm'>{errors.sectionId.message}</span>}
                        </div>
                    </>
                )}

                {/* Specific for CSUB, STSUB, SPW */}
                {['CSUB', 'STSUB', 'SPW'].includes(watchedType) && (
                    <>
                        <div className='space-y-2'>
                            <Label>
                                Staff Name <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='staffId'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={staffList.map((s: any) => ({ label: s.empName, value: s.hrmE_Id.toString() }))}
                                        defaultValue={(field.value || []).map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                        placeholder='Select Staff'
                                    />
                                )}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>
                                Day <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='dayId'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={daysList.map((d: any) => ({ label: d.ttmD_DayName, value: d.ttmD_Id.toString() }))}
                                        defaultValue={(field.value || []).map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                        placeholder='Select Days'
                                    />
                                )}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>
                                Period <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='periodId'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={periodList.map((p: any) => ({ label: p.ttmP_PeriodName, value: p.ttmP_Id.toString() }))}
                                        defaultValue={(field.value || []).map(String)}
                                        onValueChange={(val) => field.onChange(val.map(Number))}
                                        placeholder='Select Periods'
                                    />
                                )}
                            />
                        </div>
                    </>
                )}

                {/* Specific for STFP, PSTF */}
                {['STFP', 'PSTF'].includes(watchedType) && (
                    <div className='space-y-2'>
                        <Label>
                            Day <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='singleDayId'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select Day--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {daysList.map((item: any) => (
                                            <SelectItem key={item.ttmD_Id} value={item.ttmD_Id.toString()}>
                                                {item.ttmD_DayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Specific for PSTF */}
                {watchedType === 'PSTF' && (
                    <div className='space-y-2'>
                        <Label>
                            Period <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='singlePeriodId'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select Period--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodList.map((item: any) => (
                                            <SelectItem key={item.ttmP_Id} value={item.ttmP_Id.toString()}>
                                                {item.ttmP_PeriodName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Specific for RMR */}
                {watchedType === 'RMR' && (
                    <div className='col-span-1 space-y-2 md:col-span-2'>
                        <Label>Report Option</Label>
                        <Controller
                            control={control}
                            name='rpttyp'
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex space-x-4'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='SAWC' id='SAWC' />{' '}
                                        <Label htmlFor='SAWC'>Subject Along With Class Details</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value='SNWC' id='SNWC' />{' '}
                                        <Label htmlFor='SNWC'>Subject Without Class Details</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>
                )}
            </div>

            <div className='flex justify-center'>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    <Search className='mr-2 h-4 w-4' />
                    Get Report
                </Button>
            </div>
        </form>
    );
}
