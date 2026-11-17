'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useHolidayReport } from '@/hooks/hrms/attendance-management/useReports';
import { exportToExcel } from '@/lib/utils';
import { format } from 'date-fns';
import { FileSpreadsheet, Printer, X } from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';
import AddHolidayReportForm from './_components/add-from';
import type { HolidayReportRow } from './_components/columns';
import { holidayReportColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function HolidayReportPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useHolidayReport(searchParams);

    return (
        <FormProvider<HolidayReportRow>>
            <HolidayReportPageContent response={response} isLoading={isLoading} error={error} searchParams={searchParams} />
        </FormProvider>
    );
}

function FormSections({ searchParams }: { searchParams?: any }) {
    const { closeAddForm, addFormRef } = useFormContext<HolidayReportRow>();

    return (
        <>
            <div ref={addFormRef}>
                <CollapsibleSection
                    title='Generate Holiday Report'
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
                        <AddHolidayReportForm onSuccess={closeAddForm} searchParams={searchParams} />
                    </div>
                </CollapsibleSection>
            </div>
        </>
    );
}

function HolidayReportPageContent({
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
    const [selectedRows, setSelectedRows] = useState<HolidayReportRow[]>([]);
    const tableProps = useDataTableProps(response);

    const handleRowSelectionChange = (rows: HolidayReportRow[]) => {
        setSelectedRows(rows);
    };

    const handleExportToExcel = () => {
        if (selectedRows.length === 0) return;

        // Prepare data for export
        const exportData = selectedRows.map((row, index) => ({
            'Sl.No': index + 1,
            Name: row.name || '',
            'Start Date': row.start_date ? format(new Date(row.start_date), 'dd-MM-yyyy') : ''
        }));

        exportToExcel(exportData, 'Holiday_Report');
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
                <title>Holiday Report</title>
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
                <h1>Holiday Report</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Name</th>
                            <th>Start Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${selectedRows
                            .map(
                                (row, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${row.name || ''}</td>
                                <td>${row.start_date ? format(new Date(row.start_date), 'dd-MM-yyyy') : ''}</td>
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
                    <GenericDataTable<HolidayReportRow>
                        {...tableProps}
                        columns={holidayReportColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        isPaginationRequired={true}
                        onRowSelectionChange={handleRowSelectionChange}
                        loadingMessage='Loading Holiday Reports...'
                        noDataTitle='No Holiday Reports Found'
                        noDataDescription='Get started by generating your first Holiday Report'
                        errorTitle='Error Loading Holiday Reports'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
