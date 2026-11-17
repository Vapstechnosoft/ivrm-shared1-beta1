'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
export interface LeaveReportFilters {
    selectedTypes: number[];
    selectedDepartments: number[];
    selectedDesignations: number[];
    isIndividual: boolean;
    selectedEmployeeId: number | null;
    leave: string;
    fromDate: string;
    toDate: string;
    showEmployeeLeaveBalance: boolean;
}
interface LeaveReportFiltersProps {
    filters: LeaveReportFilters;
    types: Array<{ id: number; name: string }>;
    departments: Array<{ id: number; name: string }>;
    designations: Array<{ id: number; name: string }>;
    employees: Array<{ id: number; employeeCode: string; employeeName: string; designation?: string; department?: string }>;
    isLoadingTypes?: boolean;
    isLoadingDepartments?: boolean;
    isLoadingDesignations?: boolean;
    isLoadingEmployees?: boolean;
    onFilterChange: (key: keyof LeaveReportFilters, value: any) => void;
    onReport: () => void;
    onCancel: () => void;
}
export function LeaveReportFilters({
    filters,
    types,
    departments,
    designations,
    employees,
    isLoadingTypes = false,
    isLoadingDepartments = false,
    isLoadingDesignations = false,
    isLoadingEmployees = false,
    onFilterChange,
    onReport,
    onCancel
}: LeaveReportFiltersProps) {
    // Hide employee section when Employee Leave Balance is checked
    const showEmployeeSection = !filters.showEmployeeLeaveBalance;
    return (
        <CollapsibleSection
            title='LEAVE REPORT'
            description='Configure filters to generate leave report'
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='grid grid-cols-1 gap-6'>
                {/* Type, Department, Designation MultiSelect Dropdowns */}
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
                            <MultiSelect
                                options={types.map((type) => ({
                                    label: type.name,
                                    value: type.id.toString()
                                }))}
                                defaultValue={filters.selectedTypes.map((id) => id.toString())}
                                onValueChange={(values) =>
                                    onFilterChange(
                                        'selectedTypes',
                                        values.map((v) => Number.parseInt(v))
                                    )
                                }
                                placeholder='Select types'
                            />
                        )}
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
                            <MultiSelect
                                options={departments.map((dept) => ({
                                    label: dept.name,
                                    value: dept.id.toString()
                                }))}
                                defaultValue={filters.selectedDepartments.map((id) => id.toString())}
                                onValueChange={(values) =>
                                    onFilterChange(
                                        'selectedDepartments',
                                        values.map((v) => Number.parseInt(v))
                                    )
                                }
                                placeholder='Select departments'
                            />
                        )}
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
                            <MultiSelect
                                options={designations.map((desg) => ({
                                    label: desg.name,
                                    value: desg.id.toString()
                                }))}
                                defaultValue={filters.selectedDesignations.map((id) => id.toString())}
                                onValueChange={(values) =>
                                    onFilterChange(
                                        'selectedDesignations',
                                        values.map((v) => Number.parseInt(v))
                                    )
                                }
                                placeholder='Select designations'
                            />
                        )}
                    </div>
                </div>
                {/* Employee Section - Hide when Employee Leave Balance is checked */}
                {showEmployeeSection && (
                    <>
                        {/* Individual/All Selection */}
                        <div className='space-y-2'>
                            <Label className='font-medium text-sm'>Employee Selection</Label>
                            <RadioGroup
                                value={filters.isIndividual ? 'Individual' : 'All'}
                                onValueChange={(value) => onFilterChange('isIndividual', value === 'Individual')}
                                className='flex flex-row gap-6'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='All' id='all' />
                                    <Label htmlFor='all' className='cursor-pointer'>
                                        All
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Individual' id='individual' />
                                    <Label htmlFor='individual' className='cursor-pointer'>
                                        Individual
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {/* Employee Selection - Only show when Individual is selected */}
                        {filters.isIndividual && (
                            <div className='space-y-2'>
                                <Label htmlFor='employee-select' className='font-medium text-sm'>
                                    Employee :
                                </Label>
                                {isLoadingEmployees ? (
                                    <div className='flex items-center justify-center rounded-md border p-3'>
                                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                                    </div>
                                ) : (
                                    <Select
                                        value={filters.selectedEmployeeId?.toString() || undefined}
                                        onValueChange={(value) =>
                                            onFilterChange('selectedEmployeeId', value ? Number.parseInt(value) : null)
                                        }
                                        disabled={employees.length === 0}>
                                        <SelectTrigger id='employee-select'>
                                            <SelectValue
                                                placeholder={
                                                    employees.length === 0
                                                        ? 'No employees available'
                                                        : 'Select or search Employee in the list...'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.length > 0 ? (
                                                employees.map((emp) => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                                        {emp.employeeCode} - {emp.employeeName}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className='px-2 py-1.5 text-muted-foreground text-sm'>No employees available</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}
                    </>
                )}
                {/* Filter Fields */}
                <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-3'>
                    <div>
                        <Label htmlFor='leave-select' className='font-medium text-sm'>
                            Leave <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={filters.leave} onValueChange={(value) => onFilterChange('leave', value)}>
                            <SelectTrigger id='leave-select'>
                                <SelectValue placeholder='--Select--' />
                            </SelectTrigger>
                            <SelectContent>
                                {['All', 'Casual Leave', 'Sick Leave', 'Privilege Leave', 'Comp Off', 'Optional Leave'].map((l) => (
                                    <SelectItem key={l} value={l}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid grid-cols-1 gap-2 md:col-span-1 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='from-date-input' className='font-medium text-sm'>
                                From Date <span className='text-red-500'>*</span>
                            </Label>
                            <InputText
                                id='from-date-input'
                                type='date'
                                value={filters.fromDate}
                                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='to-date-input' className='font-medium text-sm'>
                                To Date <span className='text-red-500'>*</span>
                            </Label>
                            <InputText
                                id='to-date-input'
                                type='date'
                                value={filters.toDate}
                                onChange={(e) => onFilterChange('toDate', e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Employee Leave Balance Checkbox */}
                    <div className='flex items-center gap-2 md:col-span-3'>
                        <Checkbox
                            id='empLeaveBalance'
                            checked={filters.showEmployeeLeaveBalance}
                            onCheckedChange={(checked) => onFilterChange('showEmployeeLeaveBalance', checked)}
                        />
                        <label htmlFor='empLeaveBalance' className='text-sm'>
                            Employee Leave Balance
                        </label>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex gap-2 md:col-span-3'>
                        <Button onClick={onReport} variant='default'>
                            Report
                        </Button>
                        <Button variant='outline' onClick={onCancel}>
                            <X className='mr-2 h-4 w-4' />
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
        </CollapsibleSection>
    );
}
