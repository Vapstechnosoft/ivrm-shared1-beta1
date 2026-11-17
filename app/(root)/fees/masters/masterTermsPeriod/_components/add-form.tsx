'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_HEADS_DROPDOWN, TERM_DROPDOWN_DATA, useMasterTermsPeriod } from '@/hooks/fees/useMasters';
import { useacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { masterTermPeriodSchema } from '@/schemas/fees/masters';
import { addOrUpdateTermsPeriod, get_split_year } from '@/server/fees/masters/fee_terms_period';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermPeriodSchema.addOrUpdate>;

interface FeeTermsPeriodFormProps {
    onSuccess?: () => void;
    termname?: string;
}

export default function AddFeeTermsPeriodForm({ onSuccess, termname = '' }: FeeTermsPeriodFormProps) {
    const { refetchAll } = useMasterTermsPeriod();

    // Fetch hooks
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useacademicyerdropdowndatafee();

    const { data: terms, isLoading: termsLoading, error: termsError, refetchAll: refetchterms } = TERM_DROPDOWN_DATA();

    const { data: masterHeads, isLoading: masterHeadsLoading, error: headerror, refetchAll: refetchMasterHeads } = MASTER_HEADS_DROPDOWN();

    const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedHead, setSelectedHead] = useState<number | null>(null);
    const [splitAcademicYear, setSplitAcademicYear] = useState<any>(null); // store API result

    const [isSplitLoading, setIsSplitLoading] = useState(false);

    const [selectedSplitYear, setSelectedSplitYear] = useState<string | null>(null);

    const [filterType, setFilterType] = useState<string>('');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthOrder: Record<string, number> = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
    };

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermPeriodSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmtP_Year: '',
            filterType: '',
            from_Month: '',
            to_Month: ''
        }
    });
    const fromMonth = watch('from_Month');
    const toMonth = watch('to_Month');

    // useEffect(() => {
    //     if (
    //         fromMonth &&
    //         toMonth &&
    //         monthOrder[fromMonth] >= monthOrder[toMonth]
    //     ) {
    //         setValue('to_Month', '');
    //     }
    // }, [fromMonth]);

    // ✅ useEffect to auto-fetch dropdown data
    useEffect(() => {
        refetchterms();
        refetchMasterHeads();
    }, [refetchterms, refetchMasterHeads]);

    function OnReset() {
        // reset();
        reset({
            from_Month: '',
            to_Month: '',
            filterType: ''
        });
        refetchAll();
        refetchterms();
        refetchMasterHeads();
    }

    const handleFilterChange = (value: string) => {
        setFilterType(value);
    };

    useEffect(() => {
        if (selectedAcademicYear !== null) {
            const fetchSplitAcademicYear = async () => {
                setIsSplitLoading(true); // 🔥 Disable immediately
                setSplitAcademicYear(null); // 🔥 Clear old data
                setSelectedSplitYear(null); // 🔥 Reset selected option
                try {
                    const response = await get_split_year(Number(selectedAcademicYear));
                    console.log('Split Academic Year:', response);
                    setSplitAcademicYear(response.data); // store result if needed
                } catch (err) {
                    console.error('Failed to fetch split academic year', err);
                } finally {
                    setIsSplitLoading(false); // 🔥 Re-enable dropdown
                }
            };

            fetchSplitAcademicYear();
        }
    }, [selectedAcademicYear]);
    //getFeeTermHeadDueDateGridList
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (monthOrder[data.from_Month] >= monthOrder[data.to_Month]) {
            toast.error('From Month must be earlier than To Month');
            return;
        }
        try {
            const { asmay_Id, fmt_id } = data;

            const payload = {
                // mi_id: 30,
                asmay_Id: asmay_Id,
                fmt_id: fmt_id,
                // fmh_id: selectedHead,
                fmtP_Year: data.fmtP_Year,
                feeflag: filterType,
                fmtP_FROM_MONTH: data.from_Month,
                fmtP_TO_MONTH: data.to_Month
                // user_id: 21602
            };

            console.log('Payload JSON:', JSON.stringify(payload));

            const response = await addOrUpdateTermsPeriod(payload);

            if (response.success) {
                toast.success(response.message);
                OnReset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className={`${termname}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                {/* Academic Year */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Academic Year:<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='asmay_Id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedAcademicYear(id);
                                    }}
                                    value={typeof field.value === 'number' || typeof field.value === 'string' ? String(field.value) : ''}
                                    disabled={academicYearLoading}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Academic Year--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYearLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : academicYearError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            academicYear?.data?.map((item: any) => (
                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.asmay_Id && <FormError>{errors.asmay_Id.message}</FormError>}
                    </div>
                </div>

                {/* Term Name */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Term Name :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='fmt_id'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        field.onChange(id);
                                        setSelectedTerm(id);
                                    }}
                                    value={typeof field.value === 'number' || typeof field.value === 'string' ? String(field.value) : ''}
                                    disabled={termsLoading}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Term--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {termsLoading ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : termsError ? (
                                            <SelectItem value='error' disabled>
                                                Error loading
                                            </SelectItem>
                                        ) : (
                                            terms?.data?.map((item: any, index: number) => (
                                                <SelectItem key={`${item.fmT_Id}-${index}`} value={item.fmT_Id.toString()}>
                                                    {item.fmT_Name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmt_id && <FormError>{errors.fmt_id.message}</FormError>}
                    </div>
                </div>

                {/* Split Academic Year */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        Year :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='fmtP_Year'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setSelectedSplitYear(val);
                                    }}
                                    value={field.value || ''}
                                    //disabled={!selectedAcademicYear || !splitAcademicYear}
                                    disabled={!selectedAcademicYear || isSplitLoading || !splitAcademicYear}
                                >
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Year--' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {!selectedAcademicYear ? (
                                            <SelectItem value='na' disabled>
                                                Select Academic Year First
                                            </SelectItem>
                                        ) : !splitAcademicYear ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (
                                            splitAcademicYear?.map((item: any) => (
                                                <SelectItem key={item.fmtP_Year} value={item.fmtP_Year}>
                                                    {item.fmtP_Year}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.fmtP_Year && <FormError>{errors.fmtP_Year.message}</FormError>}
                    </div>
                </div>
                {/* 
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        From Month :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='from_Month'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText
                                        {...field}
                                        id='from_Month'
                                        required
                                        onKeyDown={(e) => {
                                            const allowed = /^[A-Za-z0-9 ]$/;
                                            if (e.key.length === 1 && !allowed.test(e.key)) e.preventDefault();
                                        }}
                                        onPaste={(e) => {
                                            const pasteText = e.clipboardData.getData('text');
                                            if (!/^[A-Za-z0-9 ]*$/.test(pasteText)) e.preventDefault();
                                        }}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                    {errors.from_Month && <FormError>{errors.from_Month.message}</FormError>}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        To Month :<span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='to_Month'
                            control={control}
                            render={({ field }) => (
                                <>
                                    <InputText
                                        {...field}
                                        id='to_Month'
                                        required
                                        onKeyDown={(e) => {
                                            const allowed = /^[A-Za-z0-9 ]$/;
                                            if (e.key.length === 1 && !allowed.test(e.key)) e.preventDefault();
                                        }}
                                        onPaste={(e) => {
                                            const pasteText = e.clipboardData.getData('text');
                                            if (!/^[A-Za-z0-9 ]*$/.test(pasteText)) e.preventDefault();
                                        }}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                    {errors.to_Month && <FormError>{errors.to_Month.message}</FormError>}
                                </>
                            )}
                        />
                    </div>
                </div> */}
                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        From Month :<span className='ml-1 text-red-500'>*</span>
                    </Label>

                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='from_Month'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Month--' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.from_Month && <FormError>{errors.from_Month.message}</FormError>}
                    </div>
                </div>

                <div className='flex items-center gap-6'>
                    <Label className='min-w-[150px] text-right'>
                        To Month :<span className='ml-1 text-red-500'>*</span>
                    </Label>

                    <div className='flex w-full max-w-[400px] flex-col'>
                        <Controller
                            name='to_Month'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value || ''} onValueChange={field.onChange} disabled={!fromMonth}>
                                    <SelectTrigger className='min-w-[400px] text-center'>
                                        <SelectValue placeholder='--Select Month--' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.to_Month && <FormError>{errors.to_Month.message}</FormError>}
                    </div>
                </div>

                <div className='flex w-full justify-center'>
                    <Controller
                        name='filterType'
                        control={control}
                        render={({ field }) => (
                            <div className='flex w-full flex-col items-center'>
                                <Card className='w-full max-w-[900px] p-4'>
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setFilterType(val);
                                        }}
                                        className='w-full'>
                                        <div className='flex w-full items-center justify-evenly gap-x-4 px-2'>
                                            {[
                                                { value: 'N', label: 'New Admission Fee' },
                                                { value: 'F', label: 'Regular Fee' },
                                                { value: 'T', label: 'Transport Fee' },
                                                { value: 'R', label: 'Registration Fee' }
                                            ].map((item) => (
                                                <label
                                                    key={item.value}
                                                    htmlFor={item.value}
                                                    className='flex cursor-pointer items-center gap-2 text-sm'>
                                                    <RadioGroupItem value={item.value} id={item.value} />
                                                    <span>{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </Card>

                                {errors.filterType && <FormError className='mt-2'>{errors.filterType.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 pt-4 sm:flex-row sm:justify-start'>
                    <>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={OnReset}
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
                                Save
                            </div>
                        </Button>
                    </>
                </div>
            </form>
        </div>
    );
}
