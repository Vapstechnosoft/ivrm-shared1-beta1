'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { useMasterLibrary } from '@/hooks/library/useMasters';
import { studentFeedBackSchema } from '@/schemas/student-portal/masters/attendance-details.schema';
import { saveStudentFeedback } from '@/server/student-portal/masters/attendance-details';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';

import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof studentFeedBackSchema.addOrUpdate>;

interface AddStudentFeedbackFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddStudentFeedbackForm({ onSuccess, className = '' }: AddStudentFeedbackFormProps) {
    //const { refetchAll: refetchMasterCasteCategoryCode } = useMasterLibrary();

    const { refetchAll } = useMasterLibrary();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(studentFeedBackSchema.addOrUpdate),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { asgfE_FeedBack } = data;
            const payload = {
                asgfE_Id: 0,
                asgfE_FeedBack: asgfE_FeedBack
            };

            const response = await saveStudentFeedback(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                //refetchMasterCasteCategoryCode();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-1'>
                        <InputTextarea
                            label='Please complete this form to report the feedback and Issues to SchoolSuggestions for Improvement'
                            required
                            id='asgfE_Id'
                            placeholder='Enter Feedback'
                            {...register('asgfE_FeedBack')}
                            error={errors.asgfE_FeedBack?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Feedback
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
