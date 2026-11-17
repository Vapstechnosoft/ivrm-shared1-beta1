'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDepartments, useMasterDesignations, useMasterGroupTypes, useMasterMonths, useMasterYears } from '@/hooks/hrms/useReports';

import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
// Define or import your Zod schema for the form fields
import { z } from 'zod';

const BankCashReportSchema = z.object({
    groupType: z.array(z.string()).min(1, 'Group Type is required'),
    department: z.array(z.string()).min(1, 'Department is required'),
    designation: z.array(z.string()).min(1, 'Designation is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().min(1, 'Year is required'),
    bankCash: z.string().min(1)
});

type BankCashReportSchemaFormFields = z.infer<typeof BankCashReportSchema>;
type FormFields = BankCashReportSchemaFormFields;

const mockApiResponse = {
    employeeDetails: [
        {
            employeeCode: 'VVS014',
            employeeName: 'ANNAPOORNESHWARI   DODDAMANE  C K',
            designationName: 'Asst. Teacher',
            totalEarning: 13000.0,
            totalDeduction: 1136.0,
            netSalary: 11864.0
        },
        {
            employeeCode: 'VVS074',
            employeeName: 'ABHISHEK   C',
            designationName: 'Asst. Teacher',
            totalEarning: 16000.0,
            totalDeduction: 0.0,
            netSalary: 16000.0
        },
        {
            employeeCode: 'VVS101',
            employeeName: 'ANURADHA   SE',
            designationName: 'Asst. Teacher',
            totalEarning: 18441.0,
            totalDeduction: 1611.0,
            netSalary: 16830.0
        },
        {
            employeeCode: 'VVS015',
            employeeName: 'ANUSHA   T',
            designationName: 'Asst. Teacher',
            totalEarning: 13500.0,
            totalDeduction: 1179.0,
            netSalary: 12321.0
        },
        {
            employeeCode: 'VVS102',
            employeeName: 'ARCHANA   N G',
            designationName: 'Asst. Teacher',
            totalEarning: 11990.0,
            totalDeduction: 1047.0,
            netSalary: 10943.0
        },
        {
            employeeCode: 'VVS103',
            employeeName: 'CHINNAMBEE   P',
            designationName: 'Asst. Teacher',
            totalEarning: 11000.0,
            totalDeduction: 961.0,
            netSalary: 10039.0
        },
        {
            employeeCode: '139',
            employeeName: 'Dr SWAMY   K N',
            designationName: 'ACADEMIC ADMINISTRATOR',
            totalEarning: 55000.0,
            totalDeduction: 5700.0,
            netSalary: 49300.0
        },
        {
            employeeCode: 'VVS013',
            employeeName: 'KANUMAKKA  Y',
            designationName: 'Accountant',
            totalEarning: 0.0,
            totalDeduction: 0.0,
            netSalary: 0.0
        },
        {
            employeeCode: '1718',
            employeeName: 'Chetan  ',
            designationName: 'Asst. Teacher',
            totalEarning: 0.0,
            totalDeduction: 0.0,
            netSalary: 0.0
        },
        {
            employeeCode: 'VVS009',
            employeeName: 'PRUTHVISHA S M  ',
            designationName: 'Chairman',
            totalEarning: 80000.0,
            totalDeduction: 8200.0,
            netSalary: 71800.0
        },
        {
            employeeCode: '155',
            employeeName: 'ASHA   B S',
            designationName: 'Asst. Teacher',
            totalEarning: 19334.0,
            totalDeduction: 0.0,
            netSalary: 19334.0
        },
        {
            employeeCode: '164',
            employeeName: 'BINDU   G R',
            designationName: 'Asst. Teacher',
            totalEarning: 15000.0,
            totalDeduction: 0.0,
            netSalary: 15000.0
        }
    ]
};

export default function HeadWiseReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any[]>([]);

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

    const DeaparmentsOptions =
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

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(BankCashReportSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            month: '',
            year: '',
            bankCash: 'Bank'
        },
        mode: 'onChange'
    });

    const onSearch = async (data: BankCashReportSchemaFormFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Report generated successfully!');
            setReportData(mockApiResponse.employeeDetails);
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
            month: '',
            year: '',
            bankCash: 'Bank'
        });
        setReportData([]);
        toast.info('Form has been reset');
    };

    const calculateTotalEarning = () => {
        return reportData.reduce((sum, emp) => sum + (emp.totalEarning || 0), 0);
    };

    const calculateTotalDeduction = () => {
        return reportData.reduce((sum, emp) => sum + (emp.totalDeduction || 0), 0);
    };

    const calculateNetSalary = () => {
        return reportData.reduce((sum, emp) => sum + (emp.netSalary || 0), 0);
    };

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Header wise Report'
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
                                ) : DeaparmentsOptions.length === 0 ? (
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
                                                    options={DeaparmentsOptions}
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

                {reportData.length > 0 && (
                    <CollapsibleSection
                        title='Header wise Report'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='mt-2 space-x-4'>
                            <div className='overflow-x-auto rounded-lg border'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-white-300 border-b-2 bg-white-100'>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>S.No</th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Employee Name
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                Designation
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>
                                                Total Earning
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>
                                                Total Deduction
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>
                                                Net Salary
                                            </th>
                                            <th className='border border-white-300 px-4 py-3 text-center font-semibold text-sm'>
                                                Signature
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((employee, index) => (
                                            <tr key={index} className='hover:bg-white-50'>
                                                <td className='border border-white-300 px-4 py-2 text-center text-sm'>{index + 1}</td>
                                                <td className='border border-white-300 px-4 py-2 text-left font-medium text-sm'>
                                                    {employee.employeeName}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-left text-sm'>
                                                    {employee.designationName}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                    ₹
                                                    {employee.totalEarning.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                    ₹
                                                    {employee.totalDeduction.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                    ₹
                                                    {employee.netSalary.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                                <td className='border border-white-300 px-4 py-2 text-center text-sm'>—</td>
                                            </tr>
                                        ))}

                                        <tr className='border-white-400 border-t-2 bg-white-200 font-bold'>
                                            <td colSpan={3} className='border border-white-300 px-4 py-3 text-left text-sm'>
                                                Total
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {calculateTotalEarning().toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {calculateTotalDeduction().toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {calculateNetSalary().toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className='border border-white-300 px-4 py-3' />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
