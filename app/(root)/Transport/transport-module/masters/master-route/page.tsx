'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterRoute } from '@/hooks/transport/transportmodule/usemasters';
import type { IMasterRoute } from '@/types/transport/transport-module/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddRouteForm from './_components/master-route/add-route-form';
import { routeColumns } from './_components/master-route/route-columns';
import ToggleRouteForm from './_components/master-route/toggle-route-form';
import UpdateRouteForm from './_components/master-route/update-route-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterRoutePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterRoute(searchParams);

    return (
        <FormProvider<IMasterRoute>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <MasterRoutePageContent
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

function MasterRoutePageContent({
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
    const { openAddForm } = useFormContext<IMasterRoute>();
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
                    Add Master Route
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Master Route List'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IMasterRoute>
                    {...tableProps}
                    total={tableData.length}
                    columns={routeColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading master routes...'
                    noDataTitle='No Master Routes Found'
                    noDataDescription='Get started by creating your first master route'
                    errorTitle='Error Loading Master Routes'
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
    } = useFormContext<IMasterRoute>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Route'
                        description='Fill in the details below to create a new master route'
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
                            <AddRouteForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Route'
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
                            <UpdateRouteForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleRouteForm rowData={selectedRow} onClose={closeToggleForm} />
            )}
        </>
    );
}
