'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDepartments, useMasterDesignations, useMasterGroupTypes, useMasterMonths, useMasterYears } from '@/hooks/hrms/useReports';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, RefreshCw, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

const monthEndReportSchema = z.object({
    groupType: z.array(z.string()).min(1, 'At least one group type is required'),
    department: z.array(z.string()).min(1, 'At least one department is required'),
    designation: z.array(z.string()).min(1, 'At least one designation is required'),
    ieName: z.string().min(1, 'IE Name is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().min(1, 'Year is required')
});

type FormFields = z.infer<typeof monthEndReportSchema>;

const mockMonthEndData = {
    reportData: [
        {
            slNo: 1,
            description: 'Total Students',
            count: 1250,
            sms: 1200,
            email: 1180,
            missingDetails: {
                photo: 45,
                emailId: 70,
                contactNumber: 25
            }
        },
        {
            slNo: 2,
            description: 'Total Staff',
            count: 85,
            sms: 85,
            email: 82,
            missingDetails: {
                photo: 3,
                emailId: 3,
                contactNumber: 0
            }
        },
        {
            slNo: 3,
            description: 'New Admissions',
            count: 45,
            sms: 45,
            email: 40,
            missingDetails: {
                photo: 12,
                emailId: 5,
                contactNumber: 8
            }
        },
        {
            slNo: 4,
            description: 'Attendance Records',
            count: 2850,
            sms: 2850,
            email: 2800,
            missingDetails: {
                photo: 0,
                emailId: 50,
                contactNumber: 15
            }
        },
        {
            slNo: 5,
            description: 'Fee Payments',
            count: 980,
            sms: 950,
            email: 920,
            missingDetails: {
                photo: 0,
                emailId: 60,
                contactNumber: 30
            }
        }
    ]
};

export default function HRMSMonthEndReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

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
        watch,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(monthEndReportSchema),
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            ieName: '',
            month: '',
            year: ''
        },
        mode: 'onChange'
    });

    const selectedMonth = watch('month');
    const selectedYear = watch('year');
    const ieName = watch('ieName');

    const getMonthName = (monthValue: string) => {
        return MonthsOptions.find((m: any) => m.value === monthValue)?.label || '';
    };

    const onSearch = async (data: FormFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setReportData({
                ...mockMonthEndData,
                ieName: data.ieName,
                month: getMonthName(data.month),
                year: data.year,
                date: new Date().toLocaleDateString('en-IN'),
                designation: 'Implementation Engineer'
            });
            toast.success('Report generated successfully!');
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
            ieName: '',
            month: '',
            year: ''
        });
        setReportData(null);
        toast.info('Form has been reset');
    };
    const handlePrint = () => {
        window.print();
    };

    const chartData = reportData?.reportData.map((item: any) => ({
        name: item.description,
        Count: item.count,
        SMS: item.sms,
        Email: item.email
    }));

    const getTotals = () => {
        if (!reportData) return null;
        return reportData.reportData.reduce(
            (acc: any, curr: any) => ({
                count: acc.count + curr.count,
                sms: acc.sms + curr.sms,
                email: acc.email + curr.email,
                photo: acc.photo + curr.missingDetails.photo,
                emailId: acc.emailId + curr.missingDetails.emailId,
                contactNumber: acc.contactNumber + curr.missingDetails.contactNumber
            }),
            { count: 0, sms: 0, email: 0, photo: 0, emailId: 0, contactNumber: 0 }
        );
    };

    const totals = getTotals();

    return (
        <div className='min-h-screen p-8'>
            <style>
                {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-report, #printable-report * {
              visibility: visible;
            }
            #printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Month End Report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='no-print slide-in-from-top-4 animate-in shadow-lg duration-300'>
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

                        <div className='flex justify-center'>
                            <div className='w-full max-w-md space-y-2'>
                                <Label htmlFor='ie-name' className='font-medium text-sm text-white-900'>
                                    IE Name: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='ieName'
                                    control={control}
                                    render={({ field }) => <Input {...field} id='ie-name' placeholder='Enter IE Name' className='w-full' />}
                                />
                                {errors.ieName && <FormError>{errors.ieName.message}</FormError>}
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleReset}
                                disabled={isSearching}
                                className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                                Reset
                            </Button>
                            <Button
                                type='button'
                                onClick={handleSubmit(onSearch)}
                                disabled={isSearching}
                                className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                                {isSearching ? (
                                    <>
                                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className='mr-2 h-4 w-4' />
                                        Search
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>

                {reportData && (
                    <div id='printable-report' ref={printRef}>
                        <CollapsibleSection
                            title='Month End Report'
                            defaultOpen={true}
                            variant='outline'
                            size='md'
                            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                            <div className='space-y-6 p-6'>
                                <div className='space-y-4 text-center'>
                                    <div className='mb-4 flex justify-center'>
                                        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gray-200'>
                                            <span className='text-gray-500 text-xs'>Logo</span>
                                        </div>
                                    </div>
                                    <h1 className='font-bold text-2xl'>
                                        HRMS Month End Report of {reportData.month} - {reportData.year}
                                    </h1>
                                    <h2 className='font-semibold text-xl uppercase'>{reportData.month} MONTH REPORT</h2>
                                </div>

                                <div className='mt-8 overflow-x-auto rounded-lg border'>
                                    <table className='w-full border-collapse'>
                                        <thead>
                                            <tr className='bg-white'>
                                                <th className='w-40 border px-4 py-3 text-left font-semibold'>Name:</th>
                                                <td className='border px-4 py-3' colSpan={7}>
                                                    {reportData.ieName}
                                                </td>
                                            </tr>
                                            <tr className='bg-white'>
                                                <th className='w-40 border px-4 py-3 text-left font-semibold'>Date:</th>
                                                <td className='border px-4 py-3' colSpan={7}>
                                                    {reportData.date}
                                                </td>
                                            </tr>
                                            <tr className='bg-white'>
                                                <th className='w-40 border px-4 py-3 text-left font-semibold'>Designation:</th>
                                                <td className='border px-4 py-3' colSpan={7}>
                                                    {reportData.designation}
                                                </td>
                                            </tr>
                                            <tr className='bg-white'>
                                                <th className='w-40 border px-4 py-3 text-left font-semibold'>Module Name:</th>
                                                <td className='border px-4 py-3' colSpan={7}>
                                                    HRMS
                                                </td>
                                            </tr>

                                            <tr className='border-b-2 bg-white'>
                                                <th className='border px-4 py-3 text-center font-semibold text-sm' rowSpan={2}>
                                                    SI.No
                                                </th>
                                                <th className='border px-4 py-3 text-center font-semibold text-sm' rowSpan={2}>
                                                    Description
                                                </th>
                                                <th className='border px-4 py-3 text-center font-semibold text-sm' rowSpan={2}>
                                                    Count
                                                </th>
                                                <th className='border px-4 py-3 text-center font-semibold text-sm' rowSpan={2}>
                                                    SMS
                                                </th>
                                                <th className='border px-4 py-3 text-center font-semibold text-sm' rowSpan={2}>
                                                    Email
                                                </th>
                                                <th className='border bg-gray-50 px-4 py-2 text-center font-semibold text-sm' colSpan={3}>
                                                    Missing Details
                                                </th>
                                            </tr>
                                            <tr className='border-b-2 bg-gray-50'>
                                                <th className='border px-4 py-2 text-center font-medium text-xs'>Photo</th>
                                                <th className='border px-4 py-2 text-center font-medium text-xs'>Email-ID</th>
                                                <th className='border px-4 py-2 text-center font-medium text-xs'>Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.reportData.map((row: any, index: number) => (
                                                <tr key={index} className='hover:bg-gray-50'>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.slNo}</td>
                                                    <td className='border px-4 py-2 text-left text-sm'>{row.description}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.count}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.sms}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.email}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.missingDetails.photo}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>{row.missingDetails.emailId}</td>
                                                    <td className='border px-4 py-2 text-center text-sm'>
                                                        {row.missingDetails.contactNumber}
                                                    </td>
                                                </tr>
                                            ))}
                                            {totals && (
                                                <tr className='border-t-2 bg-white font-bold'>
                                                    <td className='border px-4 py-3 text-center text-sm' colSpan={2}>
                                                        Total
                                                    </td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.count}</td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.sms}</td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.email}</td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.photo}</td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.emailId}</td>
                                                    <td className='border px-4 py-3 text-center text-sm'>{totals.contactNumber}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='mt-8'>
                                    <h3 className='mb-4 text-center font-semibold text-lg'>Report Analytics</h3>
                                    <ResponsiveContainer width='100%' height={400}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='name' angle={-45} textAnchor='end' height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey='Count' fill='#8884d8' />
                                            <Bar dataKey='SMS' fill='#82ca9d' />
                                            <Bar dataKey='Email' fill='#ffc658' />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className='mt-12 grid grid-cols-3 gap-8 border-t pt-8'>
                                    <div className='text-center'>
                                        <div className='mb-2 h-20 border-gray-300 border-b-2' />
                                        <p className='font-semibold'>Implementation Engineer</p>
                                    </div>
                                    <div className='text-center'>
                                        <div className='mb-2 h-20 border-gray-300 border-b-2' />
                                        <p className='font-semibold'>End User Signature</p>
                                    </div>
                                    <div className='text-center'>
                                        <div className='mb-2 h-20 border-gray-300 border-b-2' />
                                        <p className='font-semibold'>Nodal Officer With Seal</p>
                                    </div>
                                </div>

                                <div className='no-print flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                                    <Button
                                        onClick={handlePrint}
                                        className='order-1 w-fit gap-2 transition-all duration-200 hover:scale-105 sm:order-2'>
                                        <Printer className='h-4 w-4' />
                                        Print
                                    </Button>
                                    <Button
                                        variant='outline'
                                        onClick={() => setReportData(null)}
                                        className='order-2 w-fit gap-2 transition-all duration-200 hover:scale-105 sm:order-1'>
                                        <X className='h-4 w-4' />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}
