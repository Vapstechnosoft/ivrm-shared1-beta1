'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveCredit } from './columns';
interface LeaveCreditFormProps {
    editingCredit: LeaveCredit | null;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onSubmit: (data: LeaveCredit) => void;
    onCancel: () => void;
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
export function LeaveCreditForm({ editingCredit, activeTab, onTabChange, onSubmit, onCancel }: LeaveCreditFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm<LeaveCredit>({
        defaultValues: editingCredit || {
            leaveYear: '',
            leaveName: '',
            employeeName: '',
            leaveCredit: 0,
            leaveBalance: 0,
            type: [],
            department: [],
            designation: []
        }
    });
    const handleFormSubmit: SubmitHandler<LeaveCredit> = (data) => {
        onSubmit(data);
    };
    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className='w-full'>
            <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='Leave Credit'>Leave Credit</TabsTrigger>
                <TabsTrigger value='Leave Addition'>Leave Addition</TabsTrigger>
                <TabsTrigger value='Leave Deduction'>Leave Deduction</TabsTrigger>
                <TabsTrigger value='Leave CarryForward'>Leave CarryForward</TabsTrigger>
            </TabsList>
            <TabsContent value='Leave Credit' className='space-y-4'>
                <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
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
                        <div>
                            <label htmlFor='leave-year-select' className='font-medium text-sm'>
                                Leave Year *
                            </label>
                            <Select value={watch('leaveYear')} onValueChange={(value) => setValue('leaveYear', value)}>
                                <SelectTrigger id='leave-year-select' className={errors.leaveYear ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Leave Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='2019'>2019</SelectItem>
                                    <SelectItem value='2020'>2020</SelectItem>
                                    <SelectItem value='2021'>2021</SelectItem>
                                    <SelectItem value='2022'>2022</SelectItem>
                                    <SelectItem value='2023'>2023</SelectItem>
                                    <SelectItem value='2024'>2024</SelectItem>
                                    <SelectItem value='2025'>2025</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.leaveYear && <FormError>{errors.leaveYear.message}</FormError>}
                        </div>
                        <div>
                            <label htmlFor='leave-name-select' className='font-medium text-sm'>
                                Leave Name *
                            </label>
                            <Controller
                                name='leaveName'
                                control={control}
                                rules={{ required: 'Leave Name is required' }}
                                render={({ field }) => (
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
                                )}
                            />
                            {errors.leaveName && <FormError>{errors.leaveName.message}</FormError>}
                        </div>
                        <div>
                            <label htmlFor='employee-name-input' className='font-medium text-sm'>
                                Employee Name
                            </label>
                            <InputText id='employee-name-input' {...register('employeeName')} placeholder='Enter employee name' />
                        </div>
                        <div>
                            <label htmlFor='leave-credit-input' className='font-medium text-sm'>
                                Leave Transfer
                            </label>
                            <InputText
                                id='leave-credit-input'
                                {...register('leaveCredit', { valueAsNumber: true })}
                                placeholder='Enter leave credit'
                                type='number'
                                step='0.5'
                            />
                        </div>
                        <div>
                            <label htmlFor='leave-balance-input' className='font-medium text-sm'>
                                Leave Balance
                            </label>
                            <InputText
                                id='leave-balance-input'
                                {...register('leaveBalance', { valueAsNumber: true })}
                                placeholder='Enter leave balance'
                                type='number'
                                step='0.5'
                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Button type='submit' variant='default'>
                            {editingCredit ? 'Update' : 'Save'}
                        </Button>
                        <Button type='button' variant='destructive' onClick={onCancel}>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
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
    );
}
