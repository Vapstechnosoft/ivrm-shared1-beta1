'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSubSubject } from '@/hooks/exam/exammodule/usemasters';
import { masterSubSubjectSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubSubject } from '@/server/exam/exam-module/masters/sus-subject';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubSubjectSchema.addOrUpdate>;

interface AddMasterSubSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterSubSubjectForm({ onSuccess, className = '' }: AddMasterSubSubjectFormProps) {
    const { refetchAll } = useMasterSubSubject();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubSubjectSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emsS_SubSubjectName: '',
            emsS_SubSubjectCode: '',
            emsS_Order: 0,
            emsS_ActiveFlag: true
        }
    });
    // Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await addOrUpdateMasterSubSubject(data);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => reset();

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* SubSubject Name and Code */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Sub Subject Name'
                            required
                            {...register('emsS_SubSubjectName')}
                            error={errors.emsS_SubSubjectName?.message}
                        />

                        <InputText
                            label='Sub Subject Code'
                            required
                            {...register('emsS_SubSubjectCode')}
                            error={errors.emsS_SubSubjectCode?.message}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save Sub-Subject
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
