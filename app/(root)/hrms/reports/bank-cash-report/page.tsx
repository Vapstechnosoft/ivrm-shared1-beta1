'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useReportDepartments,
    useReportDesignations,
    useReportGroupTypes,
    useMasterMonths,
    useMasterPaymentModeList,
    useMasterYears
} from '@/hooks/hrms/useReports';
import { RefreshCw, Search, Loader2, Download, Printer } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface SelectOption {
    value: string;
    label: string;
}

const BankCashReportSchema = z.object({
    groupType: z.array(z.string()).min(1, 'Group type is required'),
    department: z.array(z.string()).min(1, 'Department is required'),
    designation: z.array(z.string()).min(1, 'Designation is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().min(1, 'Year is required'),
    bankCash: z.string().min(1, 'Payment type is required')
});

type FormFields = z.infer<typeof BankCashReportSchema>;

const mockApiResponse = {
    employeeDetails: [
        {
            employeeCode: 'VVSA11',
            employeeName: 'KIRAN   KUMAR',
            netSalary: 12500.0,
            bankAccountNumber: '1234567890',
            ifscCode: 'SBIN0001234',
            branch: 'MG Road Branch'
        },
        {
            employeeCode: 'VVS049',
            employeeName: 'PALLAVI   C',
            netSalary: 9000.0,
            bankAccountNumber: '9876543210',
            ifscCode: 'HDFC0002345',
            branch: 'Jayanagar Branch'
        },
        {
            employeeCode: 'VVSA18',
            employeeName: 'RAFIQ  ',
            netSalary: 12000.0,
            bankAccountNumber: '5555666677',
            ifscCode: 'ICIC0003456',
            branch: 'Indiranagar Branch'
        },
        {
            employeeCode: 'VVS047',
            employeeName: 'NATARAJA  ',
            netSalary: 9090.0,
            bankAccountNumber: '1111222233',
            ifscCode: 'SBIN0004567',
            branch: 'Koramangala Branch'
        },
        {
            employeeCode: 'VVS052',
            employeeName: 'BHAVYA  B  R  ',
            netSalary: 8000.0,
            bankAccountNumber: '4444555566',
            ifscCode: 'HDFC0005678',
            branch: 'Whitefield Branch'
        },
        {
            employeeCode: 'VVS051',
            employeeName: 'JAMES CHANDAN  ',
            netSalary: 9900.0,
            bankAccountNumber: '7777888899',
            ifscCode: 'ICIC0006789',
            branch: 'Electronic City Branch'
        },
        {
            employeeCode: 'VVSA01',
            employeeName: 'BASANNA  H E  ',
            netSalary: 11000.0,
            bankAccountNumber: '2222333344',
            ifscCode: 'SBIN0007890',
            branch: 'Malleshwaram Branch'
        },
        {
            employeeCode: 'VVSA14',
            employeeName: 'MANJUNATH   SP  ',
            netSalary: 7500.0,
            bankAccountNumber: '6666777788',
            ifscCode: 'HDFC0008901',
            branch: 'Banashankari Branch'
        },
        {
            employeeCode: 'VVSA09',
            employeeName: 'KAMALAMMA  ',
            netSalary: 8000.0,
            bankAccountNumber: '9999000011',
            ifscCode: 'ICIC0009012',
            branch: 'Rajajinagar Branch'
        },
        {
            employeeCode: 'VVSA05',
            employeeName: 'BORAIAH  A P  ',
            netSalary: 8500.0,
            bankAccountNumber: '3333444455',
            ifscCode: 'SBIN0010123',
            branch: 'JP Nagar Branch'
        },
        {
            employeeCode: 'VVSA24',
            employeeName: 'PARAMESHWARAPPA  B S  ',
            netSalary: 15000.0,
            bankAccountNumber: '8888999900',
            ifscCode: 'HDFC0011234',
            branch: 'HSR Layout Branch'
        },
        {
            employeeCode: 'VVSA08',
            employeeName: 'JAGADEESHA  ',
            netSalary: 10000.0,
            bankAccountNumber: '5555444433',
            ifscCode: 'ICIC0012345',
            branch: 'BTM Layout Branch'
        },
        {
            employeeCode: 'VVSA10',
            employeeName: 'KARIYANNA  ',
            netSalary: 8000.0,
            bankAccountNumber: '1111000099',
            ifscCode: 'SBIN0013456',
            branch: 'Yelahanka Branch'
        },
        {
            employeeCode: 'VVSA23',
            employeeName: 'SUNANDAMMA  ',
            netSalary: 8000.0,
            bankAccountNumber: '7777666655',
            ifscCode: 'HDFC0014567',
            branch: 'Hebbal Branch'
        },
        {
            employeeCode: 'VVSA07',
            employeeName: 'GOVINDARAJU  ',
            netSalary: 8000.0,
            bankAccountNumber: '4444333322',
            ifscCode: 'ICIC0015678',
            branch: 'Marathahalli Branch'
        },
        {
            employeeCode: 'VVSA03',
            employeeName: 'BHEEMANNA  ',
            netSalary: 9000.0,
            bankAccountNumber: '2222111100',
            ifscCode: 'SBIN0016789',
            branch: 'Bellandur Branch'
        },
        {
            employeeCode: 'VVSA26',
            employeeName: 'VISHALA  B K  ',
            netSalary: 6500.0,
            bankAccountNumber: '9999888877',
            ifscCode: 'HDFC0017890',
            branch: 'Sarjapur Branch'
        },
        {
            employeeCode: 'VVS054',
            employeeName: 'SURYA LAKSHMI  V  S  ',
            netSalary: 7484.0,
            bankAccountNumber: '6666555544',
            ifscCode: 'ICIC0018901',
            branch: 'Domlur Branch'
        },
        {
            employeeCode: 'VVSA32',
            employeeName: 'KAVANA  ',
            netSalary: 6500.0,
            bankAccountNumber: '3333222211',
            ifscCode: 'SBIN0019012',
            branch: 'Richmond Town Branch'
        }
    ]
};

import { zodResolver } from '@hookform/resolvers/zod';


export default function BankCashReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any[]>([]);
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>('Bank');

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

    const watchedGroupTypes = useWatch({ control, name: 'groupType' }) || [];
    const watchedDepartments = useWatch({ control, name: 'department' }) || [];

    const groupTypeIds = watchedGroupTypes.join(',');
    const deptIds = watchedDepartments.join(',');

    const { data: masterGroupTypes, isLoading: masterGroupTypesLoading, isError: masterGroupTypesError } = useReportGroupTypes();

    const {
        data: masterDepartments,
        isLoading: masterDepartmentsLoading,
        isError: masterDepartmentsError
    } = useReportDepartments(groupTypeIds);

    const {
        data: masterDesignations,
        isLoading: masterDesignationsLoading,
        isError: masterDesignationsError
    } = useReportDesignations(groupTypeIds, deptIds);

    const { data: masterMonths, isLoading: masterMonthsLoading, isError: masterMonthsError } = useMasterMonths();

    const { data: masterYears, isLoading: masterYearsLoading, isError: masterYearsError } = useMasterYears();

    const {
        data: masterPaymentModeList,
        isLoading: masterPaymentModeListLoading,
        isError: masterPaymentModeListError
    } = useMasterPaymentModeList();

    const groupTypeOptions: SelectOption[] =
        masterGroupTypes?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DeaparmentsOptions: SelectOption[] =
        masterDepartments?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const DesignationOptions: SelectOption[] =
        masterDesignations?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const MonthsOptions: SelectOption[] =
        masterMonths?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const YearsOptions: SelectOption[] =
        masterYears?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const PaymentModeListOptions: SelectOption[] =
        masterPaymentModeList?.data
            ?.map((item: any) => ({
                value: item.key,
                label: item.value
            }))
            .sort((a: SelectOption, b: SelectOption) => a.label.localeCompare(b.label)) || [];


    const onSearch = async (data: FormFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSelectedPaymentType(data.bankCash);
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
        setSelectedPaymentType('Bank');
        toast.info('Form has been reset');
    };

    const calculateTotal = () => {
        if (reportData.length === 0) return 0;
        return reportData.reduce((sum: number, emp: any) => sum + (emp.netSalary || 0), 0);
    };

    const totalNetSalary = calculateTotal();

    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Bank / Cash Report'
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

                        <div className='flex items-center justify-center space-y-2'>
                            <Controller
                                name='bankCash'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className='flex items-center gap-6'>
                                        {masterPaymentModeListLoading ? (
                                            <div className='text-sm text-white-500'>Loading payment modes...</div>
                                        ) : masterPaymentModeListError ? (
                                            <div className='text-red-500 text-sm'>Error loading payment modes</div>
                                        ) : PaymentModeListOptions.length === 0 ? (
                                            <div className='text-sm text-white-500'>No payment modes available</div>
                                        ) : (
                                            PaymentModeListOptions.map((option: SelectOption) => (
                                                <div key={option.value} className='flex items-center space-x-2'>
                                                    <RadioGroupItem value={option.value} id={option.value.toLowerCase()} />
                                                    <Label htmlFor={option.value.toLowerCase()} className='cursor-pointer font-normal'>
                                                        {option.label} <span className='text-red-500'>*</span>
                                                    </Label>
                                                </div>
                                            ))
                                        )}
                                    </RadioGroup>
                                )}
                            />
                            {errors.bankCash && <FormError>{errors.bankCash.message}</FormError>}
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
                        title='Bank / Cash Report'
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
                                            {selectedPaymentType === 'Bank' && (
                                                <>
                                                    <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                        Bank A/C Number
                                                    </th>
                                                    <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                        IFSC Code
                                                    </th>
                                                    <th className='border border-white-300 px-4 py-3 text-left font-semibold text-sm'>
                                                        Branch
                                                    </th>
                                                </>
                                            )}
                                            <th className='border border-white-300 px-4 py-3 text-right font-semibold text-sm'>
                                                Net Salary
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
                                                {selectedPaymentType === 'Bank' && (
                                                    <>
                                                        <td className='border border-white-300 px-4 py-2 text-left text-sm'>
                                                            {employee.bankAccountNumber}
                                                        </td>
                                                        <td className='border border-white-300 px-4 py-2 text-left text-sm'>
                                                            {employee.ifscCode}
                                                        </td>
                                                        <td className='border border-white-300 px-4 py-2 text-left text-sm'>
                                                            {employee.branch}
                                                        </td>
                                                    </>
                                                )}
                                                <td className='border border-white-300 px-4 py-2 text-right text-sm'>
                                                    ₹
                                                    {employee.netSalary.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </td>
                                            </tr>
                                        ))}

                                        <tr className='border-white-400 border-t-2 bg-white-200 font-bold'>
                                            <td
                                                colSpan={selectedPaymentType === 'Bank' ? 5 : 2}
                                                className='border border-white-300 px-4 py-3 text-left text-sm'>
                                                Total
                                            </td>
                                            <td className='border border-white-300 px-4 py-3 text-right text-sm'>
                                                ₹
                                                {totalNetSalary.toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
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
