'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { exportToExcel } from '@/lib/export-to-file';
import { usePFForm6A } from '@/hooks/hrms/useReports';
import { Loader2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

interface FilterFormValues {
    fromDate: Date | undefined;
    toDate: Date | undefined;
}

export default function PFForm6APage() {
    return (
        <FormProvider>
            <PFForm6AContent />
        </FormProvider>
    );
}

function PFForm6AContent() {
    const [reportData, setReportData] = useState<any[] | null>(null);
    const { control, handleSubmit } = useForm<FilterFormValues>({
        defaultValues: {
            fromDate: undefined,
            toDate: undefined
        }
    });

    const { mutate: generateReport, isPending } = usePFForm6A();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.fromDate || !data.toDate) {
            toast.error('Please select both From and To dates');
            return;
        }

        generateReport({
            fromDate: data.fromDate.toISOString(),
            toDate: data.toDate.toISOString()
        }, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    const data = Array.isArray(res.data) ? res.data : (res.data.alldata || res.data.list || []);
                    setReportData(data);
                    toast.success('Report generated successfully');
                } else {
                    toast.error(res.message || 'No data found');
                }
            }
        });
    };

    const handleExport = () => {
        if (!reportData || reportData.length === 0) {
            toast.error('No data to export');
            return;
        }

        const exportColumns = [
            { label: 'PF Account No', value: 'hrmE_PFAccNo' },
            { label: 'UAN No', value: 'hrmE_PFuAN' },
            { label: 'Employee Name', value: 'empName' },
            { label: 'Wages', value: 'amountofWages' },
            { label: 'Basic', value: 'basicvalue' },
            { label: 'DA', value: 'davalue' },
            { label: 'EPF', value: 'hreS_EPF' },
            { label: 'FPF', value: 'hreS_FPF' },
            { label: 'Ac 21', value: 'hreS_Ac21' },
            { label: 'Ac 22', value: 'hreS_Ac22' },
            { label: 'Ac 5', value: 'hreS_Ac5' }
        ];

        const processedContent = reportData.map((row: any) => ({
            ...row,
            empName: `${row.hrmE_EmployeeFirstName || ''} ${row.hrmE_EmployeeMiddleName || ''} ${row.hrmE_EmployeeLastName || ''}`.trim()
        }));

        exportToExcel('PF_Form_6A', JSON.stringify(exportColumns), JSON.stringify(processedContent));
    };

    const columns = [
        {
            id: 'slNo',
            header: 'SL.No',
            cell: ({ row }: any) => row.index + 1
        },
        {
            accessorKey: 'hrmE_PFAccNo',
            header: 'PF Acc No'
        },
        {
            accessorKey: 'hrmE_PFuAN',
            header: 'UAN'
        },
        {
            header: 'Employee Name',
            cell: ({ row }: any) => {
                const e = row.original;
                return `${e.hrmE_EmployeeFirstName || ''} ${e.hrmE_EmployeeMiddleName || ''} ${e.hrmE_EmployeeLastName || ''}`.trim();
            }
        },
        {
            accessorKey: 'amountofWages',
            header: 'Wages',
            cell: ({ row }: any) => Number(row.original.amountofWages || 0).toFixed(2)
        },
        {
            accessorKey: 'basicvalue',
            header: 'Basic',
            cell: ({ row }: any) => Number(row.original.basicvalue || 0).toFixed(2)
        },
        {
            accessorKey: 'davalue',
            header: 'DA',
            cell: ({ row }: any) => Number(row.original.davalue || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_EPF',
            header: 'EPF',
            cell: ({ row }: any) => Number(row.original.hreS_EPF || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_FPF',
            header: 'FPF',
            cell: ({ row }: any) => Number(row.original.hreS_FPF || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_Ac21',
            header: 'Ac 21',
            cell: ({ row }: any) => Number(row.original.hreS_Ac21 || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_Ac22',
            header: 'Ac 22',
            cell: ({ row }: any) => Number(row.original.hreS_Ac22 || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_Ac5',
            header: 'Ac 5',
            cell: ({ row }: any) => Number(row.original.hreS_Ac5 || 0).toFixed(2)
        }
    ];

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>PF Form 6A Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title="Report Criteria" variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label>From Date <span className='text-destructive'>*</span></Label>
                            <Controller name='fromDate' control={control} render={({ field }) => (
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                    placeholder="Select From Date"
                                />
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>To Date <span className='text-destructive'>*</span></Label>
                            <Controller name='toDate' control={control} render={({ field }) => (
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                    placeholder="Select To Date"
                                />
                            )} />
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <Button type='submit' disabled={isPending} className='w-32'>
                            {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                            Generate
                        </Button>
                    </div>
                </form>
            </CollapsibleSection>

            {reportData && (
                <CollapsibleSection title="Report Details" defaultOpen={true} className='shadow-md border'
                    rightElement={
                        <div className='flex gap-2'>
                            <Button variant='outline' size='sm' onClick={handleExport} className='gap-2'>
                                <Download className='h-4 w-4' />
                                Export
                            </Button>
                        </div>
                    }
                >
                    <GenericDataTable
                        data={reportData}
                        columns={columns}
                        totalItems={reportData.length}
                        isPaginationRequired={false}
                        isSearchRequired={false}
                        isLoading={isPending}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
