'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEmployeeYearlyReport } from '@/hooks/hrms/attendance-management/useReports';
import { exportToExcel } from '@/lib/utils';
import { format } from 'date-fns';
import { FileSpreadsheet, Printer, X } from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';
import AddEmployeeYearlyReportForm from './_components/add-from';
import type { YearRow } from './_components/columns';
import { employeeYearlyReportColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function EmployeeYearlyReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useEmployeeYearlyReport(searchParams);

    return (
        <FormProvider<YearRow>>
            <EmployeeYearlyReportPageContent response={response} isLoading={isLoading} error={error} searchParams={searchParams} />
        </FormProvider>
    );
}

function FormSections({ searchParams }: { searchParams?: any }) {
    const { closeAddForm, addFormRef } = useFormContext<YearRow>();

    return (
        <>
            <div ref={addFormRef}>
                <CollapsibleSection
                    title='Generate Employee Yearly Report'
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
                        <AddEmployeeYearlyReportForm onSuccess={closeAddForm} searchParams={searchParams} />
                    </div>
                </CollapsibleSection>
            </div>
        </>
    );
}

function EmployeeYearlyReportPageContent({
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
    const [selectedRows, setSelectedRows] = useState<YearRow[]>([]);
    const tableProps = useDataTableProps(response);

    const handleRowSelectionChange = (rows: YearRow[]) => {
        setSelectedRows(rows);
    };

    const handleExportToExcel = () => {
        if (selectedRows.length === 0) return;

        // Get all column keys from the first row (to handle dynamic columns)
        const firstRow = selectedRows[0];
        const allKeys = Object.keys(firstRow || {});

        // Filter out internal keys and prepare column headers
        const excludeKeys = ['user_id', 'id', '_id'];
        const columnKeys = allKeys.filter((key) => !excludeKeys.includes(key));

        // Prepare data for export with all columns dynamically
        const exportData = selectedRows.map((row, index) => {
            const exportRow: Record<string, any> = {
                'Sl.No': index + 1
            };

            // Add all other columns dynamically
            columnKeys.forEach((key) => {
                if (key === 'date_of_joining' && row[key]) {
                    exportRow['Date of Joining'] = format(new Date(row[key]), 'dd-MM-yyyy');
                } else {
                    // Convert snake_case to Title Case for headers
                    const headerName = key
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    exportRow[headerName] = row[key] ?? '';
                }
            });

            return exportRow;
        });

        exportToExcel(exportData, 'Employee_Yearly_Report');
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) return;

        // Get all column keys from the first row
        const firstRow = selectedRows[0];
        const allKeys = Object.keys(firstRow || {});
        const excludeKeys = ['user_id', 'id', '_id'];
        const columnKeys = allKeys.filter((key) => !excludeKeys.includes(key));

        // Create column headers
        const columnHeaders = [
            'Sl.No',
            ...columnKeys.map((key) => {
                if (key === 'date_of_joining') return 'Date of Joining';
                return key
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            })
        ];

        // Create a print-friendly table
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const formatValue = (value: any, key: string): string => {
            if (value === null || value === undefined) return '';
            if (key === 'date_of_joining' && value) {
                return format(new Date(value), 'dd-MM-yyyy');
            }
            return String(value);
        };

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Employee Yearly Report</title>
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
                <h1>Employee Yearly Report</h1>
                <table>
                    <thead>
                        <tr>
                            ${columnHeaders.map((header) => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${selectedRows
                            .map(
                                (row, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                ${columnKeys.map((key) => `<td>${formatValue(row[key], key)}</td>`).join('')}
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
                    <GenericDataTable<YearRow>
                        {...tableProps}
                        columns={employeeYearlyReportColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        isPaginationRequired={true}
                        onRowSelectionChange={handleRowSelectionChange}
                        loadingMessage='Loading Employee Yearly Reports...'
                        noDataTitle='No Employee Yearly Reports Found'
                        noDataDescription='Get started by generating your first Employee Yearly Report'
                        errorTitle='Error Loading Employee Yearly Reports'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
