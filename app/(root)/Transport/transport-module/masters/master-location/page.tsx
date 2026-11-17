'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterLocation } from '@/hooks/transport/transportmodule/usemasters';
import type { IMasterLocation } from '@/types/transport/transport-module/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterLocationForm from './_components/add-form';
import { masterLocationColumns } from './_components/columns';
import ToggleMasterLocationForm from './_components/toggle-form';
import UpdateMasterLocationForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterLocationPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterLocation(searchParams);

    return (
        <FormProvider<IMasterLocation>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <MasterLocationPageContent
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

function MasterLocationPageContent({
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
    const { openAddForm } = useFormContext<IMasterLocation>();
    // Updated to use 'data' key as per recent API changes/patterns seen in other modules
    const tableData = response?.data || [];
    const tableProps = useDataTableProps(response, { dataKey: 'data' });

    return (
        <>
            <div className='flex justify-end'>
                <Button
                    type='button'
                    onClick={openAddForm}
                    className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                    <Plus className='h-4 w-4' />
                    Add Master Location
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Master Location'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IMasterLocation>
                    {...tableProps}
                    total={tableData.length}
                    columns={masterLocationColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading master locations...'
                    noDataTitle='No Master Locations Found'
                    noDataDescription='Get started by creating your first master location'
                    errorTitle='Error Loading Master Locations'
                />
            </CollapsibleSection>

            <FormSections />
        </>
    );
}

function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterLocation>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Location'
                        description='Fill in the details below to create a new master location'
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
                            <AddMasterLocationForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Location'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateMasterLocationForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterLocationForm rowData={selectedRow} onClose={closeToggleForm} />
            )}
        </>
    );
}
