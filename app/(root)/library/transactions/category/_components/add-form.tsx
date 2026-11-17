'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useClassCategoryDropdown } from '@/hooks/fees/useMasters';
import { masterClassYearlyCategorySchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterClassYearlyCategory } from '@/server/fees/masters/class_yearly_category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormFields = {
    academicYear: string;
    classCategory: string;
    classes: string[];
};

interface DropdownOption {
    value: string;
    label: string;
}

interface AddMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterClassForm({ onSuccess, className = '' }: AddMasterClassFormProps) {
    const { data: categoryData, isLoading: loadingCategories, error: categoryError, refetch: refetchAll } = useClassCategoryDropdown();
    const { data: academicData, isLoading: loadingAcademic, error: academicError } = useAcademicYearDropdown();

    const {
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
        const fetchClasses = async () => {
            if (!academicYear || !classCategory) {
                setClassOptions([]);
                return;
            }

            // try {
            //     const response = await getGroupListCategory(30, Number(academicYear), {}); // mi_id = 30
            //     if (response?.data && Array.isArray(response.data)) {
            //         const options = response.data.map((item: any) => ({
            //             value: item.asmcL_Id.toString(),
            //             label: item.asmcL_ClassName
            //         }));
            //         setClassOptions(options);
            //     } else {
            //         setClassOptions([]);
            //     }
            // } catch (error: any) {
            //     console.error('Class fetch error:', error);
            //     toast.error(error.message || 'Error fetching classes');
            //     setClassOptions([]);
            // }
        };

        fetchClasses();
    }, [academicYear, classCategory]);

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
                FYCC_Id: 0,
                MI_Id: 30,
                FMCC_Id: Number(classCategory), // Selected class category ID
                ASMAY_Id: Number(academicYear), // Selected academic year
                ASMCL_ID: 0, // Always 0 as per your rules (single class will be in TempararyArrayList)
                FYCC_ActiveFlag: true,
                ClassList: classes.map((clsId) => ({
                    ASMCL_ID: Number(clsId)
                })),
                user_id: 21602 // Static user id
            };

            const response = await addOrUpdateMasterClassYearlyCategory(payload);

            if (response.success) {
                toast.success(response.message || 'Master class saved successfully');
                reset();
                setSelectedClasses([]);
                setSearchTerm('');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to save master class');
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Error saving master class');
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
                            <Label htmlFor='academicYear'>
                                Academic Year <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('academicYear', value, { shouldValidate: true })}
                                value={academicYear}
                                disabled={isLoadingDropdowns}>
                                <SelectTrigger
                                    id='academicYear'
                                    className={`transition-colors ${errors.academicYear ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYearOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasSubmitted && errors.academicYear && <FormError>{errors.academicYear.message}</FormError>}
                        </div>

                        {/* Class Category */}
                        <div>
                            <Label htmlFor='classCategory'>
                                Class Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('classCategory', value, { shouldValidate: true })}
                                value={classCategory}
                                disabled={!academicYear || isLoadingDropdowns}>
                                <SelectTrigger
                                    id='classCategory'
                                    className={`transition-colors ${errors.classCategory ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder='Select Class Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    {classCategoryOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasSubmitted && errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                        </div>

                        {/* Classes */}
                        <div className='md:col-span-2'>
                            <Label htmlFor='classes'>
                                Classes <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='min-h-[40px] rounded-md border bg-white px-3 py-2'>
                                <input
                                    type='text'
                                    placeholder='Search Classes'
                                    className='mb-2 w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={!academicYear}
                                />
                                <div className='flex max-h-40 flex-col gap-2 overflow-y-auto'>
                                    {filteredClassOptions.length > 0 ? (
                                        filteredClassOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className='flex cursor-pointer items-center rounded p-1 hover:bg-gray-50'>
                                                <input
                                                    type='checkbox'
                                                    value={option.value}
                                                    checked={selectedClasses.includes(option.value)}
                                                    onChange={() => handleClassChange(option.value)}
                                                    className='mr-2 h-4 w-4 accent-blue-600'
                                                />
                                                <span className='truncate'>{option.label}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <span className='text-gray-400 text-sm'>
                                            {academicYear ? 'No classes found' : 'Select Academic Year first'}
                                        </span>
                                    )}
                                </div>
                            </div>
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
                            Save Yearly Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
