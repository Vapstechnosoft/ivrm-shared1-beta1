'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportDepartments, useReportDesignations, useReportGroupTypes } from '@/hooks/hrms/useReports';
import { useLeaveYearDropdown, useMonthDropdown } from '@/hooks/hrms/useMasters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the form fields type
type LoanReportFormFields = {
    groupType: string[];
    department: string[];
    designation: string[];
    reportType: 'All' | 'Individual';
    month: string;
    year: string;
    employee: string;
};

// Zod schema for form validation
const LoanReportSchema = z
    .object({
        groupType: z.array(z.string()).min(1, 'Select at least one group type'),
        department: z.array(z.string()).min(1, 'Select at least one department'),
        designation: z.array(z.string()).min(1, 'Select at least one designation'),
        reportType: z.enum(['All', 'Individual']),
        month: z.string().min(1, 'Month is required').optional().or(z.literal('')),
        year: z.string().min(1, 'Year is required').optional().or(z.literal('')),
        employee: z.string().min(1, 'Employee is required').optional().or(z.literal(''))
    })
    .refine((data) => (data.reportType === 'All' && data.month && data.year) || (data.reportType === 'Individual' && data.employee), {
        message: 'Please fill all required fields based on report type',
        path: ['reportType']
    });

const mockEmployees = [
    { key: 'VVS015', value: 'ANUSHA T' },
    { key: 'VVS023', value: 'KIRAN KUMAR' },
    { key: 'VVS031', value: 'PALLAVI C' },
    { key: 'VVS042', value: 'RAFIQ' },
    { key: 'VVS056', value: 'NATARAJA' }
];

const mockLoanData = [
    {
        employeeName: 'ANUSHA T',
        employeeId: 'VVS015',
        department: 'Teaching',
        loanAmount: 50000,
        loanPurpose: 'Personal Emergency',
        installments: 12,
        applicationDate: '15/08/2024',
        status: 'Approved'
    },
    {
        employeeName: 'KIRAN KUMAR',
        employeeId: 'VVS023',
        department: 'Administration',
        loanAmount: 75000,
        loanPurpose: 'Education',
        installments: 24,
        applicationDate: '22/09/2024',
        status: 'Pending'
    },
    {
        employeeName: 'PALLAVI C',
        employeeId: 'VVS031',
        department: 'Teaching',
        loanAmount: 30000,
        loanPurpose: 'Medical',
        installments: 10,
        applicationDate: '10/10/2024',
        status: 'Approved'
    },
    {
        employeeName: 'RAFIQ',
        employeeId: 'VVS042',
        department: 'Support Staff',
        loanAmount: 25000,
        loanPurpose: 'Home Repair',
        installments: 8,
        applicationDate: '05/11/2024',
        status: 'Rejected'
    },
    {
        employeeName: 'NATARAJA',
        employeeId: 'VVS056',
        department: 'Administration',
        loanAmount: 100000,
        loanPurpose: 'Vehicle Purchase',
        installments: 36,
        applicationDate: '20/11/2024',
        status: 'Approved'
    }
];

