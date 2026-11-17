'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ConsecutiveConstraintsSchema, consecutiveConstraintsSchema } from '@/schemas/timetable/constraints/consecutive';
import {
    getClassByCategory,
    getConsecutiveConstraintsEditDetails,
    getStaffByClassSection,
    getSubjectByStaff,
    saveConsecutiveConstraintsDetail
} from '@/server/timetable/constraints/consecutive';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ConsecutiveConstraintsFormProps {
    initialData: any; // Contains lists: academiclist, catelist
    editData?: any; // For editing mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ConsecutiveConstraintsForm({ initialData, editData, onSuccess, onCancel }: ConsecutiveConstraintsFormProps) {
    const academicList = initialData?.academiclist || [];
    const categoryList = initialData?.catelist || []; // Note: Initial load provides these

    // Local state for dependent dropdowns
    const [classList, setClassList] = useState<any[]>([]);
    const [sectionList, setSectionList] = useState<any[]>(initialData?.sectDrpDwn || []);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);

    // For max value of period validation (optional, from generic API result)?
    // The legacy code referenced `maxvalue`. If it's not in initialData, we might assume a default or fetch it.
    // Assuming standard period count max around 10-15 if not provided.

    const form = useForm<ConsecutiveConstraintsSchema>({
        resolver: zodResolver(consecutiveConstraintsSchema),
        mode: 'onChange',
        defaultValues: {
            TTC_Id: 0,
            ASMAY_Id: 0,
            TTMC_Id: 0,
            ASMCL_Id: 0,
            ASMS_Id: 0,
            HRME_Id: 0,
            ISMS_Id: 0,
            TTC_NoOfConDays: 1,
            TTC_NoOfConPeriods: 1,
            TTC_NoOfPeriods: 1,
            TTC_BefAftApplFlag: false,
            TTC_BefAftFalg: '',
            TTC_BefAftPeriod: 0
        }
    });

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = form;

    const watchedAcademicYear = watch('ASMAY_Id');
    const watchedCategory = watch('TTMC_Id');
    const watchedClass = watch('ASMCL_Id');
    const watchedSection = watch('ASMS_Id');
    const watchedStaff = watch('HRME_Id');

    const watchedConDays = watch('TTC_NoOfConDays');
    const watchedConPeriods = watch('TTC_NoOfConPeriods');
    const watchedBefAftFlag = watch('TTC_BefAftApplFlag');

    // Calculate Total Periods
    useEffect(() => {
        const days = Number(watchedConDays) || 0;
        const periods = Number(watchedConPeriods) || 0;
        setValue('TTC_NoOfPeriods', days * periods);
    }, [watchedConDays, watchedConPeriods, setValue]);

    // Edit Mode Data Fetching
    useEffect(() => {
        const fetchEditDetails = async () => {
            if (Array.isArray(editData) && editData && editData[0].ttC_Id) {
                try {
                    const apiResponse = await getConsecutiveConstraintsEditDetails(editData[0].ttC_Id);
                    const editRecord = (apiResponse as any).consecutivelstedit?.[0];

                    if (editRecord) {
                        // We need to populate dropdowns sequentially or set states if we have data
                        // Ideally we should trigger the fetch functions or manually set lists if they are returned

                        // Note: Legacy `getdetails` returns just the record.
                        // But we also need the dropdown items to be populated to show the selected value.
                        // We might need to call the fetch helper functions for Class, Staff, Subject based on the IDs.

                        // 1. Set simple fields
                        reset({
                            TTC_Id: editRecord.ttC_Id,
                            ASMAY_Id: editRecord.asmaY_Id,
                            TTMC_Id: editRecord.ttmC_Id,
                            ASMCL_Id: editRecord.asmcL_Id,
                            ASMS_Id: editRecord.asmS_Id,
                            HRME_Id: editRecord.hrmE_Id,
                            ISMS_Id: editRecord.ismS_Id,
                            TTC_NoOfConDays: editRecord.ttC_NoOfConDays,
                            TTC_NoOfConPeriods: editRecord.ttC_NoOfConPeriods,
                            TTC_NoOfPeriods: editRecord.ttC_NoOfPeriods,
                            TTC_BefAftApplFlag: editRecord.ttC_BefAftApplFlag === 1,
                            TTC_BefAftFalg: editRecord.ttC_BefAftFalg ? String(editRecord.ttC_BefAftFalg) : '', // Select expects string often
                            TTC_BefAftPeriod: editRecord.ttC_BefAftPeriod
                        });

                        // 2. Fetch/Populate Lists
                        // Class
                        if (editRecord.asmaY_Id && editRecord.ttmC_Id) {
                            const clsRes = await getClassByCategory({ ASMAY_Id: editRecord.asmaY_Id, TTMC_Id: editRecord.ttmC_Id });
                            if (clsRes?.classbycategory) setClassList(clsRes.classbycategory as any[]);
                        }

                        // Staff
                        if (editRecord.asmaY_Id && editRecord.ttmC_Id && editRecord.asmcL_Id && editRecord.asmS_Id) {
                            const stfRes = await getStaffByClassSection({
                                ASMAY_Id: editRecord.asmaY_Id,
                                TTMC_Id: editRecord.ttmC_Id,
                                ASMCL_Id: editRecord.asmcL_Id,
                                ASMS_Id: editRecord.asmS_Id
                            });
                            if (stfRes?.staffbyall) setStaffList(stfRes.staffbyall as any[]);
                        }

                        // Subject
                        if (editRecord.asmaY_Id && editRecord.ttmC_Id && editRecord.asmcL_Id && editRecord.asmS_Id && editRecord.hrmE_Id) {
                            const subRes = await getSubjectByStaff({
                                ASMAY_Id: editRecord.asmaY_Id,
                                TTMC_Id: editRecord.ttmC_Id,
                                ASMCL_Id: editRecord.asmcL_Id,
                                ASMS_Id: editRecord.asmS_Id,
                                HRME_Id: editRecord.hrmE_Id
                            });
                            if (subRes?.subjectbystaff) setSubjectList(subRes.subjectbystaff as any[]);
                        }
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

    // Cascading Dropdowns

    // 1. Get Class on Category Change (and Year)
    const handleCategoryChange = async (categoryId: number) => {
        setValue('TTMC_Id', categoryId);
        // Reset downstream
        setValue('ASMCL_Id', 0);
        setClassList([]);
        setValue('ASMS_Id', 0);
        setValue('HRME_Id', 0);
        setStaffList([]);
        setValue('ISMS_Id', 0);
        setSubjectList([]);

        if (watchedAcademicYear && categoryId) {
            const res = await getClassByCategory({ ASMAY_Id: watchedAcademicYear, TTMC_Id: categoryId });
            if (res?.classbycategory) setClassList(res.classbycategory as any[]);
            else toast.info('No classes mapped to selected category');
        }
    };

    // 2. Get Staff on Section Change (and Class...)
    const handleSectionChange = async (sectionId: number) => {
        setValue('ASMS_Id', sectionId);
        // Reset downstream
        setValue('HRME_Id', 0);
        setStaffList([]);
        setValue('ISMS_Id', 0);
        setSubjectList([]);

        if (watchedAcademicYear && watchedCategory && watchedClass && sectionId) {
            const res = await getStaffByClassSection({
                ASMAY_Id: watchedAcademicYear,
                TTMC_Id: watchedCategory,
                ASMCL_Id: watchedClass,
                ASMS_Id: sectionId
            });
            if (res?.staffbyall) setStaffList(res.staffbyall as any[]);
            else toast.info('No Staff Allocated');
        }
    };

    // 3. Get Subject on Staff Change
    const handleStaffChange = async (staffId: number) => {
        setValue('HRME_Id', staffId);
        // Reset downstream
        setValue('ISMS_Id', 0);
        setSubjectList([]);

        if (watchedAcademicYear && watchedCategory && watchedClass && watchedSection && staffId) {
            const res = await getSubjectByStaff({
                ASMAY_Id: watchedAcademicYear,
                TTMC_Id: watchedCategory,
                ASMCL_Id: watchedClass,
                ASMS_Id: watchedSection,
                HRME_Id: staffId
            });
            if (res?.subjectbystaff) setSubjectList(res.subjectbystaff as any[]);
            else toast.info('No Subject Mapped');
        }
    };

    const onSubmit: SubmitHandler<ConsecutiveConstraintsSchema> = async (data) => {
        try {
            const payload = {
                ...data,
                TTC_BefAftApplFlag: data.TTC_BefAftApplFlag ? 1 : 0,
                TTC_AllotPeriods: data.TTC_NoOfPeriods, // Legacy backend compatibility
                TTC_RemPeriods: data.TTC_NoOfPeriods,
                TTC_AllotedFlag: 'N'
            };

            const res = await saveConsecutiveConstraintsDetail(payload);
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
                {/* Left Column */}
                <div className='space-y-4'>
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
                            Class <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='ASMCL_Id'
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                        // Also clear section etc? Or rely on independent section logic?
                                        // If class changes, section list might stay same (common dropdown) but staff list needs class
                                        // Better to reset downstream
                                        setStaffList([]);
                                        setValue('ASMS_Id', 0);
                                    }}
                                    value={field.value?.toString()}>
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
                            Staff <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='HRME_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => handleStaffChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staffList.map((item: any) => (
                                            <SelectItem key={item.hrmE_Id} value={item.hrmE_Id.toString()}>
                                                {item.staffName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.HRME_Id && <FormError>{errors.HRME_Id.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            Total No of Consecutive Days <span className='text-red-500'>*</span>
                        </Label>
                        <InputText type='number' {...register('TTC_NoOfConDays')} error={errors.TTC_NoOfConDays?.message} />
                    </div>
                </div>

                {/* Right Column */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>
                            Category <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='TTMC_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => handleCategoryChange(Number(val))} value={field.value?.toString()}>
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
                            Section <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='ASMS_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => handleSectionChange(Number(val))} value={field.value?.toString()}>
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
                            Subject <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='ISMS_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjectList.map((item: any) => (
                                            <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                                {item.ismS_SubjectName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ISMS_Id && <FormError>{errors.ISMS_Id.message}</FormError>}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            Total No of Consecutive Periods <span className='text-red-500'>*</span>
                        </Label>
                        <InputText type='number' {...register('TTC_NoOfConPeriods')} error={errors.TTC_NoOfConPeriods?.message} />
                    </div>
                </div>
            </div>

            {/* Calculation Row */}
            <div className='grid grid-cols-1 gap-6 pt-4 md:grid-cols-2'>
                <div className='space-y-2'>
                    <Label>Calculated Total Periods</Label>
                    <InputText {...register('TTC_NoOfPeriods')} disabled className='bg-gray-100' />
                </div>
            </div>

            {/* Before After Section */}
            <div className='mt-4 space-y-4 rounded-md border bg-gray-50 p-4'>
                <div className='flex items-center space-x-2'>
                    <Controller
                        control={control}
                        name='TTC_BefAftApplFlag'
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id='ba_flag' />}
                    />
                    <Label htmlFor='ba_flag' className='font-semibold'>
                        Before After Consecutive
                    </Label>
                </div>

                {watchedBefAftFlag && (
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label>
                                Condition <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='TTC_BefAftFalg'
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='1'>Before</SelectItem>
                                            <SelectItem value='2'>After</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.TTC_BefAftFalg && <FormError>{errors.TTC_BefAftFalg.message}</FormError>}
                        </div>

                        <div className='space-y-2'>
                            <Label>
                                Period <span className='text-red-500'>*</span>
                            </Label>
                            {/* Assuming standard manual input or dropdown. Legacy had input type number with maxvalue */}
                            <InputText type='number' {...register('TTC_BefAftPeriod')} error={errors.TTC_BefAftPeriod?.message} />
                        </div>
                    </div>
                )}
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
