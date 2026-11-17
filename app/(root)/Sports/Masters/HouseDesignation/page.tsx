'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterHouseDesignation } from '@/hooks/sports/useMasterHouseDesignation';
import type { IMasterHouseDesignation } from '@/types/sports/masters/house-designation';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterHouseDesignationForm from './_components/add-form';
import { MasterHouseDesignationColumns } from './_components/columns';
import UpdateMasterHouseDesignationForm from './_components/update-form';
import ToggleMasterHouseDesignationForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterHouseDesignationPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterHouseDesignation(searchParams);

    return (
        <FormProvider<IMasterHouseDesignation>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <MasterHouseDesignationPageContent
                        response={response}
                        isLoading={isLoading}
                        error={error}
                        refetchAll={refetchAll}
                    />
                </div>
            </div>
        </FormProvider>
    );
}

function MasterHouseDesignationPageContent({
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
    } = useFormContext<IMasterHouseDesignation>();

    const tableProps = useDataTableProps(response);

    return (
        <>
            {/* Header */}
            <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                <Button
                    type='button'
                    onClick={openAddForm}
                    className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                    <Plus className='h-4 w-4' />
                    Add Master House Designation
                </Button>
            </div>

            {/* Data Table Section */}
            <CollapsibleSection
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable<IMasterHouseDesignation>
                    {...tableProps}
                    columns={MasterHouseDesignationColumns}
                    isLoading={isLoading}
                    error={error}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading master house designations...'
                    noDataTitle='No Master House Designations Found'
                    noDataDescription='Get started by creating your first master house designation'
                    errorTitle='Error Loading Master House Designations'
                />
            </CollapsibleSection>

            {/* Forms */}
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master House Designation'
                        description='Fill in the details below to create a new master house designation'
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
                            <AddMasterHouseDesignationForm
                                onSuccess={() => {
                                    refetchAll();
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master House Designation'
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
                            <UpdateMasterHouseDesignationForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    refetchAll();
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterHouseDesignationForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={refetchAll}
                />
            )}
        </>
    );
}
