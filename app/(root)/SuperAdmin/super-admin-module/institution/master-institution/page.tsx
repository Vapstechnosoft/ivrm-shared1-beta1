'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import type { IMasterInstitution } from '@/types/super-admin/super-admin-module/institution/master-institution';
import { Plus, X } from 'lucide-react';
import AddMasterInstitutionForm from './_components/add-form';
import { MasterInstitutionColumns } from './_components/columns';

import { useMasterInstitutionData } from '@/hooks/super-admin/super-admin-module/use-master-institution';
import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterInstitutionPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterInstitutionData(searchParams);

    return (
        <FormProvider<IMasterInstitution>>
            <MasterInstitutionPageContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

function MasterInstitutionPageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<IMasterInstitution>();

    const tableProps = {
        data: response?.data || [],
        totalItems: response?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    return (
        <div>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Master Institution
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    title='List of Institutions'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                >
                    <GenericDataTable<IMasterInstitution>
                        {...tableProps}
                        total={tableProps.totalItems} // Explicitly pass total for page indexing logic if needed
                        columns={MasterInstitutionColumns}
                        isLoading={isLoading}
                        error={error}
                        loadingMessage='Loading institution details...'
                        noDataTitle='No Institution Details Found'
                        noDataDescription='No institution details available currently.'
                        isSearchRequired={true}
                        isPaginationRequired={true}
                        columnPinning={{ right: ['actions'] }}
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetchAll={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ refetchAll }: { refetchAll: any }) {
    const {
        isAddFormOpen,
        closeAddForm,
        addFormRef
    } = useFormContext<IMasterInstitution>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Institution'
                        description='Fill in the details below to create a new institution'
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
                            <AddMasterInstitutionForm onSuccess={closeAddForm} onRefresh={refetchAll} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
