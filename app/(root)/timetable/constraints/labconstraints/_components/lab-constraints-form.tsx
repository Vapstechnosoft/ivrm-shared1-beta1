'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type LabConstraintsSchema, labConstraintsSchema } from '@/schemas/timetable/constraints/labconstraints';
import {
    getClassDetails,
    getLabConstraintsEditDetails,
    getSectionDetails,
    saveLabConstraintsDetail
} from '@/server/timetable/constraints/labconstraints';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface LabConstraintsFormProps {
    initialData: any;
    editData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function LabConstraintsForm({ initialData, editData, onSuccess, onCancel }: LabConstraintsFormProps) {
    // Dropdown options
    const academicList = initialData?.yearlist || [];
    const categoryList = initialData?.categorylist || [];
    const labList = initialData?.lablist || [];

    // Local state for dropdowns
    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>([]);

    const form = useForm<LabConstraintsSchema>({
        resolver: zodResolver(labConstraintsSchema),
        mode: 'onChange',
        defaultValues: {
            TTLAB_Id: 0,
            ASMAY_Id: 0,
            TTMC_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            TTLAB_LABLibId: 0
        }
    });

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = form;

    // Watchers
    const watchedAcademicYear = watch('ASMAY_Id');
    const watchedCategory = watch('TTMC_Id');
    const watchedClass = watch('ASMCL_Id');

    // Fetch Edit Details
    useEffect(() => {
        const fetchEditDetails = async () => {
            if (Array.isArray(editData) && editData.length > 0) {
                try {
                    const apiResponse = await getLabConstraintsEditDetails(editData[0].ttlaB_Id);
                    const editDetails = (apiResponse as any).editdetails?.[0];

                    if (editDetails) {
                        reset({
                            TTLAB_Id: editDetails.ttlaB_Id,
                            ASMAY_Id: editDetails.asmaY_Id,
                            TTMC_Id: editDetails.ttmC_Id,
                            ASMCL_Id: editDetails.asmcL_Id,
                            ASMS_Id: editDetails.asmS_Id,
                            TTLAB_LABLibId: editDetails.ttlaB_LABLibId
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch edit details', err);
                    toast.error('Failed to load record details');
                }
            }
        };

        if (editData) {
            fetchEditDetails();
        }
    }, [editData, reset]);

    // Fetch Classes on Year/Category Change
    useEffect(() => {
        const fetchClassesHelper = async () => {
            if (watchedAcademicYear && watchedCategory) {
                try {
                    const res = await getClassDetails({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory
                    });
                    if (Array.isArray(res?.classlist)) {
                        setClassList(res.classlist);
                    } else {
                        setClassList([]);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchClassesHelper();
    }, [watchedAcademicYear, watchedCategory]);

    // Fetch Sections on Class Change
    useEffect(() => {
        const fetchSectionsHelper = async () => {
            if (watchedAcademicYear && watchedClass && watchedCategory) {
                try {
                    const res = await getSectionDetails({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory,
                        ASMCL_Id: watchedClass
                    });
                    if (Array.isArray(res?.sectionlist)) {
                        setSectionList(res.sectionlist);
                    } else {
                        setSectionList([]);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchSectionsHelper();
    }, [watchedAcademicYear, watchedClass, watchedCategory]);

    const onSubmit: SubmitHandler<LabConstraintsSchema> = async (data) => {
        try {
            const res = await saveLabConstraintsDetail(data);
            if (res.returnval === true) {
                toast.success('Saved Successfully');
                onSuccess?.();
            } else if (res.returnduplicatestatus === 'Duplicate') {
                toast.warning('Record Already Exists');
            } else {
                toast.error('Failed to Save');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 rounded-md border bg-white p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                    <Label>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ASMAY_Id'
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
                    {errors.ASMAY_Id && <FormError>{errors.ASMAY_Id.message}</FormError>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        Category <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='TTMC_Id'
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
                    {errors.TTMC_Id && <FormError>{errors.TTMC_Id.message}</FormError>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        Class <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ASMCL_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {classList.map((item: any) => (
                                        <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                            {item.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMCL_Id && <FormError>{errors.ASMCL_Id.message}</FormError>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        Section <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='ASMS_Id'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectionList.map((item: any) => (
                                        <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                            {item.asmC_SectionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.ASMS_Id && <FormError>{errors.ASMS_Id.message}</FormError>}
                </div>

                <div className='space-y-2'>
                    <Label>
                        Lab Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='TTLAB_LABLibId'
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='--Select--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {labList.map((item: any) => (
                                        <SelectItem key={item.labLibId} value={item.labLibId.toString()}>
                                            {item.labName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.TTLAB_LABLibId && <FormError>{errors.TTLAB_LABLibId.message}</FormError>}
                </div>
            </div>

            <div className='flex justify-center gap-4 pt-4'>
                <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' /> {editData ? 'Update' : 'Save'}
                </Button>
                <Button type='button' variant='destructive' onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
