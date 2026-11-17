'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useShiftSettingMaster } from '@/hooks/hrms/attendance-management/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateShiftSettingMaster } from '@/server/hrms/attendance-management/masters/shift-setting-master';
import type { IMasterShiftSettingList } from '@/types/hrms/attendance-management/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ShiftTimingFields } from '../../_components/shift-timing-fields';

type FormFields = z.infer<typeof hrmsMasterSchemas.shiftSettingMaster.update>;

interface UpdateShiftSettingMasterFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterShiftSettingList;
}

export default function UpdateShiftSettingMasterForm({ onSuccess, className = '', selectedRow: row }: UpdateShiftSettingMasterFormProps) {
    const { refetchAll } = useShiftSettingMaster();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.shiftSettingMaster.update),
        mode: 'onChange'
    });

    // Pre-fill form with selected row data
    useEffect(() => {
        if (row) {
            reset({
                fomsT_Id: row.FOMST_Id,
                foms_ShiftName: row.FOMS_ShiftName,
                fomsT_IHalfLoginTime: row.FOMST_IHalfLoginTime, // Shift Start Time
                fomsT_IIHalfLogoutTime: row.FOMST_IIHalfLogoutTime, // Shift End Time
                fomsT_IHalfLogoutTime: row.FOMST_IHalfLogoutTime, // Lunch start time
                fomsT_IIHalfLoginTime: row.FOMST_IIHalfLoginTime, // Lunch End time
                fomsT_FDWHrMin: row.FOMST_FDWHrMin, // Total working hours per shift
                fomsT_HDWHrMin: row.FOMST_HDWHrMin, // Half day working hours per shift
                fomsT_LunchHoursDuration: row.FOMST_LunchHoursDuration, // Lunch Hours
                fomsT_DelayPerShiftHrMin: row.FOMST_DelayPerShiftHrMin, // Delay per shift
                fomsT_EarlyPerShiftHrMin: row.FOMST_EarlyPerShiftHrMin // Early per shift
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Sample payload structure following project architecture
            // Note: mI_Id is handled by JWT, not included in request body
            // Map lowercase form field names to uppercase API field names
            const payload = {
                FOMST_Id: row.FOMST_Id,
                FOMS_ShiftName: data.foms_ShiftName?.trim(),
                FOMST_IHalfLoginTime: data.fomsT_IHalfLoginTime, // Shift Start Time
                FOMST_IIHalfLogoutTime: data.fomsT_IIHalfLogoutTime, // Shift End Time
                FOMST_IHalfLogoutTime: data.fomsT_IHalfLogoutTime, // Lunch start time
                FOMST_IIHalfLoginTime: data.fomsT_IIHalfLoginTime, // Lunch End time
                FOMST_FDWHrMin: data.fomsT_FDWHrMin, // Total working hours per shift
                FOMST_HDWHrMin: data.fomsT_HDWHrMin, // Half day working hours per shift
                FOMST_LunchHoursDuration: data.fomsT_LunchHoursDuration, // Lunch Hours
                FOMST_DelayPerShiftHrMin: data.fomsT_DelayPerShiftHrMin, // Delay per shift
                FOMST_EarlyPerShiftHrMin: data.fomsT_EarlyPerShiftHrMin, // Early per shift
                FOMST_BlockAttendance: '0',
                FOMST_FixTimings: '0'
            };

            const response = await addOrUpdateShiftSettingMaster(payload);

            if (response?.success) {
                toast.success('Shift setting updated successfully!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update shift setting');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update shift setting');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Shift Name'
                            required
                            id='foms_ShiftName'
                            placeholder='Enter shift name'
                            maxLength={100}
                            {...register('foms_ShiftName')}
                            error={errors.foms_ShiftName?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Shift Timing Fields */}
                    <ShiftTimingFields
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        fieldNames={{
                            shiftStartTime: 'fomsT_IHalfLoginTime',
                            shiftEndTime: 'fomsT_IIHalfLogoutTime',
                            totalWorkingHours: 'fomsT_FDWHrMin',
                            lunchStartTime: 'fomsT_IHalfLogoutTime',
                            lunchEndTime: 'fomsT_IIHalfLoginTime',
                            lunchHours: 'fomsT_LunchHoursDuration',
                            earlyPerShift: 'fomsT_EarlyPerShiftHrMin',
                            delayPerShift: 'fomsT_DelayPerShiftHrMin',
                            halfDayWorkingHours: 'fomsT_HDWHrMin'
                        }}
                    />

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
                            Save Shift Setting
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
