'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/extension/field';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import {
    useEmployeeStrengthReport,
    useReportDepartments,
    useReportDesignations,
    useReportGroupTypes,
    useEmployeeStrengthOnload
} from '@/hooks/hrms/useReports';
import { Loader2, Search, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { exportToExcel } from '@/lib/export-to-file';
import { printEmployeeStrengthReport } from './_components/print-utils';

interface FilterFormValues {
    groupType: string[];
    department: string[];
    designation: string[];
    allEmployee: boolean;
    departmentwise: boolean;
    leftEmployee: boolean;
    fromDate: Date | undefined;
    toDate: Date | undefined;
}

export default function EmployeeStrengthReportPage() {
    return (
        <FormProvider>
            <EmployeeStrengthReportContent />
        </FormProvider>
    );
}

function EmployeeStrengthReportContent() {
    const [reportData, setReportData] = useState<any>(null);
    const { control, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
        defaultValues: {
            groupType: [],
            department: [],
            designation: [],
            allEmployee: false,
            departmentwise: false,
            leftEmployee: false,
            fromDate: new Date(),
            toDate: new Date()
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');
    const watchedAllEmployee = watch('allEmployee');
    const watchedDepartmentwise = watch('departmentwise');
    const watchedLeftEmployee = watch('leftEmployee');

    // Queries - Using generic cascading hooks for reliable loading (ref Cumulative Report)
    const { data: onloadData } = useEmployeeStrengthOnload(30, Number(localStorage.getItem('userId')) || 0);
    const { data: groupTypesData } = useReportGroupTypes();

    const groupTypeIds = watchedGroupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);

    const deptIds = watchedDepartment?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    const { mutate: generateReport, isPending } = useEmployeeStrengthReport();

    const onSubmit = (data: FilterFormValues) => {
        if (data.groupType.length === 0 || data.department.length === 0 || data.designation.length === 0) {
            toast.error('Please select Group Type, Department and Designation');
            return;
        }

        const payload = {
            MI_Id: 30,
            designationSelected: data.designation.map(Number),
            departmentSelected: data.department.map(Number),
            groupTypeSelected: data.groupType.map(Number),
            fromDate: data.fromDate ? format(data.fromDate, 'yyyy-MM-dd') : '',
            toDate: data.toDate ? format(data.toDate, 'yyyy-MM-dd') : '',
            allEmployee: data.allEmployee,
            departmentwise: data.departmentwise,
            leftEmployee: data.leftEmployee
        };

        generateReport(payload, {
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
            { label: 'SL.No', value: 'slNo' },
            { label: 'Group Type', value: 'groupTypeName' },
            { label: 'Department', value: 'departmentName' },
            ...(!watchedDepartmentwise && !watchedLeftEmployee ? [{ label: 'Designation', value: 'designationName' }] : []),
            { label: 'Total No. of Emp', value: 'totalEmployees' }
        ];

        const processedContent = dataForExport.map((row: any, index: number) => ({
            ...row,
            slNo: index + 1
        }));

        exportToExcel('EmployeeStrengthReport', JSON.stringify(exportColumns), JSON.stringify(processedContent));
    };

    const handlePrint = () => {
        if (!reportData) {
            toast.error('No data to print');
            return;
        }
        printEmployeeStrengthReport(reportData, watchedDepartmentwise, watchedLeftEmployee);
    };

    const columns = useMemo(() => {
        if (!reportData) return [];

        const baseColumns = [
            {
                id: 'serialNumber',
                header: 'Sl.No',
                cell: ({ row }: any) => row.index + 1,
            },
            {
                accessorKey: 'groupTypeName',
                header: 'Group Type',
            },
            {
                accessorKey: 'departmentName',
                header: 'Department',
            }
        ];

        if (!watchedDepartmentwise && !watchedLeftEmployee) {
            baseColumns.push({
                accessorKey: 'designationName',
                header: 'Designation',
            } as any);
        }

        baseColumns.push({
            accessorKey: 'totalEmployees',
            header: 'Total No. of Emp',
            cell: ({ row }: any) => <div className="text-right">{row.original.totalEmployees}</div>
        } as any);

        return baseColumns;
    }, [reportData, watchedDepartmentwise, watchedLeftEmployee]);

    const totalEmployeesSum = useMemo(() => {
        const dataArr = reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : []);
        return dataArr?.reduce((sum: number, item: any) => sum + (item.totalEmployees || item.total_employees || 0), 0) || 0;
    }, [reportData]);

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>Employee Strength Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title="Report Criteria" variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                        {/* Group Type */}
                        <div className='space-y-2'>
                            <Label>Group Type <span className='text-destructive'>*</span></Label>
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

                        {/* Department */}
                        <div className='space-y-2'>
                            <Label>Department <span className='text-destructive'>*</span></Label>
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

                        {/* Designation */}
                        <div className='space-y-2'>
                            <Label>Designation <span className='text-destructive'>*</span></Label>
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

                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 bg-muted/30 p-4 rounded-lg border'>
                        <div className='flex flex-col space-y-4'>
                            <div className='flex items-center space-x-2'>
                                <Controller name='allEmployee' control={control} render={({ field }) => (
                                    <Checkbox id="allEmployee" checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                                <Label htmlFor="allEmployee" className="cursor-pointer">All Employee</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Controller name='departmentwise' control={control} render={({ field }) => (
                                    <Checkbox id="departmentwise" checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                                <Label htmlFor="departmentwise" className="cursor-pointer">Department wise</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Controller name='leftEmployee' control={control} render={({ field }) => (
                                    <Checkbox id="leftEmployee" checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                                <Label htmlFor="leftEmployee" className="cursor-pointer">Left Employee</Label>
                            </div>
                        </div>

                        {!watchedAllEmployee && (
                            <>
                                <div className='space-y-2'>
                                    <Label>From Date</Label>
                                    <Controller name='fromDate' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} placeholder="Select From Date" />
                                    )} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>To Date</Label>
                                    <Controller name='toDate' control={control} render={({ field }) => (
                                        <DatePicker date={field.value} setDate={field.onChange} placeholder="Select To Date" />
                                    )} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button type='button' variant="outline" onClick={() => setValue('groupType', [])}>Cancel</Button>
                        <Button type='submit' disabled={isPending} className='w-32'>
                            {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
                            Search
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
                            <Button variant='outline' size='sm' onClick={handlePrint} className='gap-2'>
                                <Printer className='h-4 w-4' />
                                Print
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        <div className="text-center space-y-1 py-4 border-b">
                            <h3 className="text-xl font-bold">{reportData.institutionDetails?.mI_Name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {reportData.institutionDetails?.mI_Address1} {reportData.institutionDetails?.mI_Address2} {reportData.institutionDetails?.mI_Address3}
                            </p>
                            <p className="text-sm text-muted-foreground">{reportData.institutionDetails?.mI_Pincode}</p>
                            <h4 className="text-lg font-semibold pt-2">Employee Strength Report</h4>
                        </div>

                        <GenericDataTable
                            data={reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : [])}
                            columns={columns}
                            totalItems={(reportData?.employeeDetails || reportData?.alldata || reportData?.list || (Array.isArray(reportData) ? reportData : [])).length}
                            isPaginationRequired={false}
                            isSearchRequired={false}
                            showSearchColumns={false}
                            isLoading={isPending}
                        />

                        {/* Footer Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Employees</p>
                                <p className="text-2xl font-bold">{totalEmployeesSum}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Working Employees</p>
                                <p className="text-2xl font-bold text-green-600">{reportData.totalWorkingEmployees || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Left Employees</p>
                                <p className="text-2xl font-bold text-red-600">{reportData.totalLeftEmployees || 0}</p>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
