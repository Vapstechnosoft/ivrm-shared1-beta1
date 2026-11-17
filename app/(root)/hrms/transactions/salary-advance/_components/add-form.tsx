'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useLeaveYearDropdown, useMonthDropdown } from '@/hooks/hrms/useMasters';
import { useSaveSalaryAdvance } from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import { hrmsTransactionSchemas } from '@/schemas/hrms/transaction';
import type { SalaryAdvanceEmployeeDropdownItem } from '@/types/hrms/salary-advance';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type SalaryAdvanceForm = z.infer<typeof hrmsTransactionSchemas.salaryAdvance.form>;

interface AddFormProps {
    employeeDropdown: SalaryAdvanceEmployeeDropdownItem[] | undefined;
    onSuccess: () => void;
    className?: string;
}

export default function AddSalaryAdvanceForm({ employeeDropdown, onSuccess, className = '' }: AddFormProps) {
    const { mutate: saveAdvance, isPending } = useSaveSalaryAdvance();

    // Fetch other dropdowns from masters
    const { data: leaveYearsData } = useLeaveYearDropdown();
    const { data: monthsData } = useMonthDropdown();

    // Hardcoded mode of payments as they are standard and might not have a specific hook yet
    const modeOfPayments = useMemo(() => [
        { id: 'Cash', name: 'Cash' },
        { id: 'Bank Transfer', name: 'Bank Transfer' },
        { id: 'Cheque', name: 'Cheque' }
    ], []);

    const employees = useMemo(() => employeeDropdown || [], [employeeDropdown]);
    const leaveYears = useMemo(() => (leaveYearsData as any)?.data || [], [leaveYearsData]);
    const months = useMemo(() => (monthsData as any)?.data || [], [monthsData]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<SalaryAdvanceForm>({
        resolver: zodResolver(hrmsTransactionSchemas.salaryAdvance.form),
        mode: 'onChange',
        defaultValues: {
            employeeId: '',
            entryDate: '',
            advanceYear: '',
            advanceMonth: '',
            appliedAmount: 0,
            remarks: '',
            modeOfPayment: '',
            referenceNo: ''
        }
    });

    const watchedEntryDate = watch('entryDate');

    // Auto-select year and month based on entry date
    useEffect(() => {
        if (watchedEntryDate) {
            try {
                const entryDate = new Date(watchedEntryDate);
                if (!Number.isNaN(entryDate.getTime())) {
                    const year = entryDate.getFullYear();
                    const month = entryDate.getMonth() + 1;

                    const matchingYear = (leaveYears as any[]).find(
                        (y: any) => String(y.hrmlY_LeaveYear) === String(year) || String(y.HRMLY_LeaveYear) === String(year)
                    );
                    if (matchingYear) {
                        setValue('advanceYear', (matchingYear.hrmlY_LeaveYear || matchingYear.HRMLY_LeaveYear).toString());
                    }

                    const matchingMonth = (months as any[]).find((m: any) => m.IVRM_Month_Id === month || m.key === month);
                    if (matchingMonth) {
                        setValue('advanceMonth', matchingMonth.IVRM_Month_Name || matchingMonth.value);
                    }
                }
            } catch (_error) {
                // Silently handle date parsing errors
            }
        }
    }, [watchedEntryDate, leaveYears, months, setValue]);

    const onSubmit: SubmitHandler<SalaryAdvanceForm> = async (data: SalaryAdvanceForm) => {
        const payload = {
            HRESA_Id: 0,
            HRME_Id: Number(data.employeeId),
            HRESA_EntryDate: `${data.entryDate}T00:00:00`,
            HRESA_AdvYear: Number(data.advanceYear),
            HRESA_AdvMonth: data.advanceMonth,
            HRESA_AppliedAmount: data.appliedAmount,
            HRESA_Remarks: data.remarks || '',
            HRESA_ActiveFlag: true,
            HRESA_AdvStatus: '',
            HRESA_SanctinedAmount: null,
            HRESA_ModeOfPayment: data.modeOfPayment,
            HRESA_ReferenceNo: Number(data.referenceNo) || 0
        };

        saveAdvance(payload, {
            onSuccess: () => {
                toast.success('Salary advance created successfully!');
                reset();
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create salary advance');
            }
        });
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label>Employee *</Label>
                        <Controller
                            name='employeeId'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Employee' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.hrmE_Id} value={emp.hrmE_Id.toString()}>
                                                {emp.employeeName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.employeeId && <FormError>{errors.employeeId.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <Label>Entry Date *</Label>
                        <Controller
                            name='entryDate'
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}>
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : 'Select date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date: Date | undefined) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.entryDate && <FormError>{errors.entryDate.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <Label>Advance Year *</Label>
                        <Controller
                            name='advanceYear'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(leaveYears as any[]).map((year: any) => (
                                            <SelectItem key={year.hrmlY_Id || year.HRMLY_Id} value={(year.hrmlY_LeaveYear || year.HRMLY_LeaveYear).toString()}>
                                                {year.hrmlY_LeaveYear || year.HRMLY_LeaveYear}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.advanceYear && <FormError>{errors.advanceYear.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <Label>Advance Month *</Label>
                        <Controller
                            name='advanceMonth'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Month' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(months as any[]).map((month: any) => (
                                            <SelectItem key={month.IVRM_Month_Id || month.key} value={month.IVRM_Month_Name || month.value}>
                                                {month.IVRM_Month_Name || month.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.advanceMonth && <FormError>{errors.advanceMonth.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <Label>Advanced Amount *</Label>
                        <InputText
                            type='number'
                            step='0.01'
                            placeholder='Enter advanced amount'
                            {...register('appliedAmount', { valueAsNumber: true })}
                            error={errors.appliedAmount?.message}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Mode of Payment *</Label>
                        <Controller
                            name='modeOfPayment'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Payment Mode' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modeOfPayments.map((mode) => (
                                            <SelectItem key={mode.id} value={mode.id}>
                                                {mode.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.modeOfPayment && <FormError>{errors.modeOfPayment.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <Label>Reference No</Label>
                        <InputText
                            placeholder='Enter reference number'
                            {...register('referenceNo')}
                            error={errors.referenceNo?.message}
                        />
                    </div>
                </div>
                <div className='space-y-2'>
                    <Label>Remarks</Label>
                    <InputText placeholder='Enter remarks' {...register('remarks')} error={errors.remarks?.message} />
                </div>
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={isSubmitting || isPending}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Add Salary Advance
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

