'use client';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { interviewReportColumns } from './_components/columns';
import InterviewReportForm from './_components/report-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function InterviewReportPage(props: {
    searchParams: SearchParams;
}) {
    const _searchParams = use(props.searchParams);
    const [reportData, setReportData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const handleGenerateReport = async (_filters: any) => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // const response = await generateInterviewReport(filters);
            // setReportData(response.data);
            // Mock data for now
            setReportData([]);
        } catch (err: any) {
            setError(err.message || 'Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };
    const response = { data: reportData, totalItems: reportData.length, isLoading, error };
    return (
        <FormProvider<any>>
            <InterviewReportPageContent response={response} onGenerateReport={handleGenerateReport} />
        </FormProvider>
    );
}
function InterviewReportPageContent({
    response,
    onGenerateReport
}: {
    response: any;
    onGenerateReport: (filters: any) => void;
}) {
    const tableProps = useDataTableProps(response);
    const session = useSession();
    useEffect(() => {
        if (session?.data?.role === undefined) {
            window.location.reload();
        }
    }, [session?.data?.role]);
    return (
        <div className='min-h-screen'>
            <div className='container mx-auto space-y-6 px-4 py-6 md:px-6 lg:px-8'>
                {/* Report Form - Above Table */}
                <CollapsibleSection
                    title='Interview Report'
                    description='Filter and generate interview reports'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='shadow-lg duration-300'>
                    <InterviewReportForm onGenerateReport={onGenerateReport} />
                </CollapsibleSection>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<any>
                        {...tableProps}
                        columns={interviewReportColumns}
                        isLoading={response.isLoading}
                        error={response.error}
                        showViewOptions={false}
                        loadingMessage='Loading interview report...'
                        noDataTitle='No Interview Reports Found'
                        noDataDescription='Select filters and click REPORT to generate interview data'
                        errorTitle='Error Loading Interview Reports'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
