'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker/time-picker';
import { usePeriodDistributionDetails } from '@/hooks/timetable/useMasters';
import { periodTimeSettingSchema } from '@/schemas/timetable/masters';
import { getPeriodTimeSettingDetails, savePeriodTimeSetting } from '@/server/timetable/masters/periodtimesetting';
import type { IPeriodTimeSettingData, ITimeTableMasterAcademicYear, ITimeTableMasterCategory } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof periodTimeSettingSchema.save>;

interface PeriodTimeSettingFormProps {
    onSuccess?: () => void;
}

export default function PeriodTimeSettingForm({ onSuccess }: PeriodTimeSettingFormProps) {
    const { data: response } = usePeriodDistributionDetails();
    const { selectedRow: editData, closeEditForm } = useFormContext<IPeriodTimeSettingData>();

    // Explicitly Type Data Sources
    const academicList: ITimeTableMasterAcademicYear[] = (response as any)?.academiclist || [];
    const categoryList: ITimeTableMasterCategory[] = (response as any)?.catelist || [];
    const periodList: any[] = (response as any)?.perioddrp || [];
    const dayList: any[] = (response as any)?.daydrp || [];

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(periodTimeSettingSchema.save),
        defaultValues: {
            dayIds: []
        }
    });

    const watchedDayIds = watch('dayIds');

    // Populate Form on Edit
    useEffect(() => {
        if (Array.isArray(editData) && editData.ttmdpT_Id) {
            const fetchData = async () => {
                try {
                    const res: any = await getPeriodTimeSettingDetails(editData.ttmdpT_Id);
                    if (res?.periodlistedit?.length > 0) {
                        const data = res.periodlistedit[0];
                        setValue('ttmdpT_Id', data.ttmdpT_Id);
                        setValue('asmaY_Id', data.asmaY_Id);
                        setValue('ttmC_Id', data.ttmC_Id);
                        setValue('ttmP_Id', data.ttmP_Id);

                        // Parse Time
                        // Assuming time comes as "10:30 AM" or similar string, need to convert to Date object for TimePicker
                        // Use a dummy date and set time
                        const parseTime = (timeStr: string) => {
                            const [time, modifier] = timeStr.split(' ');
                            let [hours, minutes] = time.split(':');
                            if (hours === '12') {
                                hours = '00';
                            }
                            if (modifier === 'PM') {
                                hours = (Number.parseInt(hours, 10) + 12).toString();
                            }
                            const date = new Date();
                            date.setHours(Number.parseInt(hours, 10));
                            date.setMinutes(Number.parseInt(minutes, 10));
                            date.setSeconds(0);
                            return date;
                        };

                        if (data.ttmdpT_StartTime) setValue('startTime', parseTime(data.ttmdpT_StartTime));
                        if (data.ttmdpT_EndTime) setValue('endTime', parseTime(data.ttmdpT_EndTime));

                        // Set Day
                        // Edit mode usually returns a single day for the record, but form supports multiple for creation
                        // We will set the single day in the array
                        const selectedDay = dayList.find((d) => d.ttmD_Id === data.ttmD_Id);
                        if (selectedDay) {
                            setValue('dayIds', [selectedDay]); // Just set the object directly if schema allows or structure accordingly
                        }
                    }
                } catch (err) {
                    console.error('Error fetching details', err);
                    toast.error('Failed to fetch details');
                }
            };
            fetchData();
        }
    }, [editData, setValue, dayList]);

    const onSubmit = async (data: FormFields) => {
        try {
            // Format times to "h:mm a"
            const formatTime = (date: Date) => format(date, 'h:mm a');

            const payload = {
                TTMDPT_Id: data.ttmdpT_Id || 0,
                ASMAY_Id: data.asmaY_Id,
                TTMC_Id: data.ttmC_Id,
                TTMP_Id: data.ttmP_Id,
                TTMDPT_StartTime: formatTime(data.startTime),
                TTMDPT_EndTime: formatTime(data.endTime),
                datidss: data.dayIds.map((d: any) => ({
                    ttmD_Id: d.ttmD_Id,
                    cls: true // Legacy expects this boolean structure inside the object often
                }))
            };

            // Legacy sends the day object with 'cls' property set to true.
            // My schema expects Objects.

            const response = await savePeriodTimeSetting(payload);
            if (response.returnval) {
                toast.success('Record Saved/Updated Successfully');
                onSuccess?.();
                cancelEdit();
            } else {
                toast.error('Failed to Save Record');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    const cancelEdit = () => {
        reset();
        closeEditForm();
    };

    // Helper to toggle day selection
    const toggleDay = (day: any) => {
        const currentDays = watch('dayIds') || [];
        const exists = currentDays.find((d: any) => d.ttmD_Id === day.ttmD_Id);
        if (exists) {
            setValue(
                'dayIds',
                currentDays.filter((d: any) => d.ttmD_Id !== day.ttmD_Id)
            );
        } else {
            setValue('dayIds', [...currentDays, day]);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
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
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicList.map((item) => (
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

                <div className='space-y-2'>
                    <Label>
                        Category Name <span className='text-red-500'>*</span>
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
                                    {categoryList.map((item) => (
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
                        No of Period <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ttmP_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
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
                    {errors.ttmP_Id && <span className='text-red-500 text-sm'>{errors.ttmP_Id.message}</span>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        Day <span className='text-red-500'>*</span>
                    </Label>
                    <div className='flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border bg-muted/20 p-2'>
                        {dayList.map((day: any) => (
                            <div
                                key={day.ttmD_Id}
                                className='flex cursor-pointer items-center space-x-2 rounded border bg-background p-2 hover:bg-accent'
                                onClick={() => toggleDay(day)}>
                                <Checkbox
                                    checked={watchedDayIds?.some((d: any) => d.ttmD_Id === day.ttmD_Id)}
                                    onCheckedChange={() => toggleDay(day)}
                                />
                                <Label className='cursor-pointer font-normal'>{day.ttmD_DayName}</Label>
                            </div>
                        ))}
                    </div>
                    {errors.dayIds && <span className='text-red-500 text-sm'>{errors.dayIds.message}</span>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        From Time <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='startTime'
                        render={({ field }) => <TimePicker date={field.value} setDate={field.onChange} />}
                    />
                    {errors.startTime && <span className='text-red-500 text-sm'>{errors.startTime.message}</span>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        To Time <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='endTime'
                        render={({ field }) => <TimePicker date={field.value} setDate={field.onChange} />}
                    />
                    {errors.endTime && <span className='text-red-500 text-sm'>{errors.endTime.message}</span>}
                </div>
            </div>

            <div className='flex justify-center gap-3'>
                <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' />
                    {editData ? 'Update' : 'Save'}
                </Button>
                <Button type='button' variant='destructive' onClick={cancelEdit}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
