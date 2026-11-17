'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterCompetitionCategories } from '@/hooks/sports/useMasterCompetitionCategory';
import type { IMasterCompetitionCategory } from '@/types/sports/masters/competition-category';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterCompetitionCategoryForm from './_components/add-form';
import { MasterCompetitionCategoryColumns } from './_components/columns';
import ToggleMasterCompetitionCategoryForm from './_components/toggle-form';
import UpdateMasterCompetitionCategoryForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterCompetitionCategoryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterCompetitionCategories(searchParams);

    return (
        <FormProvider<IMasterCompetitionCategory>>
            <MasterCompetitionCategoryPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterCompetitionCategoryPageContent({
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
    } = useFormContext<IMasterCompetitionCategory>();

    const tableProps = {
        data: response?.data?.CompetitionCategoryList || response?.data?.competitionCategoryList || [],
        totalItems: response?.data?.Count || response?.data?.count || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    const handleAddSuccess = async () => {
        closeAddForm();
        await refetchAll();
    };

    const handleEditSuccess = async () => {
        closeEditForm();
        await refetchAll();
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Competition Category
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterCompetitionCategory>
                        {...tableProps}
                        columns={MasterCompetitionCategoryColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading competition categories...'
                        noDataTitle='No Competition Categories Found'
                        noDataDescription='Get started by creating your first competition category'
                        errorTitle='Error Loading Categories'
                    />
                </CollapsibleSection>

                <>
                    {/* Add Form */}
                    {isAddFormOpen && (
                        <div ref={addFormRef}>
                            <CollapsibleSection
                                title='Add New Competition Category'
                                description='Fill in the details below to create a new competition category'
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
                                    <AddMasterCompetitionCategoryForm onSuccess={handleAddSuccess} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditFormOpen && selectedRow && (
                        <div ref={editFormRef}>
                            <CollapsibleSection
                                title='Edit Competition Category'
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
                                    <UpdateMasterCompetitionCategoryForm selectedRow={selectedRow} onSuccess={handleEditSuccess} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </>

                {/* Toggle Form */}
                {isToggleFormOpen && selectedRow && (
                    <ToggleMasterCompetitionCategoryForm
                        rowData={selectedRow}
                        onClose={closeToggleForm}
                        onSuccess={refetchAll}
                    />
                )}
            </div>
        </div>
    );
}
