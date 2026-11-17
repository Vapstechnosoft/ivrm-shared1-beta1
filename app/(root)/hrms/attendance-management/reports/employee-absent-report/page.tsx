'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEmployeeAbsentReport } from '@/hooks/hrms/attendance-management/useReports';
import { exportToExcel } from '@/lib/utils';
import { FileSpreadsheet, Printer, X } from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';
import AddEmployeeAbsentReportForm from './_components/add-from';
import type { EmployeeAbsentReportRow } from './_components/columns';
import { employeeAbsentReportColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function EmployeeAbsentReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useEmployeeAbsentReport(searchParams);

    return (
        <FormProvider<EmployeeAbsentReportRow>>
            <EmployeeAbsentReportPageContent response={response} isLoading={isLoading} error={error} searchParams={searchParams} />
        </FormProvider>
    );
}

function FormSections({ searchParams }: { searchParams?: any }) {
    const { closeAddForm, addFormRef } = useFormContext<EmployeeAbsentReportRow>();

    return (
        <>
            <div ref={addFormRef}>
                <CollapsibleSection
                    title='Generate Employee Absent Report'
                    description='Fill in the details below to generate the report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='relative'>
                        <Button
                            type='button'
                            onClick={closeAddForm}
                            variant='ghost'
                            size='sm'
                            className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                            <X className='h-4 w-4 text-destructive' /> Close
                        </Button>
                        <AddEmployeeAbsentReportForm onSuccess={closeAddForm} searchParams={searchParams} />
                    </div>
                </CollapsibleSection>
            </div>
        </>
    );
}

function EmployeeAbsentReportPageContent({
    response,
    isLoading,
    error,
    searchParams
}: {
    response: any;
    isLoading: boolean;
    error: any;
    searchParams?: any;
}) {
    const [selectedRows, setSelectedRows] = useState<EmployeeAbsentReportRow[]>([]);
    const tableProps = useDataTableProps(response);

    const handleRowSelectionChange = (rows: EmployeeAbsentReportRow[]) => {
        setSelectedRows(rows);
    };

    const handleExportToExcel = () => {
        if (selectedRows.length === 0) return;

        // Prepare data for export
        const exportData = selectedRows.map((row, index) => ({
            'Sl.No': index + 1,
            'Employee code': row.employee_code || '',
            Designation: row.designation || '',
            'Total Absent': row.total_absent || 0
        }));

        exportToExcel(exportData, 'Employee_Absent_Report');
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) return;

        // Create a print-friendly table
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Employee Absent Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #4f46e5; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    @media print {
                        body { margin: 0; }
                        @page { margin: 1cm; }
                    }
                </style>
            </head>
            <body>
                <h1>Employee Absent Report</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Employee code</th>
                            <th>Designation</th>
                            <th>Total Absent</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${selectedRows
                            .map(
                                (row, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${row.employee_code || ''}</td>
                                <td>${row.designation || ''}</td>
                                <td>${row.total_absent || 0}</td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Add Form Section (shown first) */}
                <FormSections searchParams={searchParams} />

                {/* Action Buttons - Show when rows are selected */}
                {selectedRows.length > 0 && (
                    <div className='flex items-center gap-2 rounded-lg border bg-blue-50 p-4 shadow-sm'>
                        <span className='font-medium text-gray-700 text-sm'>
                            {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
                        </span>
                        <div className='ml-auto flex items-center gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handleExportToExcel}
                                className='border-green-500 text-green-700 hover:bg-green-50'>
                                <FileSpreadsheet className='mr-2 h-4 w-4' />
                                Excel
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handlePrint}
                                className='border-blue-500 text-blue-700 hover:bg-blue-50'>
                                <Printer className='mr-2 h-4 w-4' />
                                Print
                            </Button>
                        </div>
                    </div>
                )}

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<EmployeeAbsentReportRow>
                        {...tableProps}
                        columns={employeeAbsentReportColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        isPaginationRequired={true}
                        onRowSelectionChange={handleRowSelectionChange}
                        loadingMessage='Loading Employee Absent Reports...'
                        noDataTitle='No Employee Absent Reports Found'
                        noDataDescription='Get started by generating your first Employee Absent Report'
                        errorTitle='Error Loading Employee Absent Reports'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
