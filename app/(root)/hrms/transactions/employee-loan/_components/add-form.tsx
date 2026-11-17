'use client';
import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useSaveEmployeeLoan } from '@/hooks/hrms/useTransactions';
import { cn } from '@/lib/utils';
import { hrmsTransactionSchemas } from '@/schemas/hrms/transaction';
import type { EmployeeLoanMastersResponse } from '@/types/hrms/employee-loan';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type EmployeeLoanForm = z.infer<typeof hrmsTransactionSchemas.employeeLoan.form>;
interface AddFormProps {
    onloadData: EmployeeLoanMastersResponse | undefined;
    onSuccess: () => void;
    className?: string;
}
export default function AddEmployeeLoanForm({ onloadData, onSuccess, className = '' }: AddFormProps) {
    const { mutate: saveLoan, isPending } = useSaveEmployeeLoan();
    // Memoize arrays to prevent unnecessary re-renders
    const employees = useMemo(() => onloadData?.employeedropdown || [], [onloadData?.employeedropdown]);
    const loanTypes = useMemo(() => onloadData?.masterloandropdown || [], [onloadData?.masterloandropdown]);
    const paymentModes = useMemo(() => onloadData?.modeOfPaymentdropdown || [], [onloadData?.modeOfPaymentdropdown]);
    // Debug logging for loan types
    if (loanTypes && loanTypes.length > 0) {
    }
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<EmployeeLoanForm>({
        resolver: zodResolver(hrmsTransactionSchemas.employeeLoan.form),
        mode: 'onChange',
        defaultValues: {
            employeeId: 0,
            loanTypeId: 0,
            amount: 0,
            installments: 0,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            modeOfPayment: '',
            referenceNo: '',
            loanInterest: 0,
            loanEMI: 0
        }
    });
    // Watch employeeId to enable/disable loan fields
    const watchedEmployeeId = useWatch({
        control,
        name: 'employeeId',
        defaultValue: 0
    });
    const isEmployeeSelected = watchedEmployeeId && watchedEmployeeId > 0;
    const onSubmit: SubmitHandler<EmployeeLoanForm> = async (data: EmployeeLoanForm) => {
        const loanData = {
            HREL_Id: 0,
            MI_Id: HRMS_MI_ID,
            HRME_Id: data.employeeId,
            HREL_AppliedDate: data.startDate,
            HREL_EmpLoanId: '',
            HRMLN_Id: data.loanTypeId,
            HREL_LoanAmount: data.amount,
            HREL_LoanInsallments: data.installments,
            HREL_LaonEMI: data.loanEMI || 0,
            HREL_LoanInterest: data.loanInterest || 0,
            HREL_ModeOfPayment: data.modeOfPayment || '',
            HREL_ReferenceNo: data.referenceNo || ''
        };
        saveLoan(loanData, {
            onSuccess: () => {
                toast.success('Employee loan created successfully!');
                reset();
                onSuccess();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create employee loan');
            }
        });
    };
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <Controller
                        name='employeeId'
                        control={control}
                        render={({ field }) => (
                            <div className='space-y-2'>
                                <Label>Employee *</Label>
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                    <SelectTrigger
                                        className={cn(
                                            'transition-colors focus:ring-2 focus:ring-primary/20',
                                            errors.employeeId && 'border-destructive'
                                        )}>
                                        <SelectValue placeholder='Select or search Employee in the list' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.length > 0 ? (
                                            employees
                                                .filter((emp) => emp?.HRME_Id != null)
                                                .map((employee) => (
                                                    <SelectItem key={employee.HRME_Id} value={employee.HRME_Id.toString()}>
                                                        {employee.HRME_EmployeeFirstName}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <div className='p-2 text-muted-foreground text-sm'>No employees available</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.employeeId && <FormError>{errors.employeeId.message}</FormError>}
                            </div>
                        )}
                    />
                    <div className='space-y-2'>
                        <Label>Applied Date *</Label>
                        <Controller
                            name='startDate'
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
                                            {field.value ? format(new Date(field.value), 'PPP') : 'Select Date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <CalendarYear
                                            mode='single'
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onDayClick={(day) => field.onChange(format(day, 'yyyy-MM-dd'))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.startDate && <FormError>{errors.startDate.message}</FormError>}
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label>Loan Type *</Label>
                        <Select
                            key={`loan-type-${loanTypes.length}`}
                            onValueChange={(value) => {
                                setValue('loanTypeId', Number(value));
                            }}
                            value={watch('loanTypeId')?.toString() || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Loan Type' />
                            </SelectTrigger>
                            <SelectContent>
                                {loanTypes && loanTypes.length > 0 ? (
                                    loanTypes
                                        .filter((type) => type && type.HRMLN_Id !== undefined && type.HRMLN_Id !== null)
                                        .map((loanType) => (
                                            <SelectItem key={`loan-${loanType.HRMLN_Id}`} value={loanType.HRMLN_Id.toString()}>
                                                {`${loanType.HRML_LoanType} (Max: ₹${loanType.HRML_Max?.toLocaleString() || 0})`}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <div className='p-2 text-muted-foreground text-sm'>
                                        {onloadData === undefined ? 'Loading loan types...' : 'No loan types available'}
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.loanTypeId && <FormError>{errors.loanTypeId.message}</FormError>}
                    </div>
                    <Controller
                        name='modeOfPayment'
                        control={control}
                        render={({ field }) => (
                            <div className='space-y-2'>
                                <Label>Mode Of Payment *</Label>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentModes
                                            .filter((mode) => mode?.IVRMMOD_Id != null && mode?.IVRMMOD_ModeOfPayment)
                                            .map((mode) => (
                                                <SelectItem key={mode.IVRMMOD_Id} value={mode.IVRMMOD_ModeOfPayment}>
                                                    {mode.IVRMMOD_ModeOfPayment}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.modeOfPayment && <FormError>{errors.modeOfPayment.message}</FormError>}
                            </div>
                        )}
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <Controller
                        name='referenceNo'
                        control={control}
                        render={({ field }) => (
                            <div className='space-y-2'>
                                <Label>Reference No.</Label>
                                <InputText
                                    id='referenceNo'
                                    placeholder='Enter reference number (max 20 characters, numbers only)'
                                    {...field}
                                    error={errors.referenceNo?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            </div>
                        )}
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <InputText
                        label='Loan Amount *'
                        type='number'
                        id='amount'
                        step='0.01'
                        placeholder='Enter loan amount (max 10 digits including decimals)'
                        {...register('amount', { valueAsNumber: true })}
                        error={errors.amount?.message}
                        disabled={!isEmployeeSelected}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                    <InputText
                        label='Loan Interest *'
                        type='number'
                        id='loanInterest'
                        step='0.01'
                        placeholder='Enter loan interest (max 5 digits including decimals)'
                        {...register('loanInterest', { valueAsNumber: true })}
                        error={errors.loanInterest?.message}
                        disabled={!isEmployeeSelected}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <InputText
                        label='Loan Installments (IN MONTHS) *'
                        type='number'
                        id='installments'
                        placeholder='Enter loan installments (max 4 digits)'
                        {...register('installments', { valueAsNumber: true })}
                        error={errors.installments?.message}
                        disabled={!isEmployeeSelected}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                    <InputText
                        label='Loan EMI *'
                        type='number'
                        id='loanEMI'
                        step='0.01'
                        placeholder='Enter loan EMI (max 10 digits including decimals)'
                        {...register('loanEMI', { valueAsNumber: true })}
                        error={errors.loanEMI?.message}
                        disabled={!isEmployeeSelected}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
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
                            Add Employee Loan
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
