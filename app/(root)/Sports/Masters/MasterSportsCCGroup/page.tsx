'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { fetchMasterSportsCCGroup } from '@/server/sports/masters/sports-cc-group';
import type { IMasterSportsCCGroup } from '@/types/sports/masters/sports-cc-group';
import { useQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { useRef } from 'react';
import AddMasterSportsCCGroupForm from './_components/add-form';
import { MasterSportsCCGroupColumns } from './_components/columns';
import ToggleMasterSportsCCGroupForm from './_components/toggle-form';
import UpdateMasterSportsCCGroupForm from './_components/update-form';

export default function MasterSportsCCGroupPage() {
    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ['masterSportsCCGroup'],
        queryFn: async () => {
            const result = await fetchMasterSportsCCGroup();
            return result;
        }
    });

    return (
        <FormProvider<IMasterSportsCCGroup>>
            <MasterSportsCCGroupPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetch} />
        </FormProvider>
    );
}

function MasterSportsCCGroupPageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
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
    } = useFormContext<IMasterSportsCCGroup>();

    const tableProps = useDataTableProps(response);

    const handleAddSuccess = () => {
        closeAddForm();
        refetchAll();
    };

    const handleEditSuccess = () => {
        closeEditForm();
        refetchAll();
    };

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
                        Add Master Sports CC Group
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSportsCCGroup>
                        {...tableProps}
                        columns={MasterSportsCCGroupColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master sports cc groups...'
                        noDataTitle='No Records Found'
                        noDataDescription='Start by adding a new group.'
                        errorTitle='Error Loading Groups'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <>
                    {/* Add Form */}
                    {isAddFormOpen && (
                        <div ref={addFormRef}>
                            <CollapsibleSection
                                title='Add New Master Sports CC Group'
                                description='Fill in the details below to create a new group'
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
                                    <AddMasterSportsCCGroupForm onSuccess={handleAddSuccess} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditFormOpen && selectedRow && (
                        <div ref={editFormRef}>
                            <CollapsibleSection
                                title='Edit Master Sports CC Group'
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
                                    <UpdateMasterSportsCCGroupForm selectedRow={selectedRow} onSuccess={handleEditSuccess} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </>

                {/* Toggle Form */}
                {isToggleFormOpen && selectedRow && (
                    <ToggleMasterSportsCCGroupForm
                        rowData={selectedRow}
                        onClose={closeToggleForm}
                        onSuccess={refetchAll}
                    />
                )}
            </div>
        </div>
    );
}
