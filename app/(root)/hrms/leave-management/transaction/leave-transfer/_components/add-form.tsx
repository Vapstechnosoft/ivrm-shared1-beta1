'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaveCredit, useSaveLeaveCredit } from '@/hooks/hrms/leave-management/useTransactions';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveCredit } from './columns';
interface AddLeaveCreditFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
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
const employeeOptions = [
    { label: 'Steffi Halian', value: 'Steffi Halian' },
    { label: 'Shruthi NA', value: 'Shruthi NA' },
    { label: 'Bindhushree N', value: 'Bindhushree N' },
    { label: 'Chaithra NS', value: 'Chaithra NS' },
    { label: 'Balu Prabhakar', value: 'Balu Prabhakar' },
    { label: 'Rizwan Ahmed Kusugal', value: 'Rizwan Ahmed Kusugal' }
];
type LeaveTransferFormData = LeaveCredit & {
    employeeNames?: string[];
    leaveCount?: number;
    reason?: string;
};
export default function AddLeaveCreditForm({ onSuccess, onCancel, className = '' }: AddLeaveCreditFormProps) {
    const { refetchAll } = useLeaveCredit();
    const { mutate: saveCredit, isPending } = useSaveLeaveCredit();
    const [activeTab, setActiveTab] = useState('Leave Credit');
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue: _setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<LeaveTransferFormData>({
        mode: 'onChange',
        defaultValues: {
            leaveYear: '',
            leaveName: '',
            employeeName: '',
            leaveCredit: 0,
            leaveBalance: 0,
            leaveCount: 0,
            reason: '',
            type: [],
            department: [],
            designation: [],
            employeeNames: []
        }
    });
    const onSubmit: SubmitHandler<LeaveTransferFormData> = async (data) => {
        // Convert employeeNames array to employeeName string (comma-separated or first selected)
        const submitData = {
            ...data,
            employeeName:
                Array.isArray(data.employeeNames) && data.employeeNames.length > 0 ? data.employeeNames.join(', ') : data.employeeName || ''
        };
        // Remove employeeNames from submit data as it's not part of LeaveCredit interface
        (submitData as any).employeeNames = undefined;
        saveCredit(submitData as LeaveCredit, {
            onSuccess: () => {
                reset();
                refetchAll();
                onSuccess?.();
            }
        });
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
                        {/* Step 1: Type, Department, Designation - First line */}
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
                        {/* Step 2: Leave Year and Leave Name - Second line */}
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
                        </div>
                        {/* Step 3: Employee Name and Leave Count - Dynamically rendered when all three criteria are selected */}
                        {watch('type')?.length > 0 && watch('department')?.length > 0 && watch('designation')?.length > 0 && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label htmlFor='employee-name-multiselect' className='mb-2 block font-medium text-sm'>
                                        Employee Name
                                    </label>
                                    <Controller
                                        name='employeeNames'
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                id='employee-name-multiselect'
                                                options={employeeOptions}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || []}
                                                placeholder='Select Employee Name'
                                            />
                                        )}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <InputText
                                        label='Leave Count'
                                        id='leave-count-input'
                                        type='number'
                                        step='0.5'
                                        {...register('leaveCount', { valueAsNumber: true })}
                                        error={errors.leaveCount?.message}
                                        placeholder='Enter leave count'
                                    />
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-2'>
                            {onCancel && (
                                <Button type='button' variant='outline' onClick={onCancel} disabled={isPending || isSubmitting}>
                                    <X className='mr-2 h-4 w-4' />
                                    CANCEL
                                </Button>
                            )}
                            <Button type='button' variant='outline' onClick={handleReset} disabled={isPending || isSubmitting}>
                                Reset
                            </Button>
                            <Button type='submit' disabled={isPending || isSubmitting} variant='default'>
                                <Save className='mr-2 h-4 w-4' />
                                {isPending || isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value='Leave Addition' className='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Step 1: Type, Department, Designation - First line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                                <label htmlFor='type-multiselect-addition' className='mb-2 block font-medium text-sm'>
                                    Type
                                </label>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='type-multiselect-addition'
                                            options={typeOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Type'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='department-multiselect-addition' className='mb-2 block font-medium text-sm'>
                                    Department
                                </label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='department-multiselect-addition'
                                            options={departmentOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Department'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='designation-multiselect-addition' className='mb-2 block font-medium text-sm'>
                                    Designation
                                </label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='designation-multiselect-addition'
                                            options={designationOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Designation'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Step 2: Leave Year and Leave Name - Second line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Controller
                                name='leaveYear'
                                control={control}
                                rules={{ required: 'Leave Year is required' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor='leave-year-select-addition' className='font-medium text-sm'>
                                            Leave Year <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-year-select-addition'
                                                className={errors.leaveYear ? 'border-red-500' : ''}>
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
                                        <label htmlFor='leave-name-select-addition' className='font-medium text-sm'>
                                            Leave Name <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-name-select-addition'
                                                className={errors.leaveName ? 'border-red-500' : ''}>
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
                        </div>
                        {/* Step 3: Employee Name, Leave Count, and Reason - Dynamically rendered when all three criteria are selected */}
                        {watch('type')?.length > 0 && watch('department')?.length > 0 && watch('designation')?.length > 0 && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label htmlFor='employee-name-multiselect-addition' className='mb-2 block font-medium text-sm'>
                                        Employee Name
                                    </label>
                                    <Controller
                                        name='employeeNames'
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                id='employee-name-multiselect-addition'
                                                options={employeeOptions}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || []}
                                                placeholder='Select Employee Name'
                                            />
                                        )}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <InputText
                                        label='Leave Count'
                                        id='leave-count-input-addition'
                                        type='number'
                                        step='0.5'
                                        {...register('leaveCount', { valueAsNumber: true })}
                                        error={errors.leaveCount?.message}
                                        placeholder='Enter leave count'
                                    />
                                </div>
                                <div className='md:col-span-2'>
                                    <InputText
                                        label='Reason'
                                        id='reason-input-addition'
                                        {...register('reason')}
                                        error={errors.reason?.message}
                                        placeholder='Enter reason'
                                    />
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-2'>
                            {onCancel && (
                                <Button type='button' variant='outline' onClick={onCancel} disabled={isPending || isSubmitting}>
                                    <X className='mr-2 h-4 w-4' />
                                    CANCEL
                                </Button>
                            )}
                            <Button type='button' variant='outline' onClick={handleReset} disabled={isPending || isSubmitting}>
                                Reset
                            </Button>
                            <Button type='submit' disabled={isPending || isSubmitting} variant='default'>
                                <Save className='mr-2 h-4 w-4' />
                                {isPending || isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value='Leave Deduction' className='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Step 1: Type, Department, Designation - First line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                                <label htmlFor='type-multiselect-deduction' className='mb-2 block font-medium text-sm'>
                                    Type
                                </label>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='type-multiselect-deduction'
                                            options={typeOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Type'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='department-multiselect-deduction' className='mb-2 block font-medium text-sm'>
                                    Department
                                </label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='department-multiselect-deduction'
                                            options={departmentOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Department'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='designation-multiselect-deduction' className='mb-2 block font-medium text-sm'>
                                    Designation
                                </label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='designation-multiselect-deduction'
                                            options={designationOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Designation'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Step 2: Leave Year and Leave Name - Second line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Controller
                                name='leaveYear'
                                control={control}
                                rules={{ required: 'Leave Year is required' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor='leave-year-select-deduction' className='font-medium text-sm'>
                                            Leave Year <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-year-select-deduction'
                                                className={errors.leaveYear ? 'border-red-500' : ''}>
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
                                        <label htmlFor='leave-name-select-deduction' className='font-medium text-sm'>
                                            Leave Name <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-name-select-deduction'
                                                className={errors.leaveName ? 'border-red-500' : ''}>
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
                        </div>
                        {/* Step 3: Employee Name, Leave Count, and Reason - Dynamically rendered when all three criteria are selected */}
                        {watch('type')?.length > 0 && watch('department')?.length > 0 && watch('designation')?.length > 0 && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label htmlFor='employee-name-multiselect-deduction' className='mb-2 block font-medium text-sm'>
                                        Employee Name
                                    </label>
                                    <Controller
                                        name='employeeNames'
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                id='employee-name-multiselect-deduction'
                                                options={employeeOptions}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || []}
                                                placeholder='Select Employee Name'
                                            />
                                        )}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <InputText
                                        label='Leave Count'
                                        id='leave-count-input-deduction'
                                        type='number'
                                        step='0.5'
                                        {...register('leaveCount', { valueAsNumber: true })}
                                        error={errors.leaveCount?.message}
                                        placeholder='Enter leave count'
                                    />
                                </div>
                                <div className='md:col-span-2'>
                                    <InputText
                                        label='Reason'
                                        id='reason-input-deduction'
                                        {...register('reason')}
                                        error={errors.reason?.message}
                                        placeholder='Enter reason'
                                    />
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-2'>
                            {onCancel && (
                                <Button type='button' variant='outline' onClick={onCancel} disabled={isPending || isSubmitting}>
                                    <X className='mr-2 h-4 w-4' />
                                    CANCEL
                                </Button>
                            )}
                            <Button type='button' variant='outline' onClick={handleReset} disabled={isPending || isSubmitting}>
                                Reset
                            </Button>
                            <Button type='submit' disabled={isPending || isSubmitting} variant='default'>
                                <Save className='mr-2 h-4 w-4' />
                                {isPending || isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value='Leave CarryForward' className='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Step 1: Type, Department, Designation - First line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                                <label htmlFor='type-multiselect-carryforward' className='mb-2 block font-medium text-sm'>
                                    Type
                                </label>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='type-multiselect-carryforward'
                                            options={typeOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Type'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='department-multiselect-carryforward' className='mb-2 block font-medium text-sm'>
                                    Department
                                </label>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='department-multiselect-carryforward'
                                            options={departmentOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Department'
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor='designation-multiselect-carryforward' className='mb-2 block font-medium text-sm'>
                                    Designation
                                </label>
                                <Controller
                                    name='designation'
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            id='designation-multiselect-carryforward'
                                            options={designationOptions}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || []}
                                            placeholder='Select Designation'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Step 2: Leave Year and Leave Name - Second line */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <Controller
                                name='leaveYear'
                                control={control}
                                rules={{ required: 'Leave Year is required' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor='leave-year-select-carryforward' className='font-medium text-sm'>
                                            Leave Year <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-year-select-carryforward'
                                                className={errors.leaveYear ? 'border-red-500' : ''}>
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
                                        <label htmlFor='leave-name-select-carryforward' className='font-medium text-sm'>
                                            Leave Name <span className='text-red-500'>*</span>
                                        </label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id='leave-name-select-carryforward'
                                                className={errors.leaveName ? 'border-red-500' : ''}>
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
                        </div>
                        {/* Step 3: Employee Name - Dynamically rendered when all three criteria are selected */}
                        {watch('type')?.length > 0 && watch('department')?.length > 0 && watch('designation')?.length > 0 && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label htmlFor='employee-name-multiselect-carryforward' className='mb-2 block font-medium text-sm'>
                                        Employee Name
                                    </label>
                                    <Controller
                                        name='employeeNames'
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                id='employee-name-multiselect-carryforward'
                                                options={employeeOptions}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || []}
                                                placeholder='Select Employee Name'
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        <div className='flex justify-end gap-2'>
                            {onCancel && (
                                <Button type='button' variant='outline' onClick={onCancel} disabled={isPending || isSubmitting}>
                                    <X className='mr-2 h-4 w-4' />
                                    CANCEL
                                </Button>
                            )}
                            <Button type='button' variant='outline' onClick={handleReset} disabled={isPending || isSubmitting}>
                                Reset
                            </Button>
                            <Button type='submit' disabled={isPending || isSubmitting} variant='default'>
                                <Save className='mr-2 h-4 w-4' />
                                {isPending || isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
