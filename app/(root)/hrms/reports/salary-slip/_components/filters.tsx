'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table/data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { EmployeeSalarySlipDisplay } from './columns';
import { getSalarySlipColumns } from './columns';
export interface SalarySlipFilters {
    groupType: number[];
    department: number[];
    designation: number[];
    month: string;
    year: string;
    slipPerPage: string;
    options: {
        lopDays: boolean;
        leaveDetails: boolean;
        panCardNo: boolean;
        bankDetails: boolean;
    };
}
interface SalarySlipFiltersProps {
    filters: SalarySlipFilters;
    groupTypes: any[];
    departments: any[];
    designations: any[];
    months: any[];
    years: any[];
    employees: EmployeeSalarySlipDisplay[];
    filteredEmployees: EmployeeSalarySlipDisplay[];
    searchTerm: string;
    selectedCount: number;
    isLoading: boolean;
    onFilterChange: (filters: SalarySlipFilters) => void;
    onSearchChange: (searchTerm: string) => void;
    onOptionChange: (option: keyof SalarySlipFilters['options'], checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onSelectEmployee: (employeeId: number, checked: boolean) => void;
    onGenerateSlip: () => void;
    onCancel: () => void;
}
export function SalarySlipFilters({
    filters,
    groupTypes,
    departments,
    designations,
    months,
    years,
    employees: _employees,
    filteredEmployees,
    searchTerm,
    selectedCount,
    isLoading,
    onFilterChange,
    onSearchChange,
    onOptionChange,
    onSelectAll,
    onSelectEmployee,
    onGenerateSlip,
    onCancel
}: SalarySlipFiltersProps) {
    const [_currentYear, setCurrentYear] = useState<number | null>(null);
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);
    const columns = getSalarySlipColumns({ onSelectAll, onSelectEmployee });
    return (
        <CollapsibleSection
            title='Salary Slip Configuration'
            description='Configure filters and options for salary slip generation'
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            {/* Filter Section - Row 1 */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Group Type Filter */}
                <div className='space-y-2'>
                    <Label>Group Type</Label>
                    <MultiSelect
                        options={groupTypes.map((gt) => ({
                            label: gt.value || gt.HRMGT_EmployeeGroupType,
                            value: (gt.key || gt.HRMGT_Id).toString()
                        }))}
                        defaultValue={filters.groupType.map((id) => id.toString())}
                        onValueChange={(values) =>
                            onFilterChange({
                                ...filters,
                                groupType: values.map((v) => Number.parseInt(v))
                            })
                        }
                        placeholder='Select group types'
                    />
                </div>
                {/* Department Filter */}
                <div className='space-y-2'>
                    <Label>Department</Label>
                    <MultiSelect
                        options={departments.map((dept) => ({
                            label: dept.hrmD_DepartmentName || dept.HRMD_DepartmentName,
                            value: (dept.hrmD_Id || dept.HRMD_Id).toString()
                        }))}
                        defaultValue={filters.department.map((id) => id.toString())}
                        onValueChange={(values) =>
                            onFilterChange({
                                ...filters,
                                department: values.map((v) => Number.parseInt(v))
                            })
                        }
                        placeholder='Select departments'
                    />
                </div>
                {/* Designation Filter */}
                <div className='space-y-2'>
                    <Label>Designation</Label>
                    <MultiSelect
                        options={designations.map((desg) => ({
                            label: desg.hrmdeS_DesignationName || desg.HRMDES_DesignationName,
                            value: (desg.hrmdeS_Id || desg.HRMDES_Id).toString()
                        }))}
                        defaultValue={filters.designation.map((id) => id.toString())}
                        onValueChange={(values) =>
                            onFilterChange({
                                ...filters,
                                designation: values.map((v) => Number.parseInt(v))
                            })
                        }
                        placeholder='Select designations'
                    />
                </div>
            </div>
            {/* Filter Section - Row 2 */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Month Filter */}
                <div className='mt-3 mb-3 space-y-2'>
                    <label htmlFor='month-select' className='font-medium text-foreground text-sm'>
                        Month
                    </label>
                    <Select value={filters.month} onValueChange={(value) => onFilterChange({ ...filters, month: value })}>
                        <SelectTrigger id='month-select'>
                            <SelectValue placeholder='Select month' />
                        </SelectTrigger>
                        <SelectContent>
                            {months
                                .filter((month: any) => {
                                    const value =
                                        month.monthName ||
                                        month.IVRM_Month_Name ||
                                        month.value ||
                                        month.name ||
                                        month.monthId?.toString() ||
                                        month.IVRM_Month_Id?.toString();
                                    return value && value.toString().trim() !== '';
                                })
                                .map((month: any, index: number) => {
                                    const monthValue =
                                        month.monthName ||
                                        month.IVRM_Month_Name ||
                                        month.value ||
                                        month.name ||
                                        month.monthId?.toString() ||
                                        month.IVRM_Month_Id?.toString();
                                    const monthLabel =
                                        month.monthName ||
                                        month.IVRM_Month_Name ||
                                        month.value ||
                                        month.name ||
                                        month.monthId ||
                                        month.IVRM_Month_Id;
                                    const key = month.monthId || month.IVRM_Month_Id || month.key || index;
                                    return (
                                        <SelectItem key={`month-${index}-${key}`} value={monthValue}>
                                            {monthLabel}
                                        </SelectItem>
                                    );
                                })}
                            {months.length === 0 && <div className='px-2 py-1.5 text-muted-foreground text-sm'>No months available</div>}
                        </SelectContent>
                    </Select>
                </div>
                {/* Year Filter */}
                <div className='mt-3 mb-3 space-y-2'>
                    <label htmlFor='year-select' className='font-medium text-foreground text-sm'>
                        Year
                    </label>
                    <Select value={filters.year} onValueChange={(value) => onFilterChange({ ...filters, year: value })}>
                        <SelectTrigger id='year-select'>
                            <SelectValue placeholder='Select year' />
                        </SelectTrigger>
                        <SelectContent>
                            {years
                                .map((year: any, index: number) => {
                                    const yearValue =
                                        year.hrmlY_LeaveYear || year.HRMLY_LeaveYear || year.yearName || year.yearId?.toString();
                                    const yearLabel = year.hrmlY_LeaveYear || year.HRMLY_LeaveYear || year.yearName || year.yearId;
                                    const key = year.hrmlY_Id || year.HRMLY_Id || year.yearId || index;
                                    return (
                                        <SelectItem key={`year-${index}-${key}`} value={yearValue}>
                                            {yearLabel}
                                        </SelectItem>
                                    );
                                })}
                            {years.length === 0 && <div className='px-2 py-1.5 text-muted-foreground text-sm'>No years available</div>}
                        </SelectContent>
                    </Select>
                </div>
                {/* Slip/page Filter */}
                <div className='mt-3 mb-3 space-y-2'>
                    <Label>Slip/page</Label>
                    <Select value={filters.slipPerPage} onValueChange={(value) => onFilterChange({ ...filters, slipPerPage: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder='Select' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key='slip-per-page-1' value='1'>
                                1 slip per page
                            </SelectItem>
                            <SelectItem key='slip-per-page-2' value='2'>
                                2 slips per page
                            </SelectItem>
                            {/* <SelectItem key='slip-per-page-3' value='3'>
                                3 slips per page
                            </SelectItem>
                            <SelectItem key='slip-per-page-4' value='4'>
                                4 slips per page
                            </SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* Options Section */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='mt-3 flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                        id='lop-days-checkbox'
                        checked={filters.options.lopDays}
                        onCheckedChange={(checked) => onOptionChange('lopDays', !!checked)}
                    />
                    <Label htmlFor='lop-days-checkbox'>LOP Days</Label>
                </div>
                <div className='mt-3 flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                        id='leave-details-checkbox'
                        checked={filters.options.leaveDetails}
                        onCheckedChange={(checked) => onOptionChange('leaveDetails', !!checked)}
                    />
                    <Label htmlFor='leave-details-checkbox'>Leave Details</Label>
                </div>
                <div className='mt-3 flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                        id='pan-card-checkbox'
                        checked={filters.options.panCardNo}
                        onCheckedChange={(checked) => onOptionChange('panCardNo', !!checked)}
                    />
                    <Label htmlFor='pan-card-checkbox'>Pan Card No.</Label>
                </div>
                <div className='mt-3 flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                        id='bank-details-checkbox'
                        checked={filters.options.bankDetails}
                        onCheckedChange={(checked) => onOptionChange('bankDetails', !!checked)}
                    />
                    <Label htmlFor='bank-details-checkbox'>Bank Details</Label>
                </div>
            </div>
            {/* Employee Table with Search */}
            <div className='space-y-4'>
                <div className='mt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='font-medium text-foreground text-sm'>
                            Employee List ({filteredEmployees.length} employees)
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Name or Code..."
                                className="pl-8 h-9"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                    {selectedCount > 0 && <span className='text-muted-foreground text-sm'>{selectedCount} selected</span>}
                </div>
                {/* Data Table */}
                <div className='salary-slip-table-wrapper'>
                    <DataTable
                        isLoading={isLoading}
                        columns={columns}
                        data={filteredEmployees}
                        totalItems={filteredEmployees.length}
                        showViewOptions={true}
                        isSearchRequired={false}
                        isPaginationRequired={false}
                        scrollable={true}
                        maxHeight="250px"
                        columnPinning={{ left: ['select', 'id'] }}
                    />
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end'>
                <Button variant='outline' onClick={onCancel}>
                    <X className='mr-2 h-4 w-4' />
                    CANCEL
                </Button>
                <Button onClick={onGenerateSlip} disabled={selectedCount === 0}>
                    <FileText className='mr-2 h-4 w-4' />
                    GENERATE SLIP
                </Button>
            </div>
        </CollapsibleSection>
    );
}
