'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTimeTableAcademicYear, useTimeTableCategoryClassMapping, useTimeTableCategoryDropDownData } from '@/hooks/timetable/useMasters';
import { cn } from '@/lib/utils';
import { categoryClassMappingSchema } from '@/schemas/timetable/masters';
import { addOrUpdateCategoryClassMapping } from '@/server/timetable/masters/categoryclassmapping';
import { ClassDropDownDataOnchnGeYrAndCategory } from '@/server/timetable/masters/masterdayclasswise';
import type { ClassDropDownDataTT } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof categoryClassMappingSchema.addOrUpdate>;

interface AddMasterBuildingProps {
    onSuccess?: () => void;
    buildingname?: string;
}

export default function AddCategoryClassMappingForm({ onSuccess, buildingname = '' }: AddMasterBuildingProps) {
    const { refetchAll } = useTimeTableCategoryClassMapping();

    const [classseach, setClassseach] = useState('');
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    const [selectedClassItems, setSelectedClassItems] = useState<{ asmcl_Id: string }[]>([]);
    const [classdata, setClassdata] = useState<ClassDropDownDataTT[]>([]);
    const [classSearch, setClassSearch] = useState('');

    const [selectedcalssidsItems, setSelectedcalssidsItems] = useState<{ asmcL_Id: string }[]>([]);
    const {
        data: academicyeardata,
        isLoading: academicyearloading,
        error: academicyearerror,
        refetchAll: refetchAllAcademicYear
    } = useTimeTableAcademicYear();
    //useTimeTableCategoryDropDownData

    const {
        data: categorydropdowndata,
        isLoading: categorydropdownloading,
        error: categorydropdownerror,
        refetchAll: refetchAllCategory
    } = useTimeTableCategoryDropDownData();

    // const {
    //     data: classdata,
    //     isLoading: classdropdownloading,
    //     error: classdropdownerror,
    //     refetchAll: refetchAllClass
    // } = useTimeTableClassDropdownData();

    const {
        register,
        handleSubmit,
        reset,

        setValue,
        watch,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(categoryClassMappingSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmay_id: undefined,
            ttmC_Id: undefined
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
                    setClassdata([]);
                } finally {
                    setIsLoadingClasses(false);
                }
            };
            fetchClasses();
        } else {
            // Clear class data if either academic year or category is not selected
            setClassdata([]);
            setValue('calssids', undefined as any);
            setSelectedcalssidsItems([]);
        }
    }, [academicyear, category]);

    const ClassOptions =
        classdata.map((h) => ({
            id: String(h.asmcL_Id),
            label: h.asmcL_ClassName
        })) ?? [];

    const calssids = watch('calssids') || [];

    const toggleClass = (id: string) => {
        let updated = [];

        if (calssids.includes(id)) {
            updated = calssids.filter((v: string) => v !== id);
        } else {
            updated = [...calssids, id];
        }

        // MUST be tuple: at least 1 element
        if (updated.length === 0) {
            setValue('calssids', undefined as any);
        } else {
            setValue('calssids', updated as [string, ...string[]], {
                shouldValidate: true
            });
        }

        setSelectedClassItems(updated.map((x) => ({ asmcl_Id: x })));
    };

    const selectAllClasses = () => {
        const all = ClassOptions.map((h) => h.id);

        if (calssids.length === all.length) {
            // Option: clear selection → field becomes undefined
            setValue('calssids', undefined as any);
            setSelectedClassItems([]);
        } else {
            setValue('calssids', all as [string, ...string[]], {
                shouldValidate: true
            });
            setSelectedClassItems(all.map((x) => ({ asmcl_Id: x })));
        }
    };

    const filteredClasses = classdata.filter((h) => h.asmcL_ClassName?.toLowerCase().includes(classSearch.toLowerCase()));

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { asmay_id, ttmC_Id, calssids } = data;

            const classes = calssids.map((id) => ({ asmcL_Id: Number(id) }));
            const payload = {
                asmaY_Id: asmay_id,
                ttmC_Id: ttmC_Id,
                clssids: classes
            };
            console.log('payload', JSON.stringify(payload));
            const response = await addOrUpdateCategoryClassMapping(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        refetchAll();
        refetchAllAcademicYear();
        refetchAllCategory();
        setSelectedClassItems([]);
    };

    return (
        <div className={`${buildingname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='ftmcoM_Id' className='whitespace-nowrap'>
                                Academic Year:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='w-96'>
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
                                                {academicyearloading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Academic Years...
                                                    </SelectItem>
                                                ) : academicyearerror ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Academic Years
                                                    </SelectItem>
                                                ) : (
                                                    academicyeardata?.data?.map((item) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.asmay_id && <FormError className='ml-2'>{errors.asmay_id.message}</FormError>}
                            </div>
                        </div>

                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='ftmcoM_Id' className='whitespace-nowrap'>
                                Category :<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='w-96'>
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
                                                {categorydropdownloading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Categories
                                                    </SelectItem>
                                                ) : categorydropdownerror ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Categories
                                                    </SelectItem>
                                                ) : (
                                                    categorydropdowndata?.data?.map((item) => (
                                                        <SelectItem key={item.ttmC_Id} value={item.ttmC_Id.toString()}>
                                                            {item.ttmC_CategoryName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ttmC_Id && <FormError className='ml-2'>{errors.ttmC_Id.message}</FormError>}
                            </div>
                        </div>
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* <div className='space-y-4'>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='group flex items-center justify-center gap-1.5 space-x-3'>
                            <Label htmlFor='ftmcoM_Id' className='whitespace-nowrap'>
                                Category:<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='w-96'>
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
                                                {categorydropdownloading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Categories
                                                    </SelectItem>
                                                ) : categorydropdownerror ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Categories
                                                    </SelectItem>
                                                ) : (
                                                    categorydropdowndata?.data?.map((item) => (
                                                        <SelectItem
                                                            key={item.ttmC_Id}
                                                            value={item.ttmC_Id.toString()}>
                                                            {item.ttmC_CategoryName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ttmC_Id && <FormError className='ml-2'>{errors.ttmC_Id.message}</FormError>}
                            </div>
                        </div>

                    </div>

                  
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div> */}

                <div className='group flex items-center justify-center gap-10 space-x-10'>
                    <Label htmlFor='calssids' className='whitespace-nowrap'>
                        Class:<span className='ml-1 text-red-500'>*</span>
                    </Label>

                    <div className='w-96'>
                        <div className='mt-2 rounded-md border border-gray-300 bg-white p-3'>
                            {/* Fix: Use single search state */}
                            <InputText
                                placeholder='Search Class...'
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                                className='mb-3'
                            />

                            {/* Optional: Add Select All functionality */}
                            {filteredClasses.length > 0 && (
                                <div
                                    onClick={selectAllClasses}
                                    className={cn(
                                        'mb-2 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 font-medium text-sm transition-all',
                                        calssids?.length === filteredClasses.length && filteredClasses.length > 0
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-300 hover:border-primary/40'
                                    )}>
                                    {calssids?.length === filteredClasses.length && filteredClasses.length > 0 ? (
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
                                ) : filteredClasses.length === 0 ? (
                                    <div className='py-4 text-center text-gray-500 text-sm'>
                                        {classSearch ? `No classes found for "${classSearch}"` : 'No classes available'}
                                    </div>
                                ) : (
                                    filteredClasses
                                        .filter((u) => u.asmcL_Id != null)
                                        .map((u) => {
                                            const id = String(u.asmcL_Id);
                                            const selected = calssids?.includes(id);

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
                        {errors.calssids && <FormError>{errors.calssids.message}</FormError>}
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
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Category Class Mapping
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
