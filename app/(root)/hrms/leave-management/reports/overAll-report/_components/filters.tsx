'use client';
import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
export interface OverallReportFilters {
    status: 'Applied' | 'Approved' | 'Requested' | 'Rejected' | 'PartialApproved';
    groupBy: 'Employee Wise' | 'Leave Wise';
    employee: string;
    company: string;
    leaveName: string;
    fromDate: Date | undefined;
    toDate: Date | undefined;
}
interface OverallReportFiltersProps {
    filters: OverallReportFilters;
    onFilterChange: (key: keyof OverallReportFilters, value: any) => void;
    onReport: () => void;
    onCancel: () => void;
}
export function OverallReportFilters({ filters, onFilterChange, onReport, onCancel }: OverallReportFiltersProps) {
    return (
        <CollapsibleSection
            title='VKS OVERALL REPORT'
            description='Configure filters to generate overall leave report'
            defaultOpen={true}
            variant='default'
            size='lg'
            className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <div className='grid grid-cols-1 gap-4'>
                {/* Status Selection */}
                <div className='flex flex-wrap items-center gap-6'>
                    <label className='flex items-center gap-2 text-sm'>
                        <input type='radio' checked={filters.status === 'Applied'} onChange={() => onFilterChange('status', 'Applied')} />
                        Applied
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input type='radio' checked={filters.status === 'Approved'} onChange={() => onFilterChange('status', 'Approved')} />
                        Approved
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.status === 'Requested'}
                            onChange={() => onFilterChange('status', 'Requested')}
                        />
                        Requested
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input type='radio' checked={filters.status === 'Rejected'} onChange={() => onFilterChange('status', 'Rejected')} />
                        Rejected
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.status === 'PartialApproved'}
                            onChange={() => onFilterChange('status', 'PartialApproved')}
                        />
                        Partial Approved
                    </label>
                </div>
                {/* Group By Selection */}
                <div className='flex items-center gap-6'>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.groupBy === 'Employee Wise'}
                            onChange={() => onFilterChange('groupBy', 'Employee Wise')}
                        />
                        Employee Wise
                    </label>
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            type='radio'
                            checked={filters.groupBy === 'Leave Wise'}
                            onChange={() => onFilterChange('groupBy', 'Leave Wise')}
                        />
                        Leave Wise
                    </label>
                </div>
                {/* Filter Fields */}
                <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-3'>
                    {/* Employee Wise Fields */}
                    {filters.groupBy === 'Employee Wise' && (
                        <div className='md:col-span-1'>
                            <label htmlFor='employee-select' className='font-medium text-sm'>
                                Employee
                            </label>
                            <Select value={filters.employee} onValueChange={(value) => onFilterChange('employee', value)}>
                                <SelectTrigger id='employee-select'>
                                    <SelectValue placeholder='Select or search employee' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL'>All</SelectItem>
                                    <SelectItem value='Steffi Halian'>Steffi Halian</SelectItem>
                                    <SelectItem value='Shruthi NA'>Shruthi NA</SelectItem>
                                    <SelectItem value='Bindhushree N'>Bindhushree N</SelectItem>
                                    <SelectItem value='Chaithra NS'>Chaithra NS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* Leave Wise Fields */}
                    {filters.groupBy === 'Leave Wise' && (
                        <>
                            <div className='md:col-span-1'>
                                <label htmlFor='company-select' className='font-medium text-sm'>
                                    Company Name
                                </label>
                                <Select value={filters.company} onValueChange={(value) => onFilterChange('company', value)}>
                                    <SelectTrigger id='company-select'>
                                        <SelectValue placeholder='Select or search company' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='ALL'>All</SelectItem>
                                        <SelectItem value='Vaps Knowledge Services Pvt Ltd'>Vaps Knowledge Services Pvt Ltd</SelectItem>
                                        <SelectItem value='Vaps Infotech Pvt Ltd'>Vaps Infotech Pvt Ltd</SelectItem>
                                        <SelectItem value='Unnathi Marketing'>Unnathi Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='md:col-span-1'>
                                <label htmlFor='leave-name-select' className='font-medium text-sm'>
                                    Leave Name
                                </label>
                                <Select value={filters.leaveName} onValueChange={(value) => onFilterChange('leaveName', value)}>
                                    <SelectTrigger id='leave-name-select'>
                                        <SelectValue placeholder='Select or search leave' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='ALL'>All</SelectItem>
                                        <SelectItem value='Casual Leave'>Casual Leave</SelectItem>
                                        <SelectItem value='Sick Leave'>Sick Leave</SelectItem>
                                        <SelectItem value='Privilege Leave'>Privilege Leave</SelectItem>
                                        <SelectItem value='Comp Off'>Comp Off</SelectItem>
                                        <SelectItem value='Optional Leave'>Optional Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                    <div className='space-y-2'>
                        <label htmlFor='from-date-input' className='font-medium text-sm'>
                            From Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id='from-date-input'
                                    variant='outline'
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !filters.fromDate && 'text-muted-foreground'
                                    )}>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {filters.fromDate ? format(filters.fromDate, 'dd-MM-yyyy') : 'Select date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <CalendarYear
                                    mode='single'
                                    selected={filters.fromDate}
                                    onDayClick={(day) => onFilterChange('fromDate', day)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='to-date-input' className='font-medium text-sm'>
                            To Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id='to-date-input'
                                    variant='outline'
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !filters.toDate && 'text-muted-foreground'
                                    )}>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {filters.toDate ? format(filters.toDate, 'dd-MM-yyyy') : 'Select date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <CalendarYear
                                    mode='single'
                                    selected={filters.toDate}
                                    onDayClick={(day) => onFilterChange('toDate', day)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Action Buttons */}
                    <div className='mt-2 flex gap-2 md:col-span-3'>
                        <Button onClick={onReport} variant='default'>
                            Report
                        </Button>
                        <Button variant='outline' onClick={onCancel}>
                            <X className='mr-2 h-4 w-4' />
                            Cancel
                        </Button>
                        <Button variant='outline' disabled>
                            Export to Excel
                        </Button>
                        <Button variant='outline' disabled>
                            Print
                        </Button>
                    </div>
                </div>
            </div>
        </CollapsibleSection>
    );
}
