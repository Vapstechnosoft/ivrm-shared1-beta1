'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterYears, useYearWiseSalaryDetails, useMonthWiseSalaryDetails } from '@/hooks/hrms/useReports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';
import { type MonthlySalaryDetail, getMonthlySalaryDetailColumns } from './_components/columns';
import { DepartmentBreakdownDialog } from './_components/department-breakdown-dialog';

const monthEndReportSchema = z.object({
    year: z.string().min(1, 'Year is required')
});

type FormFields = z.infer<typeof monthEndReportSchema>;

export default function HRMSMonthEndReportPage() {
    const [selectedMonth, setSelectedMonth] = useState<MonthlySalaryDetail | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const { data: masterYears, isLoading: masterYearsLoading, isError: masterYearsError } = useMasterYears();

    const {
        control,
        watch,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(monthEndReportSchema),
        defaultValues: {
            year: ''
        },
        mode: 'onChange'
    });

    const selectedYear = watch('year');

    // API Hooks
    const { data: yearSalaryResponse, isLoading: isYearLoading } = useYearWiseSalaryDetails(selectedYear);
    const { data: monthSalaryResponse, isLoading: isMonthLoading } = useMonthWiseSalaryDetails(
        selectedYear,
        selectedMonth?.month || ''
    );

    const reportData: MonthlySalaryDetail[] =
        yearSalaryResponse?.success && yearSalaryResponse.data
            ? yearSalaryResponse.data.map((item: any, index: number) => ({
                id: index + 1,
                month: item.month,
                year: selectedYear,
                netSalary: item.netamount,
                createdAt: new Date()
            }))
            : [];

    const YearsOptions =
        masterYears?.data?.map((item: any) => ({
            value: item.key,
            label: item.value
        })) || [];

    const columns = getMonthlySalaryDetailColumns((monthData) => {
        setSelectedMonth(monthData);
        setIsDialogOpen(true);
    });


    const chartData = reportData?.map((item) => ({
        month: item.month.substring(0, 3),
        'Net Salary': item.netSalary
    }));

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
                    title='Salary Details'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='no-print slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='space-y-6'>
                        <div className='flex flex-row justify-center'>
                            <div className='w-full max-w-md space-y-2'>
                                <Label htmlFor='year' className='font-medium text-gray-900 text-sm'>
                                    Financial Year: <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='year'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select Financial Year' />
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
                </CollapsibleSection>

                {reportData && reportData.length > 0 && (
                    <div id='printable-report' ref={printRef}>
                        <CollapsibleSection
                            title='Salary Details'
                            defaultOpen={true}
                            variant='outline'
                            size='md'
                            className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                            <GenericDataTable<MonthlySalaryDetail>
                                data={reportData}
                                columns={columns}
                                isLoading={isYearLoading}
                                showViewOptions={true}
                                columnPinning={{ right: ['viewDetails'] }}
                                loadingMessage='Loading salary details...'
                                noDataTitle='No Salary Data Found'
                                noDataDescription='No salary records available for the selected year'
                                errorTitle='Error Loading Salary Data'
                            />

                        </CollapsibleSection>

                        <CollapsibleSection
                            title='Salary Analytics'
                            defaultOpen={true}
                            variant='outline'
                            size='md'
                            className='slide-in-from-top-4 mt-4 animate-in shadow-lg duration-300'>
                            <div className='space-y-6 p-6'>
                                <div className='mt-4'>
                                    <h3 className='mb-6 text-center font-semibold text-lg'>Monthly Salary Breakdown</h3>
                                    <ResponsiveContainer width='100%' height={400}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='month' angle={-45} textAnchor='end' height={80} />
                                            <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                            <Legend />
                                            <Bar dataKey='Net Salary' fill='#22c55e' />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>

            {/* Department Breakdown Dialog */}
            <DepartmentBreakdownDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                monthName={selectedMonth?.month || ''}
                year={selectedYear}
                data={(monthSalaryResponse?.success && monthSalaryResponse.data ? monthSalaryResponse.data : []) as any}
                isLoading={isMonthLoading}
            />
        </div>
    );
}

