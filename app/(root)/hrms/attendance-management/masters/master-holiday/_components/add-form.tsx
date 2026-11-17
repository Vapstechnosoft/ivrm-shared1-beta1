'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateField } from '@/components/ui/dateField';
import { DaySelectionCheckbox } from '@/components/ui/day-selection-checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHolidayDatesForDays, useMasterHoliday } from '@/hooks/hrms/attendance-management/useMasters';
import { useMasterDepartment } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMasterHoliday } from '@/server/hrms/attendance-management/masters/master-holiday';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.masterHoliday.add>;

interface AddMasterHolidayFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterHolidayForm({ onSuccess, className = '' }: AddMasterHolidayFormProps) {
    const { refetchAll } = useMasterHoliday();
    const { data: departmentData } = useMasterDepartment();

    // Generate calendar years (current year - 10 to current year + 10)
    const calendarYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    }, []);

    // Get departments from API
    const departmentOptions = useMemo(() => {
        if (!departmentData?.data) return [];
        const data = Array.isArray(departmentData.data) ? departmentData.data : (departmentData.data as any)?.report_list || [];
        return data
            .filter((dept: { hrmD_ActiveFlag?: boolean }) => dept.hrmD_ActiveFlag)
            .map((dept: { hrmD_DepartmentName?: string; hrmD_Id?: number }) => ({
                label: dept.hrmD_DepartmentName || '',
                value: String(dept.hrmD_Id || '')
            }))
            .filter((dept: { label: string; value: string }) => dept.label && dept.value);
    }, [departmentData]);

    // Holiday types - placeholder, update when API is available
    const holidayTypeOptions = useMemo(() => {
        // Sample data - replace with actual API call when available
        return [
            { label: 'Public Holiday', value: 'PUBLIC_HOLIDAY' },
            { label: 'Week Day', value: 'WEEK_DAY' },
            { label: 'Festival', value: 'FESTIVAL' }
        ];
    }, []);

    // Holiday types that require Start Date, End Date, Holiday Name, and Remarks
    const holidayTypesRequiringDateFields = useMemo(() => ['PUBLIC_HOLIDAY'], []);

    const calendarYearId = useId();
    const departmentId = useId();
    const holidayTypeId = useId();
    const selectedDaysId = useId();
    const startDateId = useId();
    const endDateId = useId();
    const holidayNameId = useId();
    const remarksId = useId();

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.masterHoliday.add),
        mode: 'onChange',
        defaultValues: {
            calendarYear: '',
            fomhwD_Department: '',
            fomhwD_HolidayType: '',
            selectedDays: [],
            fomhwD_FromDate: '',
            fomhwD_ToDate: '',
            fomhwD_Name: '',
            fomhwD_Remarks: ''
        }
    });

    const calendarYear = watch('calendarYear');
    const holidayType = watch('fomhwD_HolidayType');
    const selectedDays = watch('selectedDays') || [];

    // Check if date fields should be shown
    const shouldShowDateFields = useMemo(() => {
        return holidayType && holidayTypesRequiringDateFields.includes(holidayType) && (!selectedDays || selectedDays.length === 0);
    }, [holidayType, selectedDays, holidayTypesRequiringDateFields]);

    // State to track selected rows in the table
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    // Call API when days are selected
    const { data: datesData, isLoading: isLoadingDates } = useHolidayDatesForDays(
        calendarYear && holidayType && selectedDays.length > 0
            ? {
                  calendarYear,
                  holidayType,
                  selectedDays
              }
            : undefined,
        true
    );

    // Parse dates from API response
    const holidayDates = useMemo(() => {
        if (!datesData?.data) return [];

        // Handle different response structures
        let data: any[] = [];
        if (Array.isArray(datesData.data)) {
            data = datesData.data;
        } else if ((datesData.data as any)?.report_list) {
            data = (datesData.data as any).report_list;
        } else if ((datesData.data as any)?.data) {
            data = Array.isArray((datesData.data as any).data) ? (datesData.data as any).data : [];
        }

        return data
            .filter((item: any) => item && (item.Date || item.date || item.Dayname || item.dayname))
            .map((item: { Date?: string; date?: string; Dayname?: string; dayname?: string; DayName?: string; dayName?: string }) => ({
                id: `${item.Date || item.date || ''}_${item.Dayname || item.dayname || item.DayName || item.dayName || ''}_${Math.random()}`,
                dayName: item.Dayname || item.dayname || item.DayName || item.dayName || '',
                date: item.Date || item.date || ''
            }))
            .filter((item: { dayName: string; date: string }) => item.dayName && item.date); // Only include items with both dayName and date
    }, [datesData]);

    // Handle select all checkbox
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(holidayDates.map((item: { id: string; dayName: string; date: string }) => item.id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    // Handle individual row checkbox
    const handleRowSelect = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);
    };

    // Reset selected rows when dates change
    useEffect(() => {
        setSelectedRows(new Set());
    }, [holidayDates]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Sample payload structure following project architecture
            // Note: mI_Id is handled by JWT, not included in request body
            const payload = {
                fomhwD_Id: 0, // 0 for add operation
                calendarYear: data.calendarYear || '',
                fomhwD_Department: data.fomhwD_Department || '',
                fomhwD_HolidayType: data.fomhwD_HolidayType || '',
                selectedDays: data.selectedDays || [],
                fomhwD_FromDate: data.fomhwD_FromDate || '',
                fomhwD_ToDate: data.fomhwD_ToDate || '',
                fomhwD_Name: data.fomhwD_Name || '',
                fomhwD_Remarks: data.fomhwD_Remarks || '',
                fomhwD_ActiveFlag: true
            };

            const response = await addOrUpdateMasterHoliday(payload);

            if (response?.success) {
                toast.success(response?.message || 'Master holiday saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save master holiday');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save master holiday');
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
                        {/* Calendar Year */}
                        <div className='space-y-2'>
                            <Label htmlFor={calendarYearId}>
                                Calendar year <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='calendarYear'
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id={calendarYearId} className={errors.calendarYear ? 'border-red-500' : ''}>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {calendarYears.map((year) => (
                                                <SelectItem key={year} value={String(year)}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.calendarYear && <FormError>{errors.calendarYear.message}</FormError>}
                        </div>

                        {/* Department */}
                        <div className='space-y-2'>
                            <Label htmlFor={departmentId}>Department</Label>
                            <Controller
                                name='fomhwD_Department'
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id={departmentId} className={errors.fomhwD_Department ? 'border-red-500' : ''}>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentOptions.map((dept: { label: string; value: string }) => (
                                                <SelectItem key={dept.value} value={dept.value}>
                                                    {dept.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fomhwD_Department && <FormError>{errors.fomhwD_Department.message}</FormError>}
                        </div>

                        {/* Holiday Type */}
                        <div className='space-y-2'>
                            <Label htmlFor={holidayTypeId}>
                                Holiday Type <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='fomhwD_HolidayType'
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id={holidayTypeId} className={errors.fomhwD_HolidayType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder='--Select--' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {holidayTypeOptions.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fomhwD_HolidayType && <FormError>{errors.fomhwD_HolidayType.message}</FormError>}
                        </div>

                        {/* Select Day */}
                        <div className='space-y-2'>
                            <Label htmlFor={selectedDaysId}>
                                Select Day <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='selectedDays'
                                control={control}
                                render={({ field }) => (
                                    <DaySelectionCheckbox
                                        id={selectedDaysId}
                                        label='Select Day'
                                        selectedDays={field.value || []}
                                        onDaysChange={(days) => {
                                            field.onChange(days);
                                            // Clear date fields when days are selected
                                            if (days.length > 0) {
                                                setValue('fomhwD_FromDate', '');
                                                setValue('fomhwD_ToDate', '');
                                                setValue('fomhwD_Name', '');
                                                setValue('fomhwD_Remarks', '');
                                            }
                                        }}
                                        checked={(field.value || []).length > 0}
                                    />
                                )}
                            />
                            {errors.selectedDays && <FormError>{errors.selectedDays.message}</FormError>}
                        </div>
                    </div>

                    {/* Conditional Fields: Start Date, End Date, Holiday Name, Remarks */}
                    {shouldShowDateFields && (
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {/* Start Date */}
                            <div className='space-y-2'>
                                <Label htmlFor={startDateId}>Start Date</Label>
                                <Controller
                                    name='fomhwD_FromDate'
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DateField field={field} fieldState={fieldState} label='' fromDate={new Date()} />
                                    )}
                                />
                                {errors.fomhwD_FromDate && <FormError>{errors.fomhwD_FromDate.message}</FormError>}
                            </div>

                            {/* End Date */}
                            <div className='space-y-2'>
                                <Label htmlFor={endDateId}>End Date</Label>
                                <Controller
                                    name='fomhwD_ToDate'
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DateField field={field} fieldState={fieldState} label='' fromDate={new Date()} />
                                    )}
                                />
                                {errors.fomhwD_ToDate && <FormError>{errors.fomhwD_ToDate.message}</FormError>}
                            </div>

                            {/* Holiday Name */}
                            <div className='space-y-2'>
                                <Label htmlFor={holidayNameId}>Holiday Name</Label>
                                <Controller
                                    name='fomhwD_Name'
                                    control={control}
                                    render={({ field }) => (
                                        <InputText
                                            id={holidayNameId}
                                            placeholder='Enter holiday name'
                                            maxLength={100}
                                            {...field}
                                            error={errors.fomhwD_Name?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    )}
                                />
                                {errors.fomhwD_Name && <FormError>{errors.fomhwD_Name.message}</FormError>}
                            </div>

                            {/* Remarks */}
                            <div className='space-y-2'>
                                <Label htmlFor={remarksId}>Remarks</Label>
                                <Controller
                                    name='fomhwD_Remarks'
                                    control={control}
                                    render={({ field }) => (
                                        <InputTextarea
                                            id={remarksId}
                                            placeholder='Enter remarks'
                                            maxLength={250}
                                            rows={4}
                                            {...field}
                                            error={errors.fomhwD_Remarks?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    )}
                                />
                                {errors.fomhwD_Remarks && <FormError>{errors.fomhwD_Remarks.message}</FormError>}
                            </div>
                        </div>
                    )}

                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Holiday Dates Table - Show when days are selected */}
                {selectedDays && selectedDays.length > 0 && (
                    <div className='space-y-4 rounded-md border border-input bg-background p-4'>
                        <h3 className='font-semibold text-sm'>Holiday List</h3>
                        {!calendarYear || !holidayType ? (
                            <div className='rounded-md border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-800'>
                                Please select Calendar Year and Holiday Type to load holiday dates.
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='w-12'>
                                                <Checkbox
                                                    checked={holidayDates.length > 0 && selectedRows.size === holidayDates.length}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label='Select all'
                                                />
                                            </TableHead>
                                            <TableHead>Day Name</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingDates ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className='text-center'>
                                                    Loading dates...
                                                </TableCell>
                                            </TableRow>
                                        ) : holidayDates.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className='text-center'>
                                                    No dates found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            holidayDates.map((item: { id: string; dayName: string; date: string }) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedRows.has(item.id)}
                                                            onCheckedChange={(checked) => handleRowSelect(item.id, !!checked)}
                                                            aria-label='Select row'
                                                        />
                                                    </TableCell>
                                                    <TableCell>{item.dayName}</TableCell>
                                                    <TableCell>
                                                        {item.date
                                                            ? new Date(item.date).toLocaleDateString('en-GB', {
                                                                  day: '2-digit',
                                                                  month: '2-digit',
                                                                  year: 'numeric'
                                                              })
                                                            : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Cancel
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
