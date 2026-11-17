'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterCategoryClassMapping } from '@/hooks/exam/exammodule/usemasters';
import type { ICategoryMapping } from '@/types/exam/exam-module/masters';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import AddCategoryClassForm from './_components/add-form';
import CategoryClassMappingDetailsPage from './_components/category-class-mapping-details';
import { CategoryClassMappingColumns } from './_components/columns';
import UpdateCategoryClassMappingForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function CategoryClassMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMasterCategoryClassMapping(searchParams);

    return (
        <FormProvider<ICategoryMapping>>
            <CategoryClassMappingPageContent categorydata={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function CategoryClassMappingPageContent({
    categorydata,
    isLoading,
    error
}: {
    categorydata: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<ICategoryMapping>();
    const tableProps = useDataTableProps(categorydata);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
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
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ICategoryMapping>
                        {...tableProps}
                        columns={CategoryClassMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        //showSearchColumns={true}
                        loadingMessage='Loading mappings...'
                        noDataTitle='No Mappings Found'
                        noDataDescription='Get started by creating your first mapping'
                        errorTitle='Error Loading Mappings'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isDetailsViewOpen,
        closeAddForm,
        closeEditForm,
        closeDetailsView,
        addFormRef,
        editFormRef,
        selectedRow
    } = useFormContext<ICategoryMapping>();

    const [sections, setSections] = useState<{ id: number; name: string }[]>([]);
    const [selectedSections, setSelectedSections] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => {
        async function fetchSections() {
            if (!selectedRow) return; // Skip if no row selected
        }

        fetchSections();
    }, [selectedRow]);

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Category-Class Mapping'
                        description='Fill in the details below to create a new mapping'
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
                            <AddCategoryClassForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Category-Class Mapping'
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
                            <UpdateCategoryClassMappingForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <CategoryClassMappingDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
