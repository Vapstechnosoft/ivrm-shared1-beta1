'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useTrustMasterData } from '@/hooks/super-admin/super-admin-module/use-trust-masters';
import type { ITrustMaster } from '@/types/super-admin/super-admin-module/trust-masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddTrustMasterForm from './_components/add-form';
import { TrustMasterColumns } from './_components/columns';
import ToggleTrustMasterForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function TrustMasterPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useTrustMasterData(searchParams);

    return (
        <FormProvider<ITrustMaster>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <TrustMasterPageContent
                        response={response}
                        isLoading={isLoading}
                        error={error}
                        refetchAll={refetchAll}
                    />
                </div>
            </div>
        </FormProvider>
    );
}

function TrustMasterPageContent({
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
    const { openAddForm } = useFormContext<ITrustMaster>();
    const tableProps = useDataTableProps(response);

    return (
        <>
            <div className='flex justify-end'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Master Trust
                    </Button>
                </div>
            </div>

            <CollapsibleSection
                title='Trust Details'
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
            >
                <GenericDataTable<ITrustMaster>
                    {...tableProps}
                    total={response?.total}
                    columns={TrustMasterColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading trust masters...'
                    noDataTitle='No Trust Masters Found'
                    noDataDescription='Get started by adding a new master trust'
                    errorTitle='Error Loading Trust Masters'
                />
            </CollapsibleSection>

            <FormSections refetchAll={refetchAll} />
        </>
    );
}

function FormSections({ refetchAll }: { refetchAll: any }) {
    const {
        isAddFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeToggleForm,
        addFormRef
    } = useFormContext<ITrustMaster>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Trust'
                        description='Fill in the details below to create a new trust'
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
                            <AddTrustMasterForm onSuccess={closeAddForm} onRefresh={refetchAll} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Confirmation Modal */}
            {isToggleFormOpen && selectedRow && (
                <ToggleTrustMasterForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onRefresh={refetchAll}
                />
            )}
        </>
    );
}
