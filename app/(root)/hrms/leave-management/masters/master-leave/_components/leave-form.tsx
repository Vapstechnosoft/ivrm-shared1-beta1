'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterLeaveDropdowns } from '@/hooks/hrms/leave-management/useMasters';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { MasterLeave } from './columns';
interface LeaveFormProps {
    editingLeave: MasterLeave | null;
    onSubmit: (data: MasterLeave) => void;
    onCancel: () => void;
}
export function LeaveForm({ editingLeave, onSubmit, onCancel }: LeaveFormProps) {
    const { data: dropdownData, isLoading: isLoadingDropdowns } = useMasterLeaveDropdowns();
    // Extract leave type options from API
    const leaveTypeOptions = useMemo(() => {
        if (!dropdownData?.data?.leaveTypes || !Array.isArray(dropdownData.data.leaveTypes)) {
            return [];
        }
        return dropdownData.data.leaveTypes;
    }, [dropdownData]);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<MasterLeave>({
        defaultValues: editingLeave || {
            leaveName: '',
            leaveCode: '',
            leaveType: '',
            leaveDetails: '',
            leaveCredit: false,
            lateDeduct: false,
            leaveOrder: 0,
            isActive: true
        }
    });
    const handleFormSubmit: SubmitHandler<MasterLeave> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                    <label htmlFor='leave-name-input' className='font-medium text-sm'>
                        Leave Name *
                    </label>
                    <InputText
                        id='leave-name-input'
                        {...register('leaveName', { required: 'Leave name is required' })}
                        placeholder='Enter leave name'
                        className={errors.leaveName ? 'border-red-500' : ''}
                    />
                    {errors.leaveName && <p className='mt-1 text-red-500 text-xs'>{errors.leaveName.message}</p>}
                </div>
                <div>
                    <label htmlFor='leave-code-input' className='font-medium text-sm'>
                        Leave Code *
                    </label>
                    <InputText
                        id='leave-code-input'
                        {...register('leaveCode', { required: 'Leave code is required' })}
                        placeholder='Enter leave code'
                        className={errors.leaveCode ? 'border-red-500' : ''}
                    />
                    {errors.leaveCode && <p className='mt-1 text-red-500 text-xs'>{errors.leaveCode.message}</p>}
                </div>
                <div>
                    <label htmlFor='leave-type-select' className='font-medium text-sm'>
                        Leave Type *
                    </label>
                    <Select
                        value={watch('leaveType')}
                        onValueChange={(value) => setValue('leaveType', value)}
                        disabled={isLoadingDropdowns}>
                        <SelectTrigger id='leave-type-select' className={errors.leaveType ? 'border-red-500' : ''}>
                            <SelectValue placeholder={isLoadingDropdowns ? 'Loading...' : 'Select Leave Type'} />
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
                    {errors.leaveType && <p className='mt-1 text-red-500 text-xs'>{errors.leaveType.message}</p>}
                </div>
                <div className='md:col-span-3'>
                    <label htmlFor='leave-details-textarea' className='font-medium text-sm'>
                        Leave Details
                    </label>
                    <textarea
                        id='leave-details-textarea'
                        {...register('leaveDetails')}
                        placeholder='Enter leave details'
                        className='w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                        rows={3}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='leaveCredit'
                        checked={watch('leaveCredit')}
                        onCheckedChange={(checked) => setValue('leaveCredit', checked as boolean)}
                    />
                    <label htmlFor='leaveCredit' className='font-medium text-sm'>
                        Leave Credit
                    </label>
                </div>
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='lateDeduct'
                        checked={watch('lateDeduct')}
                        onCheckedChange={(checked) => setValue('lateDeduct', checked as boolean)}
                    />
                    <label htmlFor='lateDeduct' className='font-medium text-sm'>
                        Late Deduct
                    </label>
                </div>
                <div>
                    <label htmlFor='leave-order-input' className='font-medium text-sm'>
                        Leave Order
                    </label>
                    <InputText
                        id='leave-order-input'
                        {...register('leaveOrder', { valueAsNumber: true })}
                        placeholder='Enter order'
                        type='number'
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3'>
                <div>
                    <label htmlFor='leave-apply-criteria-select' className='font-medium text-sm'>
                        Apply Criteria
                    </label>
                    <Select value={watch('leaveApplyCriteria')} onValueChange={(value) => setValue('leaveApplyCriteria', value)}>
                        <SelectTrigger id='leave-apply-criteria-select'>
                            <SelectValue placeholder='Select Criteria' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='Before'>Before</SelectItem>
                            <SelectItem value='After'>After</SelectItem>
                            <SelectItem value='Same Day'>Same Day</SelectItem>
                            <SelectItem value='Month'>Month</SelectItem>
                            <SelectItem value='Quarter'>Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor='days-for-criteria-input' className='font-medium text-sm'>
                        Days for Criteria
                    </label>
                    <InputText id='days-for-criteria-input' {...register('daysForApplyCriteria')} placeholder='Enter days' type='number' />
                </div>
                <div>
                    <label htmlFor='max-days-input' className='font-medium text-sm'>
                        Max Days for Apply
                    </label>
                    <InputText id='max-days-input' {...register('maxDaysForApply')} placeholder='Enter max days' type='number' />
                </div>
            </div>
            <div className='flex gap-2'>
                <Button type='submit' variant='default'>
                    {editingLeave ? 'Update' : 'Save'}
                </Button>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
