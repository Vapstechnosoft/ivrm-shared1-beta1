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
import { usePFForm5 } from '@/hooks/hrms/useReports';
import { Loader2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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

export default function PFForm5Page() {
    return (
        <FormProvider>
            <PFForm5Content />
        </FormProvider>
    );
}

function PFForm5Content() {
    const [reportData, setReportData] = useState<any>(null);
    const { control, handleSubmit } = useForm<FilterFormValues>({
        defaultValues: {
            year: '',
            month: ''
        }
    });

    const { data: yearsData } = useLeaveYearDropdown();
    const { mutate: generateReport, isPending } = usePFForm5();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.year || !data.month) {
            toast.error('Please select Year and Month');
            return;
        }

        const selectedYearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year);
        const yearString = selectedYearObj?.hrmlY_LeaveYear?.split('-')[0] || data.year;

        const selectedMonthObj = MONTH_LIST.find(m => m.id.toString() === data.month);
        const monthName = selectedMonthObj?.name || '';

        generateReport({
            hreS_Year: yearString,
            hreS_Month: monthName
        }, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    setReportData(res.data);
                    toast.success('Report generated successfully');
                } else {
                    toast.error(res.message || 'No data found');
                }
            }
        });
    };

    const handleExport = () => {
        if (!reportData || !reportData.pfreportdetails || reportData.pfreportdetails.length === 0) {
            toast.error('No data to export');
            return;
        }

        const exportColumns = [
            { label: 'PF Account No', value: 'hrmE_PFAccNo' },
            { label: 'Employee Name', value: 'empName' },
            { label: 'Father/Husband Name', value: 'fatherHusbandName' },
            { label: 'Date of Birth', value: 'dob' },
            { label: 'Gender', value: 'ivrmmG_GenderName' },
            { label: 'PF Joining Date', value: 'pfDate' }
        ];

        const processedContent = reportData.pfreportdetails.map((row: any) => ({
            ...row,
            empName: `${row.hrmE_EmployeeFirstName || ''} ${row.hrmE_EmployeeMiddleName || ''} ${row.hrmE_EmployeeLastName || ''}`.trim(),
            dob: row.hrmE_DOB ? format(new Date(row.hrmE_DOB), 'dd-MM-yyyy') : '',
            pfDate: row.hrmE_PFDate ? format(new Date(row.hrmE_PFDate), 'dd-MM-yyyy') : ''
        }));

        exportToExcel('PF_Form_5', JSON.stringify(exportColumns), JSON.stringify(processedContent));
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
            header: 'Employee Name',
            cell: ({ row }: any) => {
                const e = row.original;
                return `${e.hrmE_EmployeeFirstName || ''} ${e.hrmE_EmployeeMiddleName || ''} ${e.hrmE_EmployeeLastName || ''}`.trim();
            }
        },
        {
            accessorKey: 'fatherHusbandName',
            header: 'Father/Husband Name'
        },
        {
            header: 'Date of Birth',
            cell: ({ row }: any) => row.original.hrmE_DOB ? format(new Date(row.original.hrmE_DOB), 'dd-MM-yyyy') : ''
        },
        {
            accessorKey: 'ivrmmG_GenderName',
            header: 'Gender'
        },
        {
            header: 'PF Joining Date',
            cell: ({ row }: any) => row.original.hrmE_PFDate ? format(new Date(row.original.hrmE_PFDate), 'dd-MM-yyyy') : ''
        }
    ];

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>PF Form 5</h2>
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
                                        {MONTH_LIST.map((m) => (
                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
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
                        data={reportData.alldata || reportData.pfreportdetails || []}
                        columns={columns}
                        totalItems={(reportData.alldata || reportData.pfreportdetails || []).length}
                        isPaginationRequired={false}
                        isSearchRequired={false}
                        isLoading={isPending}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
