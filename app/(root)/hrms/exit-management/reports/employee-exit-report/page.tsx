// Refactored by automation script on 2025-10-28T15:40:35.728Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/filters.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithYear } from '@/components/ui/date-picker-year';
import { Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { BarChart3, CalendarIcon, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
type ReportFormData = {
    departments: string[];
    designations: string[];
    fromDate: Date;
    toDate: Date;
    status: string[];
};
const departmentOptions = [
    'IT Education',
    'Sales and Marketing',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Research and Development'
];
const designationOptions = [
    'E-learning coordinator',
    'Client Acquisition',
    'Assistant Business Development Manager',
    'Telecaller Executive',
    'Software Developer',
    'Senior Software Developer',
    'Team Lead',
    'Manager',
    'Director',
    'CEO'
];
const statusOptions = [
    { value: 'ALL', label: 'ALL' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'PENDING', label: 'PENDING' }
];
export default function EmployeeExitReportPage() {
    const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
    const [designationDropdownOpen, setDesignationDropdownOpen] = useState(false);
    const [fromDateOpen, setFromDateOpen] = useState(false);
    const [toDateOpen, setToDateOpen] = useState(false);
    const { handleSubmit, setValue, watch } = useForm<ReportFormData>({
        defaultValues: {
            departments: ['ALL'],
            designations: ['ALL'],
            fromDate: new Date('2024-01-01'),
            toDate: new Date('2024-01-31'),
            status: ['ALL', 'APPROVED', 'REJECTED', 'PENDING']
        }
    });
    const watchedDepartments = watch('departments');
    const watchedDesignations = watch('designations');
    const watchedFromDate = watch('fromDate');
    const watchedToDate = watch('toDate');
    const watchedStatus = watch('status');
    const handleDepartmentToggle = (dept: string) => {
        const current = watchedDepartments || [];
        if (dept === 'ALL') {
            setValue('departments', ['ALL']);
        } else {
            const newSelection = current.includes(dept)
                ? current.filter((d) => d !== dept && d !== 'ALL')
                : [...current.filter((d) => d !== 'ALL'), dept];
            setValue('departments', newSelection.length === 0 ? ['ALL'] : newSelection);
        }
    };
    const handleDesignationToggle = (desig: string) => {
        const current = watchedDesignations || [];
        if (desig === 'ALL') {
            setValue('designations', ['ALL']);
        } else {
            const newSelection = current.includes(desig)
                ? current.filter((d) => d !== desig && d !== 'ALL')
                : [...current.filter((d) => d !== 'ALL'), desig];
            setValue('designations', newSelection.length === 0 ? ['ALL'] : newSelection);
        }
    };
    const handleStatusToggle = (status: string) => {
        const current = watchedStatus || [];
        if (status === 'ALL') {
            setValue('status', ['ALL']);
        } else {
            const newSelection = current.includes(status)
                ? current.filter((s) => s !== status && s !== 'ALL')
                : [...current.filter((s) => s !== 'ALL'), status];
            setValue('status', newSelection.length === 0 ? ['ALL'] : newSelection);
        }
    };
    const onSubmit = (_data: ReportFormData) => {
        // Handle report generation
    };
    const getDisplayText = (items: string[], allText: string) => {
        if (items.includes('ALL') || items.length === 0) return allText;
        return items.length === 1 ? items[0] : `${items.length} selected`;
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title='Employee Exit Report'
                            description='Generate comprehensive exit reports with advanced filtering options'
                        />
                    </div>
                </div>
                {/* Report Form Section */}
                <Card className='shadow-lg'>
                    <CardHeader>
                        <CardTitle className='font-semibold text-gray-800 text-lg'>EMPLOYEE EXIT REPORT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {/* Department Filter */}
                                <div className='space-y-2'>
                                    <Label>
                                        Department <span className='text-red-500'>*</span>
                                    </Label>
                                    <Popover open={departmentDropdownOpen} onOpenChange={setDepartmentDropdownOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full justify-between text-left font-normal'>
                                                <span className='truncate'>{getDisplayText(watchedDepartments, 'All Departments')}</span>
                                                <Search className='h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-80 p-0' align='start'>
                                            <div className='p-3'>
                                                <Input placeholder='search here...' className='mb-3' />
                                                <div className='max-h-60 space-y-2 overflow-y-auto'>
                                                    {['ALL', ...departmentOptions].map((dept) => (
                                                        <div key={dept} className='flex items-center space-x-2'>
                                                            <Checkbox
                                                                id={`dept-${dept}`}
                                                                checked={watchedDepartments?.includes(dept) || false}
                                                                onCheckedChange={() => handleDepartmentToggle(dept)}
                                                            />
                                                            <label
                                                                htmlFor={`dept-${dept}`}
                                                                className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                                {dept}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {/* Designation Filter */}
                                <div className='space-y-2'>
                                    <Label>
                                        Designation <span className='text-red-500'>*</span>
                                    </Label>
                                    <Popover open={designationDropdownOpen} onOpenChange={setDesignationDropdownOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full justify-between text-left font-normal'>
                                                <span className='truncate'>{getDisplayText(watchedDesignations, 'All Designations')}</span>
                                                <Search className='h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-80 p-0' align='start'>
                                            <div className='p-3'>
                                                <Input placeholder='search here...' className='mb-3' />
                                                <div className='max-h-60 space-y-2 overflow-y-auto'>
                                                    {['ALL', ...designationOptions].map((desig) => (
                                                        <div key={desig} className='flex items-center space-x-2'>
                                                            <Checkbox
                                                                id={`desig-${desig}`}
                                                                checked={watchedDesignations?.includes(desig) || false}
                                                                onCheckedChange={() => handleDesignationToggle(desig)}
                                                            />
                                                            <label
                                                                htmlFor={`desig-${desig}`}
                                                                className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                                {desig}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {/* From Date */}
                                <div className='space-y-2'>
                                    <Label>From Date</Label>
                                    <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full justify-start text-left font-normal'>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {watchedFromDate ? format(watchedFromDate, 'dd-MM-yyyy') : 'Select date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <DatePickerWithYear
                                                mode='single'
                                                selected={watchedFromDate}
                                                onDayClick={(day) => {
                                                    setValue('fromDate', day);
                                                    setFromDateOpen(false);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {/* To Date */}
                                <div className='space-y-2'>
                                    <Label>To Date</Label>
                                    <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full justify-start text-left font-normal'>
                                                <CalendarIcon className='mr-2 h-4 w-4' />
                                                {watchedToDate ? format(watchedToDate, 'dd-MM-yyyy') : 'Select date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <DatePickerWithYear
                                                mode='single'
                                                selected={watchedToDate}
                                                onDayClick={(day) => {
                                                    setValue('toDate', day);
                                                    setToDateOpen(false);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            {/* Status Checkboxes */}
                            <div className='space-y-3'>
                                <Label>Status</Label>
                                <div className='flex flex-wrap gap-4'>
                                    {statusOptions.map((status) => (
                                        <div key={status.value} className='flex items-center space-x-2'>
                                            <Checkbox
                                                id={`status-${status.value}`}
                                                checked={watchedStatus?.includes(status.value) || false}
                                                onCheckedChange={() => handleStatusToggle(status.value)}
                                            />
                                            <label
                                                htmlFor={`status-${status.value}`}
                                                className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                {status.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => {
                                        setValue('departments', ['ALL']);
                                        setValue('designations', ['ALL']);
                                        setValue('fromDate', new Date('2024-01-01'));
                                        setValue('toDate', new Date('2024-01-31'));
                                        setValue('status', ['ALL', 'APPROVED', 'REJECTED', 'PENDING']);
                                    }}
                                    disabled={false}
                                    className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                    <X className='mr-2 h-4 w-4' />
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={false}
                                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                    <div className='flex items-center'>
                                        <BarChart3 className='mr-2 h-4 w-4' />
                                        Generate Report
                                    </div>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
