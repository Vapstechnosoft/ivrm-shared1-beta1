'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterLanguage } from '@/hooks/library/useMasters';
import { masterLanguageSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterLanguage } from '@/server/library/masters/master_language';
import type { IMasterLanguageList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterLanguageSchema.addOrUpdate>;

interface UpdateMasterLanguageFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterLanguageList;
}

export default function UpdateMasterLanguageForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterLanguageFormProps) {
    const { refetchAll } = useMasterLanguage();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterLanguageSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                lmL_Id: row.lmL_Id,
                lmL_LanguageName: row.lmL_LanguageName
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmL_LanguageName } = data;

            const payload = {
                lmL_Id: row.lmL_Id,
                lmL_LanguageName: lmL_LanguageName
            };

            const response = await addOrUpdateMasterLanguage(payload);

            if (response.success) {
                toast.success(response.message || 'Master Language updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Master Language');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Language Name'
                            required
                            id='lmL_LanguageName'
                            {...register('lmL_LanguageName', {
                                required: 'Language Name is required',
                                pattern: {
                                    value: /^[A-Za-z ]+$/,
                                    message: 'Only letters and spaces allowed'
                                }
                            })}
                            error={errors.lmL_LanguageName?.message}
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
                            Update Master Language
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
