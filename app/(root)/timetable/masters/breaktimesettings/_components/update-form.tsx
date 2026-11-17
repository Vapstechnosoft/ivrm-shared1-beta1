'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker/time-picker';
import { useBreakTimeSettingDetails } from '@/hooks/timetable/useMasters';

import { breakTimeSettingsSchema } from '@/schemas/timetable/masters';
import { getBreakTimeSettingsById, getClassByCategory, saveBreakTimeSettings } from '@/server/timetable/masters/breaktimesettings';
import type { IBreakTimeSettingsList, IMasterDayList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof breakTimeSettingsSchema.addOrUpdate>;

interface UpdateBreakTimeSettingsFormProps {
    onSuccess?: () => void;
    selectedRow: IBreakTimeSettingsList;
}

export default function UpdateBreakTimeSettingsForm({ onSuccess, selectedRow }: UpdateBreakTimeSettingsFormProps) {
    const { data: response, refetchAll } = useBreakTimeSettingDetails();
    const [classList, setClassList] = useState<any[]>([]);
    const [periodsBefore, setPeriodsBefore] = useState<any[]>([]);
    const [periodsAfter, setPeriodsAfter] = useState<any[]>([]);
    const [maxPeriods, setMaxPeriods] = useState<number>(0);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const academicList = (response as any)?.academiclist || [];
    const categoryList = (response as any)?.catelist || [];
    const dayList: IMasterDayList[] = (response as any)?.daysDrpDwn || [];

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(breakTimeSettingsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {}
    });

    // Fetch Details on Mount
    useEffect(() => {
        const fetchData = async () => {
            if (selectedRow?.ttmB_Id) {
                try {
                    const res = await getBreakTimeSettingsById(selectedRow.ttmB_Id);
                    if (res?.breaktimelistedit && (res.breaktimelistedit as any[]).length > 0) {
                        const data = (res.breaktimelistedit as any[])[0];

                        // Prefill basic fields
                        setValue('asmay_id', data.asmaY_Id);
                        setValue('ttmC_Id', data.ttmC_Id);
                        setValue('ttmB_BreakName', data.ttmB_BreakName);
                        setValue('ttmB_AfterPeriod', data.ttmB_AfterPeriod);

                        const parseTime = (timeStr: string) => {
                            const d = new Date();
                            const [time, modifier] = timeStr.split(' ');
                            let [hours, minutes] = time.split(':');
                            if (hours === '12') hours = '00';
                            if (modifier === 'PM') hours = (Number.parseInt(hours, 10) + 12).toString();
                            d.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10));
                            return d;
                        };

                        let startTime = new Date(data.ttmB_BreakStartTime);
                        if (Number.isNaN(startTime.getTime())) startTime = parseTime(data.ttmB_BreakStartTime);

                        let endTime = new Date(data.ttmB_BreakEndTime);
                        if (Number.isNaN(endTime.getTime())) endTime = parseTime(data.ttmB_BreakEndTime);

                        setValue('ttmB_BreakStartTime', startTime);
                        setValue('ttmB_BreakEndTime', endTime);

                        // Trigger class fetch
                        const classRes = await getClassByCategory({
                            ASMAY_Id: data.asmaY_Id,
                            TTMC_Id: data.ttmC_Id
                        });
                        if (classRes?.classbycategory) {
                            setClassList(classRes.classbycategory as any[]);

                            const selectedcalssids = (res.breaktimelistedit as any[]).map((r: any) => r.asmcL_Id);
                            const uniquecalssids = Array.from(new Set(selectedcalssids));

                            const selectedObjs = (classRes.classbycategory as any[])
                                .filter((c: any) => uniquecalssids.includes(c.asmcL_Id))
                                .map((c: any) => ({ asmcL_Id: c.asmcL_Id, asmcL_ClassName: c.asmcL_ClassName }));

                            // setValue('calssids', selectedObjs);
                        }

                        // Set Selected Days
                        const selecteddayids = (res.breaktimelistedit as any[]).map((r: any) => r.ttmD_Id);
                        const uniquedayids = Array.from(new Set(selecteddayids));
                        const selectedDayObjs = dayList
                            .filter((d: any) => uniquedayids.includes(d.ttmD_Id))
                            .map((d: any) => ({ ttmD_Id: d.ttmD_Id, ttmD_DayName: d.ttmD_DayName }));
                        //setValue('dayids', selectedDayObjs);

                        setIsLoadingData(false);
                    }
                } catch (err) {
                    console.error('Error fetching details', err);
                    setIsLoadingData(false);
                }
            }
        };
        fetchData();
    }, [selectedRow]);

    const watchedCategory = watch('ttmC_Id');
    const watchedAcademicYear = watch('asmay_id');
    const watchedClasses = watch('calssids') as any[];
    const watchedAfterPeriod = watch('ttmB_AfterPeriod');

    // Logic for Max Periods
    useEffect(() => {
        const fetchMaxPeriods = async () => {
            if (watchedClasses && watchedClasses.length > 0) {
                try {
                    const classId = watchedClasses[watchedClasses.length - 1].asmcL_Id.toString();
                    const count = watchedClasses.length;
                    // const res = await getMaximumPeriodsCount({ classid: classId, calssidscount: count });
                    // if (res?.calssidscountreturn) {
                    //     setMaxPeriods(res.calssidscountreturn as number);
                    // }
                } catch (err) {
                    console.error('Error fetching max periods', err);
                }
            }
        };
        if (!isLoadingData) fetchMaxPeriods();
    }, [watchedClasses, isLoadingData]);

    useEffect(() => {
        if (watchedAfterPeriod && maxPeriods) {
            const ap = Number(watchedAfterPeriod);
            const before = [];
            for (let i = 1; i <= ap; i++) before.push({ key: i, label: `${i}` });
            setPeriodsBefore(before);

            const after = [];
            for (let i = ap + 1; i <= maxPeriods; i++) after.push({ key: i, label: `${i}` });
            setPeriodsAfter(after);
        }
    }, [watchedAfterPeriod, maxPeriods]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const payload = {
                TTMB_Id: selectedRow.ttmB_Id,
                ASMAY_Id: data.asmay_id,
                TTMC_Id: data.ttmC_Id,
                ArrayClassList: data.calssids,
                ArrayDayList: data.dayids,
                TTMB_BreakName: data.ttmB_BreakName,
                TTMB_BreakStartTime: data.ttmB_BreakStartTime,
                TTMB_BreakEndTime: data.ttmB_BreakEndTime,
                TTMB_AfterPeriod: data.ttmB_AfterPeriod,
                ArraybeforeperiodsList: periodsBefore.map((p) => ({ TTPeriodnameB: p.key })),
                ArrayafterperiodsList: periodsAfter.map((p) => ({ TTPeriodnameA: p.key })),
                TTMB_ActiveFlag: true
            };

            const response = await saveBreakTimeSettings(payload as any);
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoadingData) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='asmay_id'
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
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Class <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='calssids'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={classList.map((c: any) => ({ label: c.asmcL_ClassName, value: c.asmcL_Id.toString() }))}
                                        defaultValue={field.value?.map((v: any) => v.asmcL_Id.toString()) || []}
                                        onValueChange={(vals) => {
                                            const selectedObjs = vals
                                                .map((id) => {
                                                    const found = classList.find((c) => c.asmcL_Id.toString() === id);
                                                    return found
                                                        ? { asmcL_Id: found.asmcL_Id, asmcL_ClassName: found.asmcL_ClassName }
                                                        : null;
                                                })
                                                .filter((x) => x) as any[];
                                            field.onChange(selectedObjs);
                                        }}
                                        placeholder='Select Classes'
                                    />
                                )}
                            />
                        </div>

                        <div className='space-y-2'>
                            <InputText label='Break Name' required {...register('ttmB_BreakName')} error={errors.ttmB_BreakName?.message} />
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Start Time <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='ttmB_BreakStartTime'
                                render={({ field }) => <TimePicker date={field.value} setDate={field.onChange} />}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label>Before Period</Label>
                            <div className='flex flex-wrap gap-2 rounded-md border bg-muted/20 p-2'>
                                {periodsBefore.map((p) => (
                                    <div key={p.key} className='flex items-center space-x-2'>
                                        <Checkbox checked disabled />
                                        <Label className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            {p.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4'>
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
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Day <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='dayids'
                                render={({ field }) => (
                                    <MultiSelect
                                        options={dayList.map((d: any) => ({ label: d.ttmD_DayName, value: d.ttmD_Id.toString() }))}
                                        defaultValue={field.value?.map((v: any) => v.ttmD_Id.toString()) || []}
                                        onValueChange={(vals) => {
                                            const selectedObjs = vals
                                                .map((id) => {
                                                    const found = dayList.find((d) => d.ttmD_Id.toString() === id);
                                                    return found ? { ttmD_Id: found.ttmD_Id, ttmD_DayName: found.ttmD_DayName } : null;
                                                })
                                                .filter((x) => x);
                                            field.onChange(selectedObjs);
                                        }}
                                        placeholder='Select Days'
                                    />
                                )}
                            />
                        </div>

                        <div className='space-y-2'>
                            <InputText
                                label='After Period'
                                required
                                {...register('ttmB_AfterPeriod')}
                                error={errors.ttmB_AfterPeriod?.message}
                                type='number'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                End Time <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='ttmB_BreakEndTime'
                                render={({ field }) => <TimePicker date={field.value} setDate={field.onChange} />}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label>After Period (Remaining)</Label>
                            <div className='flex flex-wrap gap-2 rounded-md border bg-muted/20 p-2'>
                                {periodsAfter.map((p) => (
                                    <div key={p.key} className='flex items-center space-x-2'>
                                        <Checkbox checked disabled />
                                        <Label className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                            {p.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={onSuccess} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Updating...'>
                        <Save className='mr-2 h-4 w-4' />
                        Update
                    </Button>
                </div>
            </form>
        </div>
    );
}
