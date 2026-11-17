'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, X } from 'lucide-react';
// Report filters
export interface AdvanceFilters {
    selectedGroupTypes: string[]; // Array of IDs (as strings for MultiSelect)
    selectedDepartments: string[]; // Array of IDs (as strings for MultiSelect)
    selectedDesignations: string[]; // Array of IDs (as strings for MultiSelect)
    month: string;
    year: string;
}
interface AdvanceReportFiltersProps {
    filters: AdvanceFilters;
    groupTypes?: Array<{ HRMGT_Id: number; HRMGT_EmployeeGroupType: string; HRMGT_ActiveFlag?: boolean; [key: string]: any }>;
    departments?: Array<{ HRMD_Id: number; HRMD_DepartmentName: string; HRMD_ActiveFlag?: boolean; [key: string]: any }>;
    designations?: Array<{ HRMDES_Id: number; HRMDES_DesignationName: string; HRMDES_ActiveFlag?: boolean; [key: string]: any }>;
    months?: Array<{ IVRM_Month_Id: number; IVRM_Month_Name: string; Is_Active?: boolean; [key: string]: any }>;
    years?: Array<{ HRMLY_Id: number; HRMLY_LeaveYear: string; HRMLY_ActiveFlag?: boolean; [key: string]: any }>;
    onFilterChange: (filters: AdvanceFilters) => void;
    onSearch: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export function AdvanceReportFilters({
    filters,
    groupTypes = [],
    departments = [],
    designations = [],
    months = [],
    years = [],
    onFilterChange,
    onSearch,
    onCancel,
    isLoading = false
}: AdvanceReportFiltersProps) {
    return (
        <CollapsibleSection
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='flex items-center gap-2 pb-4 font-semibold text-foreground text-lg'>
                <FileText className='h-5 w-5' />
                EMPLOYEE ADVANCE REPORT
            </div>
            <div className='space-y-6'>
                {/* Filter Sections */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
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
                                    .filter((gt) => gt.HRMGT_Id && gt.HRMGT_EmployeeGroupType && gt.HRMGT_ActiveFlag)
                                    .map((gt) => ({
                                        label: gt.HRMGT_EmployeeGroupType,
                                        value: gt.HRMGT_Id.toString()
                                    }))}
                                defaultValue={filters.selectedGroupTypes}
                                onValueChange={(values) =>
                                    onFilterChange({
                                        ...filters,
                                        selectedGroupTypes: values
                                    })
                                }
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
                                    .filter((dept) => dept.HRMD_Id && dept.HRMD_DepartmentName && dept.HRMD_ActiveFlag)
                                    .map((dept) => ({
                                        label: dept.HRMD_DepartmentName,
                                        value: dept.HRMD_Id.toString()
                                    }))}
                                defaultValue={filters.selectedDepartments}
                                onValueChange={(values) =>
                                    onFilterChange({
                                        ...filters,
                                        selectedDepartments: values
                                    })
                                }
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
                                    .filter((desg) => desg.HRMDES_Id && desg.HRMDES_DesignationName && desg.HRMDES_ActiveFlag)
                                    .map((desg) => ({
                                        label: desg.HRMDES_DesignationName,
                                        value: desg.HRMDES_Id.toString()
                                    }))}
                                defaultValue={filters.selectedDesignations}
                                onValueChange={(values) =>
                                    onFilterChange({
                                        ...filters,
                                        selectedDesignations: values
                                    })
                                }
                                placeholder='Select Designations'
                                className='w-full'
                                maxHeight={240}
                            />
                        )}
                    </div>
                </div>
                {/* Additional Filters */}
                <div className='flex items-center justify-center gap-6 pt-4'>
                    {/* Month Filter */}
                    <div className='space-y-2'>
                        <Label htmlFor='month' className='font-medium text-foreground text-sm'>
                            Month: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-40 animate-pulse rounded-md bg-muted' />
                        ) : months.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No months available</div>
                        ) : (
                            <Select value={filters.month} onValueChange={(value) => onFilterChange({ ...filters, month: value })}>
                                <SelectTrigger id='month' className='w-40'>
                                    <SelectValue placeholder='Select' />
                                </SelectTrigger>
                                <SelectContent>
                                    {months
                                        .filter((m) => m.IVRM_Month_Name && m.Is_Active)
                                        .map((month) => (
                                            <SelectItem key={month.IVRM_Month_Id} value={month.IVRM_Month_Name.trim()}>
                                                {month.IVRM_Month_Name.trim()}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {/* Year Filter */}
                    <div className='space-y-2'>
                        <Label htmlFor='year' className='font-medium text-foreground text-sm'>
                            Year: <span className='text-red-500'>*</span>
                        </Label>
                        {isLoading ? (
                            <div className='h-10 w-32 animate-pulse rounded-md bg-muted' />
                        ) : years.length === 0 ? (
                            <div className='text-muted-foreground text-sm'>No years available</div>
                        ) : (
                            <Select value={filters.year} onValueChange={(value) => onFilterChange({ ...filters, year: value })}>
                                <SelectTrigger id='year' className='w-32'>
                                    <SelectValue placeholder='Select' />
                                </SelectTrigger>
                                <SelectContent>
                                    {years
                                        .filter((y) => y.HRMLY_LeaveYear && y.HRMLY_ActiveFlag)
                                        .map((year) => (
                                            <SelectItem key={year.HRMLY_Id} value={year.HRMLY_LeaveYear}>
                                                {year.HRMLY_LeaveYear}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
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
