'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterFineSlab } from '@/hooks/fees/useMasters';
import { fineslabSchema } from '@/schemas/fees/masters';
import { addOrUpdateFineSlab } from '@/server/fees/masters/fineSlab';
import type { IFineSlabList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { z } from 'zod';

type FormFields = z.infer<typeof fineslabSchema.addOrUpdate>;

interface UpdateFineSlabFormProps {
    onSuccess?: () => void;
    fineslab?: string;
    selectedRow: IFineSlabList;
}

export default function UpdateFineSlabForm({ onSuccess, fineslab = '', selectedRow: row }: UpdateFineSlabFormProps) {
    const { refetchAll } = useMasterFineSlab();

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(fineslabSchema.addOrUpdate),
        mode: 'onChange'
    });

    const fineType = watch('fmfS_FineType');

    useEffect(() => {
        if (row) {
            reset({
                fmfS_FineType: row.fmfS_FineType as 'Between' | 'GreaterThan' | 'LessThan',

                fmfS_Id: row.fmfS_Id,
                fmfS_FromDay: row.fmfS_FromDay,
                fmfS_ToDay: row.fmfS_ToDay,
                fmfS_ECSFlag: row.fmfS_ECSFlag,
                fmfS_ActiveFlag: row.fmfS_ActiveFlag
            });
        }
    }, [JSON.stringify(row)]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { fmfS_FineType, fmfS_Id, fmfS_FromDay, fmfS_ToDay, fmfS_ECSFlag, fmfS_ActiveFlag } = data;
            const payload = {
                // mi_id: 30,
                fmfS_FineType: fmfS_FineType,
                fmfS_Id: fmfS_Id,
                fmfS_FromDay: fmfS_FromDay,
                fmfS_ToDay: fmfS_ToDay,
                fmfS_ECSFlag: fmfS_ECSFlag,
                fmfS_ActiveFlag: fmfS_ActiveFlag
            };

            console.log('Payload to be sent:', JSON.stringify(payload));

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
        reset();
    };

    return (
        <div className={`${fineslab}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col items-center justify-center space-y-6'>
                <div className='w-full max-w-md space-y-4'>
                    <div className='w-full max-w-md'>
                        <div className='flex flex-col items-center gap-1.5'>
                            <Label htmlFor='fmfS_FineType' className='text-center'>
                                Fine Slab Type<span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='fmfS_FineType'
                                control={control}
                                defaultValue={row?.fmfS_FineType as 'Between' | 'GreaterThan' | 'LessThan'}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value ?? undefined} disabled>
                                        <SelectTrigger className='w-full text-center'>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent className='text-center'>
                                            <SelectItem value='Between'>Between</SelectItem>
                                            <SelectItem value='GreaterThan'>Greater Than</SelectItem>
                                            <SelectItem value='LessThan'>Less Than</SelectItem>
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
                        <div className='flex flex-row items-center justify-center gap-2'>
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

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

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
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
