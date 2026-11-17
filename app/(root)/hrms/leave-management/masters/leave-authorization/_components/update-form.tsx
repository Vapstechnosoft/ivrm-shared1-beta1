'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useLeaveAuthorization,
    useLeaveAuthorizationDropdowns,
    useLeaveAuthorizationForEdit,
    useUpdateLeaveAuthorization
} from '@/hooks/hrms/leave-management/useMasters';
import { LEAVE_AUTHORIZATION_VALIDATION } from '@/lib/validation/hrms-master-validation';
import { Save, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveAuthorization } from './columns';
interface UpdateLeaveAuthorizationFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
    selectedRow: LeaveAuthorization;
}
export default function UpdateLeaveAuthorizationForm({
    onSuccess,
    onCancel,
    className = '',
    selectedRow: row
}: UpdateLeaveAuthorizationFormProps) {
    const { refetchAll } = useLeaveAuthorization();
    const { mutate: updateLeaveAuthorization, isPending } = useUpdateLeaveAuthorization();
    const { data: dropdownData, isLoading: isLoadingDropdowns } = useLeaveAuthorizationDropdowns();
    // Fetch leave authorization data for editing from API
    const { data: editData, isLoading: isLoadingEditData, error: editError } = useLeaveAuthorizationForEdit(row?.id || null);
    // Extract dropdown options from API
    const gradeOptions = useMemo(() => {
        if (!dropdownData?.data?.grades || !Array.isArray(dropdownData.data.grades)) {
            return [];
        }
        return dropdownData.data.grades;
    }, [dropdownData]);
    const groupTypeOptions = useMemo(() => {
        if (!dropdownData?.data?.groupTypes || !Array.isArray(dropdownData.data.groupTypes)) {
            return [];
        }
        return dropdownData.data.groupTypes;
    }, [dropdownData]);
    const departmentOptions = useMemo(() => {
        if (!dropdownData?.data?.departments || !Array.isArray(dropdownData.data.departments)) {
            return [];
        }
        return dropdownData.data.departments;
    }, [dropdownData]);
    const designationOptions = useMemo(() => {
        if (!dropdownData?.data?.designations || !Array.isArray(dropdownData.data.designations)) {
            return [];
        }
        return dropdownData.data.designations;
    }, [dropdownData]);
    const leaveTypeOptions = useMemo(() => {
        if (!dropdownData?.data?.leaveTypes || !Array.isArray(dropdownData.data.leaveTypes)) {
            return [];
        }
        return dropdownData.data.leaveTypes;
    }, [dropdownData]);
    const approvalPersonOptions = useMemo(() => {
        if (!dropdownData?.data?.approvalPersons || !Array.isArray(dropdownData.data.approvalPersons)) {
            return [];
        }
        return dropdownData.data.approvalPersons;
    }, [dropdownData]);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue: _setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<LeaveAuthorization>({
        mode: 'onChange'
    });
    // Load data from API when edit data is fetched
    useEffect(() => {
        if (editData?.data) {
            const apiRow = editData.data;
            const gradeId = gradeOptions.find((opt) => opt.label === apiRow.gradeName || opt.value == apiRow.gradeName)?.value || '';
            const groupTypeId = groupTypeOptions.find((opt) => opt.label === apiRow.groupTypeName || opt.value == apiRow.groupTypeName)?.value || '';
            const departmentId = departmentOptions.find((opt) => opt.label === apiRow.departmentName || opt.value == apiRow.departmentName)?.value || '';
            const designationId = designationOptions.find((opt) => opt.label === apiRow.designationName || opt.value == apiRow.designationName)?.value || '';
            const leaveTypeId = leaveTypeOptions.find((opt) => opt.label === apiRow.leaveType || opt.value == apiRow.leaveType)?.value || '';
            const approvalPersonId = approvalPersonOptions.find((opt) => opt.label === apiRow.approvalPerson || opt.value == apiRow.approvalPerson)?.value || '';

            reset({
                institution: apiRow.institution || 'Vaps Knowledge Services Pvt Ltd',
                gradeName: gradeId,
                groupTypeName: groupTypeId,
                departmentName: departmentId,
                designationName: designationId,
                leaveType: leaveTypeId,
                orderOfApproval: apiRow.orderOfApproval || '',
                approvalPerson: approvalPersonId,
                finalFlag: apiRow.finalFlag ?? false
            });
        } else if (row && !isLoadingEditData) {
            // Fallback to selectedRow if API data is not available
            const gradeId = gradeOptions.find((opt) => opt.label === row.gradeName || opt.value == row.gradeName)?.value || '';
            const groupTypeId = groupTypeOptions.find((opt) => opt.label === row.groupTypeName || opt.value == row.groupTypeName)?.value || '';
            const departmentId = departmentOptions.find((opt) => opt.label === row.departmentName || opt.value == row.departmentName)?.value || '';
            const designationId = designationOptions.find((opt) => opt.label === row.designationName || opt.value == row.designationName)?.value || '';
            const leaveTypeId = leaveTypeOptions.find((opt) => opt.label === row.leaveType || opt.value == row.leaveType)?.value || '';
            const approvalPersonId = approvalPersonOptions.find((opt) => opt.label === row.approvalPerson || opt.value == row.approvalPerson)?.value || '';

            reset({
                institution: row.institution || 'Vaps Knowledge Services Pvt Ltd',
                gradeName: gradeId,
                groupTypeName: groupTypeId,
                departmentName: departmentId,
                designationName: designationId,
                leaveType: leaveTypeId,
                orderOfApproval: row.orderOfApproval || '',
                approvalPerson: approvalPersonId,
                finalFlag: row.finalFlag ?? false
            });
        }
    }, [
        editData,
        row,
        reset,
        isLoadingEditData,
        gradeOptions,
        groupTypeOptions,
        departmentOptions,
        designationOptions,
        leaveTypeOptions,
        approvalPersonOptions
    ]);
    const onSubmit: SubmitHandler<LeaveAuthorization> = async (data) => {
        updateLeaveAuthorization(
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
    // Show loading state while fetching edit data
    if (isLoadingEditData) {
        return (
            <div className={`${className} flex items-center justify-center p-8`}>
                <div className='text-center'>
                    <div className='mb-2 text-muted-foreground text-sm'>Loading leave authorization data...</div>
                </div>
            </div>
        );
    }
    // Show error state if edit data failed to load
    if (editError) {
        return (
            <div className={`${className} flex items-center justify-center p-8`}>
                <div className='text-center'>
                    <div className='mb-2 text-red-600 text-sm'>{editError.message || 'Failed to load leave authorization data'}</div>
                    {onCancel && (
                        <Button type='button' variant='outline' onClick={onCancel} className='mt-4'>
                            <X className='mr-2 h-4 w-4' />
                            CANCEL
                        </Button>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Institution Field */}
                <div className='mb-4'>
                    <label htmlFor='institution-display' className='mb-2 block font-medium text-gray-700 text-sm'>
                        Institution
                    </label>
                    <div id='institution-display' className='rounded-md bg-gray-100 p-3 text-gray-600'>
                        {watch('institution')}
                    </div>
                </div>
                {/* Form Fields Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <Controller
                            name='gradeName'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.gradeName}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='grade-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Select Grade <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger id='grade-select' className={errors.gradeName ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gradeOptions.length > 0 ? (
                                                gradeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.gradeName && <FormError>{errors.gradeName.message}</FormError>}
                                </div>
                            )}
                        />
                        <Controller
                            name='groupTypeName'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.groupTypeName}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='group-type-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Group Type <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger id='group-type-select' className={errors.groupTypeName ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groupTypeOptions.length > 0 ? (
                                                groupTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.groupTypeName && <FormError>{errors.groupTypeName.message}</FormError>}
                                </div>
                            )}
                        />
                        <Controller
                            name='departmentName'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.departmentName}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='department-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Department Type <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger id='department-select' className={errors.departmentName ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentOptions.length > 0 ? (
                                                departmentOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.departmentName && <FormError>{errors.departmentName.message}</FormError>}
                                </div>
                            )}
                        />
                        <Controller
                            name='designationName'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.designationName}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='designation-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Designation Type <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger id='designation-select' className={errors.designationName ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {designationOptions.length > 0 ? (
                                                designationOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.designationName && <FormError>{errors.designationName.message}</FormError>}
                                </div>
                            )}
                        />
                    </div>
                    {/* Right Column */}
                    <div className='space-y-4'>
                        <Controller
                            name='leaveType'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.leaveType}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='leave-type-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Leave Type <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger id='leave-type-select' className={errors.leaveType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {leaveTypeOptions.length > 0 ? (
                                                leaveTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.leaveType && <FormError>{errors.leaveType.message}</FormError>}
                                </div>
                            )}
                        />
                        <InputText
                            label='Order of Approval'
                            required
                            id='orderOfApproval'
                            type='number'
                            {...register('orderOfApproval', LEAVE_AUTHORIZATION_VALIDATION.orderOfApproval)}
                            error={errors.orderOfApproval?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <Controller
                            name='approvalPerson'
                            control={control}
                            rules={LEAVE_AUTHORIZATION_VALIDATION.approvalPerson}
                            render={({ field }) => (
                                <div>
                                    <label htmlFor='approval-person-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                        Approval Person <span className='text-red-500'>*</span>
                                    </label>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingDropdowns}>
                                        <SelectTrigger
                                            id='approval-person-select'
                                            className={errors.approvalPerson ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : '--Select--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvalPersonOptions.length > 0 ? (
                                                approvalPersonOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                    {isLoadingDropdowns ? 'Loading options...' : 'No options available'}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.approvalPerson && <FormError>{errors.approvalPerson.message}</FormError>}
                                </div>
                            )}
                        />
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name='finalFlag'
                                control={control}
                                render={({ field }) => <Checkbox id='finalFlag' checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <label htmlFor='finalFlag' className='font-medium text-gray-700 text-sm'>
                                Final Flag
                            </label>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
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
                    <Button type='submit' disabled={isPending || isSubmitting}>
                        <Save className='mr-2 h-4 w-4' />
                        {isPending || isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
