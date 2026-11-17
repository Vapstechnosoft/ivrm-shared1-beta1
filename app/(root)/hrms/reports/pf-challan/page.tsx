'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import { exportToExcel } from '@/lib/export-to-file';
import { usePFChallan, usePFChallanOnload } from '@/hooks/hrms/useReports';
import { Loader2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

const MONTH_LIST = [
    { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
    { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
    { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
    { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
];

interface FilterFormValues {
    year: string;
    month: string;
}

export default function PFChallanPage() {
    return (
        <FormProvider>
            <PFChallanContent />
        </FormProvider>
    );
}

function PFChallanContent() {
    const [reportData, setReportData] = useState<any[] | null>(null);
    const { control, handleSubmit } = useForm<FilterFormValues>({
        defaultValues: {
            year: '',
            month: ''
        }
    });

    // Queries - Using facade onload for ID sync
    const { data: onloadData } = usePFChallanOnload(30);

    // Using general master for Years as reference Cumulative Report
    const { data: yearsData } = useLeaveYearDropdown();
    const monthsData = { data: onloadData?.data?.monthdropdown || [] };

    const { mutate: generateReport, isPending } = usePFChallan();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.year || !data.month) {
            toast.error('Please select Year and Month');
            return;
        }


        const selectedYearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year);
        const yearString = selectedYearObj?.hrmlY_LeaveYear?.split('-')[0] || data.year;

        generateReport({
            hreS_Year: yearString,
            hreS_Month: data.month
        }, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    // Robust data binding: handle direct array or nested properties
                    const dataArr = res.data.alldata || res.data.pfreport || (Array.isArray(res.data) ? res.data : []);
                    setReportData(dataArr);
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
            { label: 'Wages', value: 'amountofWages' },
            { label: 'EPF', value: 'hreS_EPF' },
            { label: 'FPF', value: 'hreS_FPF' },
            { label: 'Ac 21', value: 'hreS_Ac21' },
            { label: 'Ac 22', value: 'hreS_Ac22' },
            { label: 'Ac 5', value: 'hreS_Ac5' },
            { label: 'Ac 10', value: 'hreS_Ac10' },
            { label: 'PF Amount', value: 'pfAmount' },
            { label: 'Father/Husband Name', value: 'fatherHusbandName' }
        ];

        exportToExcel('PF_Challan', JSON.stringify(exportColumns), JSON.stringify(reportData));
    };

    const columns = [
        {
            id: 'slNo',
            header: 'SL.No',
            cell: ({ row }: any) => row.index + 1
        },
        {
            accessorKey: 'amountofWages',
            header: 'Wages',
            cell: ({ row }: any) => Number(row.original.amountofWages || 0).toFixed(2)
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
        },
        {
            accessorKey: 'hreS_Ac10',
            header: 'Ac 10',
            cell: ({ row }: any) => Number(row.original.hreS_Ac10 || 0).toFixed(2)
        },
        {
            accessorKey: 'pfAmount',
            header: 'PF Amount',
            cell: ({ row }: any) => Number(row.original.pfAmount || 0).toFixed(2)
        },
        {
            accessorKey: 'fatherHusbandName',
            header: 'Father/Husband Name',
        }
    ];

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>PF Challan Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title="Report Criteria" variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label>Year <span className='text-destructive'>*</span></Label>
                            <Controller name='year' control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearsData?.data?.map((y: any) => (
                                            <SelectItem key={y.hrmlY_Id} value={y.hrmlY_Id.toString()}>
                                                {y.hrmlY_LeaveYear}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Month <span className='text-destructive'>*</span></Label>
                            <Controller name='month' control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthsData?.data?.length > 0 ? (
                                            monthsData.data.map((m: any) => (
                                                <SelectItem key={m.ivrM_Month_Id || m.IVRM_Month_Id} value={m.ivrM_Month_Name || m.IVRM_Month_Name}>
                                                    {m.ivrM_Month_Name || m.IVRM_Month_Name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            MONTH_LIST.map((m) => (
                                                <SelectItem key={m.id} value={m.name}>
                                                    {m.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
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
