'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterVehicle } from '@/hooks/transport/transportmodule/usemasters';
import type { IMasterVehicle } from '@/types/transport/transport-module/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddVehicleForm from './_components/add-form';
import { vehicleColumns } from './_components/columns';
import DocumentViewer from './_components/document-viewer';
import ToggleVehicleForm from './_components/toggle-form';
import UpdateVehicleForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterVehiclePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterVehicle(searchParams);
    console.log('grid response', response);
    return (
        <FormProvider<IMasterVehicle>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <MasterVehicleContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
                </div>
            </div>
        </FormProvider>
    );
}

function MasterVehicleContent({
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
    const {
        openAddForm,
        isAddFormOpen,
        closeAddForm,
        isEditFormOpen,
        closeEditForm,
        selectedRow,
        isToggleFormOpen,
        closeToggleForm,
        isDocumentViewOpen,
        closeDocumentView,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterVehicle>();

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
                    Add Master Vehicle
                </Button>
            </div>

            <CollapsibleSection
                defaultOpen={true}
                title='Master Vehicle'
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IMasterVehicle>
                    {...tableProps}
                    total={tableData.length}
                    columns={vehicleColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading master vehicles...'
                    noDataTitle='No Master Vehicles Found'
                    noDataDescription='Get started by creating your first master vehicle'
                    errorTitle='Error Loading Master Vehicles'
                />
            </CollapsibleSection>

            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Vehicle'
                        description='Fill in the details below to create a new master vehicle'
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
                            <AddVehicleForm onClose={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Vehicle'
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
                            <UpdateVehicleForm rowData={selectedRow} onClose={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleVehicleForm rowData={selectedRow} onClose={closeToggleForm} />}
            {isDocumentViewOpen && selectedRow && (
                <DocumentViewer rowData={selectedRow} isOpen={isDocumentViewOpen} onClose={closeDocumentView} />
            )}
        </>
    );
}
