'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import {
    useReportDepartments,
    useReportDesignations,
    useReportGroupTypes,
    useSearchEmployeeContribution,
    useEmployeeContributionOnload
} from '@/hooks/hrms/useReports';
import { Loader2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { exportToExcel } from '@/lib/export-to-file';

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
    formatType: string;
}

export default function EmployeeContributionReportPage() {
    return (
        <FormProvider>
            <EmployeeContributionContent />
        </FormProvider>
    );
}

function EmployeeContributionContent() {
    const [reportData, setReportData] = useState<any>(null);
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
        defaultValues: {
            year: '',
            month: '',
            groupType: [],
            department: [],
            designation: [],
            formatType: 'Overall'
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');

    // Queries - Using global and cascading hooks for reliability
    const { data: yearsData } = useLeaveYearDropdown();
    const { data: groupTypesData } = useReportGroupTypes();

    const groupTypeIds = watchedGroupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);

    const deptIds = watchedDepartment?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    const { mutate: generateReport, isPending } = useSearchEmployeeContribution();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.year || !data.month) {
            toast.error('Please select Year and Month');
            return;
        }

        const selectedYear = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year)?.hrmlY_LeaveYear || '';

        const payload = {
            hreS_Year: selectedYear,
            hreS_Month: data.month,
            groupTypeselected: data.groupType.map(Number),
            departmentselected: data.department.map(Number),
            designationselected: data.designation.map(Number)
        };

        generateReport(payload, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    setReportData(res.data);
                    toast.success(res.message || 'Report generated successfully');
                } else {
                    toast.error(res.message || 'No data found');
                }
            }
        });
    };

    const handleExport = () => {
        const dataForExport = reportData?.alldata || reportData?.employeeDetails || reportData?.list || (Array.isArray(reportData) ? reportData : []);
        if (!dataForExport || dataForExport.length === 0) {
            toast.error('No data to export');
            return;
        }

        const exportColumns = [
            { label: 'Code', value: 'hrmE_EmployeeCode' },
            { label: 'Employee Name', value: 'empName' },
            { label: 'Father/Husband Name', value: 'fatherHusbandName' },
            { label: 'DOB', value: 'dob' },
            { label: 'Gender', value: 'ivrmmG_GenderName' },
            { label: 'PF Date', value: 'pfDate' },
            { label: 'PF No', value: 'hrmE_PFAccNo' },
            { label: 'ESI No', value: 'hrmE_ESIAccNo' },
            { label: 'Days', value: 'hreS_WorkingDays' },
            { label: 'Basic', value: 'basicvalue' },
            { label: 'DA', value: 'davalue' },
            { label: 'Wages', value: 'amountofWages' },
            { label: 'PF Amount', value: 'pfAmount' },
            { label: 'EPF', value: 'hreS_EPF' },
            { label: 'FPF', value: 'hreS_FPF' },
            { label: 'Ac 21', value: 'hreS_Ac21' },
            { label: 'Ac 22', value: 'hreS_Ac22' },
            { label: 'Ac 5', value: 'hreS_Ac5' }
        ];

        const processedContent = dataForExport.map((row: any) => ({
            ...row,
            empName: `${row.hrmE_EmployeeFirstName || ''} ${row.hrmE_EmployeeMiddleName || ''} ${row.hrmE_EmployeeLastName || ''}`.trim(),
            dob: row.hrmE_DOB ? format(new Date(row.hrmE_DOB), 'dd-MM-yyyy') : '',
            pfDate: row.hrmE_PFDate ? format(new Date(row.hrmE_PFDate), 'dd-MM-yyyy') : '',
            hreS_WorkingDays: row.hreS_WorkingDays || row.hre_WorkingDays || row.HRE_WorkingDays || 0,
            basicvalue: row.basicvalue || 0,
            davalue: row.davalue || 0,
            amountofWages: row.amountofWages || 0,
            pfAmount: row.pfAmount || 0,
            hreS_EPF: row.hreS_EPF || row.hre_EPF || row.HRE_EPF || 0,
            hreS_FPF: row.hreS_FPF || row.hre_FPF || row.HRE_FPF || 0,
            hreS_Ac21: row.hreS_Ac21 || 0,
            hreS_Ac22: row.hreS_Ac22 || 0,
            hreS_Ac5: row.hreS_Ac5 || 0
        }));

        exportToExcel('E_PF_Contribution_Register', JSON.stringify(exportColumns), JSON.stringify(processedContent));
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
            accessorKey: 'hrmE_EmployeeFirstName',
            header: 'Employee Name',
            cell: ({ row }: any) => {
                const e = row.original;
                return `${e.hrmE_EmployeeFirstName || ''} ${e.hrmE_EmployeeMiddleName || ''} ${e.hrmE_EmployeeLastName || ''}`.trim();
            }
        },
        {
            accessorKey: 'fatherHusbandName',
            header: 'Father/Husband Name',
            cell: ({ row }: any) => row.original.fatherHusbandName || '-'
        },
        {
            accessorKey: 'hrmE_DOB',
            header: 'DOB',
            cell: ({ row }: any) => row.original.hrmE_DOB ? format(new Date(row.original.hrmE_DOB), 'dd-MM-yyyy') : '-'
        },
        {
            accessorKey: 'ivrmmG_GenderName',
            header: 'Gender'
        },
        {
            accessorKey: 'hrmE_PFDate',
            header: 'PF Date',
            cell: ({ row }: any) => row.original.hrmE_PFDate ? format(new Date(row.original.hrmE_PFDate), 'dd-MM-yyyy') : '-'
        },
        {
            accessorKey: 'hrmE_PFAccNo',
            header: 'PF No'
        },
        {
            accessorKey: 'hreS_WorkingDays',
            header: 'Days',
            cell: ({ row }: any) => row.original.hreS_WorkingDays || row.original.hre_WorkingDays || row.HRE_WorkingDays || 0
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
            accessorKey: 'amountofWages',
            header: 'Wages',
            cell: ({ row }: any) => Number(row.original.amountofWages || 0).toFixed(2)
        },
        {
            accessorKey: 'pfAmount',
            header: 'PF Amount',
            cell: ({ row }: any) => Number(row.original.pfAmount || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_EPF',
            header: 'EPF',
            cell: ({ row }: any) => Number(row.original.hreS_EPF || row.original.hre_EPF || row.HRE_EPF || 0).toFixed(2)
        },
        {
            accessorKey: 'hreS_FPF',
            header: 'FPF',
            cell: ({ row }: any) => Number(row.original.hreS_FPF || row.original.hre_FPF || row.HRE_EPF || 0).toFixed(2)
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
                <h2 className='text-2xl font-bold tracking-tight'>E-PF Contribution Register</h2>
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
                                            <SelectItem key={m.id} value={m.name}>
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
                        data={reportData?.alldata || reportData?.employeeDetails || reportData?.list || (Array.isArray(reportData) ? reportData : [])}
                        columns={columns}
                        totalItems={(reportData?.alldata || reportData?.employeeDetails || reportData?.list || (Array.isArray(reportData) ? reportData : [])).length}
                        isPaginationRequired={false}
                        isSearchRequired={false}
                        isLoading={isPending}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
