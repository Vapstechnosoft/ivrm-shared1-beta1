'use client';

import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
    EmployeePunchAttendanceFormValues,
    useEmployeePunchAttendance,
} from '@/hooks/staff-portal/useEmployeePunchAttendance';
import { IEmployeeDetails } from '@/types/staff-portal/biometric-report/employee-punch-attendance.types';

interface EmployeePunchAttendanceFilterProps {
    form: UseFormReturn<EmployeePunchAttendanceFormValues>;
    employeeDetails: IEmployeeDetails | null;
    onSubmit: (values: EmployeePunchAttendanceFormValues) => void;
    isLoading: boolean;
}

export const EmployeePunchAttendanceFilter = ({
    form,
    employeeDetails,
    onSubmit,
    isLoading,
}: EmployeePunchAttendanceFilterProps) => {
    return (
        <div className='w-full p-4 bg-white rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>
                    EMPLOYEE PUNCH REPORT
                </h3>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                            <div className='flex flex-row items-center gap-2'>
                                <label className='w-1/3 text-sm font-medium text-gray-700 text-right'>
                                    Employee Name:
                                </label>
                                <div className='w-2/3 p-2 bg-gray-50 rounded border border-gray-200 text-sm'>
                                    {employeeDetails
                                        ? `${employeeDetails.empFname} ${employeeDetails.empMname || ''} ${employeeDetails.empLname || ''}`
                                        : 'Loading...'}
                                </div>
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                                <label className='w-1/3 text-sm font-medium text-gray-700 text-right'>
                                    Designation:
                                </label>
                                <div className='w-2/3 p-2 bg-gray-50 rounded border border-gray-200 text-sm'>
                                    {employeeDetails?.hrmdeS_DesignationName || '-'}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex flex-row items-center gap-2'>
                                <label className='w-1/3 text-sm font-medium text-gray-700 text-right'>
                                    Department:
                                </label>
                                <div className='w-2/3 p-2 bg-gray-50 rounded border border-gray-200 text-sm'>
                                    {employeeDetails?.hrmD_DepartmentName || '-'}
                                </div>
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                                <label className='w-1/3 text-sm font-medium text-gray-700 text-right'>
                                    DOJ:
                                </label>
                                <div className='w-2/3 p-2 bg-gray-50 rounded border border-gray-200 text-sm'>
                                    {employeeDetails?.hrmE_DOJ
                                        ? format(new Date(employeeDetails.hrmE_DOJ), 'dd-MM-yyyy')
                                        : '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
                        <FormField
                            control={form.control}
                            name='fromdate'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                                    <FormLabel className='w-1/3 text-right'>
                                        From Date:<span className='text-red-500 ml-1'>*</span>
                                    </FormLabel>
                                    <div className='w-2/3'>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'dd-MM-yyyy')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                    mode='single'
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date('1900-01-01')
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='todate'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                                    <FormLabel className='w-1/3 text-right'>
                                        To Date:<span className='text-red-500 ml-1'>*</span>
                                    </FormLabel>
                                    <div className='w-2/3'>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'dd-MM-yyyy')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                    mode='single'
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date('1900-01-01')
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex justify-center pt-4'>
                        <Button type='submit' disabled={isLoading} className='w-32'>
                            {isLoading ? (
                                'Checking...'
                            ) : (
                                <>
                                    <Search className='w-4 h-4 mr-2' />
                                    Check
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
