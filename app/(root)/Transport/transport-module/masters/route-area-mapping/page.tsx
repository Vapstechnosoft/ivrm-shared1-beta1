'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterRouteArea } from '@/hooks/transport/transportmodule/usemasters';
import type { IRouteAreaMapping } from '@/types/transport/transport-module/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMappingForm from './_components/add-mapping-form';
import { mappingColumns } from './_components/mapping-columns';
import ToggleMappingForm from './_components/toggle-mapping-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function RouteAreaMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterRouteArea(searchParams);

    return (
        <FormProvider<IRouteAreaMapping>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <RouteAreaMappingContent
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

function RouteAreaMappingContent({
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
    const { openAddForm } = useFormContext<IRouteAreaMapping>();
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
                    Map Route Area
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Route Area Mapping List'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IRouteAreaMapping>
                    {...tableProps}
                    total={tableData.length}
                    columns={mappingColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading mappings...'
                    noDataTitle='No Mappings Found'
                    noDataDescription='Get started by mapping routes to areas'
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
    } = useFormContext<IRouteAreaMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Map Route to Areas'
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
                            <AddMappingForm onClose={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleMappingForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
