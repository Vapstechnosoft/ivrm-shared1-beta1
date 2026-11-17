'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useSaveLeaveTransactionManual } from '@/hooks/hrms/leave-management/useLeaveTransactionManual';
import { useMasterLeaveDropdowns } from '@/hooks/hrms/leave-management/useMasters';
import { useInstitutionsByLoginBased } from '@/hooks/hrms/leave-management/useMasters';
import { DatePicker } from '@/components/ui/date-picker';
import { useEffect, useState } from 'react';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { toast } from 'sonner';

const leaveTransactionSchema = z.object({
    hrmE_Id: z.number().min(1, 'Employee is required'),
    hrmL_LeaveType: z.string().min(1, 'Leave type is required'),
    hrelT_FromDate: z.date({ required_error: 'From date is required' }),
    hrelT_ToDate: z.date({ required_error: 'To date is required' }),
    hrelT_TotDays: z.number().min(0.5, 'Total days must be at least 0.5'),
    hrmlY_Id: z.number().optional()
});

type FormValues = z.infer<typeof leaveTransactionSchema>;

interface AddLeaveTransactionManualFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddLeaveTransactionManualForm({
    onSuccess,
    onCancel
}: AddLeaveTransactionManualFormProps) {
    const { mutate: saveTransaction, isPending } = useSaveLeaveTransactionManual();
    const { data: leaveDropdowns } = useMasterLeaveDropdowns();

    // For now, using a placeholder for employee list since we don't have a specific hook yet
    // In a real scenario, this would come from a search component or another dropdown
    const employees = [
        { value: 1208, label: 'ANUSHA T' },
        { value: 1210, label: 'EMPLOYEE 1210' }
    ];

    const form = useForm<FormValues>({
        resolver: zodResolver(leaveTransactionSchema),
        defaultValues: {
            hrmE_Id: 0,
            hrmL_LeaveType: '',
            hrelT_FromDate: new Date(),
            hrelT_ToDate: new Date(),
            hrelT_TotDays: 1,
            hrmlY_Id: 88 // Default or from dropdown
        }
    });

    const onSubmit = (values: FormValues) => {
        saveTransaction({
            hrelT_Id: 0,
            hreltD_Id: 0,
            hrmE_Id: values.hrmE_Id,
            hrmL_LeaveType: values.hrmL_LeaveType,
            hrmlY_Id: values.hrmlY_Id || 88,
            hrelT_FromDate: values.hrelT_FromDate.toISOString(),
            hrelT_ToDate: values.hrelT_ToDate.toISOString(),
            hrelT_TotDays: values.hrelT_TotDays
        } as any, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {/* Employee selection */}
                    <FormField
                        control={form.control}
                        name='hrmE_Id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee</FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? String(field.value) : ''}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Employee' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.value} value={String(emp.value)}>
                                                {emp.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Leave Type */}
                    <FormField
                        control={form.control}
                        name='hrmL_LeaveType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Leave Type' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(leaveDropdowns as any)?.data?.leaveTypes?.map((type: any) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* From Date */}
                    <FormField
                        control={form.control}
                        name='hrelT_FromDate'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>From Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder='Pick a date'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* To Date */}
                    <FormField
                        control={form.control}
                        name='hrelT_ToDate'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>To Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder='Pick a date'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Total Days */}
                    <FormField
                        control={form.control}
                        name='hrelT_TotDays'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Days</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        step='0.5'
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Transaction'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
