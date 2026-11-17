'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterGradeDropdownList } from '@/hooks/exam/exammodule/usemasters';
import type { IMasterGradeList } from '@/types/hrms/hrms-config/master';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddGradeForm from './_components/add-form';
import { columns } from './_components/columns';
import ReorderGradeForm from './_components/reorder-form';
import ToggleMasterGradeForm from './_components/toggle-form';
import UpdateGradeForm from './_components/update-form';
import { useMasterGrade } from '@/hooks/hrms/useMasters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterGradePage(props: { searchParams: SearchParams }) {
    const [searchParams, setSearchParams] = useState<any>({});

    useEffect(() => {
        const fetchParams = async () => {
            const params = await props.searchParams;
            setSearchParams(params);
        };
        fetchParams();
    }, [props.searchParams]);

    const { data: response, isLoading, error } = useMasterGrade(searchParams);

    return (
        <FormProvider<IMasterGradeList>>
            <MasterGradePageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function MasterGradePageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterGradeList>();
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
                        Add Grade
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='flex justify-end'>
                        <ReorderGradeForm />
                    </div>
                    <GenericDataTable<IMasterGradeList>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading grades...'
                        noDataTitle='No Grades Found'
                        noDataDescription='Get started by creating your first grade'
                        errorTitle='Error Loading Grades'
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
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterGradeList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Grade'
                        description='Fill in the details below to create a new grade'
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
                            <AddGradeForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Grade'
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
                            <UpdateGradeForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterGradeForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
