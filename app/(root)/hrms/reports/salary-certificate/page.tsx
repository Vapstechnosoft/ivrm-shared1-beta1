'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDepartments, useMasterDesignations, useMasterGroupTypes, useMasterMonths, useMasterYears } from '@/hooks/hrms/useReports';
import { type FormFields, SalaryCertificateSchema } from '@/schemas/hrms/employee-category-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const mockEmployees = [
    { key: '1208', value: 'ANUSHA T' },
    { key: 'EMP002', value: 'KIRAN KUMAR' },
    { key: 'EMP003', value: 'PALLAVI C' },
    { key: 'EMP004', value: 'RAFIQ' },
    { key: 'EMP005', value: 'NATARAJA' }
];

const mockApiResponse = {
    institutionDetails: {
        mI_Name: 'Vidya Vikasa Vidya Samsthe (R)',
        mI_Address1: 'Basaveshwara Talkies rd',
        mI_Address2: 'Gayatri circle',
        mI_Address3: 'karantaka',
        mI_Pincode: 577501,
        mI_ContactDetails: 'Ph No: 8194220904 Email Id : vvvsoffice@gmail.com'
    },
    currentemployeeDetails: {
        hrmE_EmployeeFirstName: 'ANUSHA ',
        hrmE_EmployeeLastName: 'T',
        hrmE_EmployeeCode: 'VVS015'
    },
    designationName: 'Asst. Teacher',
    employeeSalaryslipDetails: [
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'BASIC PAY',
            Amount: 7020.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'HRA',
            Amount: 1404.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'DA',
            Amount: 2808.0
        },
        {
            HRMED_EarnDedFlag: 'Earning',
            HRMED_Name: 'OTHER ALLOWANCE',
            Amount: 2268.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'PF CONT',
            Amount: 1179.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'ESIC CONT',
            Amount: 0.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'PT',
            Amount: 0.0
        },
        {
            HRMED_EarnDedFlag: 'Deduction',
            HRMED_Name: 'TDS',
            Amount: 0.0
        }
    ]
};

export default function SalaryCertificatePage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useMasterGroupTypes();

    const { data: masterDepartments, isLoading: masterDepartmentsLoading, isError: masterDepartmentsError } = useMasterDepartments();

    const { data: masterDesignations, isLoading: masterDesignationsLoading, isError: masterDesignationsError } = useMasterDesignations();

    const { data: masterMonths, isLoading: masterMonthsLoading, isError: masterMonthsError } = useMasterMonths();

    const { data: masterYears, isLoading: masterYearsLoading, isError: masterYearsError } = useMasterYears();

    const groupTypeOptions =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DepartmentsOptions =
        masterDepartments?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DesignationOptions =
        masterDesignations?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const MonthsOptions =
        masterMonths?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const YearsOptions =
        masterYears?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const EmployeeOptions = mockEmployees.map((emp) => ({
        value: emp.key,
        label: emp.value
    }));

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(SalaryCertificateSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            month: '',
            year: '',
            employee: ''
        },
        mode: 'onChange'
    });

    const onSearch = async (data: FormFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Salary certificate generated successfully!');
            setReportData(mockApiResponse);
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate certificate');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        reset({
            groupType: [],
            department: [],
            designation: [],
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

    const calculateGrossEarning = () => {
        if (!reportData) return 0;
        return reportData.employeeSalaryslipDetails
            .filter((item: any) => item.HRMED_EarnDedFlag === 'Earning')
            .reduce((sum: number, item: any) => sum + item.Amount, 0);
    };

    const calculateTotalDeductions = () => {
        if (!reportData) return 0;
        return reportData.employeeSalaryslipDetails
            .filter((item: any) => item.HRMED_EarnDedFlag === 'Deduction')
            .reduce((sum: number, item: any) => sum + item.Amount, 0);
    };

    const calculateNetSalary = () => {
        return calculateGrossEarning() - calculateTotalDeductions();
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const grossEarning = calculateGrossEarning();
    const totalDeductions = calculateTotalDeductions();
    const netSalary = calculateNetSalary();

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Salary Certificate'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
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

                {reportData && (
                    <CollapsibleSection
                        title='Salary Certificate'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='space-y-6 p-6 '>
                            <div className='space-y-4'>
                                <Label className='mx-auto block text-center text-gray-600 underline'>Salary Certificate</Label>

                                <p className='text-justify leading-relaxed'>
                                    This is to certify that Mr/Ms.{' '}
                                    <span className='font-semibold'>
                                        {reportData.currentemployeeDetails.hrmE_EmployeeFirstName}
                                        {reportData.currentemployeeDetails.hrmE_EmployeeLastName}
                                    </span>{' '}
                                    (Employee Code:{' '}
                                    <span className='font-semibold'>{reportData.currentemployeeDetails.hrmE_EmployeeCode}</span>) is working
                                    in Our Institution as a <span className='font-semibold'>{reportData.designationName}</span> and his/her
                                    monthly emoluments are as follows.
                                </p>
                            </div>

                            {/* Salary Table */}
                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-white-300 border-b-2 bg-white-100'>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Pay & Allowance
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>Amount</th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Deductions
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const earnings = reportData.employeeSalaryslipDetails.filter(
                                                (item: any) => item.HRMED_EarnDedFlag === 'Earning'
                                            );
                                            const deductions = reportData.employeeSalaryslipDetails.filter(
                                                (item: any) => item.HRMED_EarnDedFlag === 'Deduction'
                                            );
                                            const maxRows = Math.max(earnings.length, deductions.length);

                                            return Array.from({ length: maxRows }).map((_, index) => (
                                                <tr key={index} className='hover:bg-white-50'>
                                                    <td className='border border-white-300 px-4 py-2 text-sm'>
                                                        {earnings[index]?.HRMED_Name || ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                        {earnings[index]
                                                            ? `₹${earnings[index].Amount.toLocaleString('en-IN', {
                                                                  minimumFractionDigits: 2,
                                                                  maximumFractionDigits: 2
                                                              })}`
                                                            : ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-sm'>
                                                        {deductions[index]?.HRMED_Name || ''}
                                                    </td>
                                                    <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                        {deductions[index]
                                                            ? `₹${deductions[index].Amount.toLocaleString('en-IN', {
                                                                  minimumFractionDigits: 2,
                                                                  maximumFractionDigits: 2
                                                              })}`
                                                            : ''}
                                                    </td>
                                                </tr>
                                            ));
                                        })()}

                                        <tr className='border-white-400 border-t-2 bg-white-200 font-bold'>
                                            <td className='border border-white-300 px-4 py-3 text-sm'>Gross Earning:</td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {grossEarning.toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-sm'>Gross Deduction:</td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {totalDeductions.toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex justify-end'>
                                <div className='rounded-lg border bg-white-50 px-6 py-4'>
                                    <div className='flex items-center gap-4'>
                                        <span className='font-semibold text-lg'>Net Salary:</span>
                                        <span className='font-bold text-gray-600 text-xl'>
                                            ₹
                                            {netSalary.toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-end justify-between border-t pt-6'>
                                <div>
                                    <p className='font-medium text-sm'>Date: {getTodayDate()}</p>
                                </div>
                                <div className='text-right'>
                                    <div className='mb-16' />
                                    <p className='font-semibold'>Principal</p>
                                </div>
                            </div>

                            {/* Action Buttons at Bottom */}
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
                                    className='no-print order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                    <Printer className='mr-2 h-4 w-4' />
                                    Print
                                </Button>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
