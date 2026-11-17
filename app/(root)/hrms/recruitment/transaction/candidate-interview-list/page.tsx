'use client';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { use } from 'react';
import { candidateInterviewListColumns } from './_components/columns';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function CandidateInterviewListPage(props: {
    searchParams: SearchParams;
}) {
    const _searchParams = use(props.searchParams);
    // Mock data for now - replace with actual API call
    const response = { data: [], totalItems: 0, isLoading: false, error: null };
    return (
        <FormProvider<any>>
            <CandidateInterviewListPageContent response={response} isLoading={false} error={null} />
        </FormProvider>
    );
}
function CandidateInterviewListPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const tableProps = useDataTableProps(response);
    return (
        <div className='min-h-screen'>
            <div className='container mx-auto space-y-6 px-4 py-6 md:px-6 lg:px-8'>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<any>
                        {...tableProps}
                        columns={candidateInterviewListColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading interviews...'
                        noDataTitle='No Interviews Found'
                        noDataDescription='No candidate interviews available'
                        errorTitle='Error Loading Interviews'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
