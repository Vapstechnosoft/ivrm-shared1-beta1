'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
export interface LeaveOpeningBalanceFormData {
    selectedTypes: number[];
    selectedDepartments: number[];
    selectedDesignations: number[];
    selectedEmployeeId: number | null;
    leaveBalances: Record<string, number>; // leaveName -> balance
}
interface LeaveOpeningBalanceFormProps {
    types: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    designations: Array<{ id: number; name: string }>;
    employees: Array<{ id: number; employeeCode: string; employeeName: string }>;
    leaveTypes: Array<{ id: number; name: string }>;
    onSubmit: (data: LeaveOpeningBalanceFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<LeaveOpeningBalanceFormData>;
    isLoadingTypes?: boolean;
    isLoadingDepartments?: boolean;
    isLoadingDesignations?: boolean;
    isLoadingEmployees?: boolean;
}
export function LeaveOpeningBalanceForm({
    types,
    departments,
    designations,
    employees,
    leaveTypes,
    onSubmit,
    onCancel,
    defaultValues,
    isLoadingTypes = false,
    isLoadingDepartments = false,
    isLoadingDesignations = false,
    isLoadingEmployees = false
}: LeaveOpeningBalanceFormProps) {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<LeaveOpeningBalanceFormData>({
        defaultValues: defaultValues || {
            selectedTypes: [],
            selectedDepartments: [],
            selectedDesignations: [],
            selectedEmployeeId: null,
            leaveBalances: {}
        }
    });
    const _selectedEmployeeId = watch('selectedEmployeeId');
    const onSubmitForm: SubmitHandler<LeaveOpeningBalanceFormData> = (data) => {
        onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
            {/* Filters Section - Type, Department, Designation */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Type */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Type <span className='text-red-500'>*</span>
                    </Label>
                    {isLoadingTypes ? (
                        <div className='flex items-center justify-center rounded-md border p-3'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                        </div>
                    ) : (
                        <Controller
                            name='selectedTypes'
                            control={control}
                            rules={{ required: 'Type is required' }}
                            render={({ field }) => (
                                <MultiSelect
                                    options={types.map((t) => ({ label: t.name, value: t.id.toString() }))}
                                    onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                    defaultValue={field.value?.map((v) => v.toString()) || []}
                                    placeholder='Select Types'
                                    maxHeight={200}
                                />
                            )}
                        />
                    )}
                    {errors.selectedTypes && <FormError>{errors.selectedTypes.message}</FormError>}
                </div>
                {/* Department */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Department <span className='text-red-500'>*</span>
                    </Label>
                    {isLoadingDepartments ? (
                        <div className='flex items-center justify-center rounded-md border p-3'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                        </div>
                    ) : (
                        <Controller
                            name='selectedDepartments'
                            control={control}
                            rules={{ required: 'Department is required' }}
                            render={({ field }) => (
                                <MultiSelect
                                    options={departments.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                    onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                    defaultValue={field.value?.map((v) => v.toString()) || []}
                                    placeholder='Select Departments'
                                    maxHeight={200}
                                />
                            )}
                        />
                    )}
                    {errors.selectedDepartments && <FormError>{errors.selectedDepartments.message}</FormError>}
                </div>
                {/* Designation */}
                <div className='space-y-2'>
                    <Label className='font-medium text-sm'>
                        Designation <span className='text-red-500'>*</span>
                    </Label>
                    {isLoadingDesignations ? (
                        <div className='flex items-center justify-center rounded-md border p-3'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                        </div>
                    ) : (
                        <Controller
                            name='selectedDesignations'
                            control={control}
                            rules={{ required: 'Designation is required' }}
                            render={({ field }) => (
                                <MultiSelect
                                    options={designations.map((d) => ({ label: d.name, value: d.id.toString() }))}
                                    onValueChange={(values) => field.onChange(values.map((v) => Number.parseInt(v)))}
                                    defaultValue={field.value?.map((v) => v.toString()) || []}
                                    placeholder='Select Designations'
                                    maxHeight={200}
                                />
                            )}
                        />
                    )}
                    {errors.selectedDesignations && <FormError>{errors.selectedDesignations.message}</FormError>}
                </div>
            </div>
            {/* Employee Selection */}
            <div className='space-y-2'>
                <Label htmlFor='employee-select' className='font-medium text-sm'>
                    Employee <span className='text-red-500'>*</span>
                </Label>
                {isLoadingEmployees ? (
                    <div className='flex items-center justify-center rounded-md border p-3'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                    </div>
                ) : (
                    <Controller
                        name='selectedEmployeeId'
                        control={control}
                        rules={{ required: 'Employee is required' }}
                        render={({ field }) => (
                            <Select value={field.value?.toString() || ''} onValueChange={(value) => field.onChange(Number.parseInt(value))}>
                                <SelectTrigger id='employee-select' className={errors.selectedEmployeeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='Select Employee' />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.length > 0 ? (
                                        employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                {emp.employeeCode} - {emp.employeeName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='p-2 text-muted-foreground text-sm'>No employees found</div>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}
                {errors.selectedEmployeeId && <FormError>{errors.selectedEmployeeId.message}</FormError>}
            </div>
            {/* Leave Opening Balance Table */}
            <div className='space-y-3'>
                <Label className='font-medium text-sm'>Leave Opening Balance</Label>
                <div className='overflow-hidden rounded-md border'>
                    {leaveTypes.length > 0 ? (
                        <div className='max-h-[400px] overflow-x-auto overflow-y-auto'>
                            <table className='w-full border-collapse'>
                                <thead className='sticky top-0 bg-primary text-primary-foreground'>
                                    <tr>
                                        <th className='border p-2 text-left font-medium text-sm'>Sl No</th>
                                        <th className='border p-2 text-left font-medium text-sm'>LeaveName</th>
                                        <th className='border p-2 text-left font-medium text-sm'>Leave(Opening Balance)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveTypes.map((leave, index) => (
                                        <tr key={leave.id} className='hover:bg-muted/50'>
                                            <td className='border p-2 text-center'>{index + 1}</td>
                                            <td className='border p-2'>{leave.name}</td>
                                            <td className='border p-2'>
                                                <Controller
                                                    name={`leaveBalances.${leave.name}`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputText
                                                            type='number'
                                                            step='0.5'
                                                            value={field.value && Number(field.value) !== 0 ? field.value : ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value.trim();
                                                                if (value === '') {
                                                                    field.onChange('');
                                                                    return;
                                                                }
                                                                // Allow only numbers and decimals
                                                                if (/^\d*\.?\d*$/.test(value)) {
                                                                    field.onChange(value === '' ? '' : Number(value));
                                                                }
                                                            }}
                                                            placeholder='0'
                                                            className='w-full'
                                                        />
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='p-4 text-center text-muted-foreground text-sm'>No leave types available</div>
                    )}
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-center gap-2 border-t pt-4'>
                <Button type='submit' variant='default' className='min-w-[120px]'>
                    <Save className='mr-2 h-4 w-4' />
                    SAVE
                </Button>
                <Button type='button' variant='outline' onClick={onCancel} className='min-w-[120px]'>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
            </div>
        </form>
    );
}
