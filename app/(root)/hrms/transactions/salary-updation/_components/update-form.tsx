'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveSalaryUpdation } from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import { hrmsTransactionSchemas } from '@/schemas/hrms/transaction';
import type { SalaryUpdationItem, SalaryUpdationOnloadResponse } from '@/types/hrms/salary-updation';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof hrmsTransactionSchemas.salaryUpdation.addOrUpdate>;
interface UpdateFormProps {
    selectedRow: SalaryUpdationItem | null;
    onloadData: SalaryUpdationOnloadResponse | undefined;
    onSuccess: () => void;
    className?: string;
}
export default function UpdateSalaryUpdationForm({ selectedRow, onloadData, onSuccess, className = '' }: UpdateFormProps) {
    const { mutate: saveUpdation, isPending } = useSaveSalaryUpdation();
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsTransactionSchemas.salaryUpdation.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            HRESU_Id: 0,
            MI_Id: 30,
            HRME_Id: 0,
            HRESU_OldSalary: 0,
            HRESU_NewSalary: 0,
            HRESU_EffectiveDate: new Date(),
            HRESU_Remarks: '',
            HRESU_ActiveFlg: true,
            LogInUserId: 2
        }
    });
    useEffect(() => {
        if (selectedRow) {
            reset({
                HRESU_Id: selectedRow.HRESU_Id,
                MI_Id: selectedRow.MI_Id,
                HRME_Id: selectedRow.HRME_Id,
                HRESU_OldSalary: selectedRow.HRESU_OldSalary,
                HRESU_NewSalary: selectedRow.HRESU_NewSalary,
                HRESU_EffectiveDate: new Date(selectedRow.HRESU_EffectiveDate),
                HRESU_Remarks: selectedRow.HRESU_Remarks || '',
                HRESU_ActiveFlg: true,
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
            HRESU_Id: data.HRESU_Id || 0,
            MI_Id: data.MI_Id,
            HRME_Id: data.HRME_Id,
            HRESU_OldSalary: data.HRESU_OldSalary,
            HRESU_NewSalary: data.HRESU_NewSalary,
            HRESU_EffectiveDate: data.HRESU_EffectiveDate.toISOString(),
            HRESU_Remarks: data.HRESU_Remarks,
            HRESU_ActiveFlag: data.HRESU_ActiveFlg,
            roleId: data.LogInUserId || 2
        };
        saveUpdation(payload as any, {
            onSuccess: (response) => {
                toast.success((response as any)?.retrunMsg || 'Salary updation updated successfully');
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'An error occurred');
            }
        });
    };
    // Memoize arrays to prevent unnecessary re-renders
    const employees = useMemo(() => onloadData?.employeedropdown || [], [onloadData?.employeedropdown]);
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                                            {employees.map((emp: any) => (
                                                <SelectItem key={emp.HRME_Id} value={String(emp.HRME_Id)}>
                                                    {emp.HRME_EmployeeCode} - {emp.HRME_EmployeeFirstName} {emp.HRME_EmployeeLastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRME_Id && <FormError>{errors.HRME_Id.message}</FormError>}
                        </div>
                        {/* Old Salary */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESU_OldSalary'>
                                Old Salary <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRESU_OldSalary'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        id='HRESU_OldSalary'
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.HRESU_OldSalary?.message}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                )}
                            />
                        </div>
                        {/* New Salary */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESU_NewSalary'>
                                New Salary <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRESU_NewSalary'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        id='HRESU_NewSalary'
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.HRESU_NewSalary?.message}
                                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                                    />
                                )}
                            />
                        </div>
                        {/* Effective Date */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRESU_EffectiveDate'>
                                Effective Date <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='HRESU_EffectiveDate'
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
                            {errors.HRESU_EffectiveDate && <FormError>{errors.HRESU_EffectiveDate.message}</FormError>}
                        </div>
                        {/* Remarks */}
                        <div className='col-span-full'>
                            <InputText
                                label='Remarks'
                                id='HRESU_Remarks'
                                placeholder='Enter remarks (optional)'
                                {...register('HRESU_Remarks')}
                                error={errors.HRESU_Remarks?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>
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
                            Update Salary Updation
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
