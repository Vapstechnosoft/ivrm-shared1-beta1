'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterTerms } from '@/hooks/fees/useMasters';
import { masterTermsSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTerm } from '@/server/fees/masters/feemasterterms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermsSchema.addOrUpdate>;

interface AddFeeTermsProps {
    onSuccess?: () => void;
    feeterms?: string;
}

export default function AddAddFeeTermsForm({ onSuccess, feeterms = '' }: AddFeeTermsProps) {
    const { refetchAll } = useMasterTerms();

    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmT_Id: 0
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { fmT_Name, fmT_IncludeArrearFeeFlg } = data;

            const payload = {
                // mi_id: 30,
                fmT_Name,
                fmT_IncludeArrearFeeFlg,
                fmfS_ActiveFlag: true
            };

            const response = await addOrUpdateFeeTerm(payload);
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

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${feeterms}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                {/* <div className='flex items-center space-x-2'>
                    <InputText
                        label='Term Name'
                        required
                        id='fmT_Name'
                        {...register('fmT_Name')}
                        error={errors.fmT_Name?.message}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                </div> */}

                {/* <div className='flex items-center space-x-2'>
                    <InputText
                        label='Term Name'
                        required
                        id='fmT_Name'
                        {...register('fmT_Name', {
                            onChange: (e) => {
                                
                                e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                            }
                        })}
                        error={errors.fmT_Name?.message}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                </div> */}
                {/* <div className='flex items-center space-x-2'>
                    <InputText
                        label='Term Name'
                        required
                        id='fmT_Name'
                        {...register('fmT_Name', {
                            required: 'Term Name is required',
                            validate: (value) => {
                                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                                    return 'Only letters and numbers allowed (no spaces)';
                                }
                                return true;
                            },
                            onChange: (e) => {
                               
                                e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                            }
                        })}
                        error={errors.fmT_Name?.message}
                        className='transition-colors focus:ring-2 focus:ring-primary/20'
                    />
                </div> */}

                <div className='flex items-center space-x-3'>
                    <label htmlFor='fmT_Name' className='w-32 text-right font-medium'>
                        Term Name<span className='text-red-500'>*</span>:
                    </label>

                    <div className='flex-1'>
                        {/* <InputText
                            id='fmT_Name'
                            {...register('fmT_Name', {
                                required: 'Term Name is required',
                                validate: (value) => {
                                    if (!/^[a-zA-Z0-9]+$/.test(value)) {
                                        return 'Only letters and numbers allowed (no spaces)';
                                    }
                                    return true;
                                },
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                }
                            })}
                            error={errors.fmT_Name?.message}
                            className='w-full rounded-none border-0 border-gray-300 px-0 py-1 focus:border-primary focus:ring-0'
                        /> */}
                        <InputText
                            //label='Term Name'
                            required
                            id='fmT_Name'
                            {...register('fmT_Name')}
                            error={errors.fmT_Name?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>
                </div>

                <Controller
                    name='fmT_IncludeArrearFeeFlg'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <div className='flex items-center space-x-2'>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked: boolean) => {
                                    field.onChange(checked);
                                }}
                                id='fmT_IncludeArrearFeeFlg'
                            />
                            <Label htmlFor='fmT_IncludeArrearFeeFlg'>Arrear Term</Label>
                        </div>
                    )}
                />
                <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='transition-all duration-200 hover:scale-105'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='transition-all duration-200 hover:scale-105'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Fee Terms
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
