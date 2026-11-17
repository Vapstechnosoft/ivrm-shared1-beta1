'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classWiseReportSchema } from '@/schemas/timetable/reports';
import { getClassByCategory } from '@/server/timetable/reports/classwisett';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormFields = z.infer<typeof classWiseReportSchema.search>;

interface ClassWiseFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function ClassWiseForm({ initialData, onSubmit, onCancel }: ClassWiseFormProps) {
    const [classList, setClassList] = useState<any[]>([]);

    const academicList = initialData?.acayear || [];
    const categoryList = initialData?.categorylist || [];
    const sectionList = initialData?.sectionlist || [];

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(classWiseReportSchema.search),
        defaultValues: {
            classId: [],
            sectionId: []
        }
    });

    const watchedAcademicYear = watch('asmaY_Id');
    const watchedCategory = watch('ttmC_Id');

    // Fetch classes when Academic Year or Category changes
    useEffect(() => {
        const fetchClasses = async () => {
            setValue('classId', []);
            if (watchedAcademicYear && watchedCategory) {
                try {
                    const res = await getClassByCategory({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory
                    });
                    if (res && Array.isArray(res.classlist)) {
                        setClassList(res.classlist);
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
        fetchClasses();
    }, [watchedAcademicYear, watchedCategory, setValue]);

    const onFormSubmit = (data: FormFields) => {
        // Construct payload matching AngularJS requirement
        // "ASMAY_Id": $scope.asmaY_Id,
        // "TTMC_Id": $scope.ttmC_Id,
        // classarray: $scope.albumNameArray1, (selected classes)
        // sectionarray: $scope.albumNameArray2, (selected sections)

        const selectedClasses = classList.filter((c: any) => data.classId?.includes(c.asmcL_Id));
        const selectedSections = sectionList.filter((s: any) => data.sectionId?.includes(s.asmS_Id));

        const payload = {
            ASMAY_Id: data.asmaY_Id,
            TTMC_Id: data.ttmC_Id,
            classarray: selectedClasses,
            sectionarray: selectedSections
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6 rounded-lg border bg-white p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Academic Year */}
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

                {/* Category */}
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

                {/* Class */}
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

                {/* Section */}
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
            </div>

            <div className='flex justify-center space-x-2'>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    <Search className='mr-2 h-4 w-4' />
                    Report
                </Button>
                <Button type='button' variant='destructive' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
