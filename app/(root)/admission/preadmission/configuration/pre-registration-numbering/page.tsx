'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { usePreRegistrationNumbering } from '@/hooks/admission/preadmission/useConfigurations';
import type { IMasterTransactionNumberingList } from '@/types/admission/preadmission/configaration';
import { Plus, X } from 'lucide-react';
import AddPreRegistrationNumberingForm from './_components/add-form';
import { preRegistrationnumberingColumns } from './_components/columns';
import UpdatePreRegistrationForm from './_components/update-form';

export default function RegistrationNumberingPage() {
    const { data: response, isLoading, error } = usePreRegistrationNumbering();

    return (
        <FormProvider<IMasterTransactionNumberingList>>
            <RegistrationNumberingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function RegistrationNumberingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterTransactionNumberingList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                {response && response.data.length === 0 && (
                    <div className='flex justify-end'>
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Transaction Numbering
                        </Button>
                    </div>
                )}

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterTransactionNumberingList>
                        {...tableProps}
                        columns={preRegistrationnumberingColumns}
                        isLoading={isLoading}
                        error={error}
                        isSearchRequired={false}
                        isPaginationRequired={false}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Pre-registration Numberings...'
                        noDataTitle='No Pre-Registration Numberings Found'
                        noDataDescription='Get started by creating your first Pre-Registration Numbering'
                        errorTitle='Error Loading Religions'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IMasterTransactionNumberingList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Pre-Registration Numbering'
                        description='Fill in the details below to create a new registration Numbering'
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
                            <AddPreRegistrationNumberingForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Pre-Registration Numbering'
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
                            <UpdatePreRegistrationForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
