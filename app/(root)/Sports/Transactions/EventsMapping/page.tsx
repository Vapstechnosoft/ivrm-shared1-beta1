'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEventMapping } from '@/hooks/sports/useEventMapping';
import type { IEventsMappingData } from '@/types/sports/events-mapping';
import { Plus, X } from 'lucide-react';
import AddEventsMappingForm from './_components/add-form';
import { eventsMappingColumns } from './_components/columns';
import UpdateEventsMappingForm from './_components/update-form';

export default function EventsMappingPage() {
    const { loadGrid } = useEventMapping();
    const { data: response, isLoading, error } = loadGrid;

    // We pass the full response to the content component to handle pagination metadata
    return (
        <FormProvider<any>>
            <EventsMappingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function EventsMappingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm, isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IEventsMappingData>();

    const gridData = response?.data?.eventmappingList || [];
    const tableProps = useDataTableProps({ ...response, data: gridData });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Mapping
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    title='Events Mapping List'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IEventsMappingData>
                        {...tableProps}
                        columns={eventsMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading mapping details...'
                        noDataTitle='No Mapping Found'
                        noDataDescription='Get started by creating your first event mapping'
                        errorTitle='Error Loading Mapping'
                    />
                </CollapsibleSection>

                {/* Add Form */}
                {isAddFormOpen && (
                    <div ref={addFormRef}>
                        <CollapsibleSection
                            title='Add Events Mapping'
                            defaultOpen={true}
                            variant='default'
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
                                <AddEventsMappingForm onSuccess={closeAddForm} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* Edit Form */}
                {isEditFormOpen && selectedRow && (
                    <div ref={editFormRef}>
                        <CollapsibleSection
                            title='Edit Events Mapping'
                            defaultOpen={true}
                            variant='default'
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
                                <UpdateEventsMappingForm data={selectedRow} onSuccess={closeEditForm} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </div>
    );
}

