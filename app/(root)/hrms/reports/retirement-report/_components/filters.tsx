'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import { headerFields } from './columns';
export interface RetirementFilters {
    selectedHeaders: string[];
    format: 'format1' | 'format2';
    dateFilter: 'dateOfBirth' | 'dateOfJoining' | 'dateOfLeaving';
    fromDate: Date | undefined;
    toDate: Date | undefined;
    employeeStatus: 'working' | 'left';
    reportScope: 'all' | 'individual';
    selectionType?: 'type' | 'employee' | null; // For individual scope: 'type' or 'employee'
    selectedType?: string; // Selected employee type ID
    selectedEmployee?: string; // Selected employee ID
    // Format 2 filters
    selectedGroupTypes?: string[]; // Selected group type IDs (as strings for MultiSelect)
    selectedDepartments?: string[]; // Selected department IDs (as strings for MultiSelect)
    selectedDesignations?: string[]; // Selected designation IDs (as strings for MultiSelect)
}
interface RetirementReportFiltersProps {
    filters: RetirementFilters;
    employeeTypes?: Array<{ HRMET_Id: number; HRMET_EmployeeType: string; [key: string]: any }>;
    employees?: Array<{
        HRME_Id: number;
        HRME_EmployeeCode: string;
        HRME_EmployeeFirstName?: string;
        HRME_EmployeeMiddleName?: string;
        HRME_EmployeeLastName?: string;
        [key: string]: any;
    }>;
    // Format 2 dropdowns
    groupTypes?: Array<{ hrmgT_Id: number; HRMGT_GroupTypeName: string; [key: string]: any }>;
    departments?: Array<{ hrmD_Id: number; HRMD_DepartmentName: string; [key: string]: any }>;
    designations?: Array<{ hrmdeS_Id: number; HRMDES_DesignationName: string; [key: string]: any }>;
    onFilterChange: (key: keyof RetirementFilters, value: any) => void;
    onHeaderChange: (header: string, checked: boolean) => void;
    onHeaderSelectAll: (checked: boolean) => void;
    onDateChange: (key: 'fromDate' | 'toDate', date: Date | undefined) => void;
    onSearch: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export function RetirementReportFilters({
    filters,
    employeeTypes = [],
    employees = [],
    groupTypes = [],
    departments = [],
    designations = [],
    onFilterChange,
    onHeaderChange,
    onHeaderSelectAll,
    onDateChange,
    onSearch,
    onCancel,
    isLoading = false
}: RetirementReportFiltersProps) {
    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Left Column */}
                <div className='space-y-4'>
                    {/* Header Selection */}
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                            <span className='font-medium text-foreground text-sm'>Header:</span>
                            <span className='text-red-500'>*</span>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    id='all-headers'
                                    checked={filters.selectedHeaders.length === headerFields.length}
                                    onCheckedChange={onHeaderSelectAll}
                                />
                                <label htmlFor='all-headers' className='cursor-pointer text-sm'>
                                    All
                                </label>
                            </div>
                        </div>
                        <div className='h-40 space-y-2 overflow-y-auto rounded-lg border p-3'>
                            {headerFields.map((header) => (
                                <div key={header} className='flex items-center gap-2'>
                                    <Checkbox
                                        id={`header-${header}`}
                                        checked={filters.selectedHeaders.includes(header)}
                                        onCheckedChange={(checked) => onHeaderChange(header, checked as boolean)}
                                    />
                                    <label htmlFor={`header-${header}`} className='cursor-pointer text-sm'>
                                        {header}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right Column */}
                <div className='space-y-4'>
                    {/* Format Selection */}
                    <div className='space-y-3'>
                        <span className='font-medium text-foreground text-sm'>Format:</span>
                        <RadioGroup
                            value={filters.format}
                            onValueChange={(value) => {
                                onFilterChange('format', value);
                                // Reset Format 2 filters when switching to Format 1
                                if (value === 'format1') {
                                    onFilterChange('selectedGroupTypes', []);
                                    onFilterChange('selectedDepartments', []);
                                    onFilterChange('selectedDesignations', []);
                                }
                                // Reset Format 1 filters when switching to Format 2
                                if (value === 'format2') {
                                    onFilterChange('selectionType', null);
                                    onFilterChange('selectedType', '');
                                    onFilterChange('selectedEmployee', '');
                                }
                            }}
                            className='flex gap-4'>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='format1' id='format1' />
                                <label htmlFor='format1' className='cursor-pointer text-sm'>
                                    Format 1
                                </label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='format2' id='format2' />
                                <label htmlFor='format2' className='cursor-pointer text-sm'>
                                    Format 2
                                </label>
                            </div>
                        </RadioGroup>
                    </div>
                    {/* Date Filter Selection */}
                    <div className='space-y-3'>
                        <span className='font-medium text-foreground text-sm'>Date Filter:</span>
                        <RadioGroup
                            value={filters.dateFilter}
                            onValueChange={(value) => onFilterChange('dateFilter', value)}
                            className='flex gap-4'>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dateOfBirth' id='dateOfBirth' />
                                <label htmlFor='dateOfBirth' className='cursor-pointer text-sm'>
                                    Date of Birth
                                </label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dateOfJoining' id='dateOfJoining' />
                                <label htmlFor='dateOfJoining' className='cursor-pointer text-sm'>
                                    Date of Joining
                                </label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dateOfLeaving' id='dateOfLeaving' />
                                <label htmlFor='dateOfLeaving' className='cursor-pointer text-sm'>
                                    Date of Leaving
                                </label>
                            </div>
                        </RadioGroup>
                    </div>
                    {/* Date Range Selection */}
                    <div className='flex items-center gap-4'>
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                From: <span className='text-red-500'>*</span>
                            </span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className={cn(
                                            'w-[140px] justify-start text-left font-normal',
                                            !filters.fromDate && 'text-muted-foreground'
                                        )}>
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {filters.fromDate ? format(filters.fromDate, 'dd-MM-yyyy') : '17-09-2025'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0'>
                                    <DatePickerWithYear
                                        mode='single'
                                        selected={filters.fromDate}
                                        onDayClick={(day) => onDateChange('fromDate', day)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='space-y-2'>
                            <span className='font-medium text-foreground text-sm'>
                                To: <span className='text-red-500'>*</span>
                            </span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className={cn(
                                            'w-[140px] justify-start text-left font-normal',
                                            !filters.toDate && 'text-muted-foreground'
                                        )}>
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {filters.toDate ? format(filters.toDate, 'dd-MM-yyyy') : '17-09-2025'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0'>
                                    <DatePickerWithYear
                                        mode='single'
                                        selected={filters.toDate}
                                        onDayClick={(day) => onDateChange('toDate', day)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* Employee Status */}
                    <div className='space-y-3'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='working'
                                    checked={filters.employeeStatus === 'working'}
                                    onCheckedChange={(checked) => checked && onFilterChange('employeeStatus', 'working')}
                                />
                                <label htmlFor='working' className='cursor-pointer text-sm'>
                                    Working
                                </label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='left'
                                    checked={filters.employeeStatus === 'left'}
                                    onCheckedChange={(checked) => checked && onFilterChange('employeeStatus', 'left')}
                                />
                                <label htmlFor='left' className='cursor-pointer text-sm'>
                                    Left
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Report Scope - Only show for Format 1 */}
                    {filters.format === 'format1' && (
                        <div className='space-y-3'>
                            <span className='font-medium text-foreground text-sm'>Report Scope:</span>
                            <RadioGroup
                                value={filters.reportScope}
                                onValueChange={(value) => {
                                    onFilterChange('reportScope', value);
                                    // Reset selection type when scope changes
                                    if (value === 'all') {
                                        onFilterChange('selectionType', null);
                                        onFilterChange('selectedType', '');
                                        onFilterChange('selectedEmployee', '');
                                    }
                                }}
                                className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='all' id='all' />
                                    <label htmlFor='all' className='cursor-pointer text-sm'>
                                        All
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='individual' id='individual' />
                                    <label htmlFor='individual' className='cursor-pointer text-sm'>
                                        Individual
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                    {/* Type/Employee Selection - Only show when Format 1 and Individual are selected */}
                    {filters.format === 'format1' && filters.reportScope === 'individual' && (
                        <div className='space-y-3'>
                            <span className='font-medium text-foreground text-sm'>
                                Selection Type: <span className='text-red-500'>*</span>
                            </span>
                            <RadioGroup
                                value={filters.selectionType || ''}
                                onValueChange={(value) => {
                                    onFilterChange('selectionType', value);
                                    // Reset selections when switching between type and employee
                                    onFilterChange('selectedType', '');
                                    onFilterChange('selectedEmployee', '');
                                }}
                                className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='type' id='type' />
                                    <label htmlFor='type' className='cursor-pointer text-sm'>
                                        Type
                                    </label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='employee' id='employee' />
                                    <label htmlFor='employee' className='cursor-pointer text-sm'>
                                        Employee
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                    {/* Type Dropdown - Only show when Format 1, Individual, and Type are selected */}
                    {filters.format === 'format1' && filters.reportScope === 'individual' && filters.selectionType === 'type' && (
                        <div className='space-y-2'>
                            <Label htmlFor='employee-type' className='font-medium text-foreground text-sm'>
                                Type: <span className='text-red-500'>*</span>
                            </Label>
                            {isLoading ? (
                                <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                            ) : employeeTypes.length === 0 ? (
                                <div className='text-muted-foreground text-sm'>No employee types available</div>
                            ) : (
                                <Select value={filters.selectedType || ''} onValueChange={(value) => onFilterChange('selectedType', value)}>
                                    <SelectTrigger id='employee-type' className='w-full'>
                                        <SelectValue placeholder='Select Employee Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employeeTypes
                                            .filter((type) => type.HRMET_Id && type.HRMET_EmployeeType)
                                            .map((type) => (
                                                <SelectItem key={type.HRMET_Id} value={type.HRMET_Id.toString()}>
                                                    {type.HRMET_EmployeeType}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}
                    {/* Employee Dropdown - Only show when Format 1, Individual, and Employee are selected */}
                    {filters.format === 'format1' && filters.reportScope === 'individual' && filters.selectionType === 'employee' && (
                        <div className='space-y-2'>
                            <Label htmlFor='employee-select' className='font-medium text-foreground text-sm'>
                                Employee: <span className='text-red-500'>*</span>
                            </Label>
                            {isLoading ? (
                                <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                            ) : employees.length === 0 ? (
                                <div className='text-muted-foreground text-sm'>No employees available</div>
                            ) : (
                                <Select
                                    value={filters.selectedEmployee || ''}
                                    onValueChange={(value) => onFilterChange('selectedEmployee', value)}>
                                    <SelectTrigger id='employee-select' className='w-full'>
                                        <SelectValue placeholder='Select Employee' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees
                                            .filter((emp) => emp.HRME_Id && emp.HRME_EmployeeCode)
                                            .map((emp) => {
                                                const employeeName =
                                                    `${emp.HRME_EmployeeFirstName || ''} ${emp.HRME_EmployeeMiddleName || ''} ${emp.HRME_EmployeeLastName || ''}`.trim() ||
                                                    emp.HRME_EmployeeCode;
                                                return (
                                                    <SelectItem key={emp.HRME_Id} value={emp.HRME_Id.toString()}>
                                                        {employeeName} ({emp.HRME_EmployeeCode})
                                                    </SelectItem>
                                                );
                                            })}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Format 2 Filters - Group Type, Department, Designation */}
            {filters.format === 'format2' && (
                <div className='grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3'>
                    {/* Group Type Section */}
                    <div className='space-y-2'>
                        <Label htmlFor='group-type' className='font-medium text-foreground text-sm'>
                            Group Type: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : groupTypes.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No group types available</div>
                        ) : (
                            <MultiSelect
                                options={groupTypes
                                    .filter((gt) => gt.hrmgT_Id && gt.HRMGT_GroupTypeName)
                                    .map((gt) => ({
                                        label: gt.HRMGT_GroupTypeName,
                                        value: gt.hrmgT_Id.toString()
                                    }))}
                                defaultValue={filters.selectedGroupTypes || []}
                                onValueChange={(values) => onFilterChange('selectedGroupTypes', values)}
                                placeholder='Select Group Types'
                                className='w-full'
                                maxHeight={240}
                            />
                        )}
                    </div>
                    {/* Department Section */}
                    <div className='space-y-2'>
                        <Label htmlFor='department' className='font-medium text-foreground text-sm'>
                            Department: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : departments.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No departments available</div>
                        ) : (
                            <MultiSelect
                                options={departments
                                    .filter((dept) => dept.hrmD_Id && dept.HRMD_DepartmentName)
                                    .map((dept) => ({
                                        label: dept.HRMD_DepartmentName,
                                        value: dept.hrmD_Id.toString()
                                    }))}
                                defaultValue={filters.selectedDepartments || []}
                                onValueChange={(values) => onFilterChange('selectedDepartments', values)}
                                placeholder='Select Departments'
                                className='w-full'
                                maxHeight={240}
                            />
                        )}
                    </div>
                    {/* Designation Section */}
                    <div className='space-y-2'>
                        <Label htmlFor='designation' className='font-medium text-foreground text-sm'>
                            Designation: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
                        ) : designations.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No designations available</div>
                        ) : (
                            <MultiSelect
                                options={designations
                                    .filter((desg) => desg.hrmdeS_Id && desg.HRMDES_DesignationName)
                                    .map((desg) => ({
                                        label: desg.HRMDES_DesignationName,
                                        value: desg.hrmdeS_Id.toString()
                                    }))}
                                defaultValue={filters.selectedDesignations || []}
                                onValueChange={(values) => onFilterChange('selectedDesignations', values)}
                                placeholder='Select Designations'
                                className='w-full'
                                maxHeight={240}
                            />
                        )}
                    </div>
                </div>
            )}
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
        </CollapsibleSection>
    );
}
