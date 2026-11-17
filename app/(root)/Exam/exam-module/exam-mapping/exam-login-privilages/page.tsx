'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useExamLoginPrivileges } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamLoginPrivileges } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddExamLoginPrivileges from './_components/add-form';
import { ExamLoginPrivilegesColumns } from './_components/columns';
import LoginPrivilegesDetailsPage from './_components/yearly-category-subject-mapping-details';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ExamLoginPrivilegesPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useExamLoginPrivileges(searchParams);
    return (
        <FormProvider<IExamLoginPrivileges>>
            <ExamLoginPrivilegesPageContent
                response={response} // always array
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function ExamLoginPrivilegesPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IExamLoginPrivileges>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' /> Add Privilege
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IExamLoginPrivileges>
                        {...tableProps}
                        columns={ExamLoginPrivilegesColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading exam login privileges...'
                        noDataTitle='No Privileges Found'
                        noDataDescription='Get started by creating your first privilege'
                        errorTitle='Error Loading Privileges'
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
    } = useFormContext<IExamLoginPrivileges>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Exam Login Privilege'
                        description='Fill in the details below to create a new privilege'
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
                        </div>
                        <AddExamLoginPrivileges onSuccess={closeAddForm} />
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Exam Login Privilege'
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
                        </div>
                        <AddExamLoginPrivileges rowData={selectedRow} onSuccess={closeEditForm} />
                    </CollapsibleSection>
                </div>
            )}
            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <LoginPrivilegesDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
