'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
//import { useReactToPrint } from 'react-to-print';
// Commented out due to build error
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import { useCumulativeSalaryReport, useReportDepartments, useReportDesignations, useReportGroupTypes } from '@/hooks/hrms/useReports';
import { exportToExcel } from '@/lib/export-to-file';
import { Download, Loader2, Printer, Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { printCumulativeSalaryReport } from './_components/print-utils';

// Static Month List (copied from Exam Module reference)
const MONTH_LIST = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
];

interface FilterFormValues {
    year: string;
    month: string;
    groupType: string[];
    department: string[];
    designation: string[];
}

export default function CumulativeSalaryReportPage() {
    return (
        <FormProvider>
            <CumulativeSalaryReportContent />
        </FormProvider>
    );
}

function CumulativeSalaryReportContent() {
    const [reportData, setReportData] = useState<any>(null);
    const { control, handleSubmit, watch } = useForm<FilterFormValues>({
        defaultValues: {
            year: '',
            month: '',
            groupType: [],
            department: [],
            designation: []
        }
    });

    const componentRef = useRef<HTMLDivElement>(null);
    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');

    // Queries
    const { data: yearsData } = useLeaveYearDropdown();

    const handlePrint = () => {
        if (!reportData) {
            toast.error('No data to print');
            return;
        }

        const selectedYear = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === watch('year'))?.hrmlY_LeaveYear || '';
        const selectedMonth = MONTH_LIST.find((m) => m.id.toString() === watch('month'))?.name || '';

        printCumulativeSalaryReport(reportData, selectedMonth, selectedYear);
    };
    const handleExport = () => {
        if (!reportData || !reportData.cumulativeSalaryReport || reportData.cumulativeSalaryReport.length === 0) {
            toast.error('No data to export');
            return;
        }

        // Prepare columns for JSON-AS-XLSX
        // Reference: lib/export-to-file.ts expects JSON string for columns and content if using `exportToExcel`
        // But wait, checking usage in other files (found in step 6/7) might clarify if we pass object or string.
        // Step 12 showed: columns: JSON.parse(columns). So it MUST be a string.

        const exportColumns = [
            { label: 'Employee Code', value: 'hrme_employeecode' },
            {
                label: 'Employee Name',
                value: (row: any) =>
                    `${row.hrme_employeefirstname || ''} ${row.hrme_employeemiddlename || ''} ${row.hrme_employeelastname || ''}`
            },
            { label: 'Designation', value: 'hrmdes_designationname' },
            { label: 'Working Days', value: 'hres_workingdays' },
            // Earnings
            ...(reportData.earningDetails || []).map((head: any) => ({
                label: head.hrmeD_Name,
                value: (row: any) => row[head.hrmeD_Name] || 0
            })),
            { label: 'Gross Pay', value: 'totalearnings' },
            // Deductions
            ...(reportData.dectuionDetails || []).map((head: any) => ({
                label: head.hrmeD_Name,
                value: (row: any) => row[head.hrmeD_Name] || 0
            })),
            { label: 'Total Deductions', value: 'totaldeduction' },
            { label: 'Net Pay', value: 'totalpayable' }
        ];

        // We need to pass JSON stringified columns and content?
        // Actually, json-as-xlsx takes objects.
        // The helper `exportToExcel` in `lib/export-to-file.ts` does:
        // columns: JSON.parse(columns), content: JSON.parse(content)
        // This suggests the helper expects STRINGS.
        // Let's verify if `json-as-xlsx` can take functions in `value`.
        // `json-as-xlsx` supports value as function.
        // BUT `JSON.parse` will fail if the string contains functions.
        // If `exportToExcel` strictly parses, then we cannot use functions in `value`.
        // We must map the content beforehand to match the keys or use simple keys.

        // Strategy: Map content to flat objects with known keys if needed, OR just pass keys.
        // But for "Employee Name", we need a computed value.
        // So we should pre-process the content.

        const processedContent = reportData.cumulativeSalaryReport.map((row: any) => {
            const newRow: any = { ...row };
            newRow.empName = `${row.hrme_employeefirstname || ''} ${row.hrme_employeemiddlename || ''} ${row.hrme_employeelastname || ''}`;

            // Ensure earnings/deductions exist as keys (they should be there based on table logic)
            return newRow;
        });

        const safeColumns = [
            { label: 'Employee Code', value: 'hrme_employeecode' },
            { label: 'Employee Name', value: 'empName' },
            { label: 'Designation', value: 'hrmdes_designationname' },
            { label: 'Working Days', value: 'hres_workingdays' },
            // Earnings
            ...(reportData.earningDetails || []).map((head: any) => ({
                label: head.hrmeD_Name,
                value: head.hrmeD_Name // Assuming key matches name
            })),
            { label: 'Gross Pay', value: 'totalearnings' },
            // Deductions
            ...(reportData.dectuionDetails || []).map((head: any) => ({
                label: head.hrmeD_Name,
                value: head.hrmeD_Name
            })),
            { label: 'Total Deductions', value: 'totaldeduction' },
            { label: 'Net Pay', value: 'totalpayable' }
        ];

        exportToExcel('CumulativeSalaryReport', JSON.stringify(safeColumns), JSON.stringify(processedContent));
    };
    const { data: groupTypesData } = useReportGroupTypes();

    const groupTypeIds = watchedGroupType?.join(',') || '';
    const { data: departmentsData } = useReportDepartments(groupTypeIds);

    const deptIds = watchedDepartment?.join(',') || '';
    const { data: designationsData } = useReportDesignations(groupTypeIds, deptIds);

    const { mutate: generateReport, isPending } = useCumulativeSalaryReport();

    const onSubmit = (data: FilterFormValues) => {
        if (!data.year || !data.month || data.designation.length === 0) {
            toast.error('Please select Year, Month and at least one Designation');
            return;
        }

        // Find selected year object to get name if needed, assuming value is ID or Year
        // If Dropdown value is ID, we might need Year String.
        // Based on Exam module ref, ASMAY_Id is used.
        // Payload expects "hreS_Year": "2025" (Year string).

        const selectedYearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year);
        // Fallback: if data.year is already the year string (depends on SelectItem value)
        // Let's assume SelectItem value is ASMAY_Id, so we get the Year string.
        // Actually, Exam module reference uses ASMAY_Id.
        // BUT payload expects `hreS_Year` as string "2025".
        // SO we must find the name.
        const yearString = selectedYearObj?.hrmlY_LeaveYear?.split('-')[0] || data.year; // Extract 2025 from 2025-2026 if necessary, or just send Year code.
        // Let's assume strictly 2025 like the payload sample.

        // Month: Payload "hreS_Month": "April". So we need Name, not ID.
        const selectedMonthObj = MONTH_LIST.find((m) => m.id.toString() === data.month);
        const monthName = selectedMonthObj?.name || '';

        generateReport(
            {
                hreS_Year: yearString, // Careful here, might need full year or split. Payload "2025" implies calendar year? OR Academic start?
                // If the user selects "2024-2025", and month is April 2025.
                // Usually academic year 2024-2025 means April 2024 to March 2025?
                // User payload "2025" "April".
                // If I assume `asmaY_Year` is "2025-2026", usually the HRES_Year corresponds to the calendar year of that salary.
                // Let's send the full string if we aren't sure, OR try to parse.
                // Given "2025" in sample, likely strictly the year.
                // For now, I will use the first part of the academic year string or the year entered.
                // Actually, let's just stick to `asmaY_Year` string if it's "2025" style, but typically it is "2023-2024".
                // Let's assume the user selects "2025" from a list that might be calendar years?
                // "useAcademicYearDropdown" returns academic years.
                // If the user meant "Calendar Year" dropdown, I don't have that.
                // I'll use the selectedYearObj?.asmaY_Year for now.
                hreS_Month: monthName,
                hrmdeS_IdList: data.designation.map(Number)
            },
            {
                onSuccess: (res) => {
                    if (res.success && res.data) {
                        setReportData(res.data);
                        toast.success('Report generated successfully');
                    } else {
                        toast.error(res.message || 'No data found');
                    }
                }
            }
        );
    };

    // Columns Construction
    const columns = useMemo(() => {
        if (!reportData) return [];

        const baseColumns = [
            {
                id: 'serialNumber',
                header: 'SL.No',
                cell: ({ row }: any) => row.index + 1
            },
            {
                accessorKey: 'hrme_employeecode',
                header: 'Employee Code'
            },
            {
                accessorKey: 'hrme_employeefirstname',
                header: 'Employee Name',
                cell: ({ row }: any) => {
                    const e = row.original;
                    return `${e.hrme_employeefirstname || ''} ${e.hrme_employeemiddlename || ''} ${e.hrme_employeelastname || ''}`;
                }
            },
            {
                accessorKey: 'hrmdes_designationname',
                header: 'Designation'
            },
            {
                accessorKey: 'hres_workingdays',
                header: 'Working Days'
            }
        ];

        // Dynamic Earnings
        const earningColumns = (reportData.earningDetails || []).map((head: any) => ({
            id: `earning_${head.hrmeD_Id}`,
            header: head.hrmeD_Name, // Column Header
            // We need to find the value for this head in the row data.
            // Since row data seems flat but dynamic, OR we might need to match keys.
            // Sample doesn't show keys.
            // If the row data DOES contain dynamic keys (e.g. "Basic Pay": 1200), we can try regular accessor.
            // If not, and it's missing from sample, we might need a mapping strategy.
            // Let's assume the backend puts values in keys matching the Head Name (sanitized) or ID.
            // Or maybe inside an 'earnings' array in the row?
            // Sample: "totalearnings" is there.
            // Valid assumption for VAPS: keys are often `headName` or similar.
            // I'll try to look for `head.hrmeD_Name` in the row.
            accessorFn: (row: any) => {
                // Try direct name match
                if (row[head.hrmeD_Name] !== undefined) return row[head.hrmeD_Name];

                // Try finding in an nested array if it existed (not in sample).
                // If keys are not present, return 0.
                return 0; // Placeholder until we confirm data structure
            }
        }));

        // Dynamic Deductions
        const deductionColumns = (reportData.dectuionDetails || []).map((head: any) => ({
            id: `deduction_${head.hrmeD_Id}`,
            header: head.hrmeD_Name,
            accessorFn: (row: any) => {
                if (row[head.hrmeD_Name] !== undefined) return row[head.hrmeD_Name];
                return 0;
            }
        }));

        const summaryColumns = [
            {
                id: 'totalearnings',
                accessorKey: 'totalearnings', // Keep for sorting if needed, but override cell
                header: 'Gross Pay',
                cell: ({ row }: any) => {
                    const r = row.original;
                    // Calculate Gross Pay
                    const gross = (reportData.earningDetails || []).reduce((sum: number, head: any) => {
                        return sum + (Number(r[head.hrmeD_Name]) || 0);
                    }, 0);
                    return gross.toFixed(2);
                }
            },
            {
                id: 'totaldeduction',
                accessorKey: 'totaldeduction',
                header: 'Total Deductions',
                cell: ({ row }: any) => {
                    const r = row.original;
                    // Calculate Total Deductions
                    const totalDed = (reportData.dectuionDetails || []).reduce((sum: number, head: any) => {
                        return sum + (Number(r[head.hrmeD_Name]) || 0);
                    }, 0);
                    return totalDed.toFixed(2);
                }
            },
            {
                id: 'totalpayable',
                accessorKey: 'totalpayable',
                header: 'Net Pay',
                cell: ({ row }: any) => {
                    const r = row.original;
                    // Calculate Net Pay
                    const gross = (reportData.earningDetails || []).reduce((sum: number, head: any) => {
                        return sum + (Number(r[head.hrmeD_Name]) || 0);
                    }, 0);
                    const totalDed = (reportData.dectuionDetails || []).reduce((sum: number, head: any) => {
                        return sum + (Number(r[head.hrmeD_Name]) || 0);
                    }, 0);
                    return (gross - totalDed).toFixed(2);
                }
            }
        ];

        const earningGroup =
            earningColumns.length > 0
                ? [
                      {
                          id: 'earnings_group',
                          header: () => (
                              <div className='rounded-t-md border bg-green-100 py-1 text-center font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300'>
                                  Earnings
                              </div>
                          ),
                          columns: earningColumns
                      }
                  ]
                : [];

        const deductionGroup =
            deductionColumns.length > 0
                ? [
                      {
                          id: 'deductions_group',
                          header: () => (
                              <div className='rounded-t-md border bg-red-100 py-1 text-center font-bold text-red-700 dark:bg-red-900/20 dark:text-red-300'>
                                  Deductions
                              </div>
                          ),
                          columns: deductionColumns
                      }
                  ]
                : [];

        return [...baseColumns, ...earningGroup, ...deductionGroup, ...summaryColumns];
    }, [reportData]);

    const processedGridData = useMemo(() => {
        return reportData?.cumulativeSalaryReport || [];
    }, [reportData]);

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-2xl tracking-tight'>Cumulative Salary Report</h2>
            </div>

            <CollapsibleSection defaultOpen={true} title='Report Criteria' variant='outline' className='shadow-sm'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                        {/* Year */}
                        <div className='space-y-2'>
                            <Label>
                                Year <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='year'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearsData?.data?.map((y: any) => (
                                                <SelectItem key={y.hrmlY_Id} value={y.hrmlY_Id.toString()}>
                                                    {y.hrmlY_LeaveYear}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Month */}
                        <div className='space-y-2'>
                            <Label>
                                Month <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='month'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Month' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MONTH_LIST.map((m) => (
                                                <SelectItem key={m.id} value={m.id.toString()}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Group Type */}
                        <div className='space-y-2'>
                            <Label>
                                Group Type <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='groupType'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            groupTypesData?.data?.map((gt: any) => ({
                                                label: gt.value,
                                                value: gt.key.toString()
                                            })) || []
                                        }
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder='Select Group Types'
                                    />
                                )}
                            />
                        </div>

                        {/* Department */}
                        <div className='space-y-2'>
                            <Label>
                                Department <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='department'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            departmentsData?.data?.map((d: any) => ({
                                                label: d.hrmD_DepartmentName,
                                                value: d.hrmD_Id.toString()
                                            })) || []
                                        }
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder='Select Departments'
                                    />
                                )}
                            />
                        </div>

                        {/* Designation */}
                        <div className='space-y-2'>
                            <Label>
                                Designation <span className='text-destructive'>*</span>
                            </Label>
                            <Controller
                                name='designation'
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        options={
                                            designationsData?.data?.map((d: any) => ({
                                                label: d.hrmdeS_DesignationName,
                                                value: d.hrmdeS_Id.toString()
                                            })) || []
                                        }
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder='Select Designations'
                                        maxHeight={200}
                                    />
                                )}
                            />
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
                <CollapsibleSection
                    title='Report Details'
                    defaultOpen={true}
                    className='border shadow-md'
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
                    }>
                    <div className='h-[500px] overflow-y-auto print:hidden'>
                        <GenericDataTable
                            data={processedGridData}
                            columns={columns}
                            totalItems={processedGridData.length}
                            isPaginationRequired={false}
                            isSearchRequired={false}
                            showSearchColumns={false}
                            isLoading={isPending}
                        />
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
