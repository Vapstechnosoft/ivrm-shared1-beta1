'use client';

import { Button } from '@/components/ui/button';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAcademicYearDropDownMasterDayClasswise,
    useCategtoryDropDownMasterDayClasswise,
    useClassDropDownMasterDayClasswise,
    usePeriodAllocation
} from '@/hooks/timetable/useMasters';
import { cn } from '@/lib/utils';
import { masterPeriodClassSchema } from '@/schemas/timetable/masters';
import {
    ClassDropDownDataOnchnGeYrAndCategory,
    getClassDropDownMasterDayClasswiseOnchnageofCatandyr
} from '@/server/timetable/masters/masterdayclasswise';
import { savePeriodClass } from '@/server/timetable/masters/periodallocation';
import type { ClassDropDownDataTT } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterPeriodClassSchema.save>;

interface MasterPeriodClassFormProps {
    onSuccess?: () => void;
}

interface PeriodItem {
    key: number;
    label: string;
}
export default function MasterPeriodClassForm({ onSuccess }: MasterPeriodClassFormProps) {
    const { data: response } = usePeriodAllocation();
    const [classList, setClassList] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);

    const [classSearch, setClassSearch] = useState('');
    const [daySearch, setDaySearch] = useState('');

    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

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

    const { data: classData, isLoading: classloading, error: classError, refetchAll: classRefetch } = useClassDropDownMasterDayClasswise();
    const [overrideClassData, setOverrideClassData] = useState<ClassDropDownDataTT[] | null>(null);
    const [selectedcalssidsItems, setSelectedcalssidsItems] = useState<{ asmcL_Id: string }[]>([]);

    const {
        reset,
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterPeriodClassSchema.save),
        defaultValues: {
            noOfPeriods: 1
        }
    });

    const watchedAcademicYear = watch('asmay_id');
    const watchedCategory = watch('ttmC_Id');
    const watchedNoOfPeriods = watch('noOfPeriods');

    // Fetch Classes based on Category and Academic Year
    useEffect(() => {
        const fetchClasses = async () => {
            if (watchedAcademicYear && watchedCategory) {
                setClassList([]);
                try {
                    // const res = await getClassByCategory({
                    //     asmay_id: watchedAcademicYear,
                    //     TTMC_Id: watchedCategory
                    // });

                    const res = await ClassDropDownDataOnchnGeYrAndCategory(watchedAcademicYear, watchedCategory);
                    console.log('ClassDropDownDataOnchnGeYrAndCategory', res);

                    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
                        setClassList(res.data);
                    } else {
                        setClassList([]);
                    }
                } catch (err) {
                    console.error('Error fetching classes', err);
                }
            } else {
                setClassList([]);
            }
        };
        fetchClasses();
    }, [watchedAcademicYear, watchedCategory]);

    // Fetch Period Class list

    const classOptions =
        classData?.data?.map((h) => ({
            id: h.asmcL_Id.toString(),
            label: h.asmcL_ClassName
        })) ?? [];

    useEffect(() => {
        const fetchClassesOnCategoryChange = async () => {
            if (!watchedAcademicYear || !watchedCategory) return;

            try {
                setIsLoadingClasses(true);

                const res = await getClassDropDownMasterDayClasswiseOnchnageofCatandyr(watchedAcademicYear, watchedCategory);

                // ✅ override class dropdown data
                if (res?.data?.length) {
                    setOverrideClassData(res.data);
                } else {
                    setOverrideClassData([]);
                }

                // reset selection
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

    const selectAllcalssids = () => {
        // Decide source based on search
        const source = classSearch.trim().length > 0 ? filteredcalssids.map((h) => h.asmcL_Id.toString()) : classOptions.map((h) => h.id);

        const isAllSelected = source.every((id) => calss_ids.includes(id));

        if (isAllSelected) {
            // Unselect only the affected items
            const remaining = calss_ids.filter((id) => !source.includes(id));

            if (remaining.length === 0) {
                setValue('calssids', undefined as any);
            } else {
                setValue('calssids', remaining as [string, ...string[]], {
                    shouldValidate: true
                });
            }
        } else {
            // Merge current + source (avoid duplicates)
            const merged = Array.from(new Set([...calss_ids, ...source]));

            setValue('calssids', merged as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedcalssidsItems(
            (classSearch.trim().length > 0 ? filteredcalssids : classData?.data || []).map((x) => ({
                asmcL_Id: x.asmcL_Id.toString()
            }))
        );
    };
    const calss_ids = watch('calssids') || [];
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

    const filteredcalssids = classData?.data?.filter((h) => h.asmcL_ClassName.toLowerCase().includes(classSearch.toLowerCase())) ?? [];

    useEffect(() => {
        const count = Number(watchedNoOfPeriods);
        if (!Number.isNaN(count) && count > 0 && count <= 20) {
            const arr: PeriodItem[] = [];
            for (let i = 1; i <= count; i++) {
                arr.push({ key: i, label: `Period ${i}` });
            }
            setPeriods(arr);
            // Auto-select all periods
            const allKeys = arr.map((p) => p.key);
            setSelectedPeriods(allKeys);
        } else {
            setPeriods([]);
            setSelectedPeriods([]);
        }
    }, [watchedNoOfPeriods]);

    const handleReset = () => {
        reset();
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const payload = {
                TTMPC_Id: 0,
                temp_period_Array: periods.map((p) => ({
                    ttmP_Id: p.ttmP_Id,
                    ttmP_PeriodName: p.ttmP_PeriodName
                })),
                asmay_id: data.asmay_id
                // Temp_class_Array: data.classIds.map((c) => ({
                //     asmcL_Id: c.asmcL_Id,
                //     asmcL_ClassName: c.asmcL_ClassName,
                //     class: true // Mimic legacy structure if needed
                // }))
            };

            const response = await savePeriodClass(payload);
            if (response.returnval) {
                // if (data.classIds.length > 1) {
                //     toast.warning('Select Only One Class !!!'); // Mimic legacy behavior/alert if needed, though successfully saved maybe?
                //     // Legacy code: if (promise.returnval === true) { ... if ($scope.checkclaaslst.length > 1) { swal('Select Only One Class !!!'); } ... }
                //     // Does it actually prevent save? Logic seems mixed in legacy.
                //     // It says "Data successfully Saved" otherwise.
                // } else {
                //     toast.success('Data successfully Saved');
                // }
                onSuccess?.();
            } else if (response.returnduplicatestatus === 'Duplicate') {
                toast.error('Records Already Exist !');
            } else {
                toast.error('Data Not Saved !');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow only arrow keys, tab, and delete/backspace for clearing
        if (
            e.key !== 'ArrowUp' &&
            e.key !== 'ArrowDown' &&
            e.key !== 'Tab' &&
            e.key !== 'Delete' &&
            e.key !== 'Backspace' &&
            e.key !== 'Enter'
        ) {
            e.preventDefault();
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
                                    {academicLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading CategoryData
                                        </SelectItem>
                                    ) : academicError ? (
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
                            placeholder='Search calssids...'
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            className='mb-3'
                        />

                        {/* Select All Users */}
                        {classData?.data && (
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
                            {/* {classloading ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>Loading Class...</div>
                            ) : classData?.data?.length === 0 ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>No Class found</div>
                            ) : ( */}

                            {isLoadingClasses ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>Loading Classes...</div>
                            ) : !watchedAcademicYear || !watchedCategory ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>Please select Academic Year and Category first</div>
                            ) : filteredcalssids.length === 0 ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>No classes found</div>
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

                {/* <div className='space-y-2'>
                    <InputText
                        label='No of Period'
                        type='number'
                        required
                        {...register('noOfPeriods')}
                        error={errors.noOfPeriods?.message}
                        min={1}
                    />
                </div>
                  <div className='space-y-2'>
                    <InputText
                        label='No of Period'
                        type='number'
                        required
                        {...register('noOfPeriods')}
                        error={errors.noOfPeriods?.message}
                        min={1}
                    />
                </div> */}
                <div className='space-y-2'>
                    <Label>
                        No of Period <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='noOfPeriods'
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                {...field}
                                // Prevent manual typing
                                onKeyDown={handleKeyDown}
                                // Prevent paste
                                onPaste={(e) => e.preventDefault()}
                                onChange={(e) => {
                                    const value = Number(e);
                                    field.onChange(value);
                                    if (value > 20) {
                                        toast.error('No of Period cannot exceed 20');
                                        setValue('noOfPeriods', 20);
                                    } else if (value < 1) {
                                        setValue('noOfPeriods', 1);
                                    }
                                }}
                                error={errors.noOfPeriods?.message}
                                className='w-full select-none'
                                // Optional: Add title/tooltip to indicate usage
                            />
                        )}
                    />
                </div>

                {/* Period Section - Multi-select checkbox display (disabled) */}
                <div className='space-y-2'>
                    <Label>Period :</Label>

                    <div className='rounded-md border border-gray-300 bg-white p-3'>
                        {/* Select All (disabled) */}
                        {/* {periods.length > 0 && (
                                        <div
                                            className={cn(
                                                'mb-2 flex cursor-not-allowed items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm opacity-50',
                                                'border-gray-300 bg-gray-50'
                                            )}>
                                            <CheckSquare className='h-4 w-4 text-gray-400' />
                                            <span>Select All</span>
                                        </div>
                                    )} */}

                        <div className='max-h-60 overflow-y-auto rounded-md border border-gray-300 p-1'>
                            {periods.length === 0 ? (
                                <div className='py-4 text-center text-gray-500 text-sm'>Enter No of Period to see periods</div>
                            ) : (
                                periods.map((p) => {
                                    const selected = selectedPeriods.includes(p.key);

                                    return (
                                        <div
                                            key={p.key}
                                            className={cn(
                                                'mb-1 flex cursor-not-allowed items-center gap-2 rounded-md border px-2 py-1.5 text-sm opacity-50',
                                                selected ? 'border-gray-400 bg-gray-100' : 'border-gray-300 bg-gray-50'
                                            )}>
                                            {selected ? (
                                                <CheckSquare className='h-4 w-4 text-gray-400' />
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

                {/* <div className='space-y-2 md:col-span-2'>
                    <Label>Period</Label>
                    <div className='flex flex-wrap gap-2 rounded-md border bg-muted/20 p-2'>
                        {periods.map((p) => (
                            <div key={p.ttmP_Id} className='flex items-center space-x-2 rounded border bg-background p-2'>
                                <Checkbox checked disabled />
                                <Label className='font-medium text-sm'>{p.ttmP_PeriodName}</Label>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>

            {/* <div className='flex justify-end gap-3'>
                <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' />
                    Save
                </Button>
            </div> */}

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
                    disabled={isSubmitting}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save Master Period ClassWise
                    </div>
                </Button>
            </div>
        </form>
    );
}
