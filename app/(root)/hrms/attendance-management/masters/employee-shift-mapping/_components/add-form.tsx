'use client';

import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useEmployeeShiftMapping,
    useEmployeeShiftMappingDepartments,
    useEmployeeShiftMappingDesignations,
    useEmployeeShiftMappingDropdowns,
    useEmployeeShiftMappingEmployeesFiltered,
    useEmployeeShiftMappingGroupTypes,
    useEmployeeShiftMappingHolidayTypes,
    useEmployeeShiftMappingShiftDetails,
    useEmployeeShiftMappingShiftNamesList,
    useShiftSettingMaster
} from '@/hooks/hrms/attendance-management/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateEmployeeShiftMapping } from '@/server/hrms/attendance-management/masters/employee-shift-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import React, { useEffect, useId, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ShiftTimingFields } from '../../_components/shift-timing-fields';

type FormFields = z.infer<typeof hrmsMasterSchemas.employeeShiftMapping.add>;

interface AddEmployeeShiftMappingFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddEmployeeShiftMappingForm({ onSuccess, className = '' }: AddEmployeeShiftMappingFormProps) {
    const { refetchAll } = useEmployeeShiftMapping();

    // Fetch dropdown data from API
    // Sample request body following project architecture
    const dropdownRequestBody = {
        // Sample structure - update when API is ready
    };
    const { data: dropdownData } = useEmployeeShiftMappingDropdowns(dropdownRequestBody);

    // Fetch shift master data from API to get fomS_Id
    const { data: shiftMasterData } = useShiftSettingMaster();
    const shiftMasterList = useMemo(() => {
        // Handle both array response and object with report_list
        if (!shiftMasterData?.data) return [];
        if (Array.isArray(shiftMasterData.data)) {
            return shiftMasterData.data;
        }
        // Type assertion for object with report_list property
        const dataWithReportList = shiftMasterData.data as { report_list?: any[] };
        return dataWithReportList?.report_list || [];
    }, [shiftMasterData]);

    // Fetch group types
    const { data: groupTypesData } = useEmployeeShiftMappingGroupTypes();

    // Fetch holiday types
    const { data: holidayTypesData } = useEmployeeShiftMappingHolidayTypes();

    // Fetch shift names list
    const { data: shiftNamesListData } = useEmployeeShiftMappingShiftNamesList();

