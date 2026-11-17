'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { breakTimeSettingsSchema } from '@/schemas/timetable/masters';
import { getMaximumPeriodsCount, saveBreakTimeSettings } from '@/server/timetable/masters/breaktimesettings';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { InputNumber } from '@/components/ui/extension/input-number';
import {
    useAcademicYearDropDownMasterDayClasswise,
    useBreakTimeSettingDetails,
    useCategtoryDropDownMasterDayClasswise,
    useDayDropDownMasterDayClasswise
} from '@/hooks/timetable/useMasters';
import { cn } from '@/lib/utils';
import {
    ClassDropDownDataOnchnGeYrAndCategory,
    getClassDropDownMasterDayClasswiseOnchnageofCatandyr
} from '@/server/timetable/masters/masterdayclasswise';
import type { ClassDropDownDataTT, IMasterDayList } from '@/types/timetable/masters/masters';
import { SpinnerTimePicker } from './SpinnerTimePicker';

type FormFields = z.infer<typeof breakTimeSettingsSchema.addOrUpdate>;

interface AddBreakTimeSettingsFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddBreakTimeSettingsForm({ onSuccess, className = '' }: AddBreakTimeSettingsFormProps) {
    const { data: response, refetchAll } = useBreakTimeSettingDetails();
    const [classList, setClassList] = useState<any[]>([]);
    const [periodsBefore, setPeriodsBefore] = useState<{ key: number; label: string }[]>([]);
    const [periodsAfter, setPeriodsAfter] = useState<{ key: number; label: string }[]>([]);
    const [maxPeriods, setMaxPeriods] = useState<number>(0);

    // State for selected periods
    const [selectedBeforePeriods, setSelectedBeforePeriods] = useState<number[]>([]);
    const [selectedAfterPeriods, setSelectedAfterPeriods] = useState<number[]>([]);

    // Search states for periods
    const [beforePeriodSearch, setBeforePeriodSearch] = useState('');
    const [afterPeriodSearch, setAfterPeriodSearch] = useState('');

    // Initial load of dropdowns from response
    const dayList: IMasterDayList[] = (response as any)?.daysDrpDwn || [];

    const [classSearch, setClassSearch] = useState('');
    const [daySearch, setDaySearch] = useState('');
    const [classloading, setClassloading] = useState(false);

    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    const [selectedcalssidsItems, setSelectedcalssidsItems] = useState<{ asmcL_Id: string }[]>([]);
    const [overrideClassData, setOverrideClassData] = useState<ClassDropDownDataTT[] | null>(null);

    const [classdata, setClassdata] = useState<ClassDropDownDataTT[]>([]);

    const {
        data: academicList,
        isLoading: academicLoading,
        error: academicError,
        refetchAll: academicRefetch
    } = useAcademicYearDropDownMasterDayClasswise();

    const {
        data: categoryList,
        isLoading: categoryLoading,
        error: categoryError,
        refetchAll: categoryRefetch
    } = useCategtoryDropDownMasterDayClasswise();

    // const { data: classData, isLoading: classloading, error: classError, refetchAll: classRefetch } = useClassDropDownMasterDayClasswise();

