'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';

import type { MappedEventCoe } from '@/types/coe/master-coe';
import { Plus, X } from 'lucide-react';
import { mappingColumns } from './_components/mapping-columns';
import { MappingForm } from './_components/mapping-form';
import { ViewMappedEventDialog } from './_components/view-mapped-event-dialog';
import ToggleForm from './_components/toggle-form';
import { useMasterCoeInitialData } from '@/hooks/coe/usemMaster';
import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function MasterCoePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: initialData, isLoading, error, refetch } = useMasterCoeInitialData(searchParams);
    console.log("Initial Data:", initialData);
    return (
        <FormProvider<MappedEventCoe>>
            <MasterCoePageContent
                initialData={initialData}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function MasterCoePageContent({
    initialData,
    isLoading,
    error,
    refetch
}: {
    initialData: any;
    isLoading: boolean;
    error: any;
    refetch?: () => void;
}) {
    const { openAddForm } = useFormContext<MappedEventCoe>();


    const tableData = initialData?.data || [];
    const tableProps = useDataTableProps(initialData);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title='Master COE' description='' /> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Mapped Event
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<MappedEventCoe>
                        {...tableProps}
                        columns={mappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading mapped events...'
                        noDataTitle='No Mapped Events Found'
                        noDataDescription='Get started by creating your first Mapped Event'
                        errorTitle='Error Loading Mapped Events'
                        // manualPagination={false}
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch?: () => void }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef,
        isDetailsViewOpen,
        closeDetailsView
    } = useFormContext<MappedEventCoe>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Mapped Event'
                        description='Fill in the details below to create a New Mapped Event'
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
                            <MappingForm
                                onSuccess={() => {
                                    refetch?.();
                                    closeAddForm();
                                }}
                                onCancel={closeAddForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Mapped Event'
                        description='Update the details of the Mapped Event'
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
                            <MappingForm
                                initialData={selectedRow}
                                onSuccess={() => {
                                    refetch?.();
                                    closeEditForm();
                                }}
                                onCancel={closeEditForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                    }}
                />
            )}

            {/* View Mapped Event Details */}
            {isDetailsViewOpen && selectedRow && (
                <ViewMappedEventDialog
                    rowData={selectedRow}
                    onClose={closeDetailsView}
                />
            )}
        </>
    );
}
