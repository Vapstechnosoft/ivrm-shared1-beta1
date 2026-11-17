'use client';

import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AttendanceDetailsSchema } from '@/schemas/student-portal/masters/attendance-details.schema';
import type { IAttendanceYear } from '@/types/student-portal/masters/attendance-details';
import { Controller, useFormContext } from 'react-hook-form';

interface AttendanceFilterProps {
    yearList: IAttendanceYear[];
    onYearChange: (value: string) => void;
}

export function AttendanceFilter({ yearList, onYearChange }: AttendanceFilterProps) {
    const {
        control,
        formState: { errors }
    } = useFormContext<AttendanceDetailsSchema>();

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-center gap-4'>
                <Label className='w-1/3 text-right'>
                    Academic Year :<span className='text-red-500'>*</span>
                </Label>
                <div className='flex w-2/3 flex-col gap-1'>
                    <Controller
                        control={control}
                        name='asmaY_Id'
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onYearChange(value);
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearList.map((year) => (
                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                </div>
            </div>
        </div>
    );
}
