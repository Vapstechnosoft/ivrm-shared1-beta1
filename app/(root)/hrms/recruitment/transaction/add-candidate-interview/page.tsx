'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { use, useEffect } from 'react';
import AddCandidateInterviewForm from './_components/add-form';
import { candidateInterviewColumns } from './_components/columns';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function AddCandidateInterviewPage(props: {
    searchParams: SearchParams;
}) {
    const _searchParams = use(props.searchParams);
    // Mock data for now - replace with actual API call
    const response = { data: [], totalItems: 0, isLoading: false, error: null };
    const refetchAll = () => {};
    return (
        <FormProvider<any>>
            <AddCandidateInterviewPageContent response={response} isLoading={false} error={null} refetch={refetchAll} />
        </FormProvider>
    );
}
function AddCandidateInterviewPageContent({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext();
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
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Candidate Interview
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<any>
                        {...tableProps}
                        columns={candidateInterviewColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading interviews...'
                        noDataTitle='No Interviews Found'
                        noDataDescription='Get started by creating your first interview'
                        errorTitle='Error Loading Interviews'
                    />
                </CollapsibleSection>
                {/* Forms - Below Table */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}
function FormSections({
    refetch
}: {
    refetch: () => void;
}) {
    const { isAddFormOpen, closeAddForm, addFormRef } = useFormContext();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Candidate Interview'
                        description='Fill in the details below to add a new candidate interview'
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
                            <AddCandidateInterviewForm
                                onSuccess={() => {
                                    closeAddForm();
                                    refetch();
                                }}
                                onCancel={closeAddForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
