'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveAuthorization } from './columns';
const institutions = [
    'Vaps Knowledge Services Pvt Ltd',
    'VAPS Institute',
    'VAPS Academy',
    'VAPS School',
    'VAPS College',
    'VAPS University'
];
interface LeaveAuthorizationFormProps {
    editingLeaveAuthorization: LeaveAuthorization | null;
    onSubmit: (data: LeaveAuthorization) => void;
    onCancel: () => void;
}
export function LeaveAuthorizationForm({ editingLeaveAuthorization, onSubmit, onCancel }: LeaveAuthorizationFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LeaveAuthorization>({
        defaultValues: editingLeaveAuthorization || {
            institution: 'Vaps Knowledge Services Pvt Ltd',
            gradeName: '',
            groupTypeName: '',
            departmentName: '',
            designationName: '',
            leaveType: '',
            orderOfApproval: '',
            approvalPerson: '',
            finalFlag: false
        }
    });
    const handleFormSubmit: SubmitHandler<LeaveAuthorization> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            {/* Institution Field */}
            <div className='mb-4'>
                <label htmlFor='institution-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                    Institution <span className='text-red-500'>*</span>
                </label>
                <Select value={watch('institution')} onValueChange={(value) => setValue('institution', value)}>
                    <SelectTrigger id='institution-select' className={errors.institution ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select Institution' />
                    </SelectTrigger>
                    <SelectContent>
                        {institutions.map((institution) => (
                            <SelectItem key={institution} value={institution}>
                                {institution}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.institution && <FormError>{errors.institution.message}</FormError>}
            </div>
            {/* Form Fields Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    <div>
                        <label htmlFor='grade-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Select Grade <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('gradeName')} onValueChange={(value) => setValue('gradeName', value)}>
                            <SelectTrigger id='grade-select' className={errors.gradeName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Manager'>Manager</SelectItem>
                                <SelectItem value='Executive'>Executive</SelectItem>
                                <SelectItem value='Senior Manager'>Senior Manager</SelectItem>
                                <SelectItem value='Director'>Director</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gradeName && <FormError>{errors.gradeName.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='group-type-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Group Type <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('groupTypeName')} onValueChange={(value) => setValue('groupTypeName', value)}>
                            <SelectTrigger id='group-type-select' className={errors.groupTypeName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='VKS'>VKS</SelectItem>
                                <SelectItem value='Admin'>Admin</SelectItem>
                                <SelectItem value='HR'>HR</SelectItem>
                                <SelectItem value='Finance'>Finance</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.groupTypeName && <FormError>{errors.groupTypeName.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='department-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Department Type <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('departmentName')} onValueChange={(value) => setValue('departmentName', value)}>
                            <SelectTrigger id='department-select' className={errors.departmentName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Sales and Marketing'>Sales and Marketing</SelectItem>
                                <SelectItem value='Human Resources'>Human Resources</SelectItem>
                                <SelectItem value='Finance'>Finance</SelectItem>
                                <SelectItem value='Operations'>Operations</SelectItem>
                                <SelectItem value='IT'>IT</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.departmentName && <FormError>{errors.departmentName.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='designation-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Designation Type <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('designationName')} onValueChange={(value) => setValue('designationName', value)}>
                            <SelectTrigger id='designation-select' className={errors.designationName ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Assistant Business Development Manager'>
                                    Assistant Business Development Manager
                                </SelectItem>
                                <SelectItem value='Business Development Manager'>Business Development Manager</SelectItem>
                                <SelectItem value='Senior Business Development Manager'>Senior Business Development Manager</SelectItem>
                                <SelectItem value='Team Lead'>Team Lead</SelectItem>
                                <SelectItem value='Senior Manager'>Senior Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.designationName && <FormError>{errors.designationName.message}</FormError>}
                    </div>
                </div>
                {/* Right Column */}
                <div className='space-y-4'>
                    <div>
                        <label htmlFor='leave-type-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Leave Type <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('leaveType')} onValueChange={(value) => setValue('leaveType', value)}>
                            <SelectTrigger id='leave-type-select' className={errors.leaveType ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Comp Off'>Comp Off</SelectItem>
                                <SelectItem value='Optional Leave'>Optional Leave</SelectItem>
                                <SelectItem value='Casual Leave'>Casual Leave</SelectItem>
                                <SelectItem value='Sick Leave'>Sick Leave</SelectItem>
                                <SelectItem value='Emergency Leave'>Emergency Leave</SelectItem>
                                <SelectItem value='Privilege Leave'>Privilege Leave</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.leaveType && <FormError>{errors.leaveType.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='order-approval-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Order Of Approval <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('orderOfApproval')} onValueChange={(value) => setValue('orderOfApproval', value)}>
                            <SelectTrigger id='order-approval-select' className={errors.orderOfApproval ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>1</SelectItem>
                                <SelectItem value='2'>2</SelectItem>
                                <SelectItem value='3'>3</SelectItem>
                                <SelectItem value='4'>4</SelectItem>
                                <SelectItem value='5'>5</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.orderOfApproval && <FormError>{errors.orderOfApproval.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='approval-person-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                            Approval Person <span className='text-red-500'>*</span>
                        </label>
                        <Select value={watch('approvalPerson')} onValueChange={(value) => setValue('approvalPerson', value)}>
                            <SelectTrigger id='approval-person-select' className={errors.approvalPerson ? 'border-red-500' : ''}>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Benoy Yogesh Shetty'>Benoy Yogesh Shetty</SelectItem>
                                <SelectItem value='R Siddesh Kumar'>R Siddesh Kumar</SelectItem>
                                <SelectItem value='John Doe'>John Doe</SelectItem>
                                <SelectItem value='Jane Smith'>Jane Smith</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.approvalPerson && <FormError>{errors.approvalPerson.message}</FormError>}
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='finalFlag'
                            checked={watch('finalFlag')}
                            onCheckedChange={(checked) => setValue('finalFlag', checked as boolean)}
                        />
                        <label htmlFor='finalFlag' className='font-medium text-gray-700 text-sm'>
                            Final Flag
                        </label>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
                <Button type='submit' variant='default'>
                    + ADD TO CART
                </Button>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}
