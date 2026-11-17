'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropDownMasterDayClasswise,
    useCategtoryDropDownMasterDayClasswise,
    useDayDropDownMasterDayClasswise,
    useMasterDayClasswiseDetails
} from '@/hooks/timetable/useMasters';
import { cn } from '@/lib/utils';
import { masterDayClasswiseSchema } from '@/schemas/timetable/masters';
import { ClassDropDownDataOnchnGeYrAndCategory } from '@/server/timetable/masters/masterdayclasswise';
import { savePeriodClass } from '@/server/timetable/masters/periodallocation';
import type { ClassDropDownDataTT } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDayClasswiseSchema.addOrUpdate>;

interface MasterPeriodClassFormProps {
    onSuccess?: () => void;
}

export default function MasterDayClassWiseAddForm({ onSuccess }: MasterPeriodClassFormProps) {
    const { refetchAll } = useMasterDayClasswiseDetails();
    const [classSearch, setClassSearch] = useState('');
    const [daySearch, setDaySearch] = useState('');
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [selectedcalssidsItems, setSelectedcalssidsItems] = useState<{ asmcL_Id: string }[]>([]);
    const [overrideClassData, setOverrideClassData] = useState<ClassDropDownDataTT[]>([]);

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

    const {
        data: Masterdaydata,
        isLoading: masterdaydataloading,
        error: masterdaydataError,
        refetchAll: masterdaydataRefetch
    } = useDayDropDownMasterDayClasswise();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDayClasswiseSchema.addOrUpdate),
        //  defaultValues: {}
        defaultValues: {
            asmay_id: undefined,
            ttmC_Id: undefined,
            calssids: undefined,
            dayids: undefined
        }
    });

    const academicyear = watch('asmay_id');
    const category = watch('ttmC_Id');

    // Fetch classes when academic year or category changes
    useEffect(() => {
        if (academicyear && category) {
            const fetchClasses = async () => {
                try {
                    setIsLoadingClasses(true);
                    const res = await ClassDropDownDataOnchnGeYrAndCategory(academicyear, category);

                    console.log('getClassDropDownMasterDayClasswiseOnchnageofCatandyr res', res);

                    if (res?.success && Array.isArray(res.data)) {
                        setOverrideClassData(res.data);
                    } else {
                        setOverrideClassData([]);
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

    // Convert class data to options format
    const classOptions = overrideClassData.map((h: ClassDropDownDataTT) => ({
        id: h.asmcL_Id.toString(),
        label: h.asmcL_ClassName
    }));

    // Define form value for calss_ids
    const calss_ids = watch('calssids') || [];
    const day_ids = watch('dayids') || [];

    // Filter classes based on search
    const filteredcalssids = overrideClassData.filter((h: ClassDropDownDataTT) =>
        h.asmcL_ClassName.toLowerCase().includes(classSearch.toLowerCase())
    );

    const toggleClass = (id: string) => {
        let updated = [];

        if (calss_ids.includes(id)) {
            updated = calss_ids.filter((v: string) => v !== id);
        } else {
            updated = [...calss_ids, id];
        }

        // MUST be tuple: at least 1 element
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
        // Decide source based on search
        const source =
            classSearch.trim().length > 0
                ? filteredcalssids.map((h: ClassDropDownDataTT) => h.asmcL_Id.toString())
                : classOptions.map((h) => h.id);

        const isAllSelected = source.every((id: string) => calss_ids.includes(id));

        if (isAllSelected) {
            // Unselect only the affected items
            const remaining = calss_ids.filter((id) => !source.includes(id));

            if (remaining.length === 0) {
                setValue('calssids', undefined as any);
                setSelectedcalssidsItems([]);
            } else {
                setValue('calssids', remaining as [string, ...string[]], {
                    shouldValidate: true
                });
                setSelectedcalssidsItems(remaining.map((x) => ({ asmcL_Id: x })));
            }
        } else {
            // Merge current + source (avoid duplicates)
            const merged = Array.from(new Set([...calss_ids, ...source]));

            setValue('calssids', merged as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedcalssidsItems(merged.map((x) => ({ asmcL_Id: x })));
        }
    };

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

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                TTMPC_Id: 0,
                ASMAY_Id: data.asmay_id
                // Add other required fields based on your schema
            };

            // TODO: Replace with actual save function for day class wise
            const response = await savePeriodClass(payload);
            if (response.returnval) {
                toast.success('Data successfully Saved');
                onSuccess?.();
                refetchAll();
                handleReset();
            } else if (response.returnduplicatestatus === 'Duplicate') {
                toast.error('Records Already Exist !');
            } else {
                toast.error('Data Not Saved !');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };

    const handleReset = () => {
        reset();
        // //     asmay_id: null,
        // //     ttmC_Id: null,
        // //     calssids: [],
        // //     dayids: []
        // //   });
        // academicRefetch();
        // categoryRefetch();
        // masterdaydataRefetch();
        // setSelectedcalssidsItems([]);
        // setClassSearch('');
        // setDaySearch('');
        // setIsLoadingClasses(false);

        // // 🔥 IMPORTANT
        // setOverrideClassData([]);
        // setSelectedcalssidsItems([]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='asmay_id'
                        control={control}
                        render={({ field }) => (
                            <Select
                                key={field.value?.toString() || 'empty'}
                                onValueChange={(value) => {
                                    field.onChange(value ? Number(value) : '');
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
                        Category Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='ttmC_Id'
                        control={control}
                        render={({ field }) => (
                            <Select
                                key={field.value?.toString() || 'empty'}
                                onValueChange={(value) => {
                                    field.onChange(value ? Number(value) : '');
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
                        Class <span className='text-red-500'>*</span>
                    </Label>

                    <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                        <InputText
                            placeholder='Search classes...'
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            className='mb-3'
                        />

                        {/* Select All Classes */}
                        {overrideClassData.length > 0 && (
                            <div
                                onClick={selectAllcalssids}
                                className={cn(
                                    'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                    calss_ids.length === classOptions.length && classOptions.length > 0
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-300 hover:border-primary/40'
                                )}>
                                {calss_ids.length === classOptions.length && classOptions.length > 0 ? (
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
                                <div className='py-4 text-center text-gray-500 text-sm'>Please select Academic Year and Category first</div>
                            ) : filteredcalssids.length === 0 ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>No classes found</div>
                            ) : (
                                filteredcalssids.map((u: ClassDropDownDataTT) => {
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
                                        day_ids.length > 0
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-300 hover:border-primary/40'
                                )}>
                                {day_ids.length === (daySearch.trim() ? filteredDayIds.length : Masterdaydata.data.length) &&
                                day_ids.length > 0 ? (
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
            </div>

            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                    Reset
                </Button>
                <Button
                    type='submit'
                    // disabled={isSubmitting || !academicyear || !category || calss_ids.length === 0 || day_ids.length === 0}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save Master Day Class Wise
                    </div>
                </Button>
            </div>
        </form>
    );
}
