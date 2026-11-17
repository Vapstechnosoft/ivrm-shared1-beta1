'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterTerms } from '@/hooks/fees/useMasters';
import { masterTermsSchema } from '@/schemas/fees/masters';
import { addOrUpdateFeeTerm } from '@/server/fees/masters/feemasterterms';
import type { IMasterTermsList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTermsSchema.addOrUpdate>;

interface UpdateFeeTermFormProps {
    onSuccess?: () => void;
    fineslab?: string;
    selectedRow: IMasterTermsList;
}

export default function UpdateFeeTermForm({ onSuccess, fineslab = '', selectedRow: row }: UpdateFeeTermFormProps) {
    const { refetchAll } = useMasterTerms();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTermsSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                fmT_Name: row.fmT_Name,
                fmT_Id: row.fmT_Id,
                fmT_ActiveFlag: row.fmT_ActiveFlag,
                fmT_IncludeArrearFeeFlg: row.fmT_IncludeArrearFeeFlg
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmT_Name, fmT_IncludeArrearFeeFlg } = data;
            const payload = {
                // mi_id: 30,
                fmT_Name: fmT_Name,
                fmT_Id: row.fmT_Id,
                fmT_IncludeArrearFeeFlg: fmT_IncludeArrearFeeFlg,
                fmT_ActiveFlag: row.fmT_ActiveFlag
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
        <div className={`${fineslab}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                {/* className='flex flex-col items-center space-y-4' */}
                {/* <div className='flex items-center space-x-4'>
                        <InputText
                            label='Term Name'
                            required
                            id='fmT_Name'
                         {...register('fmT_Name')}
                         error={errors.fmT_Name?.message}
                             className='w-full transition-colors focus:ring-2 focus:ring-primary/20'
                           
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

                {errors.root && <FormError>{errors.root.message}</FormError>}

                <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
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
