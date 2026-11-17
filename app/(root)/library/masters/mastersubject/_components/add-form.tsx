'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useMasterSubject } from '@/hooks/library/useMasters';
import { parentsubjectdropdowndata } from '@/hooks/library/useMasters';
import { masterSubjectSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterSubject } from '@/server/library/masters/master_subject';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectSchema.addOrUpdate>;

interface AddMasterSubjectFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterSubjectForm({ onSuccess, className = '' }: AddMasterSubjectFormProps) {
    //const { refetchAll: refetchMasterCasteCategoryCode } = useMasterSubject();

    const { refetchAll } = useMasterSubject();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectSchema.addOrUpdate),
        mode: 'onChange'
    });

    const { data: category, isLoading: categoryLoading, error: categoryError, refetchAll: refetchcategory } = parentsubjectdropdowndata();

    //console.log('Category Data:', category);

    // const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
    //     try {
    //         console.log('FORM DATA:', data);
    //         console.log('onclick:');
    //         const { ismS_SubjectName, lmS_ParentId, lmS_Level, lmS_SubjectNo, lmS_ClassNo } = data;
    //         const payload = {
    //             lmS_Id: 0,
    //             ismS_SubjectName: ismS_SubjectName,
    //             lmS_ActiveFlg: true,
    //             lmS_ParentId: lmS_ParentId,
    //             lmS_Level: lmS_Level,
    //             lmS_SubjectNo: lmS_SubjectNo,
    //             lmS_ClassNo: lmS_ClassNo
    //         };

    //         console.log('Payload:', payload);

    //         const response = await addOrUpdateMasterSubject(payload);

    //         if (response.success) {
    //             toast.success(response.message);
    //             reset();
    //             //refetchMasterCasteCategoryCode();
    //             refetchAll();
    //             onSuccess?.();
    //         } else {
    //             toast.error(response.message);
    //         }
    //     } catch (error: any) {
    //         toast.error(error.message);
    //     }
    // };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('FORM DATA:', data);

            const payload = {
                lmS_Id: 0,
                lmS_ActiveFlg: true,
                lmS_ParentId: data.lmS_ParentId,
                lmS_SubjectName: data.ismS_SubjectName,
                lmS_Level: data.lmS_Level,
                lmS_SubjectNo: data.lmS_SubjectNo,
                lmS_ClassNo: data.lmS_ClassNo
            };

            console.log('PAYLOAD:', payload);

            const response = await addOrUpdateMasterSubject(payload);

            if (response?.success) {
                toast.success(response.message || 'Subject saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save subject');
            }
        } catch (error: any) {
            console.error('Submit Error:', error);
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        reset();
        refetchcategory();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 '>
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='lmS_ParentId' className='whitespace-nowrap font-medium'>
                                Parent Subject <span className='ml-1 text-red-500'>*</span>:
                            </Label>
                            <div className='w-100'>
                                <Controller
                                    name='lmS_ParentId'
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value?.toString() || ''}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Parent Subject' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading Parent Subject...
                                                    </SelectItem>
                                                ) : categoryError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Parent Subjects
                                                    </SelectItem>
                                                ) : (
                                                    category?.data?.map((item) => (
                                                        <SelectItem key={item.ismS_Id} value={item.ismS_Id.toString()}>
                                                            {item.ismS_SubjectName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.lmS_ParentId && <FormError className='ml-2'>{errors.lmS_ParentId.message}</FormError>}
                            </div>
                        </div>

                        <InputText
                            label='Sub-Subject :'
                            required
                            placeholder='Enter Sub Subject'
                            {...register('ismS_SubjectName', {})}
                            error={errors.ismS_SubjectName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>
                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Level'
                            {...register('lmS_Level', {
                                pattern: {
                                    value: /^\d{1,30}$/,
                                    message: 'Only numbers allowed'
                                }
                            })}
                        />
                        <InputText
                            label='Subject No :'
                            placeholder='Enter subject no'
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
                            label='Class No '
                            id='lmS_ClassNo'
                            placeholder='Enter Class No'
                            {...register('lmS_ClassNo', {
                                required: 'Subject Name is required',
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
                            Save Master Subject
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