    // Generate unique IDs for form fields
    const typeId = useId();
    const departmentId = useId();
    const designationId = useId();
    const dayTypeId = useId();
    const shiftNameId = useId();
    const applicableDateId = useId();
    const employeesId = useId();

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.employeeShiftMapping.add),
        mode: 'onChange'
    });

    const selectedShiftName = watch('foest_ShiftName');
    const selectedGroupTypes = watch('foest_GroupType');

    // Get selected group type ID(s) - convert to array for API
    const selectedGroupTypeIds = useMemo(() => {
        if (selectedGroupTypes) {
            // Handle comma-separated string (from MultiSelect)
            const ids = selectedGroupTypes
                .split(', ')
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);
            return ids;
        }
        return [];
    }, [selectedGroupTypes]);

    // Fetch departments when group type is selected
    const { data: departmentsData } = useEmployeeShiftMappingDepartments(
        selectedGroupTypeIds.length > 0 ? selectedGroupTypeIds : undefined
    );

    // Watch selected departments
    const selectedDepartments = watch('foest_Department'); // Department field uses foest_Department

    // Get selected department ID(s) - convert to array for API
    const selectedDepartmentIds = useMemo(() => {
        if (selectedDepartments) {
            // Handle comma-separated string (from MultiSelect)
            const ids = selectedDepartments
                .split(', ')
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);
            return ids;
        }
        return [];
    }, [selectedDepartments]);

    // Fetch designations when departments are selected
    const { data: designationsData } = useEmployeeShiftMappingDesignations(
        selectedDepartmentIds.length > 0 ? selectedDepartmentIds : undefined
    );

    // Watch selected designations
    const selectedDesignations = watch('foest_Designation');

    // Get selected designation ID(s) - convert to array for API
    const selectedDesignationIds = useMemo(() => {
        if (selectedDesignations) {
            // Handle comma-separated string (from MultiSelect)
            const ids = selectedDesignations
                .split(', ')
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);
            return ids;
        }
        return [];
    }, [selectedDesignations]);

    // Fetch employees when group types, departments, or designations are selected
    const { data: employeesData } = useEmployeeShiftMappingEmployeesFiltered(
        selectedGroupTypeIds.length > 0 ? selectedGroupTypeIds : undefined,
        selectedDepartmentIds.length > 0 ? selectedDepartmentIds : undefined,
        selectedDesignationIds.length > 0 ? selectedDesignationIds : undefined
    );

    // Prepare shift name options from API
    const shiftOptions = useMemo(() => {
        if (!shiftNamesListData?.data || !Array.isArray(shiftNamesListData.data)) return [];
        return shiftNamesListData.data
            .map((item: any) => ({
                label: item.Value || item.value || '',
                value: String(item.Key || item.key || ''),
                id: item.Key || item.key || 0
            }))
            .filter((option: { value: string; label: any }) => option.value && option.value !== '' && option.value !== '0' && option.label); // Filter out empty or invalid values
    }, [shiftNamesListData]);

    // Get the selected shift's ID
    const selectedShiftId = useMemo(() => {
        if (selectedShiftName) {
            const selectedShift = shiftOptions.find((shift: { value: string; id?: number }) => shift.value === selectedShiftName);
            return selectedShift?.id || 0;
        }
        return 0;
    }, [selectedShiftName, shiftOptions]);

    // Fetch shift details when a shift is selected
    const { data: shiftDetailsData, isLoading: isLoadingShiftDetails } = useEmployeeShiftMappingShiftDetails(
        selectedShiftId > 0 ? selectedShiftId : undefined
    );

    // When shift is selected, populate timing fields from API response
    useEffect(() => {
        if (selectedShiftId > 0 && shiftDetailsData?.data) {
            // Handle both array and object responses
            const shiftDetails = Array.isArray(shiftDetailsData.data) ? shiftDetailsData.data[0] : shiftDetailsData.data;

            if (shiftDetails) {
                const shiftStartTime =
                    shiftDetails.FOMST_IHalfLoginTime ||
                    shiftDetails.IHalfLoginTime ||
                    shiftDetails.shiftStartTime ||
                    shiftDetails.startTime ||
                    '';
                const shiftEndTime =
                    shiftDetails.FOMST_IIHalfLogoutTime ||
                    shiftDetails.IIHalfLogoutTime ||
                    shiftDetails.shiftEndTime ||
                    shiftDetails.endTime ||
                    '';
                const lunchStartTime =
                    shiftDetails.FOMST_IHalfLogoutTime || shiftDetails.IHalfLogoutTime || shiftDetails.lunchStartTime || '';
                const lunchEndTime = shiftDetails.FOMST_IIHalfLoginTime || shiftDetails.IIHalfLoginTime || shiftDetails.lunchEndTime || '';
                const totalWorkingHours = shiftDetails.FOMST_FDWHrMin || shiftDetails.FDWHrMin || shiftDetails.totalWorkingHours || '';
                const halfDayWorkingHours = shiftDetails.FOMST_HDWHrMin || shiftDetails.HDWHrMin || shiftDetails.halfDayWorkingHours || '';
                const delayPerShift =
                    shiftDetails.FOMST_DelayPerShiftHrMin || shiftDetails.DelayPerShiftHrMin || shiftDetails.delayPerShift || '';
                const earlyPerShift =
                    shiftDetails.FOMST_EarlyPerShiftHrMin || shiftDetails.EarlyPerShiftHrMin || shiftDetails.earlyPerShift || '';
                const lunchHours =
                    shiftDetails.FOMST_LunchHoursDuration || shiftDetails.LunchHoursDuration || shiftDetails.lunchHours || '';
                const cleanTime = (time: string) => (time ? String(time).trim() : '');
                if (shiftStartTime) setValue('foest_MorningLogin', cleanTime(shiftStartTime));
                if (shiftEndTime) setValue('foest_AfternoonLogout', cleanTime(shiftEndTime));
                if (lunchStartTime) setValue('foest_MorningLogout', cleanTime(lunchStartTime));
                if (lunchEndTime) setValue('foest_AfternoonLogin', cleanTime(lunchEndTime));
                if (totalWorkingHours) setValue('foest_TotalWork', cleanTime(totalWorkingHours));
                if (halfDayWorkingHours) setValue('foest_HalfDayWork', cleanTime(halfDayWorkingHours));
                if (delayPerShift) setValue('foest_DelayShift', cleanTime(delayPerShift));
                if (earlyPerShift) setValue('foest_EarlyShift', cleanTime(earlyPerShift));
                if (lunchHours) setValue('foest_LunchHour', cleanTime(lunchHours));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedShiftId, shiftDetailsData, isLoadingShiftDetails]);

    // Helper function to remove duplicates by value
    const removeDuplicateOptions = (options: Array<{ label: string; value: string }>) => {
        const seen = new Set<string>();
        return options.filter((option) => {
            if (seen.has(option.value)) {
                return false;
            }
            seen.add(option.value);
            return true;
        });
    };

    // Prepare group type options for Type dropdown
    const typeMultiSelectOptions = React.useMemo(() => {
        if (!groupTypesData?.data || !Array.isArray(groupTypesData.data)) return [];
        const options = groupTypesData.data
            .map((item: any) => ({
                label: item.HRMGT_EmployeeGroupType || item.hrmgT_EmployeeGroupType || '',
                value: String(item.HRMGT_Id || item.hrmgT_Id || ''),
                id: item.HRMGT_Id || item.hrmgT_Id || 0
            }))
            .filter((option: { value: string }) => option.value && option.value !== '' && option.value !== '0'); // Filter out empty or invalid values
        return removeDuplicateOptions(options);
    }, [groupTypesData]);

    // Prepare department options from API (when group type is selected)
    const departmentMultiSelectOptions = React.useMemo(() => {
        // Use departments from the new API if available, otherwise fall back to dropdown data
        if (departmentsData?.data && Array.isArray(departmentsData.data) && departmentsData.data.length > 0) {
            const options = departmentsData.data
                .map((item: any) => ({
                    label: item.Value || item.value || '',
                    value: String(item.Key || item.key || ''),
                    id: item.Key || item.key || 0
                }))
                .filter(
                    (option: { value: string; label: any }) => option.value && option.value !== '' && option.value !== '0' && option.label
                );
            return removeDuplicateOptions(options);
        }
        // Fallback to original dropdown data
        const options = (dropdownData?.data?.departments || []).map((item: any) => ({
            label: item.label || item.name || '',
            value: item.value || String(item.id || '')
        }));
        return removeDuplicateOptions(options);
    }, [departmentsData, dropdownData]);

    // Prepare designation options from API (when departments are selected)
    const designationMultiSelectOptions = React.useMemo(() => {
        // Use designations from the new API if available, otherwise fall back to dropdown data
        if (designationsData?.data && Array.isArray(designationsData.data) && designationsData.data.length > 0) {
            const options = designationsData.data
                .map((item: any) => ({
                    label: item.Value || item.value || '',
                    value: String(item.Key || item.key || ''),
                    id: item.Key || item.key || 0
                }))
                .filter(
                    (option: { value: string; label: any }) => option.value && option.value !== '' && option.value !== '0' && option.label
                );
            return removeDuplicateOptions(options);
        }
        // Fallback to original dropdown data
        const options = (dropdownData?.data?.designations || []).map((item: any) => ({
            label: item.label || item.name || '',
            value: item.value || String(item.id || '')
        }));
        return removeDuplicateOptions(options);
    }, [designationsData, dropdownData]);

    // Prepare holiday type options for Day Type dropdown
    const dayTypeOptions = React.useMemo(() => {
        if (!holidayTypesData?.data || !Array.isArray(holidayTypesData.data)) return [];
        return holidayTypesData.data
            .map((item: any) => ({
                label: item.Value || item.value || '',
                value: String(item.Key || item.key || ''),
                id: item.Key || item.key || 0
            }))
            .filter((option: { value: string; label: any }) => option.value && option.value !== '' && option.value !== '0' && option.label); // Filter out empty or invalid values
    }, [holidayTypesData]);

    // Get employee options from API (when filters are selected)
    const employeeOptions = React.useMemo(() => {
        // Use employees from the new API if available, otherwise fall back to dropdown data
        if (employeesData?.data && Array.isArray(employeesData.data) && employeesData.data.length > 0) {
            const options = employeesData.data
                .map((item: any) => ({
                    label: item.Value || item.value || '',
                    value: String(item.Key || item.key || ''),
                    id: item.Key || item.key || 0
                }))
                .filter(
                    (option: { value: string; label: any }) => option.value && option.value !== '' && option.value !== '0' && option.label
                );
            return removeDuplicateOptions(options);
        }
        // Fallback to original dropdown data
        const options = (dropdownData?.data?.employees || []).map((emp: any) => ({
            label: emp.label || '',
            value: emp.value || ''
        }));
        return removeDuplicateOptions(options);
    }, [employeesData, dropdownData]);

    // Extract shift names for the dropdown (using labels)
    const shiftNames = useMemo(() => {
        return shiftOptions.map((shift: { label: string; value: string; id?: number }) => ({
            label: shift.label,
            value: shift.value,
            id: shift.id
        }));
    }, [shiftOptions]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            // Get shift master ID from selected shift name (which is now the key/ID)
            const fomS_Id = data.foest_ShiftName ? Number.parseInt(data.foest_ShiftName, 10) : 0;

            // Convert employee strings to IDs from dropdown data
            const employeeIds = (data.foest_Employee?.split(', ') || [])
                .map((empString) => {
                    const parsed = Number.parseInt(empString, 10);
                    if (!Number.isNaN(parsed) && parsed > 0) {
                        return parsed;
                    }
                    // Find in dropdown data
                    const found = dropdownData?.data?.employees?.find((emp: any) => {
                        const empValue = String(emp.value || '');
                        const empLabel = String(emp.label || '').toLowerCase();
                        const searchValue = empString.toLowerCase().trim();
                        return empValue === empString || empLabel === searchValue;
                    });
                    return found?.id || 0;
                })
                .filter((id) => id > 0);

            // Get day type IDs from selected values (Day Type field - can be multiple)
            const dayTypeIds = (data.foest_HolidayType ? data.foest_HolidayType.split(', ') : [])
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);

            // Validate required fields
            if (fomS_Id === 0) {
                toast.error('Shift Name is required. Please select a shift.');
                return;
            }
            if (employeeIds.length === 0) {
                toast.error('Employee IDs are required. Please ensure employees are selected correctly.');
                return;
            }
            if (dayTypeIds.length === 0) {
                toast.error('Day Type is required. Please select at least one day type.');
                return;
            }

            // Get group type IDs from selected values (Type field - can be multiple)
            const groupTypeIds = (data.foest_GroupType ? data.foest_GroupType.split(', ') : [])
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);

            // Get department IDs from selected values (Department field - can be multiple)
            const departmentIds = (data.foest_Department ? data.foest_Department.split(', ') : [])
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);

            // Get designation IDs from selected values (Designation field - can be multiple)
            const designationIds = (data.foest_Designation ? data.foest_Designation.split(', ') : [])
                .map((idStr) => {
                    const id = Number.parseInt(idStr.trim(), 10);
                    return id > 0 ? id : null;
                })
                .filter((id): id is number => id !== null);

            // Get shift name label for display
            const selectedShift = shiftNames.find((shift: { value: string; label: string }) => shift.value === data.foest_ShiftName);
            const shiftNameLabel = selectedShift?.label || '';

            // Payload structure matching API requirements
            // POST /api/EmployeeShiftMappingFacade/SaveDetail
            const payload = {
                FOEST_Id: 0, // 0 for add operation
                FOMS_Id: fomS_Id, // Shift ID from Shift Name dropdown
                FOEST_Date: data.foest_ApplicableDate || new Date().toISOString(),
                FOEST_FDWHrMin: data.foest_TotalWork || '00:00',
                FOEST_HDWHrMin: data.foest_HalfDayWork || '00:00',
                FOEST_IHalfLoginTime: data.foest_MorningLogin || '00:00',
                FOEST_IHalfLogoutTime: data.foest_MorningLogout || '00:00',
                FOEST_IIHalfLoginTime: data.foest_AfternoonLogin || '00:00',
                FOEST_IIHalfLogoutTime: data.foest_AfternoonLogout || '00:00',
                FOEST_DelayPerShiftHrMin: data.foest_DelayShift || '00:00',
                FOEST_EarlyPerShiftHrMin: data.foest_EarlyShift || '00:00',
                FOEST_LunchHoursDuration: data.foest_LunchHour || '00:00',
                FOEST_BlockAttendance: '0', // Always send as "0" (string)
                FOEST_FixTimings: '0', // Always send as "0" (string)
                EmployeeIds: employeeIds, // Array of employee IDs
                DayTypeIds: dayTypeIds // Array of day type IDs
            };

            const response = await addOrUpdateEmployeeShiftMapping(payload);

            if (response?.success) {
                toast.success(response?.message || 'Employee shift mapping saved successfully');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to save employee shift mapping');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save employee shift mapping');
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    {/* Type, Department, Designation Row */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='space-y-2'>
                            <Label htmlFor={typeId}>
                                Type <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='foest_GroupType'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id={typeId}
                                        options={typeMultiSelectOptions}
                                        onValueChange={(values) => {
                                            field.onChange(values.join(', '));
                                        }}
                                        defaultValue={field.value ? field.value.split(', ') : []}
                                        placeholder='Select Type'
                                        variant='inverted'
                                    />
                                )}
                            />
                            {errors.foest_GroupType && <FormError>{errors.foest_GroupType.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor={departmentId}>
                                Department <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='foest_Department'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id={departmentId}
                                        options={departmentMultiSelectOptions}
                                        onValueChange={(values) => {
                                            field.onChange(values.join(', '));
                                        }}
                                        defaultValue={field.value ? field.value.split(', ') : []}
                                        placeholder='Select Department'
                                        variant='inverted'
                                    />
                                )}
                            />
                            {errors.foest_Department && <FormError>{errors.foest_Department.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor={designationId}>
                                Designation <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='foest_Designation'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id={designationId}
                                        options={designationMultiSelectOptions}
                                        onValueChange={(values) => {
                                            field.onChange(values.join(', '));
                                        }}
                                        defaultValue={field.value ? field.value.split(', ') : []}
                                        placeholder='Select Designation'
                                        variant='inverted'
                                    />
                                )}
                            />
                            {errors.foest_Designation && <FormError>{errors.foest_Designation.message}</FormError>}
                        </div>
                    </div>

                    {/* Day Type, Shift Name, Applicable Date Row */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='mt-2 space-y-2'>
                            <Label htmlFor={dayTypeId}>
                                Day Type <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='foest_HolidayType'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id={dayTypeId}
                                        options={dayTypeOptions}
                                        onValueChange={(values) => {
                                            field.onChange(values.join(', '));
                                        }}
                                        defaultValue={field.value ? field.value.split(', ') : []}
                                        placeholder='Select Day Type'
                                        variant='inverted'
                                    />
                                )}
                            />
                            {errors.foest_HolidayType && <FormError>{errors.foest_HolidayType.message}</FormError>}
                        </div>
                        <div className='mt-2 space-y-2'>
                            <Label htmlFor={shiftNameId}>
                                Shift Name <span className='text-red-500'>*</span>
                            </Label>
                            <Select
                                value={watch('foest_ShiftName')}
                                onValueChange={(value) => setValue('foest_ShiftName', value)}
                                disabled={shiftNames.length === 0}>
                                <SelectTrigger id={shiftNameId} className={errors.foest_ShiftName ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={shiftNames.length === 0 ? 'No shifts available' : '--Select Shift Name--'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {shiftNames
                                        .filter((shift: { label: string; value: string; id?: number }) => shift.value && shift.value !== '')
                                        .map((shift: { label: string; value: string; id?: number }) => (
                                            <SelectItem key={shift.value} value={shift.value}>
                                                {shift.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.foest_ShiftName && <FormError>{errors.foest_ShiftName.message}</FormError>}
                        </div>
                        <div className='space-y-2'>
                            <Controller
                                name='foest_ApplicableDate'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <DateField field={field} fieldState={fieldState} label='Applicable Date' fromDate={new Date()} />
                                )}
                            />
                        </div>
                    </div>

                    {/* Employee Selection */}
                    <div className='space-y-2 md:w-1/3'>
                        <Label htmlFor={employeesId}>
                            Employee <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            name='foest_Employee'
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    id={employeesId}
                                    options={employeeOptions}
                                    onValueChange={(values) => {
                                        field.onChange(values.join(', '));
                                    }}
                                    defaultValue={field.value ? field.value.split(', ') : []}
                                    placeholder='Select Employee'
                                    variant='inverted'
                                />
                            )}
                        />
                        {errors.foest_Employee && <FormError>{errors.foest_Employee.message}</FormError>}
                    </div>

                    {/* Timing Fields - Rendered dynamically when shift is selected */}
                    {selectedShiftName && (
                        <ShiftTimingFields
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            fieldNames={{
                                shiftStartTime: 'foest_MorningLogin',
                                shiftEndTime: 'foest_AfternoonLogout',
                                totalWorkingHours: 'foest_TotalWork',
                                lunchStartTime: 'foest_MorningLogout',
                                lunchEndTime: 'foest_AfternoonLogin',
                                lunchHours: 'foest_LunchHour',
                                earlyPerShift: 'foest_EarlyShift',
                                delayPerShift: 'foest_DelayShift',
                                halfDayWorkingHours: 'foest_HalfDayWork'
                            }}
                        />
                    )}

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
                        <RefreshCw className='mr-2 h-4 w-4' /> Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Employee Shift Mapping
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
