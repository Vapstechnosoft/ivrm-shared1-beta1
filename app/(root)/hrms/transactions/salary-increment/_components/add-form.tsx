'use client';
import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useSaveSalaryIncrement } from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import { hrmsTransactionSchemas } from '@/schemas/hrms/transaction';
import type { SalaryIncrementOnloadResponse } from '@/types/hrms/salary-increment';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof hrmsTransactionSchemas.salaryIncrement.addOrUpdate>;
interface AddFormProps {
    onloadData: SalaryIncrementOnloadResponse | undefined;
    onSuccess: () => void;
    className?: string;
}
export default function AddSalaryIncrementForm({ onloadData, onSuccess, className = '' }: AddFormProps) {
    const { mutate: saveIncrement, isPending } = useSaveSalaryIncrement();
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsTransactionSchemas.salaryIncrement.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            HRESI_Id: 0,
            MI_Id: HRMS_MI_ID,
            HRME_Id: 0,
            HRMED_Id: 0,
            HRESI_IncrementType: 'Percentage',
            HRESI_IncrementAmount: 0,
            HRESI_IncrementPercentage: 0,
            HRESI_EffectiveDate: undefined as Date | undefined,
            HRESI_Remarks: '',
            HRESI_ActiveFlg: true,
            LogInUserId: 2
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const payload = {
            HREIC_Id: data.HRESI_Id || 0,
            MI_Id: data.MI_Id,
            HRME_Id: data.HRME_Id,
            HREIC_IncrementDate: data.HRESI_EffectiveDate ? data.HRESI_EffectiveDate.toISOString() : new Date().toISOString(),
            HREIC_ArrearApplicableFlg: false,
            HREIC_ArrearGivenFlg: false,
            HREIC_ArrearMonths: 0,
            HRMED_Id: data.HRMED_Id || 0,
            HREICED_Amount: data.HRESI_IncrementAmount || 0,
            HREICED_Percentage: data.HRESI_IncrementPercentage?.toString() || '0',
            HREIC_ActiveFlag: data.HRESI_ActiveFlg,
            roleId: data.LogInUserId || 2,
            UserId: data.LogInUserId || 2
        };
        saveIncrement(payload as any, {
            onSuccess: (response) => {
                toast.success(response?.retrunMsg || 'Salary increment added successfully');
                reset();
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'An error occurred');
            }
        });
    };
    const handleReset = () => {
        reset();
    };
    // Memoize arrays to prevent unnecessary re-renders
    const employees = useMemo(() => onloadData?.employeelist || [], [onloadData?.employeelist]);
    const earningDeductions = useMemo(() => onloadData?.earningdeductiontype || [], [onloadData?.earningdeductiontype]);
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Employee - Multi-select with search */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label>
                                Employee <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRME_Id'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <MultiSelect
                                        options={employees.map((emp) => ({
                                            label: `${emp.HRME_EmployeeFirstName} ${emp.HRME_EmployeeMiddleName || ''} ${emp.HRME_EmployeeLastName || ''}`.trim(),
                                            value: String(emp.HRME_Id)
                                        }))}
                                        onValueChange={(vals) => {
                                            if (vals.length > 0) {
                                                field.onChange(Number(vals[0]));
                                            } else {
                                                field.onChange(0);
                                            }
                                        }}
                                        defaultValue={field.value ? [String(field.value)] : []}
                                        placeholder='Select employee'
                                        className='w-full'
                                        maxHeight={240}
                                    />
                                )}
                            />
                            {errors.HRME_Id && <FormError>{errors.HRME_Id.message}</FormError>}
                        </div>
                        {/* Head */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRMED_Id'>
                                Head <span className='text-destructive'>:*</span>
                            </Label>
                            <Controller
                                name='HRMED_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value ? String(field.value) : ''}>
                                        <SelectTrigger id='HRMED_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select Head' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(earningDeductions) && earningDeductions.length > 0
                                                ? earningDeductions.map((head) => (
                                                      <SelectItem key={head.HRMED_Id} value={String(head.HRMED_Id)}>
                                                          {head.HRMED_Name}
                                                      </SelectItem>
                                                  ))
                                                : null}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRMED_Id && <FormError>{errors.HRMED_Id.message}</FormError>}
                        </div>
                        {/* Increment Date */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESI_EffectiveDate'>
                                Increment Date <span className='text-destructive'>:*</span>
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
                                                {field.value ? (
                                                    format(field.value instanceof Date ? field.value : new Date(field.value), 'dd-MM-yyyy')
                                                ) : (
                                                    <span>Select date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <CalendarYear
                                                mode='single'
                                                selected={
                                                    field.value
                                                        ? field.value instanceof Date
                                                            ? field.value
                                                            : new Date(field.value)
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    field.onChange(date || undefined);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.HRESI_EffectiveDate && <FormError>{errors.HRESI_EffectiveDate.message}</FormError>}
                        </div>
                        {/* Increment Type */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label>Increment Type</Label>
                            <Controller
                                name='HRESI_IncrementType'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value || 'Percentage'}
                                        onValueChange={(value) => field.onChange(value as 'Percentage' | 'Amount' | undefined)}
                                        className='flex items-center gap-6'>
                                        <div className='flex items-center gap-2'>
                                            <RadioGroupItem value='Percentage' id='inc-per' />
                                            <Label htmlFor='inc-per' className='cursor-pointer font-normal'>
                                                Percentage
                                            </Label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <RadioGroupItem value='Amount' id='inc-amt' />
                                            <Label htmlFor='inc-amt' className='cursor-pointer font-normal'>
                                                Amount
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.HRESI_IncrementType && <FormError>{errors.HRESI_IncrementType.message}</FormError>}
                        </div>
                        {/* Percentage/Amount - Show based on selected type */}
                        {watch('HRESI_IncrementType') === 'Percentage' && (
                            <div className='group flex flex-col gap-1.5'>
                                <Label htmlFor='HRESI_IncrementPercentage'>
                                    Percentage <span className='text-destructive'>:*</span>
                                </Label>
                                <InputText
                                    type='number'
                                    step='0.01'
                                    id='HRESI_IncrementPercentage'
                                    placeholder='Enter percentage'
                                    {...register('HRESI_IncrementPercentage', { valueAsNumber: true })}
                                    error={errors.HRESI_IncrementPercentage?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            </div>
                        )}
                        {watch('HRESI_IncrementType') === 'Amount' && (
                            <div className='group flex flex-col gap-1.5'>
                                <Label htmlFor='HRESI_IncrementAmount'>
                                    Amount <span className='text-destructive'>:*</span>
                                </Label>
                                <Controller
                                    name='HRESI_IncrementAmount'
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            id='HRESI_IncrementAmount'
                                            value={field.value || 0}
                                            onChange={field.onChange}
                                            error={errors.HRESI_IncrementAmount?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    )}
                                />
                            </div>
                        )}
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
                        {/* Remarks */}
                        <div className='group col-span-full flex flex-col gap-1.5'>
                            <Label htmlFor='HRESI_Remarks'>Remarks</Label>
                            <InputText
                                id='HRESI_Remarks'
                                placeholder='Enter remarks (max 256 characters)'
                                {...register('HRESI_Remarks')}
                                error={errors.HRESI_Remarks?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>
                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end'>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending}
                        className='w-fit transition-all duration-200 hover:scale-105'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <Save className='mr-2 h-4 w-4' />
                        SAVE
                    </Button>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isPending}
                        className='w-fit transition-all duration-200 hover:scale-105'>
                        <X className='mr-2 h-4 w-4' />
                        CANCEL
                    </Button>
                </div>
            </form>
        </div>
    );
}
