'use client';
import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentDropdown, useDesignationDropdown, useGroupTypeDropdown } from '@/hooks/hrms/useEmployeeRegister';
import { useGroupDeptDessgMapping } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import type { IDepartmentDropdown, IDesignationDropdown, IGroupTypeDropdown } from '@/types/hrms/hrms-config/employee';
import type { IMasterGroupDeptDessgMappingList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof hrmsMasterSchemas.groupDeptDessgMapping.addOrUpdate>;
interface UpdateGroupDeptDessgMappingFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterGroupDeptDessgMappingList;
}
export default function UpdateGroupDeptDessgMappingForm({
    onSuccess,
    className = '',
    selectedRow: row
}: UpdateGroupDeptDessgMappingFormProps) {
    // Group Type dropdown - API: /api/MasterDropDown/GroupType
    const { data: groupTypeDropdownResponse, isLoading: isLoadingGroupTypes } = useGroupTypeDropdown();
    const groupTypeDropdown: IGroupTypeDropdown[] = Array.isArray(groupTypeDropdownResponse)
        ? groupTypeDropdownResponse
        : (groupTypeDropdownResponse as any)?.data || [];

    // Department dropdown - API: /api/MasterDropDown/GetDepartments
    const { data: departmentDropdownResponse, isLoading: isLoadingDepartments } = useDepartmentDropdown();
    const departmentDropdown: IDepartmentDropdown[] = Array.isArray(departmentDropdownResponse)
        ? departmentDropdownResponse
        : (departmentDropdownResponse as any)?.data || [];

    // Designation dropdown - API: /api/MasterDropDown/GetDesignation
    const { data: designationDropdownResponse, isLoading: isLoadingDesignations } = useDesignationDropdown();
    const designationDropdown: IDesignationDropdown[] = Array.isArray(designationDropdownResponse)
        ? designationDropdownResponse
        : (designationDropdownResponse as any)?.data || [];

    const { saveMutation } = useGroupDeptDessgMapping();
    const { mutate: saveMapping, isPending } = saveMutation;
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.groupDeptDessgMapping.addOrUpdate),
        mode: 'onChange'
    });
    useEffect(() => {
        if (row) {
            const designationids = row.hrmdeS_Id ? [row.hrmdeS_Id] : [];
            reset({
                hrgtddS_Id: row.hrgtddS_Id,
                hrmgT_Id: row.hrmgT_Id,
                hrmD_Id: row.hrmD_Id,
                hrmdeS_Id: row.hrmdeS_Id || 0,
                designationids: designationids
            });
        }
    }, [row, reset]);
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const originalDesignationIds = row.hrmdeS_Id ? [row.hrmdeS_Id] : [];
            const currentDesignationIds = (data.designationids || []).sort((a, b) => a - b);
            const hasChanges =
                row.hrmgT_Id !== data.hrmgT_Id ||
                row.hrmD_Id !== data.hrmD_Id ||
                originalDesignationIds.length !== currentDesignationIds.length ||
                !originalDesignationIds.every((id, index) => id === currentDesignationIds[index]);
            if (!hasChanges) {
                toast.info('No changes detected. Nothing to update.');
                onSuccess?.();
                return;
            }
            // Construct API request body matching Swagger spec
            const requestBody = {
                hrgtddS_Id: row.hrgtddS_Id,
                hrmgT_Id: data.hrmgT_Id,
                hrmD_Id: data.hrmD_Id,
                hrmdeS_Ids: data.designationids || []
            };
            saveMapping(requestBody, {
                onSuccess: (response) => {
                    if (response.success) {
                        toast.success(response.message || 'Mapping updated successfully');
                        onSuccess?.();
                    } else {
                        const errorMessage = response.message || '';
                        const isDuplicateError = errorMessage.toLowerCase().includes('duplicate');
                        if (isDuplicateError) {
                            toast.error(
                                'Duplicate entry detected. The combination of Group Type, Department, and Designation(s) already exists.'
                            );
                        } else {
                            toast.error(response.message || 'Failed to update mapping');
                        }
                    }
                },
                onError: (error: any) => {
                    const errorMessage = error.message || '';
                    const isDuplicateError = errorMessage.toLowerCase().includes('duplicate');
                    if (isDuplicateError) {
                        toast.error('Duplicate entry: The combination already exists.');
                    } else {
                        toast.error(error.message || 'An error occurred');
                    }
                }
            });
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };
    const handleReset = () => {
        reset();
    };

    // Transform designation dropdown for MultiSelect component
    const designationOptions = useMemo(() => {
        return designationDropdown
            .filter((desig: IDesignationDropdown) => {
                return desig.key != null && desig.key !== undefined && desig.key !== 0;
            })
            .map((desig: IDesignationDropdown) => ({
                label: desig.value || String(desig.key),
                value: desig.key?.toString().trim() || '',
                _index: 0
            }))
            .filter((opt) => opt.value !== '');
    }, [designationDropdown]);
    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='hrmgT_Id'>
                                Group Type <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='hrmgT_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={`group-select-${row.hrgtddS_Id}-${field.value}`}
                                        value={field.value?.toString() || ''}
                                        onValueChange={(value) => field.onChange(Number(value))}>
                                        <SelectTrigger id='hrmgT_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select group type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groupTypeDropdown
                                                .filter((group: IGroupTypeDropdown) => {
                                                    return group.key != null && group.key !== undefined && group.key !== 0;
                                                })
                                                .map((group: IGroupTypeDropdown) => {
                                                    const key = group.key?.toString().trim();
                                                    if (!key || key === '') return null;
                                                    const value = group.value || String(group.key);
                                                    return (
                                                        <SelectItem key={group.key} value={key}>
                                                            {value}
                                                        </SelectItem>
                                                    );
                                                })
                                                .filter(Boolean)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hrmgT_Id && <FormError>{errors.hrmgT_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='hrmD_Id'>
                                Department <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='hrmD_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={`dept-select-${row.hrgtddS_Id}-${field.value}`}
                                        value={field.value?.toString() || ''}
                                        onValueChange={(value) => field.onChange(Number(value))}>
                                        <SelectTrigger id='hrmD_Id' className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select department' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentDropdown
                                                .filter((dept: IDepartmentDropdown) => {
                                                    return dept.key != null && dept.key !== undefined && dept.key !== 0;
                                                })
                                                .map((dept: IDepartmentDropdown) => {
                                                    const key = dept.key?.toString().trim();
                                                    if (!key || key === '') return null;
                                                    const value = dept.value || String(dept.key);
                                                    return (
                                                        <SelectItem key={dept.key} value={key}>
                                                            {value}
                                                        </SelectItem>
                                                    );
                                                })
                                                .filter(Boolean)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.hrmD_Id && <FormError>{errors.hrmD_Id.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='designationids'>
                                Designation <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='designationids'
                                control={control}
                                render={({ field }) => {
                                    // Use watch to get reactive value that updates immediately when reset() is called
                                    const designationIds = watch('designationids') || [];
                                    const stringValues = designationIds.map((id) => id.toString());
                                    // Use row ID in key to force re-render when row changes
                                    const multiSelectKey = `designation-${row.hrgtddS_Id}`;
                                    return (
                                        <MultiSelect
                                            key={multiSelectKey}
                                            options={designationOptions}
                                            defaultValue={stringValues}
                                            onValueChange={(values) => {
                                                field.onChange(values.map((v) => Number(v)));
                                            }}
                                            placeholder='Select designations'
                                            maxCount={3}
                                            maxHeight={300}
                                            className='w-full'
                                        />
                                    );
                                }}
                            />
                            {errors.designationids && <FormError>{errors.designationids.message}</FormError>}
                        </div>
                    </div>
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>
                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isPending}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Mapping
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
