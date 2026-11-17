'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useInstitutionsByLoginBased,
    useLeaveAuthorization,
    useLeaveAuthorizationDropdowns,
    useSaveLeaveAuthorization
} from '@/hooks/hrms/leave-management/useMasters';
import { LEAVE_AUTHORIZATION_VALIDATION } from '@/lib/validation/hrms-master-validation';
import { Loader2, RotateCcw, Save, X } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveAuthorization } from './columns';
interface AddLeaveAuthorizationFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}
export default function AddLeaveAuthorizationForm({ onSuccess, onCancel, className = '' }: AddLeaveAuthorizationFormProps) {
    const { refetchAll } = useLeaveAuthorization();
    const { mutate: saveLeaveAuthorization, isPending } = useSaveLeaveAuthorization();
    const { data: dropdownData, isLoading: isLoadingDropdowns } = useLeaveAuthorizationDropdowns();
    const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutionsByLoginBased();

    const mastersLoading = isLoadingDropdowns || isLoadingInstitutions;

    // Extract institution options from API
    const institutionOptions = useMemo(() => {
        if (!institutionsData?.data || !Array.isArray(institutionsData.data)) {
            return [];
        }
        return institutionsData.data
            .map((item: any) => ({
                value: String(item.mI_Id || ''),
                label: String(item.mI_Name || '')
            }))
            .filter((item: { value: string; label: string }) => item.value && item.label);
    }, [institutionsData]);

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
        mode: 'onChange',
        defaultValues: {
            institution: '',
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
    const onSubmit: SubmitHandler<LeaveAuthorization> = async (data) => {
        saveLeaveAuthorization(data, {
            onSuccess: () => {
                reset();
            }
        });
    };
    const handleReset = () => {
        reset();
    };
    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Institution Field */}
                <div className='mb-4'>
                    <Controller
                        name='institution'
                        control={control}
                        rules={{ required: 'Institution is required' }}
                        render={({ field }) => (
                            <div>
                                <label htmlFor='institution-select' className='mb-2 block font-medium text-gray-700 text-sm'>
                                    Institution <span className='text-red-500'>*</span>
                                </label>
                                <Select
                                    key={field.value || 'empty'}
                                    onValueChange={(value) => {
                                        field.onChange(value || '');
                                    }}
                                    value={field.value?.toString() || undefined}>
                                    <SelectTrigger id='institution-select' className={errors.institution ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={isLoadingInstitutions ? 'Loading...' : '--Select Institution--'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutionOptions.length > 0 ? (
                                            institutionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.label}>
                                                    {option.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className='px-2 py-1.5 text-muted-foreground text-sm'>
                                                {isLoadingInstitutions ? 'Loading institutions...' : 'No institutions available'}
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.institution && <FormError>{errors.institution.message}</FormError>}
                            </div>
                        )}
                    />
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(value) => {
                                            field.onChange(value || '');
                                        }}
                                        value={field.value?.toString() || undefined}>
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
                    <Button type='button' variant='outline' onClick={handleReset} disabled={mastersLoading}>
                        <RotateCcw className='mr-1.5 h-4 w-4' />
                        Reset
                    </Button>
                    {mastersLoading && <Loader2 className='h-4 w-4 animate-spin text-purple-500' />}
                    <Button type='submit' disabled={isPending || isSubmitting}>
                        <Save className='mr-2 h-4 w-4' />
                        {isPending || isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
