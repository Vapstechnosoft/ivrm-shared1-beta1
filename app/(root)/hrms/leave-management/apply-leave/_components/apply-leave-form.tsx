'use client';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import type { ApplyLeave } from './columns';
interface ApplyLeaveFormProps {
    defaultEmployee: {
        name: string;
        designation: string;
        doj: string;
        email?: string;
        phone?: string;
    };
    onSubmit: (data: ApplyLeave) => void;
    onCancel: () => void;
}
export function ApplyLeaveForm({ defaultEmployee, onSubmit, onCancel }: ApplyLeaveFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<ApplyLeave & { contactNumber: string; dateReportingBack: string; file?: FileList }>({
        defaultValues: {
            employeeName: defaultEmployee.name,
            designation: defaultEmployee.designation,
            doj: defaultEmployee.doj,
            leaveType: '',
            fromDate: '',
            toDate: '',
            numDays: 0,
            reason: '',
            contactNumber: '',
            dateReportingBack: ''
        }
    });
    const _todayISO = new Date().toISOString().slice(0, 10);
    const selectedFile = watch('file');
    const handleFormSubmit: SubmitHandler<ApplyLeave & { contactNumber: string; dateReportingBack: string; file?: FileList }> = (data) => {
        if (!data.reason?.trim()) {
            return;
        }
        if (!data.contactNumber?.trim()) {
            return;
        }
        if (!data.dateReportingBack) {
            return;
        }
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            {/* Read-only Employee Information */}
            <div className='rounded-lg border bg-muted/30 p-5'>
                <h3 className='mb-4 font-semibold text-base text-foreground'>Employee Information</h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='space-y-2'>
                        <label htmlFor='employee-name-input' className='block font-medium text-muted-foreground text-sm'>
                            Employee Name
                        </label>
                        <InputText
                            id='employee-name-input'
                            readOnly
                            disabled
                            {...register('employeeName')}
                            className='cursor-not-allowed bg-muted opacity-70'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='doj-input' className='block font-medium text-muted-foreground text-sm'>
                            Date of Joining (DOJ)
                        </label>
                        <InputText
                            id='doj-input'
                            type='date'
                            readOnly
                            disabled
                            {...register('doj')}
                            className='cursor-not-allowed bg-muted opacity-70'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='designation-input' className='block font-medium text-muted-foreground text-sm'>
                            Designation
                        </label>
                        <InputText
                            id='designation-input'
                            readOnly
                            disabled
                            {...register('designation')}
                            className='cursor-not-allowed bg-muted opacity-70'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='email-input' className='block font-medium text-muted-foreground text-sm'>
                            Email
                        </label>
                        <InputText
                            id='email-input'
                            type='email'
                            readOnly
                            disabled
                            value={defaultEmployee.email || ''}
                            className='cursor-not-allowed bg-muted opacity-70'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='phone-input' className='block font-medium text-muted-foreground text-sm'>
                            Phone
                        </label>
                        <InputText
                            id='phone-input'
                            type='tel'
                            readOnly
                            disabled
                            value={defaultEmployee.phone || ''}
                            className='cursor-not-allowed bg-muted opacity-70'
                        />
                    </div>
                </div>
            </div>
            {/* Leave Application Form */}
            <div className='space-y-6 rounded-lg border bg-background p-5'>
                <h3 className='font-semibold text-base text-foreground'>Leave Application Details</h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Reasons for Leave */}
                    <div className='space-y-2'>
                        <label htmlFor='reason-textarea' className='block font-medium text-sm'>
                            Reasons for Leave <span className='text-red-500'>*</span>
                        </label>
                        <InputTextarea
                            id='reason-textarea'
                            {...register('reason', { required: 'Reasons for Leave is required' })}
                            placeholder='Enter reasons for leave'
                            rows={4}
                            error={errors.reason?.message}
                            className='w-full'
                        />
                    </div>
                    {/* Contact Number While on Leave */}
                    <div className='space-y-2'>
                        <label htmlFor='contact-number-input' className='block font-medium text-sm'>
                            Contact Number While on Leave <span className='text-red-500'>*</span>
                        </label>
                        <InputText
                            id='contact-number-input'
                            type='tel'
                            {...register('contactNumber', { required: 'Contact Number is required' })}
                            error={errors.contactNumber?.message}
                            placeholder='Enter contact number'
                            className='w-full'
                        />
                    </div>
                    {/* Date Reporting Back */}
                    <div className='space-y-2'>
                        <Controller
                            control={control}
                            name='dateReportingBack'
                            rules={{ required: 'Date Reporting Back is required' }}
                            render={({ field, fieldState }) => (
                                <DateField
                                    field={field}
                                    fieldState={fieldState}
                                    label='Date Reporting Back'
                                    placeholder='Select Date Reporting Back'
                                    fromDate={new Date()}
                                />
                            )}
                        />
                    </div>
                    {/* File Upload */}
                    <div className='space-y-2'>
                        <label htmlFor='leave-document-file' className='block font-medium text-sm'>
                            Document
                        </label>
                        <div className='flex items-center gap-3'>
                            <input
                                id='leave-document-file'
                                type='file'
                                {...register('file')}
                                className='hidden'
                                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => document.getElementById('leave-document-file')?.click()}
                                className='w-fit'>
                                Choose File
                            </Button>
                            <span className='text-muted-foreground text-sm'>
                                {selectedFile?.[0] ? selectedFile[0].name : 'No file chosen'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-3 pt-2'>
                <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
                <Button type='submit' size='sm' variant='outline' className='min-w-[160px]' >
                    APPLY LEAVE NOW
                </Button>
            </div>
        </form>
    );
}
