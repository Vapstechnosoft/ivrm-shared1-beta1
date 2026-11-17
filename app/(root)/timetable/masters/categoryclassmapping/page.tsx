'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import { use } from 'react';

import { useTimeTableCategoryClassMapping } from '@/hooks/timetable/useMasters';
import type { ICategoryClassMapping } from '@/types/timetable/masters/masters';
import AddCategoryClassMappingForm from './_components/add-form';
import { categoryClassMappingColumns } from './_components/columns';

// import AddMasterModeOfPaymentForm from './_components/add-form';
// import { modeOfPaymentColumns } from './_components/columns';
// import ToggleMasterModeOfPaymentForm from './_components/toggle-form';
// import UpdateMasterModeOfPaymentForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterCategoryClassMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useTimeTableCategoryClassMapping(searchParams);

    console.log('response', response);

    return (
        <FormProvider<ICategoryClassMapping>>
            <MasterCategroyClassMappingContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterCategroyClassMappingContent({
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
    const { openAddForm } = useFormContext<ICategoryClassMapping>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'>{/* <Heading title='Mode Of Payment' description='' /> */}</div>

                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Category Class Mapping
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ICategoryClassMapping>
                        {...tableProps}
                        columns={categoryClassMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Category Class Mapping data...'
                        noDataTitle='No Category Class Mapping Data Found'
                        noDataDescription='Add a new Category Class Mapping to get started'
                        errorTitle='Error Loading Category Class Mapping Data'
                    />
                </CollapsibleSection>

                <FormSections />
            </div>
        </div>
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
    } = useFormContext<ICategoryClassMapping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Category Class Mapping'
                        description='Fill in the details below to create a new Category Class Mapping'
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
                            <AddCategoryClassMappingForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
