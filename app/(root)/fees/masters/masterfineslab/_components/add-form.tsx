'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';

import { useMasterFineSlab } from '@/hooks/fees/useMasters';
import { fineslabSchema } from '@/schemas/fees/masters';
import { addOrUpdateFineSlab } from '@/server/fees/masters/fineSlab';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormFields = z.infer<typeof fineslabSchema.addOrUpdate>;

interface AddFineSlabProps {
    onSuccess?: () => void;
    fineslab?: string;
}

export default function AddFineSlabForm({ onSuccess, fineslab = '' }: AddFineSlabProps) {
    const { refetchAll } = useMasterFineSlab();

    const {
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(fineslabSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fmfS_Id: 0,
            fmfS_FineType: undefined
        }
    });

    const fineType = watch('fmfS_FineType');

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { fmfS_FineType, fmfS_Id, fmfS_FromDay, fmfS_ToDay, fmfS_ECSFlag } = data;

            const payload = {
                //   mi_id: 30,
                fmfS_FineType,
                fmfS_Id,
                fmfS_FromDay,
                fmfS_ToDay: fineType === 'Between' ? fmfS_ToDay : 0,
                fmfS_ECSFlag,
                fmfS_ActiveFlag: true
            };

            const response = await addOrUpdateFineSlab(payload);
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
        reset({
            fmfS_Id: 0,
            fmfS_FineType: undefined,
            fmfS_FromDay: 0,
            fmfS_ToDay: 0,
            fmfS_ECSFlag: '0'
        });
    };

    return (
        <div className={`${fineslab}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                <div className='w-full max-w-md'>
                    <div className='flex flex-col items-center gap-1.5'>
                        <Label htmlFor='fmfS_FineType' className='text-center'>
                            Fine Slab Type<span className='ml-1 text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='fmfS_FineType'
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                    <SelectTrigger className='w-full text-center'>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent className='text-center'>
                                        <SelectItem key='Between' value='Between'>
                                            Between
                                        </SelectItem>
                                        <SelectItem key='GreaterThan' value='GreaterThan'>
                                            Greater Than
                                        </SelectItem>
                                        <SelectItem key='LessThan' value='LessThan'>
                                            Less Than
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmfS_FineType && <FormError>{errors.fmfS_FineType.message}</FormError>}
                    </div>
                </div>

                {(fineType === 'Between' || fineType === 'GreaterThan' || fineType === 'LessThan') && (
                    <div className='w-full max-w-md'>
                        <div className='flex flex-col items-center gap-1.5'>
                            <Controller
                                name='fmfS_FromDay'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='From Day'
                                        required
                                        id='fmfS_FromDay'
                                        value={field.value || 0}
                                        onChange={field.onChange}
                                        minValue={0}
                                    />
                                )}
                            />
                            {errors.fmfS_FromDay && <FormError>{errors.fmfS_FromDay.message}</FormError>}
                        </div>
                    </div>
                )}

                {fineType === 'Between' && (
                    <div className='w-full max-w-md'>
                        <div className='flex flex-col items-center gap-1.5'>
                            <Controller
                                name='fmfS_ToDay'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='To Day'
                                        required
                                        id='fmfS_ToDay'
                                        value={field.value || 0}
                                        onChange={field.onChange}
                                        minValue={0}
                                    />
                                )}
                            />
                            {errors.fmfS_ToDay && <FormError>{errors.fmfS_ToDay.message}</FormError>}
                        </div>
                    </div>
                )}

                <div className='group flex flex-col gap-1.5'>
                    <div className='group flex flex-row gap-6'>
                        <Controller
                            name='fmfS_ECSFlag'
                            control={control}
                            defaultValue='0'
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value === 'E'}
                                        onCheckedChange={(checked) => field.onChange(checked ? 'E' : 'R')}
                                        id='fmfS_ECSFlag'
                                    />
                                    <Label htmlFor='fmfS_ECSFlag'>ECS Flag</Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

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
                            Save Fine Slab
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
