'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { LEAVE_YEAR_VALIDATION } from '@/lib/validation/hrms-master-validation';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import type { LeaveYear } from './columns';
interface LeaveYearFormProps {
    editingLeaveYear: LeaveYear | null;
    onSubmit: (data: LeaveYear) => void;
    onCancel: () => void;
}
export function LeaveYearForm({ editingLeaveYear, onSubmit, onCancel }: LeaveYearFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        trigger,
        formState: { errors }
    } = useForm<LeaveYear>({
        defaultValues: editingLeaveYear || {
            leaveYear: '',
            fromDate: '',
            toDate: '',
            isActive: true
        }
    });
    // Watch dates for cross-validation
    const fromDate = useWatch({ control, name: 'fromDate' });
    const toDate = useWatch({ control, name: 'toDate' });
    // Trigger validation when dates change
    useEffect(() => {
        if (fromDate && toDate) {
            trigger('toDate');
        }
    }, [fromDate, trigger]);
    useEffect(() => {
        if (toDate && fromDate) {
            trigger('fromDate');
        }
    }, [toDate, trigger]);
    const handleFormSubmit: SubmitHandler<LeaveYear> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                    <label htmlFor='leave-year-input' className='font-medium text-sm'>
                        Leave Year *
                    </label>
                    <InputText
                        id='leave-year-input'
                        {...register('leaveYear', LEAVE_YEAR_VALIDATION.HRMLY_LeaveYear)}
                        placeholder='Enter leave year'
                        className={errors.leaveYear ? 'border-red-500' : ''}
                    />
                    {errors.leaveYear && <p className='mt-1 text-red-500 text-xs'>{errors.leaveYear.message}</p>}
                </div>
                <div>
                    <label htmlFor='from-date-input' className='font-medium text-sm'>
                        From Date *
                    </label>
                    <InputText
                        id='from-date-input'
                        type='date'
                        {...register('fromDate', {
                            ...LEAVE_YEAR_VALIDATION.HRMLY_FromDate,
                            validate: (value) => {
                                if (!value) return LEAVE_YEAR_VALIDATION.HRMLY_FromDate.required;
                                const fromDateValue = new Date(value);
                                const toDateValue = toDate ? new Date(toDate) : null;
                                if (toDateValue && fromDateValue >= toDateValue) {
                                    return 'From Date must be before To Date';
                                }
                                return true;
                            }
                        })}
                        className={errors.fromDate ? 'border-red-500' : ''}
                    />
                    {errors.fromDate && <p className='mt-1 text-red-500 text-xs'>{errors.fromDate.message}</p>}
                </div>
                <div>
                    <label htmlFor='to-date-input' className='font-medium text-sm'>
                        To Date *
                    </label>
                    <InputText
                        id='to-date-input'
                        type='date'
                        {...register('toDate', {
                            ...LEAVE_YEAR_VALIDATION.HRMLY_ToDate,
                            validate: (value) => {
                                if (!value) return LEAVE_YEAR_VALIDATION.HRMLY_ToDate.required;
                                const toDateValue = new Date(value);
                                const fromDateValue = fromDate ? new Date(fromDate) : null;
                                if (fromDateValue && toDateValue <= fromDateValue) {
                                    return 'To Date must be on or after From Date';
                                }
                                return true;
                            }
                        })}
                        className={errors.toDate ? 'border-red-500' : ''}
                    />
                    {errors.toDate && <p className='mt-1 text-red-500 text-xs'>{errors.toDate.message}</p>}
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <Checkbox
                    id='isActive'
                    checked={watch('isActive')}
                    onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
                />
                <label htmlFor='isActive' className='font-medium text-sm'>
                    Active
                </label>
            </div>
            <div className='flex gap-2'>
                <Button type='submit' variant='default'>
                    {editingLeaveYear ? 'Update' : 'Save'}
                </Button>
                <Button type='button' variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
