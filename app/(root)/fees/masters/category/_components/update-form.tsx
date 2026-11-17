'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useClassCategoryDropdown } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { masterClassYearlyCategorySchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterClassYearlyCategory, getGroupListCategory } from '@/server/fees/masters/class_yearly_category';
import type { IMasterClassYearlyList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, ChevronsUpDown, Save, Search, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface DropdownOption {
    value: string;
    label: string;
}

interface UpdateMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: Partial<IMasterClassYearlyList>;
}
type FormFields = {
    academicYear: string;
    classCategory: string;
    classes: string[];
};

//type FormFields = z.infer<typeof masterClassYearlyCategorySchema.addOrUpdate>;

export default function UpdateMasterClassForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterClassFormProps) {
    const { data: categoryData, isLoading: loadingCategories, error: categoryError, refetch: refetchAll } = useClassCategoryDropdown();
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const js = JSON.stringify(row);
    console.log('selecteeddata', js);

    type MasterClassRowFromAPI = {
        asmaY_Id?: number;
        fycC_Id?: number;
        fyccC_Id?: number;
        mI_Id?: number;
        fycC_ActiveFlag?: boolean;
        fmcC_Id?: number;
        asmcL_Id?: number;
    };

    const apiRow = row as MasterClassRowFromAPI;

    const asmaY_Idrow = apiRow.asmaY_Id;
    const fycC_Idrow = apiRow.fycC_Id;

    //apiRow.asmcL_Id = 515;

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassYearlyCategorySchema.addOrUpdate),
        mode: 'onSubmit',
        defaultValues: {
            academicYear: '',
            classCategory: '',
            classes: []
        }
    });

    const academicYear = watch('academicYear');
    const classCategory = watch('classCategory');
    const classesValue = watch('classes');

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [academicYearOptions, setAcademicYearOptions] = useState<DropdownOption[]>([]);
    const [classCategoryOptions, setClassCategoryOptions] = useState<DropdownOption[]>([]);
    const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
    const [academicOptions, setAcademicOptions] = useState<DropdownOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);

    const [isClassPopoverOpen, setIsClassPopoverOpen] = useState(false);

    const [selectedHeadsItems, setSelectedHeadsItems] = useState<{ fmH_Id: string }[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!row) return;

        const apiRow = row as MasterClassRowFromAPI;

        if (apiRow.asmaY_Id) {
            setValue('academicYear', apiRow.asmaY_Id.toString(), {
                shouldValidate: true,
                shouldDirty: false
            });
        }

        if (apiRow.fycC_Id) {
            setValue('classCategory', apiRow.fycC_Id.toString(), {
                shouldValidate: true,
                shouldDirty: false
            });
        }
    }, [row, setValue]);

    useEffect(() => {
        if (!academicData?.data) return;

        const opts = academicData.data.map((a: any) => ({
            value: a.asmaY_Id.toString(),
            label: a.asmaY_Year
        }));

        setAcademicOptions(opts);
    }, [academicData]);

    useEffect(() => {
        if (!academicOptions.length || !apiRow.asmaY_Id) return;

        setValue('academicYear', apiRow.asmaY_Id.toString(), {
            shouldDirty: false
        });
    }, [academicOptions, apiRow.asmaY_Id, setValue]);

    useEffect(() => {
        setIsLoadingDropdowns(loadingAcademic || loadingCategories);
    }, [loadingAcademic, loadingCategories]);

    useEffect(() => {
        if (academicError) {
            toast.error(academicError.message || 'Error fetching academic years');
            setAcademicYearOptions([]);
            return;
        }
        if (academicData?.data && Array.isArray(academicData.data)) {
            const options = academicData.data.map((item: any) => ({
                value: item.asmaY_Id.toString(),
                label: item.asmaY_Year
            }));
            setAcademicYearOptions(options);
        } else {
            setAcademicYearOptions([]);
        }
    }, [academicData, academicError]);
    //apiRow.fmcC_Id = 151;

    console.log('categoryData', categoryData);
    useEffect(() => {
        if (!academicYear || !categoryData?.data) return;

        setCategoryOptions(
            categoryData.data.map((c: any) => ({
                value: c.fmcC_Id.toString(),
                label: c.fmcC_ClassCategoryName
            }))
        );
    }, [academicYear, categoryData]);

    useEffect(() => {
        if (!categoryOptions.length) return;
        if (!apiRow.fmcC_Id) return;

        setValue('classCategory', apiRow.fmcC_Id.toString(), {
            shouldDirty: false,
            shouldValidate: true
        });
    }, [categoryOptions, apiRow.fycC_Id, setValue]);

    useEffect(() => {
        console.log('calling class api', academicYear);
        const fetchClasses = async () => {
            if (!academicYear || !classCategory) {
                setClassOptions([]);
                return;
            }

            try {
                const response = await getGroupListCategory(Number(academicYear), {}); // mi_id = 30

                if (response?.data && Array.isArray(response.data)) {
                    const options = response.data.map((item: any) => ({
                        value: item.asmcL_Id.toString(),
                        label: item.asmcL_ClassName
                    }));
                    setClassOptions(options);
                } else {
                    setClassOptions([]);
                }
            } catch (error: any) {
                console.error('Class fetch error:', error);
                toast.error(error.message || 'Error fetching classes');
                setClassOptions([]);
            }
        };

        fetchClasses();
    }, [academicYear, classCategory]);

    useEffect(() => {
        if (!academicYear || !categoryData?.data) return;

        const opts = categoryData.data.map((c: any) => ({
            value: c.fmcC_Id.toString(),
            label: c.fmcC_ClassCategoryName
        }));

        setCategoryOptions(opts);
    }, [academicYear, categoryData]);

    /* -----------------------------------------
       EDIT: bind class category
    ----------------------------------------- */
    useEffect(() => {
        if (!categoryOptions.length || !apiRow.fmcC_Id) return;

        setValue('classCategory', apiRow.fmcC_Id.toString(), {
            shouldDirty: false
        });
    }, [categoryOptions, apiRow.fmcC_Id, setValue]);

    useEffect(() => {
        if (!academicYear) {
            setClassCategoryOptions([]);
            setValue('classCategory', '', { shouldValidate: true });
            setValue('classes', [], { shouldValidate: true });
            setSelectedClasses([]);
            return;
        }

        if (categoryError) {
            toast.error(categoryError.message || 'Error fetching class categories');
            setClassCategoryOptions([]);
            return;
        }

        if (categoryData?.data && Array.isArray(categoryData.data)) {
            const options = categoryData.data.map((item: any) => ({
                value: item.fmcC_Id.toString(),
                label: item.fmcC_ClassCategoryName
            }));
            setClassCategoryOptions(options);
        } else {
            setClassCategoryOptions([]);
        }
    }, [academicYear, categoryData, categoryError, setValue]);

    useEffect(() => {
        if (!classOptions.length) return;
        if (!apiRow.asmcL_Id) return;

        const classId = apiRow.asmcL_Id.toString();

        const exists = classOptions.some((o) => o.value === classId);
        if (!exists) return;

        // ✅ bind to react-hook-form
        setValue('classes', [classId], {
            shouldDirty: false,
            shouldValidate: true
        });

        // optional (UI state)
        setSelectedClasses([classId]);
    }, [classOptions, apiRow.asmcL_Id, setValue]);

    const filteredClassOptions = classOptions.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleClassChange = (value: string) => {
        const currentClasses = classesValue || [];
        let updatedClasses: string[];
        if (currentClasses.includes(value)) {
            updatedClasses = currentClasses.filter((c) => c !== value);
        } else {
            updatedClasses = [...currentClasses, value];
        }
        setSelectedClasses(updatedClasses);
        setValue('classes', updatedClasses, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (isSubmitting) return;

        try {
            const { academicYear, classCategory, classes } = data;
            if (!academicYear || !classCategory || classes.length === 0) {
                toast.error('Please select academic year, class category, and at least one class.');
                return;
            }

            const payload = {
                FYCC_Id: fycC_Idrow, // For update
                // MI_Id: 30, // Constant MI Id
                FMCC_Id: Number(classCategory), // Selected class category ID
                ASMAY_Id: Number(academicYear), // Selected academic year
                ASMCL_ID: 0, // Always 0 as per your rules (single class will be in TempararyArrayList)
                FYCC_ActiveFlag: true,
                ClassList: classes.map((clsId) => ({
                    ASMCL_ID: Number(clsId)
                }))
                // user_id: 21602 // Static user id
            };

            //    const payload = {
            //     FYCC_Id: 0,
            //     MI_Id: 30,
            //     FMCC_Id: Number(classCategory), // Selected class category ID
            //     ASMAY_Id: Number(academicYear), // Selected academic year
            //     ASMCL_ID: 0, // Always 0 as per your rules (single class will be in TempararyArrayList)
            //     FYCC_ActiveFlag: true,
            //     ClassList: classes.map((clsId) => ({
            //         ASMCL_ID: Number(clsId)
            //     })),
            //     user_id: 21602 // Static user id
            // };
            console.log('Payload:', payload);
            const response = await addOrUpdateMasterClassYearlyCategory(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                setSelectedClasses([]);
                setSearchTerm('');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedClasses([]);
        setSearchTerm('');
        setClassCategoryOptions([]);
        setClassOptions([]);
    };

    return (
        <div className={`${className}`}>
            <form
                onSubmit={(e) => {
                    setHasSubmitted(true);
                    handleSubmit(onSubmit)(e);
                }}
                className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Academic Year */}
                        <div>
                            <Label>Academic Year *</Label>
                            <Select value={academicYear} onValueChange={(v) => setValue('academicYear', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasSubmitted && errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                        </div>

                        {/* Class Category */}
                        <div>
                            <Label className='mt-4'>
                                Class Category <span className='text-red-500'>*</span>
                            </Label>
                            <Select value={classCategory} onValueChange={(v) => setValue('classCategory', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Class Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasSubmitted && errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                        </div>

                        {/* <div className='flex items-center justify-center gap-3'>
                            <Label htmlFor='fmH_Ids'>
                                Classes<span className='text-red-500'>*</span>:
                            </Label>
                            <div className='w-96'>
                                <Controller
                                    name='classes'
                                    control={control}
                                    render={({ field }) => {
                                        const selectedValue = field.value?.[0] || ''; 
                                        const filteredHeads =
                                            classOptions?.filter((h) => h.value.toLowerCase().includes(search.toLowerCase())) || [];

                                        return (
                                            <Popover open={isClassPopoverOpen} onOpenChange={setIsClassPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        onClick={() => setIsClassPopoverOpen(!isClassPopoverOpen)}
                                                        className={cn(
                                                            'w-full justify-between',
                                                            errors.classes ? 'border-red-500' : 'border-primary/30'
                                                        )}>
                                                        <span className='truncate'>
                                                            {classOptions?.find((h) => h.value.toString() === selectedValue)?.label ||
                                                                'Select Classes'}
                                                        </span>
                                                        <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className='w-[260px] p-2 sm:w-[300px]'>
                                                  
                                                    <div className='relative mb-2'>
                                                        <Search className='absolute top-2.5 left-2 h-4 w-4 text-gray-400' />
                                                        <InputText
                                                            placeholder='Search heads...'
                                                            value={search}
                                                            onChange={(e) => setSearch(e.target.value)}
                                                            className='h-8 pl-8 text-sm'
                                                        />
                                                    </div>

                                                   
                                                    <div className='max-h-[260px] overflow-y-auto rounded-md border p-1'>
                                                        {classOptions?.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>No classes found</div>
                                                        ) : filteredHeads.length === 0 ? (
                                                            <div className='py-4 text-center text-gray-500 text-sm'>
                                                                No Class match your search
                                                            </div>
                                                        ) : (
                                                            filteredHeads.map((h) => {
                                                                const isSelected = selectedValue === h.value.toString();

                                                                return (
                                                                    <div
                                                                        key={h.value}
                                                                        onClick={() => {
                                                                            field.onChange([h.value.toString()]);
                                                                            setSelectedHeadsItems([{ fmH_Id: h.value.toString() }]);
                                                                        }}
                                                                        className={cn(
                                                                            'mb-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm',
                                                                            isSelected
                                                                                ? 'border-primary bg-primary/5'
                                                                                : 'border-gray-200 hover:border-primary/40'
                                                                        )}>
                                                                        {isSelected ? (
                                                                            <CheckSquare className='h-4 w-4 text-primary' />
                                                                        ) : (
                                                                            <Square className='h-4 w-4 text-gray-400' />
                                                                        )}
                                                                        <span>{h.label}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />

                           
                            </div>
                        </div> */}

                        <div className='md:col-span-2'>
                            <Label className='mb-1 block'>
                                Classes <span className='text-red-500'>*</span>
                            </Label>

                            <Controller
                                name='classes'
                                control={control}
                                render={({ field }) => {
                                    const selectedValue = field.value?.[0] || '';

                                    const filteredClasses =
                                        classOptions?.filter((c) => c.label.toLowerCase().includes(search.toLowerCase())) || [];

                                    return (
                                        <Popover open={isClassPopoverOpen} onOpenChange={setIsClassPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    className={cn(
                                                        'h-10 w-full justify-between',
                                                        errors.classes ? 'border-red-500' : 'border-input'
                                                    )}
                                                    disabled={!academicYear}>
                                                    <span className='truncate text-muted-foreground'>
                                                        {classOptions?.find((c) => c.value === selectedValue)?.label || 'Search Classes'}
                                                    </span>
                                                    <ChevronsUpDown className='h-4 w-4 opacity-50' />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className='w-full p-2'>
                                                {/* Search */}
                                                <div className='relative mb-2'>
                                                    <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                                                    <InputText
                                                        placeholder='Search Classes'
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className='h-9 pl-8'
                                                    />
                                                </div>

                                                {/* Class List */}
                                                <div className='max-h-56 overflow-y-auto rounded-md border p-1'>
                                                    {filteredClasses.length === 0 ? (
                                                        <div className='py-3 text-center text-muted-foreground text-sm'>
                                                            No classes found
                                                        </div>
                                                    ) : (
                                                        filteredClasses.map((cls) => {
                                                            const isSelected = selectedValue === cls.value;

                                                            return (
                                                                <div
                                                                    key={cls.value}
                                                                    onClick={() => field.onChange([cls.value])}
                                                                    className={cn(
                                                                        'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                                                                        isSelected
                                                                            ? 'border border-primary bg-primary/10'
                                                                            : 'hover:bg-muted'
                                                                    )}>
                                                                    {isSelected ? (
                                                                        <CheckSquare className='h-4 w-4 text-primary' />
                                                                    ) : (
                                                                        <Square className='h-4 w-4 text-muted-foreground' />
                                                                    )}
                                                                    {cls.label}
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />

                            {/* Helper text */}
                            {!academicYear && <p className='mt-1 text-muted-foreground text-sm'>Select Academic Year first</p>}

                            {hasSubmitted && errors.classes && <FormError>{errors.classes.message}</FormError>}
                        </div>
                    </div>

                    {hasSubmitted && errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isLoadingDropdowns}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isLoadingDropdowns || !academicYear || !classCategory || selectedClasses.length === 0}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Yearly Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
