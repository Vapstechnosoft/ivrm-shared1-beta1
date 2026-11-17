'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterCompetitionLevels } from '@/hooks/sports/useMasterCompetitionLevels';
import type { IMasterCompetitionLevel } from '@/types/sports/masters/competition-level';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterCompetitionLevelForm from './_components/add-form';
import { MasterCompetitionLevelColumns } from './_components/columns';
import UpdateMasterCompetitionLevelForm from './_components/update-form';
import ToggleMasterCompetitionLevelForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterCompetitionLevelPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterCompetitionLevels(searchParams);

    return (
        <FormProvider<IMasterCompetitionLevel>>
            <MasterCompetitionLevelPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterCompetitionLevelPageContent({
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
    } = useFormContext<IMasterCompetitionLevel>();

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
                        Add Competition Level
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterCompetitionLevel>
                        {...tableProps}
                        columns={MasterCompetitionLevelColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading competition levels...'
                        noDataTitle='No Competition Levels Found'
                        noDataDescription='Get started by creating your first competition level'
                        errorTitle='Error Loading Levels'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <>
                    {/* Add Form */}
                    {isAddFormOpen && (
                        <div ref={addFormRef}>
                            <CollapsibleSection
                                title='Add New Competition Level'
                                description='Fill in the details below to create a new competition level'
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
                                    <AddMasterCompetitionLevelForm onSuccess={closeAddForm} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditFormOpen && selectedRow && (
                        <div ref={editFormRef}>
                            <CollapsibleSection
                                title='Edit Competition Level'
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
                                    <UpdateMasterCompetitionLevelForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </>

                {/* Toggle Form */}
                {isToggleFormOpen && selectedRow && (
                    <ToggleMasterCompetitionLevelForm
                        rowData={selectedRow}
                        onClose={closeToggleForm}
                        onSuccess={refetchAll}
                    />
                )}
            </div>
        </div>
    );
}