    const {
        data: Masterdaydata,
        isLoading: masterdaydataloading,
        error: masterdaydataError,
        refetchAll: masterdaydataRefetch
    } = useDayDropDownMasterDayClasswise();

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
        defaultValues: {
            // Defaults if needed
        }
    });

    const watchedAcademicYear = watch('asmay_id');
    const watchedCategory = watch('ttmC_Id');
    const watchedClasses = watch('calssids');
    const watchedAfterPeriod = watch('ttmB_AfterPeriod');

    const academicyear = watch('asmay_id');
    const category = watch('ttmC_Id');

    // Fetch classes when academic year or category changes
    useEffect(() => {
        if (watchedAcademicYear && watchedCategory) {
            const fetchClasses = async () => {
                try {
                    setIsLoadingClasses(true);
                    const res = await ClassDropDownDataOnchnGeYrAndCategory(academicyear, category);

                    console.log('getClassDropDownMasterDayClasswiseOnchnageofCatandyr res', res);

                    if (res?.success && Array.isArray(res.data)) {
                        setClassdata(res.data);
                    } else {
                        setClassdata([]);
                    }

                    // Reset class selection when data changes
                    setValue('calssids', undefined as any);
                    setSelectedcalssidsItems([]);
                    setClassSearch('');
                } catch (err) {
                    console.error('Error fetching classes', err);
                    setOverrideClassData([]);
                } finally {
                    setIsLoadingClasses(false);
                }
            };
            fetchClasses();
        } else {
            // Clear class data if either academic year or category is not selected
            setOverrideClassData([]);
            setValue('calssids', undefined as any);
            setSelectedcalssidsItems([]);
        }
    }, [academicyear, category]); // Add dependencies here

    // Watch before and after periods from form
    const watchedBeforePeriods = watch('arraybeforeperiodsList') || [];
    const watchedAfterPeriodsList = watch('arrayafterperiodsList') || [];

    // Fetch max periods when classes are selected
    useEffect(() => {
        const fetchMaxPeriods = async () => {
            if (watchedClasses && watchedClasses.length > 0) {
                try {
                    const classIds = watchedClasses.map((c: any) => c.asmcL_Id);
                    const classidscount = classIds.length;

                    const res = await getMaximumPeriodsCount(0, classidscount);
                    console.log('getMaximumPeriodsCount response:', res);
                    if (res.success) {
                        setMaxPeriods(res.data);
                    } else {
                        setMaxPeriods(0);
                    }
                } catch (err) {
                    console.error('Error fetching max periods', err);
                    setMaxPeriods(0);
                }
            } else {
                setMaxPeriods(0);
            }
        };
        fetchMaxPeriods();
    }, [watchedClasses]);

    // Validate After Period and update period lists
    useEffect(() => {
        if (watchedAfterPeriod !== undefined && maxPeriods > 0) {
            const ap = Number(watchedAfterPeriod);

            // Check if After Period exceeds Max Periods
            if (ap > maxPeriods) {
                toast.error(`After Period cannot exceed Max Periods (${maxPeriods})`);
                setValue('ttmB_AfterPeriod', 0);
                // Reset period lists
                setPeriodsBefore([]);
                setPeriodsAfter([]);
                return;
            }

            // Calculate Before periods (1 to ap)
            const before = [];
            for (let i = 1; i <= ap; i++) {
                before.push({ key: i, label: `Period ${i}` });
            }
            setPeriodsBefore(before);

            // Initialize selected before periods with all periods
            if (before.length > 0) {
                const allBeforeKeys = before.map((p) => p.key);
                setSelectedBeforePeriods(allBeforeKeys);
                setValue('arraybeforeperiodsList', allBeforeKeys);
            }

            // Calculate After periods (ap + 1 to maxPeriods)
            const after = [];
            for (let i = ap + 1; i <= maxPeriods; i++) {
                after.push({ key: i, label: `Period ${i}` });
            }
            setPeriodsAfter(after);

            // Initialize selected after periods with all periods
            if (after.length > 0) {
                const allAfterKeys = after.map((p) => p.key);
                setSelectedAfterPeriods(allAfterKeys);
                setValue('arrayafterperiodsList', allAfterKeys);
            }
        }
    }, [watchedAfterPeriod, maxPeriods, setValue]);

    const classOptions =
        classdata.map((h) => ({
            id: h.asmcL_Id.toString(),
            label: h.asmcL_ClassName
        })) ?? [];

    // Define form value for calss_ids
    const calss_ids = watch('calssids') || [];
    const day_ids = watch('dayids') || [];

    const toggleClass = (id: string) => {
        let updated = [];

        if (calss_ids.includes(id)) {
            updated = calss_ids.filter((v: string) => v !== id);
        } else {
            updated = [...calss_ids, id];
        }

        if (updated.length === 0) {
            setValue('calssids', undefined as any);
        } else {
            setValue('calssids', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedcalssidsItems(updated.map((x) => ({ asmcL_Id: x })));
    };

    const selectAllcalssids = () => {
        const source =
            classSearch.trim().length > 0
                ? filteredcalssids.map((h?: ClassDropDownDataTT) => h?.asmcL_Id.toString())
                : classOptions.map((h) => h.id);

        const isAllSelected = source.every((id?: string) => id && calss_ids.includes(id));

        if (isAllSelected) {
            const remaining = calss_ids.filter((id) => !source.includes(id));

            if (remaining.length === 0) {
                setValue('calssids', undefined as any);
            } else {
                setValue('calssids', remaining as [string, ...string[]], {
                    shouldValidate: true
                });
            }
        } else {
            const merged = Array.from(new Set([...calss_ids, ...source]));
            setValue('calssids', merged as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedcalssidsItems(
            (classSearch.trim().length > 0 ? filteredcalssids : classdata || []).map((x?: ClassDropDownDataTT) => ({
                asmcL_Id: x?.asmcL_Id.toString() || ''
            }))
        );
    };

    const filteredcalssids = classdata?.filter((h) => h.asmcL_ClassName.toLowerCase().includes(classSearch.toLowerCase())) ?? [];

    const filteredDayIds = Masterdaydata?.data?.filter((d) => d.ttmD_DayName.toLowerCase().includes(daySearch.toLowerCase())) ?? [];

    const toggleDay = (id: string) => {
        let updated: string[] = [];

        if (day_ids.includes(id)) {
            updated = day_ids.filter((v) => v !== id);
        } else {
            updated = [...day_ids, id];
        }

        if (updated.length === 0) {
            setValue('dayids', undefined as any);
        } else {
            setValue('dayids', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }
    };

    const selectAllDayIds = () => {
        const source =
            daySearch.trim().length > 0
                ? filteredDayIds.map((d) => d.ttmD_Id.toString())
                : (Masterdaydata?.data?.map((d) => d.ttmD_Id.toString()) ?? []);

        const isAllSelected = source.every((id) => day_ids.includes(id));

        if (isAllSelected) {
            const remaining = day_ids.filter((id) => !source.includes(id));

            if (remaining.length === 0) {
                setValue('dayids', undefined as any);
            } else {
                setValue('dayids', remaining as [string, ...string[]], {
                    shouldValidate: true
                });
            }
        } else {
            const merged = Array.from(new Set([...day_ids, ...source]));
            setValue('dayids', merged as [string, ...string[]], {
                shouldValidate: true
            });
        }
    };

    // Toggle Before Period selection
    const toggleBeforePeriod = (period: number) => {
        let updated: number[] = [...selectedBeforePeriods];

        if (updated.includes(period)) {
            updated = updated.filter((p) => p !== period);
        } else {
            updated.push(period);
        }

        setSelectedBeforePeriods(updated);
        setValue('arraybeforeperiodsList', updated);
    };

    // Select All Before Periods
    const selectAllBeforePeriods = () => {
        const filteredBefore = periodsBefore.filter((p) => p.label.toLowerCase().includes(beforePeriodSearch.toLowerCase()));

        const filteredKeys = filteredBefore.map((p) => p.key);
        const isAllSelected = filteredKeys.every((key) => selectedBeforePeriods.includes(key));

        if (isAllSelected) {
            // Unselect filtered items
            const remaining = selectedBeforePeriods.filter((key) => !filteredKeys.includes(key));
            setSelectedBeforePeriods(remaining);
            setValue('arraybeforeperiodsList', remaining);
        } else {
            // Select all filtered items
            const merged = Array.from(new Set([...selectedBeforePeriods, ...filteredKeys]));
            setSelectedBeforePeriods(merged);
            setValue('arraybeforeperiodsList', merged);
        }
    };

    // Toggle After Period selection
    const toggleAfterPeriod = (period: number) => {
        let updated: number[] = [...selectedAfterPeriods];

        if (updated.includes(period)) {
            updated = updated.filter((p) => p !== period);
        } else {
            updated.push(period);
        }

        setSelectedAfterPeriods(updated);
        setValue('arrayafterperiodsList', updated);
    };

    // Select All After Periods
    const selectAllAfterPeriods = () => {
        const filteredAfter = periodsAfter.filter((p) => p.label.toLowerCase().includes(afterPeriodSearch.toLowerCase()));

        const filteredKeys = filteredAfter.map((p) => p.key);
        const isAllSelected = filteredKeys.every((key) => selectedAfterPeriods.includes(key));

        if (isAllSelected) {
            // Unselect filtered items
            const remaining = selectedAfterPeriods.filter((key) => !filteredKeys.includes(key));
            setSelectedAfterPeriods(remaining);
            setValue('arrayafterperiodsList', remaining);
        } else {
            // Select all filtered items
            const merged = Array.from(new Set([...selectedAfterPeriods, ...filteredKeys]));
            setSelectedAfterPeriods(merged);
            setValue('arrayafterperiodsList', merged);
        }
    };

    const filteredBeforePeriods = periodsBefore.filter((p) => p.label.toLowerCase().includes(beforePeriodSearch.toLowerCase()));

    const filteredAfterPeriods = periodsAfter.filter((p) => p.label.toLowerCase().includes(afterPeriodSearch.toLowerCase()));

    useEffect(() => {
        const fetchClassesOnCategoryChange = async () => {
            if (!watchedAcademicYear || !watchedCategory) return;

            try {
                setIsLoadingClasses(true);

                const res = await getClassDropDownMasterDayClasswiseOnchnageofCatandyr(watchedAcademicYear, watchedCategory);

                if (res?.data?.length) {
                    setOverrideClassData(res.data);
                } else {
                    setOverrideClassData([]);
                }

                setValue('calssids', undefined as any);
                setClassSearch('');
            } catch (err) {
                console.error('Error fetching classes on category change', err);
                setOverrideClassData([]);
            } finally {
                setIsLoadingClasses(false);
            }
        };

        fetchClassesOnCategoryChange();
    }, [watchedCategory]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            // Validate After Period
            if (Number(data.ttmB_AfterPeriod) > maxPeriods) {
                toast.error(`After Period cannot exceed Max Periods (${maxPeriods})`);
                return;
            }

            const payload = {
                TTMB_Id: 0,
                TTMB_BreakName: data.ttmB_BreakName,
                TTMB_BreakStartTime: data.ttmB_BreakStartTime,
                TTMB_BreakEndTime: data.ttmB_BreakEndTime,
                TTMB_AfterPeriod: data.ttmB_AfterPeriod,
                ArraybeforeperiodsList: selectedBeforePeriods.map((p) => ({ TTPeriodnameB: p })),
                ArrayafterperiodsList: selectedAfterPeriods.map((p) => ({ TTPeriodnameA: p })),
                TTMB_ActiveFlag: true
            };

            const response = await saveBreakTimeSettings(payload as any);
            if (response.success) {
                toast.success(response.message);
                reset();
                // Reset period selections
                setSelectedBeforePeriods([]);
                setSelectedAfterPeriods([]);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmay_id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading Academic Years...
                                                </SelectItem>
                                            ) : academicError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading Academic Years...
                                                </SelectItem>
                                            ) : (
                                                academicList?.data?.map((item) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmay_id && <span className='text-red-500 text-sm'>{errors.asmay_id.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Class <span className='text-red-500'>*</span>
                            </Label>

                            <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                <InputText
                                    placeholder='Search classes...'
                                    value={classSearch}
                                    onChange={(e) => setClassSearch(e.target.value)}
                                    className='mb-3'
                                />

                                {classdata && (
                                    <div
                                        onClick={selectAllcalssids}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            calss_ids.length === classOptions.length && classOptions.length
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {calss_ids.length === classOptions.length && classOptions.length ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>
                                )}

                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                    {isLoadingClasses ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>Loading Classes...</div>
                                    ) : !academicyear || !category ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>
                                            Please select Academic Year and Category first
                                        </div>
                                    ) : filteredcalssids.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>
                                            {classSearch ? `No classes found for "${classSearch}"` : 'No classes available'}
                                        </div>
                                    ) : (
                                        filteredcalssids.map((u) => {
                                            const id = u.asmcL_Id.toString();
                                            const selected = calss_ids.includes(id);

                                            return (
                                                <div
                                                    key={u.asmcL_Id}
                                                    onClick={() => toggleClass(id)}
                                                    className={cn(
                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                        selected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-gray-300 hover:border-primary/40'
                                                    )}>
                                                    {selected ? (
                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                    ) : (
                                                        <Square className='h-4 w-4 text-gray-400' />
                                                    )}
                                                    <span>{u.asmcL_ClassName}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            {errors.calssids && <span className='text-red-500 text-sm'>{errors.calssids.message}</span>}
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
                                render={({ field }) => <SpinnerTimePicker value={field.value} onChange={field.onChange} />}
                            />
                            {errors.ttmB_BreakStartTime && <FormError>{errors.ttmB_BreakStartTime.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label>Before Periods (1 to {watchedAfterPeriod || 0})</Label>

                            <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                <InputText
                                    placeholder='Search before periods...'
                                    value={beforePeriodSearch}
                                    onChange={(e) => setBeforePeriodSearch(e.target.value)}
                                    className='mb-3'
                                />

                                {periodsBefore.length > 0 && (
                                    <div
                                        onClick={selectAllBeforePeriods}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            filteredBeforePeriods.every((p) => selectedBeforePeriods.includes(p.key))
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {filteredBeforePeriods.every((p) => selectedBeforePeriods.includes(p.key)) ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>
                                )}

                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                    {periodsBefore.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>
                                            {maxPeriods === 0 ? 'Please select classes first' : 'Enter After Period to see before periods'}
                                        </div>
                                    ) : filteredBeforePeriods.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>No periods found</div>
                                    ) : (
                                        filteredBeforePeriods.map((p) => {
                                            const selected = selectedBeforePeriods.includes(p.key);

                                            return (
                                                <div
                                                    key={p.key}
                                                    onClick={() => toggleBeforePeriod(p.key)}
                                                    className={cn(
                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                        selected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-gray-300 hover:border-primary/40'
                                                    )}>
                                                    {selected ? (
                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                    ) : (
                                                        <Square className='h-4 w-4 text-gray-400' />
                                                    )}
                                                    <span>{p.label}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label>
                                Category Name <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='ttmC_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Category' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading CategoryData
                                                </SelectItem>
                                            ) : categoryError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading CategoryData
                                                </SelectItem>
                                            ) : (
                                                categoryList?.data?.map((item) => (
                                                    <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                        {item.ttmC_CategoryName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ttmC_Id && <span className='text-red-500 text-sm'>{errors.ttmC_Id.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Day <span className='text-red-500'>*</span>
                            </Label>

                            <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                <InputText
                                    placeholder='Search Day...'
                                    value={daySearch}
                                    onChange={(e) => setDaySearch(e.target.value)}
                                    className='mb-3'
                                />

                                {Masterdaydata?.data && (
                                    <div
                                        onClick={selectAllDayIds}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            day_ids.length === (daySearch.trim() ? filteredDayIds.length : Masterdaydata.data.length) &&
                                                day_ids.length
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {day_ids.length === (daySearch.trim() ? filteredDayIds.length : Masterdaydata.data.length) &&
                                        day_ids.length ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>
                                )}

                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                    {masterdaydataloading ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>Loading Days...</div>
                                    ) : filteredDayIds.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>No Day found</div>
                                    ) : (
                                        filteredDayIds.map((d) => {
                                            const id = d.ttmD_Id.toString();
                                            const selected = day_ids.includes(id);

                                            return (
                                                <div
                                                    key={d.ttmD_Id}
                                                    onClick={() => toggleDay(id)}
                                                    className={cn(
                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                        selected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-gray-300 hover:border-primary/40'
                                                    )}>
                                                    {selected ? (
                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                    ) : (
                                                        <Square className='h-4 w-4 text-gray-400' />
                                                    )}
                                                    <span>{d.ttmD_DayName}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {errors.dayids && <span className='text-red-500 text-sm'>{errors.dayids.message}</span>}
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <Label className='flex-1'>
                                    After Period <span className='text-red-500'>*</span>
                                </Label>
                                {maxPeriods > 0 && <span className='text-muted-foreground text-xs'>Max Periods: {maxPeriods}</span>}
                            </div>
                            <Controller
                                control={control}
                                name='ttmB_AfterPeriod'
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            if (value > maxPeriods) {
                                                toast.error(`After Period cannot exceed Max Periods (${maxPeriods})`);
                                            }
                                        }}
                                        error={errors.ttmB_AfterPeriod?.message}
                                    />
                                )}
                            />
                            {errors.ttmB_AfterPeriod && <FormError>{errors.ttmB_AfterPeriod.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                End Time <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='ttmB_BreakEndTime'
                                render={({ field }) => <SpinnerTimePicker value={field.value} onChange={field.onChange} />}
                            />
                            {errors.ttmB_BreakEndTime && <FormError>{errors.ttmB_BreakEndTime.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                After Periods ({watchedAfterPeriod ? watchedAfterPeriod + 1 : 1} to {maxPeriods})
                            </Label>

                            <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                                <InputText
                                    placeholder='Search after periods...'
                                    value={afterPeriodSearch}
                                    onChange={(e) => setAfterPeriodSearch(e.target.value)}
                                    className='mb-3'
                                />

                                {periodsAfter.length > 0 && (
                                    <div
                                        onClick={selectAllAfterPeriods}
                                        className={cn(
                                            'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                            filteredAfterPeriods.every((p) => selectedAfterPeriods.includes(p.key))
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-300 hover:border-primary/40'
                                        )}>
                                        {filteredAfterPeriods.every((p) => selectedAfterPeriods.includes(p.key)) ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>Select All</span>
                                    </div>
                                )}

                                <div className='max-h-40 overflow-y-auto rounded-md border border-gray-300 p-1'>
                                    {periodsAfter.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>
                                            {maxPeriods === 0 ? 'Please select classes first' : 'Enter After Period to see after periods'}
                                        </div>
                                    ) : filteredAfterPeriods.length === 0 ? (
                                        <div className='py-4 text-center text-gray-500 text-sm'>No periods found</div>
                                    ) : (
                                        filteredAfterPeriods.map((p) => {
                                            const selected = selectedAfterPeriods.includes(p.key);

                                            return (
                                                <div
                                                    key={p.key}
                                                    onClick={() => toggleAfterPeriod(p.key)}
                                                    className={cn(
                                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-all',
                                                        selected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-gray-300 hover:border-primary/40'
                                                    )}>
                                                    {selected ? (
                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                    ) : (
                                                        <Square className='h-4 w-4 text-gray-400' />
                                                    )}
                                                    <span>{p.label}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                        Reset
                    </Button>
                    <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Saving...'>
                        <Save className='mr-2 h-4 w-4' />
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}
