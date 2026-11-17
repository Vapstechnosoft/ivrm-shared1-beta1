'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearDropdown, useMasterFeeYearlyRebateSettingFacade } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { YearlyRebateSettingsSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterYearlyRebateSettingsFacade } from '@/server/fees/masters/feeyearlyrebatesettingfacade';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar, Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof YearlyRebateSettingsSchema.addOrUpdate>;

export default function AddMasterYearlyRebateSetting({ onSuccess }: { onSuccess?: () => void } = {}) {
    const { data: academicYearOptions } = useAcademicYearDropdown();

    const { refetchAll } = useMasterFeeYearlyRebateSettingFacade();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        getValues,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        mode: 'onChange',
        resolver: zodResolver(YearlyRebateSettingsSchema.addOrUpdate),
        defaultValues: {
            asmaY_Id: '',
            fyrebseT_RebateTypeFlg: undefined,
            fyrebseT_Id: '',
            fyrebseT_RebateAmtOrPercentValue: 0,
            fyrebseT_RebateDate: ''
        }
    });

    // const handleReset = () => {
    //     reset({
    //         asmaY_Id: '',
    //         fyrebseT_Id: '',
    //         fyrebseT_RebateTypeFlg: undefined,
    //         fyrebseT_RebateAmtOrPercentValue: 0,
    //         fyrebseT_RebateDate: ''
    //     });
    //      setTimeout(() => {
    //     setValue('asmaY_Id', '');
    //     setValue('fyrebseT_Id', '');
    // }, 0);
    // };
    const handleReset = () => {
        console.log('Before reset - current values:', getValues());

        const defaultValues = {
            asmaY_Id: '',
            fyrebseT_Id: '',
            fyrebseT_RebateTypeFlg: undefined,
            fyrebseT_RebateAmtOrPercentValue: 0,
            fyrebseT_RebateDate: ''
        };

        reset(defaultValues, {
            keepErrors: false,
            keepDirty: false,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false
        });

        console.log('After reset - form values:', getValues());
        console.log('After reset - rebateType field:', getValues('fyrebseT_Id'));
    };

    const rebateId = watch('fyrebseT_Id');

    const onSubmit = async (data: FormFields) => {
        try {
            const selectedAcademicYear = academicYearOptions?.data?.find((year) => year.asmaY_Id.toString() === data.asmaY_Id);

            if (!selectedAcademicYear) {
                toast.error('Please select a valid Academic Year');
                return;
            }

            const asmaY_Id = Number(selectedAcademicYear.asmaY_Id);
            if (Number.isNaN(asmaY_Id)) {
                toast.error('Invalid Academic Year value');
                return;
            }

            if (data.fyrebseT_Id === undefined) {
                toast.error('Please select a Rebate Type');
                return;
            }

            const rebateValue = Number(data.fyrebseT_RebateAmtOrPercentValue);
            if (Number.isNaN(rebateValue) || rebateValue <= 0) {
                toast.error('Please enter a valid rebate value greater than 0');
                return;
            }

            if (!data.fyrebseT_RebateDate) {
                toast.error('Please select a Rebate Date');
                return;
            }

            const payload = {
                fyrebseT_Id: Number(data.fyrebseT_Id),
                mI_Id: 30,
                asmaY_Id,
                fyrebseT_RebateTypeFlg: data.fyrebseT_RebateTypeFlg,
                fyrebseT_RebateAmtOrPercentValue: rebateValue,
                fyrebseT_RebateDate: data.fyrebseT_RebateDate,
                fyrebseT_ActiveId: true
            };

            const response = await addOrUpdateMasterYearlyRebateSettingsFacade(payload);

            if (response?.success) {
                toast.success(response.message || 'Rebate settings saved successfully!');
                reset();
                onSuccess?.();
                refetchAll();
            } else {
                toast.error(response?.message || 'Failed to save rebate settings');
            }
        } catch (_err) {
            toast.error('Something went wrong while saving.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2'>
                <Controller
                    name='asmaY_Id'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <label htmlFor='academicYear' className='mb-1 font-medium text-gray-700 text-sm'>
                                Academic Year <span className='text-red-500'>*</span>
                            </label>
                            <Select onValueChange={field.onChange} value={field.value || ''} key={field.value}>
                                <SelectTrigger id='academicYear' className={cn(errors.asmaY_Id ? 'border-red-500' : '')}>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYearOptions?.data?.length ? (
                                        academicYearOptions.data.map((year) => (
                                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                {year.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='px-2 py-1 text-gray-500 text-sm'>No academic years available</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>
                    )}
                />

                <Controller
                    name='fyrebseT_Id'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <Label htmlFor='rebateType' className='mb-1 font-medium text-gray-700 text-sm'>
                                Rebate Type <span className='text-red-500'>*</span>
                            </Label>

                            <Select
                                key={field.value || 'empty'}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValue('fyrebseT_RebateTypeFlg', value === '0' ? 'A' : 'P');
                                }}
                                value={field.value || ''}>
                                <SelectTrigger className={cn(errors.fyrebseT_Id ? 'border-red-500' : '')}>
                                    <SelectValue placeholder='Select Type' />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='0'>Amount</SelectItem>
                                    <SelectItem value='1'>Percentage</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.fyrebseT_Id && <FormError>{errors.fyrebseT_Id.message}</FormError>}
                        </div>
                    )}
                />
            </div>

            {/* Rebate Value & Rebate Date */}
            <div className='grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2'>
                <Controller
                    name='fyrebseT_RebateAmtOrPercentValue'
                    control={control}
                    render={({ field }) => (
                        <div className='flex flex-col'>
                            <label htmlFor='rebateValue' className='mb-1 font-medium text-gray-700 text-sm'>
                                {rebateId === '1' ? 'Percentage (%)' : 'Amount'} <span className='text-red-500'>*</span>
                            </label>
                            <Input
                                id='rebateValue'
                                type='text'
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                        field.onChange(value);
                                    }
                                }}
                                placeholder={rebateId === '1' ? 'Enter percentage' : 'Enter amount'}
                                disabled={!rebateId}
                                className={cn(
                                    errors.fyrebseT_RebateAmtOrPercentValue ? 'border-red-500' : '',
                                    !rebateId ? 'cursor-not-allowed opacity-50' : ''
                                )}
                            />
                            {errors.fyrebseT_RebateAmtOrPercentValue && (
                                <FormError>{errors.fyrebseT_RebateAmtOrPercentValue.message}</FormError>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name='fyrebseT_RebateDate'
                    control={control}
                    render={({ field }) => {
                        const selectedDate = field.value ? new Date(field.value) : undefined;
                        return (
                            <div className='flex flex-col'>
                                <label htmlFor='rebateDate' className='mb-1 font-medium text-gray-700 text-sm'>
                                    Rebate Date <span className='text-red-500'>*</span>
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            className={cn(
                                                'justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground',
                                                errors.fyrebseT_RebateDate ? 'border-red-500' : ''
                                            )}>
                                            <Calendar className='mr-2 h-4 w-4' />
                                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <CalendarPicker
                                            mode='single'
                                            selected={selectedDate}
                                            onSelect={(d) => field.onChange(d ? format(d as Date, 'yyyy-MM-dd') : '')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.fyrebseT_RebateDate && <FormError>{errors.fyrebseT_RebateDate.message}</FormError>}
                            </div>
                        );
                    }}
                />
            </div>

            {/* Buttons */}
            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                <Button
                    type='button'
                    variant='outline'
                    // onClick={() => reset()}
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                    Reset
                </Button>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                    <Save className='mr-2 h-4 w-4' />
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
