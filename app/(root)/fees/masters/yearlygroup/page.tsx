'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterGetYearlyCategory } from '@/hooks/fees/useMasters';
import type { IMaasterFeesYearlyGrouping } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterYearlyGroup from './_components/add-form';
import { YearlyColoumnsColumns } from './_components/columns';
import ToggleYearColumnForm from './_components/toggle-form';
import UpdateYearlyGroupForm from './_components/update-form';

export default function MasterYearlyGroupClient({
    searchParams
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    const unwrappedSearchParams = use(searchParams);

    const { data: response, isLoading, error } = useMasterGetYearlyCategory(unwrappedSearchParams);
    const tableProps = useDataTableProps(response);

    return (
        <FormProvider<IMaasterFeesYearlyGrouping>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    {/* Header */}
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            {/* <Heading
                                title='Fees Yearly Group'
                                description='Manage fee groups, rebates, and installments by academic year'
                            /> */}
                        </div>
                        <AddButton />
                    </div>

                    {/* Table Section */}
                    <CollapsibleSection
                        defaultOpen
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable<IMaasterFeesYearlyGrouping>
                            {...tableProps}
                            columns={YearlyColoumnsColumns}
                            isLoading={isLoading}
                            error={error}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading yearly groups...'
                            noDataTitle='No Yearly Groups Found'
                            noDataDescription='Get started by creating your first yearly group'
                            errorTitle='Error Loading Yearly Groups'
                        />
                    </CollapsibleSection>

                    <FormSections />
                </div>
            </div>
        </FormProvider>
    );
}

function AddButton() {
    const { openAddForm } = useFormContext<IMaasterFeesYearlyGrouping>();
    return (
        <Button type='button' onClick={openAddForm} className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
            <Plus className='h-4 w-4' />
            Add Yearly Group
        </Button>
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
    } = useFormContext<IMaasterFeesYearlyGrouping>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Yearly Group'
                        description='Fill in the details below to create a new yearly group'
                        defaultOpen
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
                            <AddMasterYearlyGroup onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Yearly Group'
                        description='Update the details of the selected yearly group'
                        defaultOpen
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
                            <UpdateYearlyGroupForm key={selectedRow.fyG_Id} selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleYearColumnForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
