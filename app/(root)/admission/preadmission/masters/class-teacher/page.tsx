'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useClassTeacher } from '@/hooks/admission/preadmission/useMasters';
import type { IMasterClassTeacherList } from '@/types/admission/preadmission/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterClassTeacherForm from './_components/add-form';
import { masterClassTeacherColumns } from './_components/columns';
import ToggleMasterClassTeachersForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterClassTeacherPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useClassTeacher(searchParams);

    return (
        <FormProvider<IMasterClassTeacherList>>
            <MasterClassTeacherPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function MasterClassTeacherPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterClassTeacherList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Class Teacher
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterClassTeacherList>
                        {...tableProps}
                        columns={masterClassTeacherColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Class Teacher...'
                        noDataTitle='No Class Teacher Found'
                        noDataDescription='Get started by creating your first Class Teacher'
                        errorTitle='Error Loading Class Teacher'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, closeAddForm, addFormRef, isToggleFormOpen, selectedRow, closeToggleForm } =
        useFormContext<IMasterClassTeacherList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Class Teacher'
                        description='Fill in the details below to create a new Class Teacher'
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
                            <AddMasterClassTeacherForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterClassTeachersForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
