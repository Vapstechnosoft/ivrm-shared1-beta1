'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useEligibilityCertificateReport } from '@/hooks/sports/useEligibilityCertificateReport';
import type { IEligibilityCertificateReportDetail } from '@/types/sports/reports/eligibility-certificate-report';
import { useEffect, useState } from 'react';
import { columns } from './_components/columns';
import ReportForm from './_components/report-form';

export default function EligibilityCertificateReportPage() {
    const { data: loadGridData, isLoading, error } = useEligibilityCertificateReport();
    const [reportResponse, setReportResponse] = useState<any>(null);

    // Initial load
    useEffect(() => {
        if (loadGridData) {
            setReportResponse({ ...loadGridData, data: [] });
        }
    }, [loadGridData]);

    const handleReport = (data: any) => {
        setReportResponse(data);
    };

    const handleReset = () => {
        if (loadGridData) {
            setReportResponse({ ...loadGridData, data: [] });
        }
    };

    const handlePrint = () => {
        // Placeholder for print functionality
        console.log('Print', reportResponse?.data);
    };

    const handleExcel = () => {
        // Placeholder for excel functionality
        console.log('Excel', reportResponse?.data);
    };

    const tableProps = useDataTableProps(reportResponse);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold text-2xl tracking-tight'>Eligibility Certificate Report</h2>
                </div>

                <CollapsibleSection title='Report Filters' defaultOpen={true} variant='default' className='shadow-lg'>
                    <ReportForm
                        onReport={handleReport}
                        onReset={handleReset}
                        onPrint={handlePrint}
                        onExcel={handleExcel}
                        hasData={!!reportResponse?.data?.length}
                    />
                </CollapsibleSection>

                <CollapsibleSection
                    title='ELIGIBILITY CERTIFICATE REPORT LIST'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'>
                    <GenericDataTable<IEligibilityCertificateReportDetail>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={true}
                        loadingMessage='Loading report data...'
                        noDataTitle='No Records Found'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
