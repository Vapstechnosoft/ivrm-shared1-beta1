'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaveCredit, useUpdateLeaveCredit } from '@/hooks/hrms/leave-management/useTransactions';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveCredit } from './columns';
interface UpdateLeaveCreditFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: LeaveCredit;
}
const typeOptions = [
    { label: 'VKS', value: 'VKS' },
    { label: 'Permanent', value: 'Permanent' },
    { label: 'ELearning', value: 'ELearning' },
    { label: 'Robotic', value: 'Robotic' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Management Admin', value: 'Management Admin' }
];
const departmentOptions = [
    { label: 'Hardware and Network', value: 'Hardware and Network' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Human Resource', value: 'Human Resource' },
    { label: 'Admin', value: 'Admin' },
    { label: 'LEGAL', value: 'LEGAL' },
    { label: 'IT Team', value: 'IT Team' }
];
const designationOptions = [
    { label: 'Computer Faculty', value: 'Computer Faculty' },
    { label: 'E-learning coordinator', value: 'E-learning coordinator' },
    { label: 'Accounts and Finance Executive', value: 'Accounts and Finance Executive' },
    { label: 'Client acquisition manager', value: 'Client acquisition manager' },
    { label: 'Sr HR Executive', value: 'Sr HR Executive' },
    { label: 'Manager HR', value: 'Manager HR' }
];
export default function UpdateLeaveCreditForm({ onSuccess, className = '', selectedRow: row }: UpdateLeaveCreditFormProps) {
    const { refetchAll } = useLeaveCredit();
    const { mutate: updateCredit, isPending } = useUpdateLeaveCredit();
    const [activeTab, setActiveTab] = useState('Leave Credit');
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<LeaveCredit>({
        mode: 'onChange'
    });
    useEffect(() => {
        if (row) {
            reset({
                leaveYear: row.leaveYear || '',
                leaveName: row.leaveName || '',
                employeeName: row.employeeName || '',
                leaveCredit: row.leaveCredit || 0,
                leaveBalance: row.leaveBalance || 0,
                type: row.type || [],
                department: row.department || [],
                designation: row.designation || []
            });
        }
    }, [row, reset]);
    const onSubmit: SubmitHandler<LeaveCredit> = async (data) => {
        updateCredit(
            {
                ...data,
                id: row.id
            },
            {
                onSuccess: () => {
                    reset();
                    refetchAll();
                    onSuccess?.();
                }
            }
        );
    };
    const handleReset = () => {
        reset();
    };
    return (
        <div className={`${className}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='Leave Credit'>Leave Credit</TabsTrigger>
                    <TabsTrigger value='Leave Addition'>Leave Addition</TabsTrigger>
                    <TabsTrigger value='Leave Deduction'>Leave Deduction</TabsTrigger>
                    <TabsTrigger value='Leave CarryForward'>Leave CarryForward</TabsTrigger>
                </TabsList>
                <TabsContent value='Leave Credit' className='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                                <label htmlFor='type-multiselect' className='mb-2 block font-medium text-sm'>
                                    Type
                                </label>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='type-multiselect'
                                            options={typeOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Type'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='department-multiselect' className='mb-2 block font-medium text-sm'>
                                    Department
                                </label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='department-multiselect'
                                            options={departmentOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Department'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='designation-multiselect' className='mb-2 block font-medium text-sm'>
                                    Designation
                                </label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='designation-multiselect'
                                            options={designationOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Designation'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Controller
                                name='leaveYear'
                                control={control}
                                rules={{ required: 'Leave Year is required' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor='leave-year-select' className='font-medium text-sm'>
                                            Leave Year <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id='leave-year-select' className={errors.leaveYear ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='Select Leave Year' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['2019', '2020', '2021', '2022', '2023', '2024', '2025'].map((y) => (
                                                    <SelectItem key={y} value={y}>
                                                        {y}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.leaveYear && <FormError>{errors.leaveYear.message}</FormError>}
                                    </div>
                                )}
                            />
                            <Controller
                                name='leaveName'
                                control={control}
                                rules={{ required: 'Leave Name is required' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor='leave-name-select' className='font-medium text-sm'>
                                            Leave Name <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id='leave-name-select' className={errors.leaveName ? 'border-red-500' : ''}>
                                                <SelectValue placeholder='Select Leave Name' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Casual Leave'>Casual Leave</SelectItem>
                                                <SelectItem value='Sick Leave'>Sick Leave</SelectItem>
                                                <SelectItem value='Optional Leave'>Optional Leave</SelectItem>
                                                <SelectItem value='Emergency Leave'>Emergency Leave</SelectItem>
                                                <SelectItem value='Privilege Leave'>Privilege Leave</SelectItem>
                                                <SelectItem value='Comp Off'>Comp Off</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.leaveName && <FormError>{errors.leaveName.message}</FormError>}
                                    </div>
                                )}
                            />
                            <InputText
                                label='Employee Name'
                                id='employee-name-input'
                                {...register('employeeName')}
                                error={errors.employeeName?.message}
                                placeholder='Enter employee name'
                            />
                            <InputText
                                label='Leave Transfer'
                                id='leave-credit-input'
                                type='number'
                                step='0.5'
                                {...register('leaveCredit', { valueAsNumber: true })}
                                error={errors.leaveCredit?.message}
                                placeholder='Enter leave credit'
                            />
                            <InputText
                                label='Leave Balance'
                                id='leave-balance-input'
                                type='number'
                                step='0.5'
                                {...register('leaveBalance', { valueAsNumber: true })}
                                error={errors.leaveBalance?.message}
                                placeholder='Enter leave balance'
                            />
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' onClick={handleReset} disabled={isPending || isSubmitting}>
                                Reset
                            </Button>
                            <Button type='submit' disabled={isPending || isSubmitting} variant='default'>
                                <Save className='mr-2 h-4 w-4' />
                                {isPending || isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value='Leave Addition' className='space-y-4'>
                    <div className='py-8 text-center text-gray-500'>Leave Addition functionality will be implemented here</div>
                </TabsContent>
                <TabsContent value='Leave Deduction' className='space-y-4'>
                    <div className='py-8 text-center text-gray-500'>Leave Deduction functionality will be implemented here</div>
                </TabsContent>
                <TabsContent value='Leave CarryForward' className='space-y-4'>
                    <div className='py-8 text-center text-gray-500'>Leave CarryForward functionality will be implemented here</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
