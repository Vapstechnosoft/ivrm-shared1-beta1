'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const interviewerFeedbackSchema = z.object({
    candidateId: z.string().min(1, 'Candidate is required'),
    interviewId: z.string().min(1, 'Interview is required'),
    interviewerId: z.string().min(1, 'Interviewer is required'),
    rating: z.string().min(1, 'Rating is required'),
    feedback: z.string().min(1, 'Feedback is required'),
    recommendation: z.string().min(1, 'Recommendation is required')
});
type FormFields = z.infer<typeof interviewerFeedbackSchema>;
interface AddInterviewerFeedbackFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}
export default function AddInterviewerFeedbackForm({ onSuccess, onCancel, className = '' }: AddInterviewerFeedbackFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(interviewerFeedbackSchema),
        mode: 'onChange'
    });
    const onSubmit: SubmitHandler<FormFields> = async (_data) => {
        try {
            // TODO: Replace with actual API call
            toast.success('Interviewer feedback added successfully');
            reset();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add interviewer feedback');
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Candidate <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='candidateId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Candidate' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>Candidate 1</SelectItem>
                                        <SelectItem value='2'>Candidate 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.candidateId && <FormError>{errors.candidateId.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Interview <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='interviewId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Interview' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>Interview 1</SelectItem>
                                        <SelectItem value='2'>Interview 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.interviewId && <FormError>{errors.interviewId.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Interviewer <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='interviewerId'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Interviewer' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>Interviewer 1</SelectItem>
                                        <SelectItem value='2'>Interviewer 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.interviewerId && <FormError>{errors.interviewerId.message}</FormError>}
                    </div>
                    <div className='space-y-2'>
                        <label className='block font-medium text-sm'>
                            Rating <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='rating'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Rating' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Excellent'>Excellent</SelectItem>
                                        <SelectItem value='Good'>Good</SelectItem>
                                        <SelectItem value='Average'>Average</SelectItem>
                                        <SelectItem value='Poor'>Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rating && <FormError>{errors.rating.message}</FormError>}
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                        <label className='block font-medium text-sm'>
                            Feedback <span className='text-red-500'>*</span>
                        </label>
                        <Textarea placeholder='Enter feedback' rows={4} {...register('feedback')} />
                        {errors.feedback && <FormError>{errors.feedback.message}</FormError>}
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                        <label className='block font-medium text-sm'>
                            Recommendation <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='recommendation'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Recommendation' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Selected'>Selected</SelectItem>
                                        <SelectItem value='Rejected'>Rejected</SelectItem>
                                        <SelectItem value='On Hold'>On Hold</SelectItem>
                                        <SelectItem value='Further Round'>Further Round</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.recommendation && <FormError>{errors.recommendation.message}</FormError>}
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center justify-center gap-2 border-t pt-4'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                        reset();
                        onCancel?.();
                    }}
                    disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-orange-500 text-white hover:bg-orange-600'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save & Proceed
                    </div>
                </Button>
                <Button type='button' variant='destructive' onClick={() => reset()} disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' />
                    Clear
                </Button>
            </div>
        </form>
    );
}
