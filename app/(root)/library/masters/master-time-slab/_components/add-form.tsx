'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMasterTimeSlab } from '@/hooks/library/useMasters';
import { masterTimeSlabSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterTimeSlab } from '@/server/library/masters/time-slab';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTimeSlabSchema.addOrUpdate>;

interface AddMasterTimeSlabFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterTimeSlabForm({ onSuccess, className = '' }: AddMasterTimeSlabFormProps) {
    const { refetchAll } = useMasterTimeSlab();

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTimeSlabSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            lfsE_Id: 0,
            lfsE_UserType: '',
            lfsE_SlabTypeFlg: '',
            lfsE_PerDayFlg: 0,
            lfsE_FromDay: 0,
            lfsE_ToDay: 0,
            lfsE_Amount: 0
        }
    });

    const slabType = watch('lfsE_SlabTypeFlg');

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                lfsE_ActiveFlg: true,
                lfsE_Id: 0
            };

            const response = await addOrUpdateMasterTimeSlab(payload);

            if (response.success) {
                toast.success(response.message || 'Record Saved Successfully!!!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Record Not Saved Successfully!!!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <div className='space-y-2'>
                        <Label>User Type <span className='text-destructive'>*</span></Label>
                        <Controller
                            control={control}
                            name='lfsE_UserType'
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='STUDENT'>STUDENT</SelectItem>
                                        <SelectItem value='STAFF'>STAFF</SelectItem>
                                        <SelectItem value='DEPARTMENT'>DEPARTMENT</SelectItem>
                                        <SelectItem value='GUEST'>GUEST</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.lfsE_UserType && <p className='text-destructive text-sm'>{errors.lfsE_UserType.message}</p>}
                    </div>

                    <div className='space-y-2'>
                        <Label>Slab Type <span className='text-destructive'>*</span></Label>
                        <Controller
                            control={control}
                            name='lfsE_SlabTypeFlg'
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='--Select--' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='BETWEEN'>BETWEEN</SelectItem>
                                        <SelectItem value='GREATER'>GREATER</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.lfsE_SlabTypeFlg && <p className='text-destructive text-sm'>{errors.lfsE_SlabTypeFlg.message}</p>}
                    </div>

                    <div className='flex items-center space-x-2 pt-8'>
                        <Controller
                            control={control}
                            name='lfsE_PerDayFlg'
                            render={({ field }) => (
                                <Checkbox
                                    id='perDay'
                                    checked={field.value === 1}
                                    onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                                />
                            )}
                        />
                        <Label htmlFor='perDay' className='font-normal'>Per Day</Label>
                    </div>

                    <InputText
                        label='From Day'
                        type='number'
                        required
                        {...register('lfsE_FromDay')}
                        error={errors.lfsE_FromDay?.message}
                    />

                    {slabType === 'BETWEEN' && (
                        <InputText
                            label='To Day'
                            type='number'
                            required
                            {...register('lfsE_ToDay')}
                            error={errors.lfsE_ToDay?.message}
                        />
                    )}

                    <InputText
                        label='Amount'
                        type='number'
                        step='0.01'
                        required
                        {...register('lfsE_Amount')}
                        error={errors.lfsE_Amount?.message}
                    />
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
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
