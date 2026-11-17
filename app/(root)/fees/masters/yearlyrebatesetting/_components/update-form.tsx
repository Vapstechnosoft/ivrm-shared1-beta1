'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FEES_QUERY_KEYS } from '@/constants/query-keys';
import { useAcademicYearDropdown, useMasterFeeYearlyRebateSettingFacade } from '@/hooks/fees/useMasters';
import { cn } from '@/lib/utils';
import { YearlyRebateSettingsSchema } from '@/schemas/fees/masters';
import { addOrUpdateMasterYearlyRebateSettingsFacade } from '@/server/fees/masters/feeyearlyrebatesettingfacade';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof YearlyRebateSettingsSchema.addOrUpdate>;

interface UpdateYearlyRebateSettingFormProps {
    onSuccess?: () => void;
    selectedRow: any;
}

export default function UpdateYearlyRebateSettingForm({ onSuccess, selectedRow }: UpdateYearlyRebateSettingFormProps) {
    const { refetchAll } = useMasterFeeYearlyRebateSettingFacade();

    const [isInitializing, setIsInitializing] = useState(false);
    const { data: academicYearOptions, isLoading: isAcademicYearLoading } = useAcademicYearDropdown();

    console.log('academicYearOptions:', academicYearOptions);
    const queryClient = useQueryClient();

    console.log('selectedRow in update form:', selectedRow);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        mode: 'onChange',
        resolver: zodResolver(YearlyRebateSettingsSchema.addOrUpdate),

        defaultValues: {
            asmaY_Id: selectedRow?.asmaY_Id?.toString() || '',
            fyrebseT_RebateTypeFlg:
                selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'A'
                    ? '0'
                    : selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'P'
                      ? '1'
                      : '',
            fyrebseT_Id:
                selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'A'
                    ? '0'
                    : selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'P'
                      ? '1'
                      : '',
            fyrebseT_RebateAmtOrPercentValue: selectedRow?.fyrebseT_RebateAmtOrPercentValue || 0,
            fyrebseT_RebateDate: selectedRow?.fyrebseT_RebateDate
        }
    });
    useEffect(() => {
        if (!selectedRow) return;
        setValue('asmaY_Id', selectedRow?.asmaY_Id?.toString() || '');
        setValue(
            'fyrebseT_RebateTypeFlg',
            selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'A' ? '0' : selectedRow?.fyrebseT_RebateTypeFlg.toString() === 'P' ? '1' : ''
        );
        setValue('fyrebseT_Id', selectedRow?.fyrebseT_Id?.toString() || undefined);
        setValue('fyrebseT_RebateAmtOrPercentValue', selectedRow?.fyrebseT_RebateAmtOrPercentValue || 0);
        setValue('fyrebseT_RebateDate', selectedRow?.fyrebseT_RebateDate);
    }, [selectedRow]);

    const rebateId = watch('fyrebseT_Id');

    useEffect(() => {
        const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';

        const rebateTypeFlg = selectedRow.fyrebseT_RebateTypeFlg;

        const rebateTypeId =
            rebateTypeFlg === 'A' || rebateTypeFlg === 'Amount' ? '0' : rebateTypeFlg === 'P' || rebateTypeFlg === 'Percentage' ? '1' : '';
        //setValue('fyrebseT_Id', rebateTypeId);

        const rawRebateValue = selectedRow.fyrebseT_RebateAmtOrPercentValue;
        const parsedRebateValue = typeof rawRebateValue === 'string' ? Number(rawRebateValue) : rawRebateValue;

        const rebateValue = Number.isFinite(parsedRebateValue) ? parsedRebateValue : 0;

        let rebateDate = '';
        if (selectedRow.fyrebseT_RebateDate) {
            try {
                const date = new Date(selectedRow.fyrebseT_RebateDate);
                if (!Number.isNaN(date.getTime())) {
                    rebateDate = format(date, 'yyyy-MM-dd');
                }
            } catch {}
        }

        const formValues = {
            asmaY_Id: academicYearId,
            fyrebseT_RebateTypeFlg: rebateTypeFlg === 'A' ? 'A' : 'P',
            fyrebseT_Id: rebateTypeId,
            fyrebseT_RebateAmtOrPercentValue: rebateValue,
            fyrebseT_RebateDate: rebateDate
        };

        setIsInitializing(true);
        reset(formValues);
        setTimeout(() => setIsInitializing(false), 50);
    }, [selectedRow]);

    const onSubmit = async (data: FormFields) => {
        try {
            let selectedAcademicYear = academicYearOptions?.data?.find((year) => year && year.asmaY_Id.toString() === data.asmaY_Id);

            if (!selectedAcademicYear && selectedRow?.asmaY_Id) {
                selectedAcademicYear = academicYearOptions?.data?.find((y) => String(y.asmaY_Id) === String(selectedRow.asmaY_Id));
            }

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

            const miIdFromRow = selectedRow.mI_Id ?? (selectedRow as any).mI_ID ?? (selectedRow as any).mi_id ?? 30;

            const payload = {
                fyrebseT_Id: Number(selectedRow.fyrebseT_Id),
                mI_Id: Number(miIdFromRow),
                asmaY_Id,
                fyrebseT_RebateTypeFlg: data.fyrebseT_RebateTypeFlg,
                fyrebseT_RebateAmtOrPercentValue: rebateValue,
                fyrebseT_RebateDate: data.fyrebseT_RebateDate,
                fyrebseT_ActiveId: selectedRow.fyrebseT_ActiveId ?? true
            };

            console.log('🔵 [DEBUG] Input Data:', payload);
            const response = await addOrUpdateMasterYearlyRebateSettingsFacade(payload);

            if (response?.success) {
                toast.success(response.message || 'Rebate settings updated successfully!');
                refetchAll();

                try {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === FEES_QUERY_KEYS.FEE_YEARLY_REBATE_SETTINGS
                    });
                } catch (_e) {
                    //ignore
                }

                reset();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update rebate settings');
            }
        } catch (_err) {
            toast.error('Something went wrong while updating.');
        }
    };

    const handleReset = () => {
        if (selectedRow) {
            const academicYearId = selectedRow.asmaY_Id?.toString() ?? '';
            let rebateTypeId: string | undefined;
            const rebateTypeFlg = selectedRow.fyrebseT_RebateTypeFlg;

            if (rebateTypeFlg === 'A' || rebateTypeFlg === 'Amount') {
                rebateTypeId = '0';
            } else if (rebateTypeFlg === 'P' || rebateTypeFlg === 'Percentage') {
                rebateTypeId = '1';
            }

            const rawRebateValue = selectedRow.fyrebseT_RebateAmtOrPercentValue;
            const parsedRebateValue = typeof rawRebateValue === 'string' ? Number(rawRebateValue) : rawRebateValue;
            const rebateValue = Number.isFinite(parsedRebateValue) ? parsedRebateValue : 0;

            let rebateDate = '';
            if (selectedRow.fyrebseT_RebateDate) {
                try {
                    const date = new Date(selectedRow.fyrebseT_RebateDate);
                    if (!Number.isNaN(date.getTime())) {
                        rebateDate = format(date, 'yyyy-MM-dd');
                    }
                } catch (_e) {
                    //ignore
                }
            }

            reset({
                asmaY_Id: academicYearId,
                fyrebseT_RebateTypeFlg: rebateTypeFlg === 'A' || rebateTypeFlg === 'Amount' ? 'A' : 'P',
                fyrebseT_Id: rebateTypeId,
                fyrebseT_RebateAmtOrPercentValue: rebateValue,
                fyrebseT_RebateDate: rebateDate
            });
        }
    };

    if (isAcademicYearLoading) {
        return <div className='p-4'>Loading form data...</div>;
    }

    return (
        <div className='p-4'>
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
                                <Select onValueChange={field.onChange} value={field.value} disabled={isAcademicYearLoading}>
                                    <SelectTrigger
                                        id='academicYear'
                                        className={cn('transition-colors', errors.asmaY_Id ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Academic Year'>
                                            {(() => {
                                                const v = field.value;
                                                if (v) {
                                                    if (academicYearOptions?.data && Array.isArray(academicYearOptions.data)) {
                                                        return (
                                                            academicYearOptions.data.find((year) => year.asmaY_Id.toString() === v)
                                                                ?.asmaY_Year ??
                                                            selectedRow?.asmaY_Year ??
                                                            v
                                                        );
                                                    }
                                                    return selectedRow?.asmaY_Year ?? v;
                                                }
                                                return selectedRow?.asmaY_Year ?? 'Select Academic Year';
                                            })()}
                                        </SelectValue>
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
                                {!isInitializing && errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
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
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setValue('fyrebseT_RebateTypeFlg', value === '0' ? 'A' : 'P');
                                    }}
                                    value={field.value}>
                                    <SelectTrigger className={cn('transition-colors', errors.fyrebseT_Id ? 'border-red-500' : '')}>
                                        <SelectValue placeholder='Select Type' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value='0'>Amount</SelectItem>
                                        <SelectItem value='1'>Percentage</SelectItem>
                                    </SelectContent>
                                </Select>

                                {!isInitializing && errors.fyrebseT_Id && <FormError>{errors.fyrebseT_Id.message}</FormError>}
                            </div>
                        )}
                    />
                </div>

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
                                        'transition-colors',
                                        errors.fyrebseT_RebateAmtOrPercentValue ? 'border-red-500' : '',
                                        !rebateId ? 'cursor-not-allowed opacity-50' : ''
                                    )}
                                />
                                {!isInitializing && errors.fyrebseT_RebateAmtOrPercentValue && (
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
                                                    'justify-start text-left font-normal transition-colors',
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
                                    {!isInitializing && errors.fyrebseT_RebateDate && (
                                        <FormError>{errors.fyrebseT_RebateDate.message}</FormError>
                                    )}
                                </div>
                            );
                        }}
                    />
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
                        disabled={isSubmitting || !academicYearOptions?.data}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                        <Save className='mr-2 h-4 w-4' />
                        {isSubmitting ? 'Updating...' : 'Update Rebate Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
