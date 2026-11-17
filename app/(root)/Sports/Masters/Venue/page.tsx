'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterVenues } from '@/hooks/sports/useMasterVenues';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterVenueForm from './_components/add-form';
import { MasterVenueColumns } from './_components/columns';
import ToggleMasterVenueForm from './_components/toggle-form';
import UpdateMasterVenueForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterVenuePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterVenues(searchParams);

    return (
        <FormProvider<IMasterEventVenue>>
            <MasterVenuePageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterVenuePageContent({
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
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        openAddForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterEventVenue>();

    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Venue
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterEventVenue>
                        {...tableProps}
                        columns={MasterVenueColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master venues...'
                        noDataTitle='No Master Venues Found'
                        noDataDescription='Get started by creating your first master venue'
                        errorTitle='Error Loading Venues'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <>
                    {/* Add Form */}
                    {isAddFormOpen && (
                        <div ref={addFormRef}>
                            <CollapsibleSection
                                title='Add New Master Venue'
                                description='Fill in the details below to create a new master venue'
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
                                    <AddMasterVenueForm onSuccess={closeAddForm} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditFormOpen && selectedRow && (
                        <div ref={editFormRef}>
                            <CollapsibleSection
                                title='Edit Master Venue'
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
                                    <UpdateMasterVenueForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Toggle Form */}
                    {isToggleFormOpen && selectedRow && (
                        <ToggleMasterVenueForm
                            rowData={selectedRow}
                            onClose={closeToggleForm}
                            onSuccess={refetchAll}
                        />
                    )}
                </>
            </div>
        </div>
    );
}
