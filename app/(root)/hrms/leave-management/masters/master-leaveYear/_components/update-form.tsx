'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLeaveYear, useUpdateMasterLeaveYear } from '@/hooks/hrms/leave-management/useMasters';
import { LEAVE_YEAR_VALIDATION } from '@/lib/validation/hrms-master-validation';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import type { LeaveYear } from './columns';
interface UpdateMasterLeaveYearFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: LeaveYear;
}
export default function UpdateMasterLeaveYearForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterLeaveYearFormProps) {
    const { refetchAll } = useMasterLeaveYear();
    const { mutate: updateMasterLeaveYear, isPending } = useUpdateMasterLeaveYear();
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors, isSubmitting }
    } = useForm<LeaveYear>({
        mode: 'onChange'
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
    useEffect(() => {
        if (row) {
            reset({
                leaveYear: row.leaveYear || '',
                fromDate: row.fromDate || '',
                toDate: row.toDate || '',
                isActive: row.isActive ?? true
            });
        }
    }, [row, reset]);
    const onSubmit: SubmitHandler<LeaveYear> = async (data) => {
        updateMasterLeaveYear(
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
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <InputText
                            label='Leave Year'
                            required
                            id='leaveYear'
                            {...register('leaveYear', LEAVE_YEAR_VALIDATION.HRMLY_LeaveYear)}
                            error={errors.leaveYear?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='From Date'
                            required
                            id='fromDate'
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
                            error={errors.fromDate?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='To Date'
                            required
                            id='toDate'
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
                            error={errors.toDate?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Controller
                            name='isActive'
                            control={control}
                            render={({ field }) => <Checkbox id='isActive' checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <label htmlFor='isActive' className='font-medium text-sm'>
                            Active
                        </label>
                    </div>
                </div>
                <div className='flex justify-end gap-2'>
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
