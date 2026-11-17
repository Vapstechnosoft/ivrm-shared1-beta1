'use client';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { FormError } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useMasterLeaveDropdowns } from '@/hooks/hrms/leave-management/useMasters';
import {
    useLeaveTransactionDepartments,
    useLeaveTransactionDesignation,
    useLeaveTransactionEmployee
} from '@/hooks/hrms/leave-management/useTransactions';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { Save, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveCreditTransaction } from './columns';

interface LeaveCreditTransactionFormProps {
    editingRow: LeaveCreditTransaction | null;
    onSubmit: (data: LeaveCreditTransaction) => void;
    onCancel: () => void;
}

export function LeaveCreditTransactionForm({ editingRow, onSubmit, onCancel }: LeaveCreditTransactionFormProps) {
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
    const [selectedDesignations, setSelectedDesignations] = useState<number[]>([]);
    const [selectedEmpTypes, setSelectedEmpTypes] = useState<number[]>([]);

    const { data: leaveDropdowns } = useMasterLeaveDropdowns();
    const { data: departmentsData } = useLeaveTransactionDepartments({ MI_Id: HRMS_MI_ID });
    const { data: designationsData } = useLeaveTransactionDesignation({ MI_Id: HRMS_MI_ID });

    // Fetch employees based on filters
    const { data: employeesData } = useLeaveTransactionEmployee({
        MI_Id: HRMS_MI_ID,
        DepartmentIds: selectedDepartments,
        DesignationIds: selectedDesignations,
        EmpTypeIds: selectedEmpTypes
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<LeaveCreditTransaction>({
        defaultValues:
            editingRow ||
            ({
                employeeId: 0,
                leaveName: '',
                hrmL_LeaveType: '',
                hrmlY_Id: 0,
                fromDate: new Date(),
                toDate: new Date(),
                totalDays: 1,
                id: 0,
                transactionId: 0,
                isActive: true,
                employeeName: '',
                createdAt: new Date()
            } as any)
    });

    const fromDate = watch('fromDate');
    const toDate = watch('toDate');

    // Calculate total days from date range
    useEffect(() => {
        if (fromDate && toDate) {
            try {
                const start = new Date(fromDate);
                const end = new Date(toDate);
                if (end >= start) {
                    const days = differenceInDays(end, start) + 1;
                    setValue('totalDays', days, { shouldValidate: true });
                }
            } catch (_error) { }
        }
    }, [fromDate, toDate, setValue]);

    const onSubmitForm: SubmitHandler<LeaveCreditTransaction> = (data) => {
        // Ensure hrmL_LeaveType is set from leaveName if not already
        const submitData = {
            ...data,
            hrmL_LeaveType: data.leaveName || (data as any).hrmL_LeaveType || '',
            hrmlY_Id: (data as any).hrmlY_Id || 0
        };
        onSubmit(submitData as any);
    };

    const leaveYearOptions = useMemo(() => {
        const raw = (leaveDropdowns as any)?.data?.leaveYear || [];
        return raw.map((item: any) => ({
            label: item.hrmlY_LeaveYear || item.label || '',
            value: String(item.hrmlY_Id || item.value || '')
        }));
    }, [leaveDropdowns]);

    const leaveTypeOptions = useMemo(() => {
        const raw = (leaveDropdowns as any)?.data?.leaveTypes || [];
        return raw.map((item: any) => ({
            label: item.hrmL_LeaveName || item.label || '',
            value: item.hrmL_LeaveName || item.value || ''
        }));
    }, [leaveDropdowns]);

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
            {/* Filters Section */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {/* Department Filter */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Filter by Department:</Label>
                    <MultiSelect
                        options={departmentsData?.data?.departmentOptions || []}
                        onValueChange={(vals) => setSelectedDepartments(vals.map(Number))}
                        defaultValue={[]}
                        placeholder='Select Departments'
                        className='w-full'
                    />
                </div>
                {/* Designation Filter */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>Filter by Designation:</Label>
                    <MultiSelect
                        options={designationsData?.data?.designationOptions || []}
                        onValueChange={(vals) => setSelectedDesignations(vals.map(Number))}
                        defaultValue={[]}
                        placeholder='Select Designations'
                        className='w-full'
                    />
                </div>
            </div>

            {/* Leave Details Section */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                    <Label className='font-medium text-sm'>
                        Employee <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='employeeId'
                        control={control}
                        rules={{ required: 'Employee is required', min: { value: 1, message: 'Employee is required' } }}
                        render={({ field }) => (
                            <Select value={field.value ? String(field.value) : ''} onValueChange={(val) => field.onChange(Number(val))}>
                                <SelectTrigger className={errors.employeeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select employee' />
                                </SelectTrigger>
                                <SelectContent>
                                    {employeesData?.data?.employeeOptions?.map((option: any) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.employeeId && <FormError>{errors.employeeId.message}</FormError>}
                </div>

                <div>
                    <Label className='font-medium text-sm'>
                        Leave Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='leaveName'
                        control={control}
                        rules={{ required: 'Leave Name is required' }}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={errors.leaveName ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Leave' />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveTypeOptions.map((option: any) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.leaveName && <FormError>{errors.leaveName.message}</FormError>}
                </div>

                <div>
                    <Label className='font-medium text-sm'>
                        From Date <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='fromDate'
                        control={control}
                        rules={{ required: 'From Date is required' }}
                        render={({ field }) => (
                            <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                setDate={field.onChange}
                                placeholder='Select date'
                                className={cn('w-full', errors.fromDate && 'border-red-500')}
                            />
                        )}
                    />
                    {errors.fromDate && <FormError>{errors.fromDate.message}</FormError>}
                </div>

                <div>
                    <Label className='font-medium text-sm'>
                        To Date <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='toDate'
                        control={control}
                        rules={{ required: 'To Date is required' }}
                        render={({ field }) => (
                            <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                setDate={field.onChange}
                                placeholder='Select date'
                                // fromDate={fromDate}
                                className={cn('w-full', errors.toDate && 'border-red-500')}
                            />
                        )}
                    />
                    {errors.toDate && <FormError>{errors.toDate.message}</FormError>}
                </div>

                <div>
                    <Label className='font-medium text-sm'>
                        Total Days <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='totalDays'
                        control={control}
                        rules={{ required: 'Total Days is required', min: { value: 0.5, message: 'Min 0.5 days' } }}
                        render={({ field }) => (
                            <Input
                                type='number'
                                step='0.5'
                                value={field.value || 0}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className={errors.totalDays ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.totalDays && <FormError>{errors.totalDays.message}</FormError>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-center gap-2 pt-4'>
                <Button type='submit' variant='default' className='min-w-[120px]'>
                    <Save className='mr-2 h-4 w-4' />
                    SAVE
                </Button>
                <Button type='button' variant='destructive' onClick={onCancel} className='min-w-[120px] bg-red-600 hover:bg-red-700'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}
