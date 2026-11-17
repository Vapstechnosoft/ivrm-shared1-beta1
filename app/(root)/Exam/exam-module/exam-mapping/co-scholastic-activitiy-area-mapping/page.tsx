'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useCoScholasticActivityAreaMapping } from '@/hooks/exam/exammodule/exam-mapping';
import type { ICoScholasticActivityAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddCoScholasticActivityAreaMapping from './_components/add-from';
//import AddExamTermAndExamMapping from './_components/add-from';
// import AddExamTermAndExamMapping from './_components/add-form';
import { CoScholasticActivityAreaMappingColumns } from './_components/columns';
import ToggleCoScholasticActivityAreaForm from './_components/toggle-form';
import UpdateCoScholasticActivityAreaMapping from './_components/update-form';
//import ExamTermAndExamMappingDetailsPage from './_components/exam-term-exam-mapping-details';
//import ToggleExamTermAndExamMappingForm from './_components/toggle-form';
//import UpdateExamTermAndExamMapping from './_components/update-form';
// import UpdateExamTermAndExamMapping from './_components/update-form';
// import ViewExamTermMappingDetails from './_components/view-details';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function CoScholasticActivityAreaMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useCoScholasticActivityAreaMapping(searchParams);

    return (
        <FormProvider<ICoScholasticActivityAreaMapping>>
            <CoScholasticActivityAreaMappingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function CoScholasticActivityAreaMappingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<ICoScholasticActivityAreaMapping>();
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
                        Add Activity Area Mapping
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ICoScholasticActivityAreaMapping>
                        {...tableProps}
                        columns={CoScholasticActivityAreaMappingColumns}
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
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<ICoScholasticActivityAreaMapping>();

    return (
        <>
            {/*  Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Co-Scholastic Activity Area Mapping'
                        description='Fill in the details below to create a new co-scholastic activity area mapping'
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
                            <AddCoScholasticActivityAreaMapping onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Co-Scholastic Activity Area Mapping'
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
                            <UpdateCoScholasticActivityAreaMapping rowData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleCoScholasticActivityAreaForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
