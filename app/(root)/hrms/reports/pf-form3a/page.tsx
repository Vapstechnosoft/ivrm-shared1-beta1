'use client';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterYears } from '@/hooks/hrms/useReports';
import { type PFForm3aFields, PFForm3aSchema } from '@/schemas/hrms/employee-category-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import PFChallan from './_components/columns';

type FormFields = z.infer<typeof PFForm3aSchema>;

const mockEmployees = [
    { key: '1208', value: 'ANUSHA T' },
    { key: 'EMP002', value: 'KIRAN KUMAR' },
    { key: 'EMP003', value: 'PALLAVI C' },
    { key: 'EMP004', value: 'RAFIQ' },
    { key: 'EMP005', value: 'NATARAJA' }
];

const tableProps = {
    contributions: [
        {
            month: 'April',
            amount: 50000,
            epf: 6000,
            epfDifference: 0,
            pensionContribution: 4165,
            total: 10165,
            refund: 0,
            periodFrom: '01-04-2025',
            periodTo: '30-04-2025',
            remarks: ''
        },
        {
            month: 'May',
            amount: 52000,
            epf: 6240,
            epfDifference: 0,
            pensionContribution: 4320,
            total: 10560,
            refund: 0,
            periodFrom: '01-05-2025',
            periodTo: '31-05-2025',
            remarks: ''
        }
    ],
    establishmentName: 'Vidya Vikasa Vidya Samsthe (R)',
    establishmentCode: 'PF',
    establishmentAddress: 'Basaveshwara Talkies rd, Gayatri circle, karantaka, 577501'
};

export default function DepartmentSalaryReportPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');

    const { data: masterYears, isLoading: masterYearsLoading, isError: masterYearsError } = useMasterYears();

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
        resolver: zodResolver(PFForm3aSchema),
        defaultValues: {
            year: '',
            employee: ''
        },
        mode: 'onChange'
    });

    const onSearch = async (data: PFForm3aFields) => {
        setIsSearching(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Get month and year labels for display

            const yearLabel = YearsOptions.find((opt: any) => opt.value === data.year)?.label || data.year;
            const employeeLabel = EmployeeOptions.find((opt: any) => opt.value === data.employee)?.label || data.employee;

            // Store selected values
            setSelectedEmployee(employeeLabel);
            setSelectedYear(yearLabel);

            // Set the report data (in real scenario, this would come from API)
            setReportData(tableProps);

            toast.success('Report generated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsSearching(false);
        }
    };

    const handleReset = () => {
        reset({
            year: '',
            employee: ''
        });
        setReportData(null);
        setSelectedEmployee('');
        setSelectedYear('');
        toast.info('Form has been reset');
    };
    const handleCancel = () => {
        setReportData(null);
        setSelectedEmployee('');
        setSelectedYear('');
    };
    const handlePrint = () => {
        window.print();
    };
    return (
        <div className='min-h-screen p-8'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Form 3A'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
                        <div className='flex justify-center'>
                            <div className='grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2'>
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
                                type='submit'
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
                        title='Form 3A'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <PFChallan
                            contributions={reportData.contributions || []}
                            accountNo='MH/56789/123'
                            employeeName={selectedEmployee}
                            fatherName='-'
                            establishmentName={reportData.establishmentName}
                            establishmentAddress={reportData.establishmentAddress}
                            contributionRate={12}
                            vpfContribution={0}
                            year={selectedYear}
                            onCancel={handleCancel}
                            onPrint={handlePrint}
                            isLoading={false}
                        />
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
