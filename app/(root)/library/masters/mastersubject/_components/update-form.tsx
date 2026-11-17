'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSubject } from '@/hooks/library/useMasters';
import { masterSubjectSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterSubject } from '@/server/library/masters/master_subject';
import type { IMasterSubjectList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectSchema.addOrUpdate>;

interface UpdateMasterSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSubjectList;
}

export default function UpdateMasterLibraryForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterSubjectFormProps) {
    const { refetchAll } = useMasterSubject();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                lmS_Id: row.lmS_Id,
                lmS_SubjectName: row.lmS_SubjectName,
                lmS_Level: row.lmS_Level,
                lmS_SubjectNo: row.lmS_SubjectNo,
                lmS_ClassNo: row.lmS_ClassNo
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { lmS_SubjectName, lmS_Level, lmS_SubjectNo, lmS_ClassNo } = data;

            const payload = {
                mI_Id: 30,
                lmS_Id: row.lmS_Id,
                lmS_SubjectName: lmS_SubjectName,
                lmS_Level: lmS_Level,
                lmS_SubjectNo: lmS_SubjectNo,
                lmS_ClassNo: lmS_ClassNo
            };

            const response = await addOrUpdateMasterSubject(payload);

            if (response.success) {
                toast.success(response.message || 'Master Library updated successfully');
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update Master Library');
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
                            label='Subject Name'
                            required
                            id='ismS_Id'
                            {...register('ismS_Id', {})}
                            error={errors.ismS_Id?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Sub-Subject :'
                            required
                            id='lmS_SubjectName'
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmS_SubjectName', {})}
                            error={errors.lmS_SubjectName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Level :'
                            required
                            id='lmS_Level'
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmS_Level', {
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Only letters allowed'
                                }
                            })}
                            error={errors.lmS_Level?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Subject No :'
                            required
                            id='lmS_SubjectNo'
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmS_SubjectNo', {
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Only letters allowed'
                                }
                            })}
                            error={errors.lmS_SubjectNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Class No  :'
                            required
                            id='lmS_ClassNo'
                            onKeyDown={(e) => {
                                const allowed = /^[A-Za-z]$/;

                                if (e.key.length === 1 && !allowed.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            {...register('lmS_ClassNo', {
                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: 'Only letters allowed'
                                }
                            })}
                            error={errors.lmS_ClassNo?.message}
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
                            Update Master Library
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
