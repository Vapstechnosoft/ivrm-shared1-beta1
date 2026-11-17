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
import type { SalaryAdvanceEmployeeDropdownItem, SalaryAdvanceGridItem } from '@/types/hrms/salary-advance';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface SalaryAdvanceForm {
    employeeId: string;
    entryDate: string;
    advanceYear: string;
    advanceMonth: string;
    appliedAmount: number;
    remarks: string;
    modeOfPayment: string;
    referenceNo: string;
}

interface UpdateFormProps {
    selectedRow: SalaryAdvanceGridItem | null;
    employeeDropdown: SalaryAdvanceEmployeeDropdownItem[] | undefined;
    onSuccess: () => void;
    className?: string;
}

export default function UpdateSalaryAdvanceForm({ selectedRow, employeeDropdown, onSuccess, className = '' }: UpdateFormProps) {
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

    const lastBoundIdRef = useRef<number | null>(null);

    // Generate initial values for immediate binding on mount
    const initialValues = useMemo(() => {
        if (!selectedRow) return {
            employeeId: '',
            entryDate: '',
            advanceYear: '',
            advanceMonth: '',
            appliedAmount: 0,
            remarks: '',
            modeOfPayment: '',
            referenceNo: ''
        };

        // Try to find matching year if possible (though we prefer immediate binding)
        let yearValue = selectedRow.hresA_AdvYear.toString();
        const matchingYear = (leaveYears as any[]).find(
            (y: any) =>
                String(y.hrmlY_LeaveYear) === yearValue ||
                String(y.HRMLY_LeaveYear) === yearValue
        );
        if (matchingYear) {
            yearValue = (matchingYear.hrmlY_LeaveYear || matchingYear.HRMLY_LeaveYear).toString();
        }

        const paymentMode = selectedRow.hresA_ModeOfPayment || '';
        const matchingMode = modeOfPayments.find(m => m.id.toLowerCase() === paymentMode.toLowerCase());
        const normalizedPaymentMode = matchingMode ? matchingMode.id : paymentMode;

        return {
            employeeId: selectedRow.hrmE_Id.toString(),
            entryDate: selectedRow.hresA_EntryDate ? format(new Date(selectedRow.hresA_EntryDate), 'yyyy-MM-dd') : '',
            advanceYear: yearValue,
            advanceMonth: String(selectedRow.hresA_AdvMonth || ''),
            appliedAmount: selectedRow.hresA_AppliedAmount,
            remarks: selectedRow.hresA_Remarks || '',
            modeOfPayment: normalizedPaymentMode,
            referenceNo: String(selectedRow.hresA_ReferenceNo || '')
        };
    }, [selectedRow, leaveYears, modeOfPayments]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<SalaryAdvanceForm>({
        mode: 'onChange',
        defaultValues: initialValues
    });

    const watchedEntryDate = watch('entryDate');

    // Sync form when selectedRow changes (handles cases where form stays mounted)
    useEffect(() => {
        if (selectedRow && lastBoundIdRef.current !== selectedRow.hresA_Id) {
            reset(initialValues);
            lastBoundIdRef.current = selectedRow.hresA_Id;
        }
    }, [selectedRow, initialValues, reset]);

    // Auto-select year and month based on entry date ONLY for new entries or if changed manually
    // We'll skip this if we're just loading an existing record
    useEffect(() => {
        if (watchedEntryDate && !selectedRow) {
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

                    const matchingMonth = (months as any[]).find((m: any) => m.IVRM_Month_Id === month || m.key === month || m.value?.toLowerCase() === format(entryDate, 'MMMM').toLowerCase());
                    if (matchingMonth) {
                        setValue('advanceMonth', matchingMonth.IVRM_Month_Name || matchingMonth.value);
                    }
                }
            } catch (_error) {
                // Silently handle date parsing errors
            }
        }
    }, [watchedEntryDate, leaveYears, months, setValue, selectedRow]);

    const onSubmit: SubmitHandler<SalaryAdvanceForm> = async (data: SalaryAdvanceForm) => {
        if (!selectedRow) {
            toast.error('No row selected for update');
            return;
        }

        const payload = {
            HRESA_Id: selectedRow.hresA_Id,
            HRME_Id: Number(data.employeeId),
            HRESA_EntryDate: `${data.entryDate}T00:00:00`,
            HRESA_AdvYear: Number(data.advanceYear),
            HRESA_AdvMonth: data.advanceMonth,
            HRESA_AppliedAmount: data.appliedAmount,
            HRESA_Remarks: data.remarks,
            HRESA_ActiveFlag: true,
            HRESA_AdvStatus: selectedRow.hresA_AdvStatus || '',
            HRESA_SanctinedAmount: null,
            HRESA_ModeOfPayment: data.modeOfPayment,
            HRESA_ReferenceNo: Number(data.referenceNo) || 0
        };

        saveAdvance(payload, {
            onSuccess: () => {
                toast.success('Salary advance updated successfully!');
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to update salary advance');
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
                            rules={{ required: 'Please select an employee' }}
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
                            rules={{ required: 'Please select entry date' }}
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
                            rules={{ required: 'Please select advance year' }}
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
                            rules={{ required: 'Please select advance month' }}
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
                        <Label>Applied Amount *</Label>
                        <InputText
                            type='number'
                            step='any'
                            placeholder='Enter amount'
                            {...register('appliedAmount', {
                                required: 'Please enter applied amount',
                                min: {
                                    value: 0.01,
                                    message: 'Amount must be greater than 0'
                                }
                            })}
                            error={errors.appliedAmount?.message}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Mode of Payment *</Label>
                        <Controller
                            name='modeOfPayment'
                            control={control}
                            rules={{ required: 'Please select mode of payment' }}
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
                        onClick={onSuccess}
                        disabled={isSubmitting || isPending}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting || isPending}
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Salary Advance
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}