export default function LoanReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<LoanReportFormFields>({
        resolver: zodResolver(LoanReportSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            reportType: 'All',
            month: '',
            year: '',
            employee: ''
        },
        mode: 'onChange'
    });

    const watchReportType = watch('reportType');
    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');

    const groupTypeIds = watchedGroupType?.join(',') || '';
    const deptIds = watchedDepartment?.join(',') || '';

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useReportGroupTypes();

    const { data: masterDepartments, isLoading: masterDepartmentsLoading, isError: masterDepartmentsError } = useReportDepartments(groupTypeIds);

    const { data: masterDesignations, isLoading: masterDesignationsLoading, isError: masterDesignationsError } = useReportDesignations(groupTypeIds, deptIds);

    const { data: masterMonths, isLoading: masterMonthsLoading, isError: masterMonthsError } = useMonthDropdown();

    const { data: masterYears, isLoading: masterYearsLoading, isError: masterYearsError } = useLeaveYearDropdown();

    const groupTypeOptions =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key.toString(),
            label: item.value
        })) || [];

    const DepartmentsOptions =
        masterDepartments?.data?.map((item: any) => ({
            value: item.hrmD_Id.toString(),
            label: item.hrmD_DepartmentName
        })) || [];

    const DesignationOptions =
        masterDesignations?.data?.map((item: any) => ({
            value: item.hrmdeS_Id.toString(),
            label: item.hrmdeS_DesignationName
        })) || [];

    const MonthsOptions =
        masterMonths?.data?.map((item: any) => ({
            value: item.key.toString(),
            label: item.value
        })) || [];

    const YearsOptions =
        masterYears?.data?.map((item: any) => ({
            value: item.hrmlY_Id.toString(),
            label: item.hrmlY_LeaveYear
        })) || [];

    const EmployeeOptions = mockEmployees.map((emp) => ({
        value: emp.key,
        label: emp.value
    }));



    const onSearch = async (data: LoanReportFormFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            let filteredData = mockLoanData;
            if (data.reportType === 'Individual' && data.employee) {
                filteredData = mockLoanData.filter((loan) => loan.employeeId === data.employee);
            }

            toast.success('Loan report generated successfully!');
            setReportData(filteredData);
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        reset({
            groupType: [],
            department: [],
            designation: [],
            reportType: 'All',
            month: '',
            year: '',
            employee: ''
        });
        setReportData(null);
        toast.info('Form has been reset');
    };
    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };

    const handleReportTypeChange = (value: 'All' | 'Individual') => {
        setValue('reportType', value);

        // Clear fields based on selection
        if (value === 'All') {
            setValue('employee', '');
        } else {
            setValue('month', '');
            setValue('year', '');
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'text-green-600 font-semibold';
            case 'pending':
                return 'text-yellow-600 font-semibold';
            case 'rejected':
                return 'text-red-600 font-semibold';
            default:
                return 'text-gray-600';
        }
    };
    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Employee Loan Report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
                        <div className='mt-2 flex justify-center'>
                            <div className='space-y-2'>
                                <Controller
                                    name='reportType'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={(value: 'All' | 'Individual') => {
                                                handleReportTypeChange(value);
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                            className='flex items-center gap-6'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='All' id='all' />
                                                <Label htmlFor='all' className='cursor-pointer font-normal'>
                                                    All
                                                </Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='Individual' id='individual' />
                                                <Label htmlFor='individual' className='cursor-pointer font-normal'>
                                                    Individual
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                                {errors.reportType && <FormError>{errors.reportType.message}</FormError>}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            <div className='space-y-2'>
                                <Label htmlFor='group-type' className='font-medium text-sm text-white-900'>
                                    Group Type: <span className='text-red-500'>*</span>
                                </Label>
                                {masterGroupTypesLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : groupTypeOptions.length === 0 ? (
                                    <div className='text-sm text-white-500'>No group types available</div>
                                ) : masterGroupTypesError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
                                        <Controller
                                            name='groupType'
                                            control={control}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={groupTypeOptions}
                                                    defaultValue={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder='Select Group Types'
                                                    className='w-full'
                                                    maxHeight={240}
                                                />
                                            )}
                                        />
                                        {errors.groupType && <FormError>{errors.groupType.message}</FormError>}
                                    </>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='department' className='font-medium text-sm text-white-900'>
                                    Department: <span className='text-red-500'>*</span>
                                </Label>
                                {masterDepartmentsLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : DepartmentsOptions.length === 0 ? (
                                    <div className='text-sm text-white-500'>No departments available</div>
                                ) : masterDepartmentsError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
                                        <Controller
                                            name='department'
                                            control={control}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={DepartmentsOptions}
                                                    defaultValue={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder='Select Departments'
                                                    className='w-full'
                                                    maxHeight={240}
                                                />
                                            )}
                                        />
                                        {errors.department && <FormError>{errors.department.message}</FormError>}
                                    </>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='designation' className='font-medium text-sm text-white-900'>
                                    Designation: <span className='text-red-500'>*</span>
                                </Label>
                                {masterDesignationsLoading ? (
                                    <div className='h-10 w-full animate-pulse rounded-md bg-white-200' />
                                ) : DesignationOptions.length === 0 ? (
                                    <div className='text-sm text-white-500'>No designations available</div>
                                ) : masterDesignationsError ? (
                                    <SelectItem value='error' disabled>
                                        Error loading data
                                    </SelectItem>
                                ) : (
                                    <>
                                        <Controller
                                            name='designation'
                                            control={control}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={DesignationOptions}
                                                    defaultValue={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder='Select Designations'
                                                    className='w-full'
                                                    maxHeight={240}
                                                />
                                            )}
                                        />
                                        {errors.designation && <FormError>{errors.designation.message}</FormError>}
                                    </>
                                )}
                            </div>
                        </div>

                        {watchReportType === 'All' ? (
                            <div className='flex justify-center'>
                                <div className='grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='month' className='font-medium text-sm text-white-900'>
                                            Month: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='month'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Month' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterMonthsLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : masterMonthsError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading data
                                                            </SelectItem>
                                                        ) : (
                                                            MonthsOptions?.map((opt: any) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.month && <FormError>{errors.month.message}</FormError>}
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='year' className='font-medium text-sm text-white-900'>
                                            Year: <span className='text-red-500'>*</span>
                                        </Label>
                                        <Controller
                                            name='year'
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select Year' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masterYearsLoading ? (
                                                            <SelectItem value='loading' disabled>
                                                                Loading...
                                                            </SelectItem>
                                                        ) : masterYearsError ? (
                                                            <SelectItem value='error' disabled>
                                                                Error loading data
                                                            </SelectItem>
                                                        ) : (
                                                            YearsOptions?.map((opt: any) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.year && <FormError>{errors.year.message}</FormError>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex justify-center'>
                                <div className='w-full max-w-md space-y-2'>
                                    <Label htmlFor='employee' className='font-medium text-sm text-white-900'>
                                        Employee: <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='employee'
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Employee' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {EmployeeOptions.map((opt: any) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.employee && <FormError>{errors.employee.message}</FormError>}
                                </div>
                            </div>
                        )}

                        <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSearching || isSubmitting}
                                className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                Reset
                            </Button>
                            <Button
                                type='button'
                                onClick={handleSubmit(onSearch)}
                                disabled={isSearching || isSubmitting}
                                className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                {isSearching ? (
                                    <>
                                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                        Searching...
                                    </>
                                ) : (
                                    <div className='flex items-center'>
                                        <Search className='mr-2 h-4 w-4' />
                                        Search
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>

                {reportData && reportData.length > 0 && (
                    <CollapsibleSection
                        title='Loan Report'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='space-y-6 p-6'>
                            <div className='text-center'>
                                <h2 className='font-bold text-2xl'>Employee Loan Report</h2>
                                <p className='text-gray-600 text-sm'>Generated on: {getTodayDate()}</p>
                            </div>

                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-white-300 border-b-2 bg-white-100'>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>SI. No</th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Employee Name
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Employee ID
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Department
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>
                                                Loan Amount
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Loan Purpose
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>
                                                Installments
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>
                                                Application Date
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((loan: any, index: number) => (
                                            <tr key={index} className='hover:bg-white-50'>
                                                <td className='border border-white-300 px-4 py-2 text-center text-sm'>{index + 1}</td>
                                                <td className='border border-white-300 px-4 py-2 text-sm'>{loan.employeeName}</td>
                                                <td className='border border-white-300 px-4 py-2 text-sm'>{loan.employeeId}</td>
                                                <td className='border border-white-300 px-4 py-2 text-sm'>{loan.department}</td>
                                                <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                    ₹
                                                    {loan.loanAmount.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-sm'>{loan.loanPurpose}</td>
                                                <td className='border border-white-300 px-4 py-2 text-center text-sm'>
                                                    {loan.installments}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-center text-sm'>
                                                    {loan.applicationDate}
                                                </td>
                                                <td
                                                    className={`border border-white-300 px-4 py-2 text-center text-sm ${getStatusColor(
                                                        loan.status
                                                    )}`}>
                                                    {loan.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='mt-4 flex items-end justify-between pt-6'>
                                <div>
                                    <p className='font-medium text-sm'>Date: {getTodayDate()}</p>
                                </div>
                                <div className='text-center'>
                                    <div className='mb-16' />
                                    <div className='border-gray-400 border-t pt-2'>
                                        <p className='font-semibold'>Manager/HR Signature</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handlePrint}
                                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                    <Printer className='mr-2 h-4 w-4' />
                                    Print
                                </Button>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}

                {reportData && reportData.length === 0 && (
                    <CollapsibleSection
                        title='Loan Report'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='p-6 text-center'>
                            <p className='text-gray-500'>No loan records found for the selected criteria.</p>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
