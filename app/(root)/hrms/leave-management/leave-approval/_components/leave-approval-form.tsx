'use client';
import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Check, X } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { LeaveApprovalRow } from './columns';
export type LeaveApprovalFormData = {
    remark?: string;
    action: 'approve' | 'reject';
};
interface LeaveApprovalFormProps {
    leaveRequest: LeaveApprovalRow;
    onSubmit: (data: LeaveApprovalFormData) => void;
    onCancel: () => void;
}
export function LeaveApprovalForm({ leaveRequest, onSubmit, onCancel }: LeaveApprovalFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LeaveApprovalFormData>({
        defaultValues: {
            remark: leaveRequest.remark || '',
            action: 'approve'
        }
    });
    const handleFormSubmit: SubmitHandler<LeaveApprovalFormData> = async (data) => {
        onSubmit(data);
    };
    const handleApprove = () => {
        handleSubmit((data) => {
            onSubmit({ ...data, action: 'approve' });
        })();
    };
    const handleReject = () => {
        handleSubmit((data) => {
            onSubmit({ ...data, action: 'reject' });
        })();
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-4'>
            <AdaptiveBody className='flex flex-col gap-5'>
                {/* Leave Request Details */}
                <div className='rounded-lg border bg-gray-50 p-4'>
                    <h3 className='mb-4 font-semibold text-gray-700 text-sm'>Leave Request Details</h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>Employee Code</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>{leaveRequest.employeeCode}</div>
                        </div>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>Employee Name</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>{leaveRequest.employeeName}</div>
                        </div>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>Leave Name</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>{leaveRequest.leaveName}</div>
                        </div>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>Total Days</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>{leaveRequest.totalDays}</div>
                        </div>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>From Date</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>
                                {new Date(leaveRequest.fromDate).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                        <div>
                            <div className='mb-1 block font-medium text-gray-600 text-xs'>To Date</div>
                            <div className='rounded-md border bg-white p-2 text-sm'>
                                {new Date(leaveRequest.toDate).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Remark */}
                <div>
                    <label htmlFor='remark-textarea' className='mb-2 block font-medium text-sm'>
                        Remark
                    </label>
                    <InputTextarea
                        id='remark-textarea'
                        {...register('remark')}
                        placeholder='Enter your remark (optional)'
                        rows={4}
                        error={errors.remark?.message}
                        className='w-full'
                    />
                </div>
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button type='button' variant='secondary' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button type='button' variant='destructive' onClick={handleReject} isLoading={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Reject
                </Button>
                <Button type='button' onClick={handleApprove} isLoading={isSubmitting} className='bg-green-600 hover:bg-green-700'>
                    <Check className='mr-2 h-4 w-4' />
                    Approve
                </Button>
            </AdaptiveFooter>
        </form>
    );
}
