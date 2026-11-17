'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useExamSubjectGroupMapping } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamSubjectGroupMapping } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddExamSubjectGroupMapping from './_components/add-form';
import ExamSubjectGroupingDetailsPage from './_components/category-class-mapping-details';
import { ExamSubjectGroupMappingColumns } from './_components/columns';
import UpdateExamSubjectGroup from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// -------------------------
// MAIN PAGE
// -------------------------
export default function ExamSubjectGroupMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useExamSubjectGroupMapping(searchParams);

    return (
        <FormProvider<IExamSubjectGroupMapping>>
            <ExamSubjectGroupMappingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

// -------------------------
// PAGE CONTENT
// -------------------------
function ExamSubjectGroupMappingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IExamSubjectGroupMapping>();
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
                        <Plus className='h-4 w-4' />
                        Add Subject Group Mapping
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IExamSubjectGroupMapping>
                        {...tableProps}
                        columns={ExamSubjectGroupMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading subject group mappings...'
                        noDataTitle='No Subject Group Mappings Found'
                        noDataDescription='Get started by creating your first subject group mapping'
                        errorTitle='Error Loading Subject Group Mappings'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

// -------------------------
// FORM SECTIONS
// -------------------------
function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isDetailsViewOpen, //  Added for View
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeDetailsView, // Added for View
        addFormRef,
        editFormRef
    } = useFormContext<IExamSubjectGroupMapping>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Subject Group Mapping'
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
                            <AddExamSubjectGroupMapping onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Subject Group Mapping'
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
                            <UpdateExamSubjectGroup selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <ExamSubjectGroupingDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
