'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useVehicleDriverMapping } from '@/hooks/transport/transportmodule/usetransaction';
import type { IVehicleDriverMapping } from '@/types/transport/transport-module/transaction';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddForm from './_components/add-form';
import { vehicleDriverMappingColumns } from './_components/columns';
import ToggleForm from './_components/toggle-form';
import UpdateForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function VehicleDriverMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useVehicleDriverMapping(searchParams);

    return (
        <FormProvider<IVehicleDriverMapping>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <VehicleDriverMappingContent
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

function VehicleDriverMappingContent({
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
    const { openAddForm } = useFormContext<IVehicleDriverMapping>();
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
                    Map Vehicle Driver
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Vehicle Driver Mapping List'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IVehicleDriverMapping>
                    {...tableProps}
                    total={tableData.length}
                    data={tableData}
                    columns={vehicleDriverMappingColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading mappings...'
                    noDataTitle='No Mappings Found'
                    noDataDescription='Get started by mapping drivers to vehicles'
                    errorTitle='Error Loading Mappings'
                // For debugging if needed
                // meta={{ refetch: refetchAll }}
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
    } = useFormContext<IVehicleDriverMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Map Vehicle to Driver'
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
                            <AddForm
                                onClose={closeAddForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Vehicle Driver Mapping'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateForm
                                selectedRow={selectedRow}
                                onClose={closeEditForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
