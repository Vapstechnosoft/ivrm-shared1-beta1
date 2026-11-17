'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Save, X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const candidateInterviewSchema = z.object({
    candidateId: z.string().min(1, 'Candidate is required'),
    interviewDate: z.string().min(1, 'Interview date is required'),
    interviewRound: z.string().min(1, 'Interview round is required'),
    interviewerId: z.string().min(1, 'Interviewer is required'),
    interviewVenue: z.string().min(1, 'Interview venue is required'),
    status: z.string().min(1, 'Status is required'),
    notifyByEmail: z.boolean().optional(),
    notifyBySMS: z.boolean().optional()
});
type FormFields = z.infer<typeof candidateInterviewSchema>;
interface AddCandidateInterviewFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}
export default function AddCandidateInterviewForm({ onSuccess, onCancel, className = '' }: AddCandidateInterviewFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(candidateInterviewSchema),
        mode: 'onChange',
        defaultValues: {
            notifyByEmail: false,
            notifyBySMS: false
        }
    });
    const onSubmit: SubmitHandler<FormFields> = async (_data) => {
        try {
            // TODO: Replace with actual API call
            // const response = await addCandidateInterview(data);
            // if (response.success) {
            //     toast.success(response.message);
            //     reset();
            //     onSuccess?.();
            // } else {
            //     toast.error(response.message);
            // }
            toast.success('Candidate interview added successfully');
            reset();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add candidate interview');
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
            <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Candidate Name:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='candidateId'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select OR Search Candidate in the list...' />
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
                                Interview Date:<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative'>
                                <CalendarIcon className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
                                <InputText
                                    type='date'
                                    className='pl-10'
                                    {...register('interviewDate')}
                                    error={errors.interviewDate?.message}
                                />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>Notify Candidate By:</label>
                            <div className='flex items-center space-x-6'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox id='notifyByEmail' {...register('notifyByEmail')} />
                                    <label htmlFor='notifyByEmail' className='text-sm'>
                                        E-Mail
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox id='notifyBySMS' {...register('notifyBySMS')} />
                                    <label htmlFor='notifyBySMS' className='text-sm'>
                                        SMS
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Status:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='status'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Scheduled'>Scheduled</SelectItem>
                                            <SelectItem value='Completed'>Completed</SelectItem>
                                            <SelectItem value='Cancelled'>Cancelled</SelectItem>
                                            <SelectItem value='Rescheduled'>Rescheduled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormError>{errors.status.message}</FormError>}
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Interview Rounds:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='interviewRound'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Technical Round'>Technical Round</SelectItem>
                                            <SelectItem value='HR Round'>HR Round</SelectItem>
                                            <SelectItem value='Management Round'>Management Round</SelectItem>
                                            <SelectItem value='Technical + HR'>Technical + HR</SelectItem>
                                            <SelectItem value='All Rounds'>All Rounds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.interviewRound && <FormError>{errors.interviewRound.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <label className='block font-medium text-sm'>
                                Interviewer Name:<span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='interviewerId'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select OR Search Interviewer in the list...' />
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
                                Interview Venue:<span className='text-red-500'>*</span>
                            </label>
                            <Textarea placeholder='Enter interview venue' rows={4} {...register('interviewVenue')} />
                            {errors.interviewVenue && <FormError>{errors.interviewVenue.message}</FormError>}
                        </div>
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
