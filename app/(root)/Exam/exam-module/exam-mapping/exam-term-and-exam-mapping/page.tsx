'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useExamTermAndExamMapping } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamTermAndExamMapping } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddExamTermAndExamMapping from './_components/add-from';
// import AddExamTermAndExamMapping from './_components/add-form';
import { ExamTermAndExamMappingColumns } from './_components/columns';
import ExamTermAndExamMappingDetailsPage from './_components/exam-term-exam-mapping-details';
import ToggleExamTermAndExamMappingForm from './_components/toggle-form';
import UpdateExamTermAndExamMapping from './_components/update-form';
// import UpdateExamTermAndExamMapping from './_components/update-form';
// import ViewExamTermMappingDetails from './_components/view-details';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ExamTermAndExamMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useExamTermAndExamMapping(searchParams);

    return (
        <FormProvider<IExamTermAndExamMapping>>
            <ExamTermAndExamMappingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function ExamTermAndExamMappingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IExamTermAndExamMapping>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Exam Term Mapping
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IExamTermAndExamMapping>
                        {...tableProps}
                        columns={ExamTermAndExamMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading exam term mappings...'
                        noDataTitle='No Exam Term Mappings Found'
                        noDataDescription='Get started by creating your first exam term mapping'
                        errorTitle='Error Loading Exam Term Mappings'
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
        isDetailsViewOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeDetailsView,
        addFormRef,
        editFormRef
    } = useFormContext<IExamTermAndExamMapping>();

    return (
        <>
            {/*  Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Exam Term Mapping'
                        description='Fill in the details below to create a new exam term mapping'
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
                            <AddExamTermAndExamMapping onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Exam Term Mapping'
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
                            <UpdateExamTermAndExamMapping rowData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleExamTermAndExamMappingForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/*  Details View */}
            {isDetailsViewOpen && selectedRow && <ExamTermAndExamMappingDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
