'use client';

import { useRef, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
//import { useReactToPrint } from 'react-to-print';
//Commented due to Build Error
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import { exportToExcel } from '@/lib/export-to-file';
import {
    useESIReport,
    useReportDepartments,
    useReportDesignations,
    useReportGroupTypes
} from '@/hooks/hrms/useReports';
import { Loader2, Search, Download, Printer } from 'lucide-react';
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
    groupType: string[];
    department: string[];
    designation: string[];
}

export default function ESIReportPage() {
    return (
        <FormProvider>
            <ESIReportContent />
        </FormProvider>
    );
}

function ESIReportContent() {
    const [reportData, setReportData] = useState<any>(null);
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
        defaultValues: {
            year: '',
            month: '',
            groupType: [],
            department: [],
            designation: []
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');

    // Queries - Reusing hooks from cumulative-salary-report for reliability
    const { data: yearsData } = useLeaveYearDropdown();
    const { data: groupTypesData } = useReportGroupTypes();

    const groupTypeIds = watchedGroupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);

    const deptIds = watchedDepartment?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    const { mutate: generateReport, isPending } = useESIReport();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.year || !data.month) {
            toast.error('Please select Year and Month');
            return;
        }

        const selectedYearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year);
        const yearString = selectedYearObj?.hrmlY_LeaveYear || data.year;

        const selectedMonthObj = MONTH_LIST.find(m => m.id.toString() === data.month);
        const monthName = selectedMonthObj?.name || '';

        generateReport({
            MI_Id: 30,
            hreS_Year: yearString,
            hreS_Month: monthName,
            groupTypeselected: data.groupType.map(Number),
            departmentselected: data.department.map(Number),
            designationselected: data.designation.map(Number)
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
        const dataForExport = reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : []);
        if (!dataForExport || dataForExport.length === 0) {
            toast.error('No data to export');
            return;
        }

        const exportColumns = [
            { label: 'Employee Code', value: 'hrmE_EmployeeCode' },
            { label: 'Employee Name', value: 'employeeName' },
            { label: 'Working Days', value: 'hreS_WorkingDays' },
            { label: 'Basic Amount', value: 'basicamount' },
            { label: 'Employee Contribution', value: 'employeeContibution' },
            { label: 'Employer Contribution', value: 'employerContibution' },
            { label: 'Total Amount', value: 'totalAmount' }
        ];

        const processedContent = dataForExport.map((row: any) => ({
            ...row,
            employeeName: row.employeeName || row.EmployeeName || `${row.hrmE_EmployeeFirstName || ''} ${row.hrmE_EmployeeMiddleName || ''} ${row.hrmE_EmployeeLastName || ''}`.trim(),
            hreS_WorkingDays: row.hreS_WorkingDays || row.HRES_WorkingDays || 0
        }));

        exportToExcel('ESI_Report', JSON.stringify(exportColumns), JSON.stringify(processedContent));
    };

    const columns = [
        {
            id: 'slNo',
            header: 'SL.No',
            cell: ({ row }: any) => row.index + 1
        },
        {
            accessorKey: 'hrmE_EmployeeCode',
            header: 'Code'
        },
        {
            accessorKey: 'employeeName',
            header: 'Employee Name'
        },
        {
            accessorKey: 'hreS_WorkingDays',
            header: 'Days',
            cell: ({ row }: any) => row.original.hreS_WorkingDays || row.original.HRES_WorkingDays || 0
        },
        {
            accessorKey: 'basicamount',
            header: 'Basic',
            cell: ({ row }: any) => Number(row.original.basicamount || row.original.basicAmount || 0).toFixed(2)
        },
        {
            accessorKey: 'employeeContibution',
            header: 'Emp. Cont.',
            cell: ({ row }: any) => Number(row.original.employeeContibution || row.original.EmployeeContibution || 0).toFixed(2)
        },
        {
            accessorKey: 'employerContibution',
            header: 'Empr. Cont.',
            cell: ({ row }: any) => Number(row.original.employerContibution || row.original.EmployerContibution || 0).toFixed(2)
        },
        {
            accessorKey: 'totalAmount',
            header: 'Total',
            cell: ({ row }: any) => Number(row.original.totalAmount || 0).toFixed(2)
        }
    ];

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>ESI Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title="Report Criteria" variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
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
                                        {MONTH_LIST.map((m: any) => (
                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Group Type</Label>
                            <Controller name='groupType' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={groupTypesData?.data?.map((gt: any) => ({
                                        label: gt.value,
                                        value: gt.key.toString()
                                    })) || []}
                                    defaultValue={field.value}
                                    onValueChange={(vals) => {
                                        field.onChange(vals);
                                        // Reset children
                                        setValue('department', []);
                                        setValue('designation', []);
                                    }}
                                    placeholder="Select Group Types"
                                />
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Department</Label>
                            <Controller name='department' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={departmentsData?.data?.map((d: any) => ({
                                        label: d.hrmD_DepartmentName,
                                        value: d.hrmD_Id.toString()
                                    })) || []}
                                    defaultValue={field.value}
                                    onValueChange={(vals) => {
                                        field.onChange(vals);
                                        // Reset child
                                        setValue('designation', []);
                                    }}
                                    placeholder="Select Departments"
                                    disabled={!watchedGroupType.length}
                                />
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Designation</Label>
                            <Controller name='designation' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={designationsData?.data?.map((d: any) => ({
                                        label: d.hrmdeS_DesignationName,
                                        value: d.hrmdeS_Id.toString()
                                    })) || []}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select Designations"
                                    disabled={!watchedDepartment.length}
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
                        data={reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : [])}
                        columns={columns}
                        totalItems={(reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : [])).length}
                        isPaginationRequired={false}
                        isSearchRequired={false}
                        isLoading={isPending}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
