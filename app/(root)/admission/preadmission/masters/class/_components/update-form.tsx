'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMasterClass } from '@/hooks/admission/preadmission/useMasters';
import { masterClassSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterClass } from '@/server/admission/preadmission/masters/class';
import type { IMasterClassList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassSchema.addOrUpdate>;

interface UpdateMasterClassFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterClassList;
}

export default function UpdateMasterClassForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterClassFormProps) {
    const { refetchAll } = useMasterClass();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                asmcl_id: row.asmcL_Id,
                asmcl_classcode: row.asmcL_ClassCode,
                asmcl_classname: row.asmcL_ClassName,
                asmcl_maxcapacity: row.asmcL_MaxCapacity,
                asmcl_order: row.asmcL_Order,
                asmcl_minageyear: row.asmcL_MinAgeYear,
                asmcl_minagemonth: row.asmcL_MinAgeMonth,
                asmcl_minagedays: row.asmcL_MinAgeDays,
                asmcl_maxageyear: row.asmcL_MaxAgeYear,
                asmcl_maxagemonth: row.asmcL_MaxAgeMonth,
                asmcl_maxagedays: row.asmcL_MaxAgeDays,
                asmcl_preadmflag: row.asmcL_PreadmFlag
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const {
                asmcl_classcode,
                asmcl_classname,
                asmcl_maxcapacity,
                asmcl_order,
                asmcl_minageyear,
                asmcl_minagemonth,
                asmcl_minagedays,
                asmcl_maxageyear,
                asmcl_maxagemonth,
                asmcl_maxagedays,
                asmcl_preadmflag
            } = data;
            const payload = {
                ASMCL_Id: row.asmcL_Id,
                ASMCL_ClassCode: asmcl_classcode,
                ASMCL_ClassName: asmcl_classname,
                ASMCL_MaxCapacity: asmcl_maxcapacity,
                ASMCL_Order: asmcl_order,
                ASMCL_MinAgeYear: asmcl_minageyear,
                ASMCL_MinAgeMonth: asmcl_minagemonth,
                ASMCL_MinAgeDays: asmcl_minagedays,
                ASMCL_MaxAgeYear: asmcl_maxageyear,
                ASMCL_MaxAgeMonth: asmcl_maxagemonth,
                ASMCL_MaxAgeDays: asmcl_maxagedays,
                ASMCL_PreadmFlag: asmcl_preadmflag,
                ASMCL_ActiveFlag: true
            };

            const response = await addOrUpdateMasterClass(payload);

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
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <InputText
                            label='Class Code'
                            required
                            id='asmcl_classcode'
                            {...register('asmcl_classcode')}
                            defaultValue={row.asmcL_ClassCode}
                            error={errors.asmcl_classcode?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Class Name'
                            required
                            id='asmcl_classname'
                            {...register('asmcl_classname')}
                            defaultValue={row.asmcL_ClassName}
                            error={errors.asmcl_classname?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_maxcapacity'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Max Capacity'
                                        required
                                        id='asmcl_maxcapacity'
                                        defaultValue={row.asmcL_MaxCapacity || 0}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_maxcapacity && <FormError>{errors.asmcl_maxcapacity.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_order'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Order'
                                        required
                                        id='asmcl_order'
                                        defaultValue={row.asmcL_Order}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_order && <FormError>{errors.asmcl_order.message}</FormError>}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_minageyear'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Min Age (Year)'
                                        required
                                        id='asmcl_minageyear'
                                        defaultValue={row.asmcL_MinAgeYear}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={100}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_minageyear && <FormError>{errors.asmcl_minageyear.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_minagemonth'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Min Age (Month)'
                                        required
                                        id='asmcl_minagemonth'
                                        defaultValue={row.asmcL_MinAgeMonth}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={11}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_minagemonth && <FormError>{errors.asmcl_minagemonth.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_minagedays'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Min Age (Days)'
                                        required
                                        id='asmcl_minagedays'
                                        defaultValue={row.asmcL_MinAgeDays}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={31}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_minagedays && <FormError>{errors.asmcl_minagedays.message}</FormError>}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_maxageyear'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Max Age (Year)'
                                        required
                                        id='asmcl_maxageyear'
                                        defaultValue={row.asmcL_MaxAgeYear}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={100}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_maxageyear && <FormError>{errors.asmcl_maxageyear.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_maxagemonth'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Max Age (Month)'
                                        required
                                        id='asmcl_maxagemonth'
                                        defaultValue={row.asmcL_MaxAgeMonth}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={11}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_maxagemonth && <FormError>{errors.asmcl_maxagemonth.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmcl_maxagedays'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Max Age (Days)'
                                        required
                                        id='asmcl_maxagedays'
                                        defaultValue={row.asmcL_MaxAgeDays}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        maxValue={31}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmcl_maxagedays && <FormError>{errors.asmcl_maxagedays.message}</FormError>}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Preadmission Class' htmlFor='asmcl_preadmflag'>
                                Preadmission Class <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <RadioGroup
                                defaultValue={String(row.asmcL_PreadmFlag)}
                                onValueChange={(value) => setValue('asmcl_preadmflag', Number(value))}
                                className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='1' id='yes' />
                                    <Label aria-label='Yes' htmlFor='yes'>
                                        Yes
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='0' id='no' />
                                    <Label aria-label='No' htmlFor='no'>
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
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
                            Save Master Class
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
