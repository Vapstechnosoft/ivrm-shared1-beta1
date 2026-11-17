'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useRouteLocationMapping } from '@/hooks/transport/transportmodule/usetransaction';
import type { IRouteLocationMapping } from '@/types/transport/transport-module/transaction';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddForm from './_components/add-form';
import { routeLocationMappingColumns } from './_components/columns';
import ToggleForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function RouteLocationMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useRouteLocationMapping(searchParams);

    return (
        <FormProvider<IRouteLocationMapping>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <RouteLocationMappingContent
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

function RouteLocationMappingContent({
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
    const { openAddForm } = useFormContext<IRouteLocationMapping>();

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
                    Map Route Location
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Route Location Mapping List'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IRouteLocationMapping>
                    {...tableProps}
                    total={tableData.length}
                    data={tableData}
                    columns={routeLocationMappingColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading mappings...'
                    noDataTitle='No Mappings Found'
                    noDataDescription='Get started by mapping locations to routes'
                    errorTitle='Error Loading Mappings'
                />
            </CollapsibleSection>

            <FormSections />
        </>
    );
}

function FormSections() {
    const {
        isAddFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeToggleForm,
        addFormRef
    } = useFormContext<IRouteLocationMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Map Location to Route'
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
                            <AddForm onClose={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
