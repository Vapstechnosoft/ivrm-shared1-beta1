'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMessMenu } from '@/hooks/hostel/useMessMenu';
import { Plus, X } from 'lucide-react';
import { use, useEffect } from 'react';
import { messMenuColumns } from './_components/columns';
import { toast } from 'sonner';

import { ToggleMessMenuForm } from './_components/toggle-form';
import AddForm from './_components/add-form';
import UpdateMessMenuForm from './_components/update-form';
import { IMessMenu } from '@/types/hostel/hostel-management/masters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// -------------------------
// MAIN PAGE
// -------------------------
export default function MessMenuPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, refetchAll } = useMessMenu(searchParams);

    return (
        <FormProvider<IMessMenu>>
            <PageContent
                response={response}
                isLoading={isLoading}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

// -------------------------
// PAGE CONTENT
// -------------------------
function PageContent({
    response,
    isLoading,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    refetchAll: () => void;
}) {
    const { openAddForm } = useFormContext<IMessMenu>();

    // Process data for the table
    // The hook returns { get_messlist, get_messCategorylist, griddata }
    // GenericDataTable expects an object with 'list' or we pass 'data' directly in tableProps if we use useDataTableProps differently?
    // usage: useDataTableProps({ data: list, total: total }) OR usage: useDataTableProps(response) if response follows standard { list, total }
    // Here response structure is custom.
    const messMenuList = response?.griddata || [];

    // We can manually create tableProps
    const tableProps = {
        data: messMenuList,
        totalItems: messMenuList.length,
        isLoading
    };

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
                        Add Mess Menu
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMessMenu>
                        {...tableProps}
                        columns={messMenuColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading mess menus...'
                        noDataTitle='No Mess Menus Found'
                        noDataDescription='Get started by creating your first mess menu'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections
                    onSuccess={refetchAll}
                    messList={response?.get_messlist || []}
                    categoryList={response?.get_messCategorylist || []}
                />
            </div>
        </div>
    );
}

// -------------------------
// FORM SECTIONS
// -------------------------
function FormSections({
    onSuccess,
    messList,
    categoryList
}: {
    onSuccess: () => void;
    messList: { hlmM_Id: number; hlmM_Name: string }[];
    categoryList: { hlmmC_Id: number; hlmmC_Name: string }[];
}) {
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
    } = useFormContext<IMessMenu>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Mess Menu'
                        description='Fill in the details below to create a new mess menu'
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
                                onSuccess={() => { closeAddForm(); onSuccess(); }}
                                messList={messList}
                                categoryList={categoryList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Mess Menu'
                        description='Modify mess menu details'
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
                            <UpdateMessMenuForm
                                rowData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                                messList={messList}
                                categoryList={categoryList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMessMenuForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}
