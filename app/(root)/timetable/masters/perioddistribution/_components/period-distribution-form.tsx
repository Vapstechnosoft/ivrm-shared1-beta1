'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodDistributionDetails } from '@/hooks/timetable/useMasters';
import { periodDistributionSchema } from '@/schemas/timetable/masters';
import { getClassByCategory } from '@/server/timetable/masters/perioddistribution';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof periodDistributionSchema.save>;

interface PeriodDistributionFormProps {
    onSuccess?: (data: any) => void;
    initialData?: any; // For edit mode
}

export default function PeriodDistributionForm({ onSuccess, initialData }: PeriodDistributionFormProps) {
    const { data: response } = usePeriodDistributionDetails();
    const [tempList, setTempList] = useState<any[]>([]);
    const [classList, setClassList] = useState<any[]>([]);
    const [availablePeriods, setAvailablePeriods] = useState<number>(1);

    const academicList = (response as any)?.academiclist || [];
    const categoryList = (response as any)?.catelist || [];
    const staffList = (response as any)?.stafflist || [];
    const sectionList = (response as any)?.sectionlist || [];
    const subjectList = (response as any)?.subjectlist || [];

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(periodDistributionSchema.save),
        defaultValues: {
            nop1: 1,
            ttfpD_StaffConsecutive: 1,
            nop2: 0
        }
    });

    const watchedAcademicYear = watch('asmaY_Id');
    const watchedCategory = watch('ttmC_Id');
    const watchedTotalWeeklyPeriods = watch('nop1');
    // const watchedNoOfPeriodsByUser = watch('nop2');

    // Calculate Available Periods
    useEffect(() => {
        const total = Number(watchedTotalWeeklyPeriods || 0);
        const used = tempList.reduce((acc, curr) => acc + Number(curr.pedDisplay), 0);
        let avail = total - used;
        if (avail < 0) avail = 0;
        setAvailablePeriods(avail);
    }, [watchedTotalWeeklyPeriods, tempList]);

    // Fetch Classes based on Category
    useEffect(() => {
        const fetchClasses = async () => {
            setValue('asmcL_Id', undefined as any);
            setValue('asmS_Id', undefined as any);
            setValue('ismS_Id', undefined as any);
            setValue('nop2', 0);
            if (watchedAcademicYear && watchedCategory) {
                try {
                    const res = await getClassByCategory({
                        ASMAY_Id: watchedAcademicYear,
                        TTMC_Id: watchedCategory
                    });
                    if (res && (res as any).classbycategory) {
                        setClassList((res as any).classbycategory);
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

    const addToTempList = () => {
        const data = watch();
        // Validation for sub-distribution fields
        if (!data.ttmC_Id || !data.asmcL_Id || !data.asmS_Id || !data.ismS_Id || !data.nop2) {
            toast.warning('Please Select Fields Class, Section, Subject And Enter Period (Not Zero)!');
            return;
        }
        const nop2Val = Number(data.nop2);
        if (nop2Val === 0) {
            toast.warning('Period cannot be zero!');
            return;
        }

        const totalPeriods = Number(data.nop1);
        if (totalPeriods < nop2Val) {
            toast.warning("Period Distribution Can't exceed the Total for only single class !!!");
            return;
        }

        // Check if addition exceeds total
        const used = tempList.reduce((acc, curr) => acc + Number(curr.pedDisplay), 0);
        if (used + nop2Val > totalPeriods) {
            toast.warning('Total distributed periods cannot exceed Total Weekly Periods!');
            return;
        }

        // Find labels
        const catName = categoryList.find((c: any) => c.ttmC_Id === data.ttmC_Id)?.ttmC_CategoryName;
        const className = classList.find((c: any) => c.asmcL_Id === data.asmcL_Id)?.asmcL_ClassName;
        const sectionName = sectionList.find((s: any) => s.asmS_Id === data.asmS_Id)?.asmC_SectionName;
        const subjectName = subjectList.find((s: any) => s.ismS_Id === data.ismS_Id)?.ismS_SubjectName;

        // Check duplicate
        const isDuplicate = tempList.some(
            (item) =>
                item.catDisplay === catName &&
                item.clsDisplay === className &&
                item.sectDisplay === sectionName &&
                item.subDisplay === subjectName
        );

        if (isDuplicate) {
            toast.warning('Record Already Selected!');
            return;
        }

        const newItem = {
            id: Date.now(), // temp id
            catDisplay: catName,
            clsDisplay: className,
            sectDisplay: sectionName,
            subDisplay: subjectName,
            pedDisplay: nop2Val,
            // Original IDs for saving
            asmcL_Id: data.asmcL_Id,
            asmS_Id: data.asmS_Id,
            ismS_Id: data.ismS_Id,
            ttmC_Id: data.ttmC_Id
        };

        setTempList([...tempList, newItem]);

        // Reset lower fields
        setValue('nop2', 0);
        setValue('ttmC_Id', undefined as any);
        setValue('asmcL_Id', undefined as any);
        setValue('asmS_Id', undefined as any);
        setValue('ismS_Id', undefined as any);
    };

    const removeTempItem = (id: number) => {
        setTempList(tempList.filter((item) => item.id !== id));
    };

    const handleClear = () => {
        setTempList([]);
        reset({
            nop1: 1,
            ttfpD_StaffConsecutive: 1,
            nop2: 0,
            asmaY_Id: undefined,
            hrmE_Id: undefined,
            ttmC_Id: undefined,
            asmcL_Id: undefined,
            asmS_Id: undefined,
            ismS_Id: undefined
        });
        setAvailablePeriods(1);
    };

    const onSubmit = async (data: FormFields) => {
        if (!data.hrmE_Id) {
            toast.warning('Select Staff');
            return;
        }

        if (tempList.length === 0) {
            toast.warning('Need To Distribute Atleast One Period');
            return;
        }

        const payload = {
            TTFPD_Id: 0, // 0 for new
            TTFPDD_Id: 0,
            ASMAY_Id: data.asmaY_Id,
            HRME_Id: data.hrmE_Id,
            TTFPD_TotWeekPeriods: data.nop1,
            TTFPD_StaffConsecutive: data.ttfpD_StaffConsecutive,
            TempararyArrayList: tempList.map((item) => ({
                ASMCL_Id: item.asmcL_Id,
                ASMS_Id: item.asmS_Id,
                ISMS_Id: item.ismS_Id,
                NOP: item.pedDisplay,
                TTMC_Id: item.ttmC_Id
            }))
        };

        // Pass to parent
        onSuccess?.(payload);
        handleClear();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4 rounded-md border bg-white p-4 shadow-sm'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
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

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <InputText
                                    label='Total Weekly Period'
                                    type='number'
                                    required
                                    min={1}
                                    {...register('nop1')}
                                    error={errors.nop1?.message}
                                />
                            </div>
                            <div className='space-y-2'>
                                <InputText
                                    label='Staff Consecutive'
                                    type='number'
                                    required
                                    min={1}
                                    {...register('ttfpD_StaffConsecutive')}
                                    error={errors.ttfpD_StaffConsecutive?.message}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label>
                                Staff Name <span className='text-red-500'>*</span>
                            </Label>
                            {/* <Controller
                                control={control}
                                name="hrmE_Id"
                                render={({ field }) => (
                                    <Combobox
                                        value={field.value?.toString()}
                                        onChange={(val: string) => field.onChange(Number(val))}
                                        options={staffList.map((s: any) => ({
                                            value: s.hrmE_Id.toString(),
                                            label: s.staffName
                                        }))}
                                        placeholder="Select or search Staff..."
                                    />
                                )}
                            /> */}
                            {errors.hrmE_Id && <span className='text-red-500 text-sm'>{errors.hrmE_Id.message}</span>}
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label>Available Period</Label>
                                <div className='flex h-10 items-center rounded-md border bg-muted/50 px-3 py-2 font-medium text-sm'>
                                    {availablePeriods}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            {/* Distribution Section */}
            <div className='space-y-6 rounded-md border bg-muted/10 p-4'>
                <div className='grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label>Category Name</Label>
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
                    </div>

                    <div className='space-y-2'>
                        <Label>Class</Label>
                        <Controller
                            control={control}
                            name='asmcL_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classList.length > 0 ? (
                                            classList.map((item: any) => (
                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className='p-2 text-muted-foreground text-sm'>Select Category First</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Section</Label>
                        <Controller
                            control={control}
                            name='asmS_Id'
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
                    </div>

                    <div className='space-y-2'>
                        <Label>Subject</Label>
                        <Controller
                            control={control}
                            name='ismS_Id'
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
                    </div>

                    <div className='space-y-2'>
                        <InputText label='No of Period' type='number' min={0} {...register('nop2')} />
                    </div>
                </div>

                <div className='flex justify-center pt-2'>
                    <Button
                        type='button'
                        size='icon'
                        className='h-12 w-12 rounded-full transition-transform hover:scale-110'
                        onClick={addToTempList}
                        title='Add to Grid'>
                        <ArrowRight className='h-6 w-6' />
                    </Button>
                </div>

                {/* Temp Grid */}
                <div className='overflow-hidden rounded-md border bg-background'>
                    <table className='w-full text-left text-sm'>
                        <thead className='border-b bg-muted'>
                            <tr>
                                <th className='p-3 font-medium'>Category</th>
                                <th className='p-3 font-medium'>Class</th>
                                <th className='p-3 font-medium'>Section</th>
                                <th className='p-3 font-medium'>Subject</th>
                                <th className='p-3 text-center font-medium'>Periods</th>
                                <th className='p-3 text-right font-medium'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y'>
                            {tempList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='p-8 text-center text-muted-foreground'>
                                        No distributions added yet. Add items above.
                                    </td>
                                </tr>
                            ) : (
                                tempList.map((item) => (
                                    <tr key={item.id} className='transition-colors hover:bg-muted/50'>
                                        <td className='p-3'>{item.catDisplay}</td>
                                        <td className='p-3'>{item.clsDisplay}</td>
                                        <td className='p-3'>{item.sectDisplay}</td>
                                        <td className='p-3'>{item.subDisplay}</td>
                                        <td className='p-3 text-center'>{item.pedDisplay}</td>
                                        <td className='p-3 text-right'>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                className='h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive'
                                                onClick={() => removeTempItem(item.id)}>
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='flex justify-center gap-3'>
                <Button type='submit' disabled={isSubmitting}>
                    <Save className='mr-2 h-4 w-4' />
                    Save
                </Button>
                <Button type='button' onClick={handleClear}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                {/* <Button
                        type='button'
                        variant='outline'
                        onClick={handleClear}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button> */}
            </div>
        </form>
    );
}
