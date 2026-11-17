'use client';
import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
export interface ServiceReportFilters {
    type: string;
    department: string;
    designation: string;
    selectedEmployee: string;
    currentDate: Date;
    reportType: 'Experience Certificate';
}
interface EmployeeServiceFiltersProps {
    filters: ServiceReportFilters;
    groupTypes: Array<{ id: number; groupType: string }>;
    departments: Array<{ id: number; departmentName: string }>;
    designations: Array<{ id: number; designationName: string }>;
    filteredEmployees: Array<{ id: number; employeeCode: string; employeeName: string }>;
    selectedEmployeeDetails: {
        employee: {
            employeeName: string;
            employeeCode: string;
            departmentName: string;
            designationName: string;
        };
    } | null;
    onFilterChange: (key: keyof ServiceReportFilters, value: any) => void;
    onSearch: () => void;
    onCancel: () => void;
}
export function EmployeeServiceFilters({
    filters,
    groupTypes,
    departments,
    designations,
    filteredEmployees,
    selectedEmployeeDetails,
    onFilterChange,
    onSearch,
    onCancel
}: EmployeeServiceFiltersProps) {
    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        {/* Type Selection */}
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                Type: <span className='text-red-500'>*</span>
                            </span>
                            <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select' />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.groupType}>
                                            {type.groupType}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Department Selection */}
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                Department: <span className='text-red-500'>*</span>
                            </span>
                            <Select value={filters.department} onValueChange={(value) => onFilterChange('department', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select' />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.departmentName}>
                                            {dept.departmentName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Designation Selection */}
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                Designation: <span className='text-red-500'>*</span>
                            </span>
                            <Select value={filters.designation} onValueChange={(value) => onFilterChange('designation', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select' />
                                </SelectTrigger>
                                <SelectContent>
                                    {designations.map((desig) => (
                                        <SelectItem key={desig.id} value={desig.designationName}>
                                            {desig.designationName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Employee Selection */}
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                Employee: <span className='text-red-500'>*</span>
                            </span>
                            <Select value={filters.selectedEmployee} onValueChange={(value) => onFilterChange('selectedEmployee', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select or search Employee' />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredEmployees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id.toString()}>
                                            {emp.employeeName} ({emp.employeeCode})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className='space-y-4'>
                        {/* Current Date */}
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                Current Date: <span className='text-red-500'>*</span>
                            </span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !filters.currentDate && 'text-muted-foreground'
                                        )}>
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {filters.currentDate ? format(filters.currentDate, 'dd-MM-yyyy') : <span>17-09-2025</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0'>
                                    <CalendarYear
                                        mode='single'
                                        selected={filters.currentDate}
                                        onDayClick={(day) => onFilterChange('currentDate', day)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Report Type */}
                        <div className='space-y-3'>
                            <span className='font-medium text-foreground text-sm'>Report Type:</span>
                            <div className='flex items-center gap-2'>
                                <label className='flex cursor-pointer items-center gap-2 text-sm'>
                                    <input
                                        type='radio'
                                        name='reportType'
                                        value='Experience Certificate'
                                        checked={filters.reportType === 'Experience Certificate'}
                                        onChange={(e) => onFilterChange('reportType', e.target.value)}
                                        className='text-primary focus:ring-primary'
                                    />
                                    Experience Certificate
                                </label>
                            </div>
                        </div>
                        {/* Selected Employee Info */}
                        {selectedEmployeeDetails && (
                            <div className='space-y-2 rounded-md border bg-background p-3'>
                                <div className='font-medium text-foreground text-sm'>Selected Employee:</div>
                                <div className='text-muted-foreground text-sm'>
                                    <div>{selectedEmployeeDetails.employee.employeeName}</div>
                                    <div>{selectedEmployeeDetails.employee.employeeCode}</div>
                                    <div>
                                        {selectedEmployeeDetails.employee.departmentName} -{' '}
                                        {selectedEmployeeDetails.employee.designationName}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Action Buttons */}
                <div className='flex gap-2 pt-4'>
                    <Button onClick={onSearch}>
                        <Search className='mr-2 h-4 w-4' />
                        SEARCH
                    </Button>
                    <Button variant='outline' onClick={onCancel}>
                        <X className='mr-2 h-4 w-4' />
                        CANCEL
                    </Button>
                </div>
            </div>
        </CollapsibleSection>
    );
}
