'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSubSubject } from '@/hooks/exam/exammodule/usemasters';
import { masterSubSubjectSchema } from '@/schemas/exam/exam-module/masters';
import { addOrUpdateMasterSubSubject } from '@/server/exam/exam-module/masters/sus-subject';
import type { IMasterSubSubject } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubSubjectSchema.addOrUpdate>;

interface UpdateMasterSubSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSubSubject;
}

export default function UpdateMasterSubSubjectForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterSubSubjectFormProps) {
    const { refetchAll } = useMasterSubSubject();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubSubjectSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            emsS_Id: row?.emsS_Id ?? 0,
            mI_Id: row?.mI_Id ?? 0,
            emsS_SubSubjectName: row?.emsS_SubSubjectName ?? '',
            emsS_SubSubjectCode: row?.emsS_SubSubjectCode ?? '',
            emsS_Order: row?.emsS_Order ?? 1,
            emsS_ActiveFlag: row?.emsS_ActiveFlag ?? true
        }
    });

    useEffect(() => {
        if (row) {
            reset({
                emsS_Id: row.emsS_Id,
                mI_Id: row.mI_Id,
                emsS_SubSubjectName: row.emsS_SubSubjectName,
                emsS_SubSubjectCode: row.emsS_SubSubjectCode,
                emsS_Order: row.emsS_Order,
                emsS_ActiveFlag: row.emsS_ActiveFlag
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Do NOT use hidden input for boolean; pass it directly
            const payload = {
                emsS_Id: data.emsS_Id,
                mI_Id: data.mI_Id,
                emsS_SubSubjectName: data.emsS_SubSubjectName,
                emsS_SubSubjectCode: data.emsS_SubSubjectCode,
                emsS_Order: data.emsS_Order ?? 1,
                emsS_ActiveFlag: row?.emsS_ActiveFlag ?? true // keep existing value
            };

            const response = await addOrUpdateMasterSubSubject(payload);

            if (response.success) {
                toast.success(response.message || 'Sub Subject updated successfully');
                refetchAll();
                reset(payload);
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Sub Subject');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => reset();
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300)
        return () => clearTimeout(timer);
    }, [row])

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                <p className='text-muted-foreground text-sm'>Loading data...</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Sub Subject Name & Code */}
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

                {errors.root && <FormError>{errors.root.message}</FormError>}

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
                            Update Sub Subject
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
