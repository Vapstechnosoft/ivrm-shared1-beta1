'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveSalaryIncrement } from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import { hrmsTransactionSchemas } from '@/schemas/hrms/transaction';
import type { SalaryIncrementGridItem, SalaryIncrementOnloadResponse } from '@/types/hrms/salary-increment';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof hrmsTransactionSchemas.salaryIncrement.addOrUpdate>;
interface UpdateFormProps {
    selectedRow: SalaryIncrementGridItem | null;
    onloadData: SalaryIncrementOnloadResponse | undefined;
    onSuccess: () => void;
    className?: string;
}
export default function UpdateSalaryIncrementForm({ selectedRow, onloadData, onSuccess, className = '' }: UpdateFormProps) {
    const { mutate: saveIncrement, isPending } = useSaveSalaryIncrement();
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsTransactionSchemas.salaryIncrement.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            HRESI_Id: 0,
            MI_Id: 30,
            HRME_Id: 0,
            HRESI_EffectiveDate: new Date(),
            HRESI_IncrementAmount: 0,
            HRESI_IncrementPercentage: 0,
            HRESI_Remarks: '',
            HRESI_ActiveFlg: true,
            LogInUserId: 2
        }
    });
    useEffect(() => {
        if (selectedRow?.HRME_Id) {
            reset({
                HRESI_Id: selectedRow.HREIC_Id,
                MI_Id: 30,
                HRME_Id: selectedRow.HRME_Id,
                HRESI_EffectiveDate: new Date(),
                HRESI_IncrementAmount: selectedRow.Amount,
                HRESI_IncrementPercentage: 0,
                HRESI_Remarks: '',
                HRESI_ActiveFlg: true,
                LogInUserId: 2
            });
        }
    }, [selectedRow, reset]);
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (!selectedRow) {
            toast.error('No row selected for update');
            return;
        }
        const payload = {
            HREIC_Id: data.HRESI_Id || selectedRow.HREIC_Id || 0,
            MI_Id: data.MI_Id,
            HRME_Id: data.HRME_Id,
            HREIC_IncrementDate: data.HRESI_EffectiveDate.toISOString(),
            HREIC_ArrearApplicableFlg: false,
            HREIC_ArrearGivenFlg: false,
            HREIC_ArrearMonths: 0,
            HRMED_Id: 0,
            HREICED_Amount: data.HRESI_IncrementAmount,
            HREICED_Percentage: data.HRESI_IncrementPercentage?.toString() || '0',
            HREIC_ActiveFlag: data.HRESI_ActiveFlg,
            roleId: data.LogInUserId || 2,
            UserId: data.LogInUserId || 2
        };
        saveIncrement(payload as any, {
            onSuccess: (response) => {
                toast.success(response?.retrunMsg || 'Salary increment updated successfully');
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'An error occurred');
            }
        });
    };
    // Memoize arrays to prevent unnecessary re-renders
    const employees = useMemo(() => onloadData?.employeelist || [], [onloadData?.employeelist]);
    const _earningDeductions = useMemo(() => onloadData?.earningdeductiontype || [], [onloadData?.earningdeductiontype]);
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {/* Employee */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRME_Id'>
                                Employee <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRME_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value ? String(field.value) : ''}>
                                        <SelectTrigger id='HRME_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select employee' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(employees) && employees.length > 0
                                                ? employees.map((emp: any) => (
                                                      <SelectItem key={emp.HRME_Id} value={String(emp.HRME_Id)}>
                                                          {emp.HRME_EmployeeCode} - {emp.HRME_EmployeeFirstName} {emp.HRME_EmployeeLastName}
                                                      </SelectItem>
                                                  ))
                                                : null}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRME_Id && <FormError>{errors.HRME_Id.message}</FormError>}
                        </div>
                        {/* Earning/Deduction Head - Commented out as not in schema */}
                        {/* <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRMED_Id'>
                                Earning/Deduction Head <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRMED_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value ? String(field.value) : ''}>
                                        <SelectTrigger id='HRMED_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select head' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {earningDeductions.map((head) => (
                                                <SelectItem key={head.HRMED_Id} value={String(head.HRMED_Id)}>
                                                    {head.HRMED_Name} ({head.HRMED_EarnDedFlag})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRMED_Id && <FormError>{errors.HRMED_Id.message}</FormError>}
                        </div> */}
                        {/* Increment Date */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESI_EffectiveDate'>
                                Increment Date <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRESI_EffectiveDate'
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full justify-start text-left font-normal transition-colors focus:ring-2 focus:ring-primary/20',
                                                    !field.value && 'text-muted-foreground'
                                                )}>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <DatePickerWithYear
                                                mode='single'
                                                selected={field.value}
                                                onDayClick={(day) => field.onChange(day)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.HRESI_EffectiveDate && <FormError>{errors.HRESI_EffectiveDate.message}</FormError>}
                        </div>
                        {/* Amount */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESI_IncrementAmount'>
                                Amount <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRESI_IncrementAmount'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        id='HRESI_IncrementAmount'
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.HRESI_IncrementAmount?.message}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                )}
                            />
                        </div>
                        {/* Percentage */}
                        <InputText
                            label='Percentage'
                            id='HRESI_IncrementPercentage'
                            {...register('HRESI_IncrementPercentage')}
                            error={errors.HRESI_IncrementPercentage?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        {/* Arrear fields commented out - not in schema */}
                        {/* <InputNumber
                            label='Arrear Months'
                            id='HREIC_ArrearMonths'
                            {...register('HREIC_ArrearMonths', { valueAsNumber: true })}
                            error={errors.HREIC_ArrearMonths?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        /> */}
                        {/* <div className='group flex flex-col gap-1.5'>
                            <div className='flex items-center space-x-3 rounded-md border p-4'>
                                <Controller
                                    name='HREIC_ArrearApplicableFlg'
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox id='HREIC_ArrearApplicableFlg' checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor='HREIC_ArrearApplicableFlg' className='cursor-pointer font-normal'>
                                    Arrear Applicable
                                </Label>
                            </div>
                            {errors.HREIC_ArrearApplicableFlg && <FormError>{errors.HREIC_ArrearApplicableFlg.message}</FormError>}
                        </div> */}
                        {/* <div className='group flex flex-col gap-1.5'>
                            <div className='flex items-center space-x-3 rounded-md border p-4'>
                                <Controller
                                    name='HREIC_ArrearGivenFlg'
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox id='HREIC_ArrearGivenFlg' checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor='HREIC_ArrearGivenFlg' className='cursor-pointer font-normal'>
                                    Arrear Given
                                </Label>
                            </div>
                            {errors.HREIC_ArrearGivenFlg && <FormError>{errors.HREIC_ArrearGivenFlg.message}</FormError>}
                        </div> */}
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>
                {/* Action Buttons */}
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
                            Update Salary Increment
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
