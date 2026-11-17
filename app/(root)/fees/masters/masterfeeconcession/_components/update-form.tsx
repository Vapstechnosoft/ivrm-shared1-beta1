'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterConcession } from '@/hooks/fees/useMasters';
import { masterConcessionSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterConcession } from '@/server/fees/masters/feemasterconcession';
import type { IMasterConcessionList } from '@/types/fees/masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionSchema.addOrUpdate>;

interface UpdateMasterConcessionFormProps {
    onSuccess?: () => void;
    fineslab?: string;
    selectedRow: IMasterConcessionList;
}

export default function UpdateMasterConcessionForm({ onSuccess, fineslab = '', selectedRow: row }: UpdateMasterConcessionFormProps) {
    const { refetchAll } = useMasterConcession();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                fmcC_Id: row.fmcC_Id,
                fmcC_ConcessionName: row.fmcC_ConcessionName,
                fmcC_ConcessionFlag: '',
                fmcC_ConcessionApplLimit: Number(row.fmcC_ConcessionApplLimit),
                fmcC_ActiveFlag: row.fmcC_ActiveFlag
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmcC_ConcessionName, fmcC_ConcessionApplLimit } = data;
            const payload = {
                // mI_Id: 30,
                fmcC_Id: row.fmcC_Id,
                fmcC_ConcessionName: fmcC_ConcessionName,
                fmcC_ConcessionApplLimit: fmcC_ConcessionApplLimit.toString()
                // fmcC_ConcessionFlag: '',
                // fmcC_ActiveFlag: row.fmcC_ActiveFlag
            };

            const payloaddata = console.log(JSON.stringify(payload));

            const response = await addOrUpdateMasterConcession(payload);

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
        <div className={`${fineslab}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                <div className='space-y-4'>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                            <InputText
                                label='Concession Name'
                                required
                                id='fmcC_ConcessionName'
                                {...register('fmcC_ConcessionName')}
                                error={errors.fmcC_ConcessionName?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                            />

                            {/* <InputText
                                label='Concession Name'
                                required
                                id='fmcC_ConcessionName'
                                {...register('fmcC_ConcessionName', {
                                    onChange: (e) => {
                                        // ✅ Allow only alphabets (no spaces, numbers, or special characters)
                                        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
                                    },
                                    validate: (value) => {
                                        if (!value.trim()) {
                                            return 'Concession Name is required';
                                        }
                                        return true;
                                    }
                                })}
                                error={errors.fmcC_ConcessionName?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
                            /> */}

                            <Controller
                                name='fmcC_ConcessionApplLimit'
                                control={control}
                                rules={{ required: 'Concession Limit is required' }}
                                render={({ field, fieldState }) => (
                                    <div>
                                        {/* <InputNumber
                                            label='Concession Limit'
                                            required
                                            id='fmcC_ConcessionApplLimit'
                                            value={field.value ?? 0}
                                            onChange={(value: number) => {
                                                field.onChange(value); // send number to RHF
                                            }}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        /> */}

                                        <InputNumber
                                            label='Concession Limit'
                                            required
                                            id='fmcC_ConcessionApplLimit'
                                            value={field.value ?? 0}
                                            onKeyDown={(e) => {
                                                if (e.key === '-') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onPaste={(e) => {
                                                const paste = e.clipboardData.getData('text');
                                                if (Number(paste) < 0) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(value: number) => {
                                                if (value < 0) {
                                                    field.onChange(0);
                                                } else {
                                                    field.onChange(value);
                                                }
                                            }}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                        {errors.fmcC_ConcessionApplLimit && (
                                            <FormError>{errors.fmcC_ConcessionApplLimit.message}</FormError>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='flex flex-col gap-3 pt-4 sm:flex-row sm:justify-start'>
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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
