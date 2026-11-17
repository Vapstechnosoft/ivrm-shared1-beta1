'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useFeeOtherStudent } from '@/hooks/fees/useMasters';
import type { MasterFeeOtherStudentType } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import React, { use, useState } from 'react';
import AddFeeOtherStudentFrom from './_components/add-form';
import { masterFeeOtherStudentList } from './_components/column';
import DeleteFeeOtherStudentForm from './_components/delete-form';
import UpdtaeFeeOtherStudentFrom from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterFeeOtherStudentPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useFeeOtherStudent(searchParams);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const formState = {
        isAddFormOpen,
        isEditFormOpen,
        selectedRow,

        openAddForm: () => setIsAddFormOpen(true),
        closeAddForm: () => setIsAddFormOpen(false),

        openEditForm: (row: any) => {
            setSelectedRow(row);
            setIsEditFormOpen(true);
        },
        closeEditForm: () => {
            setSelectedRow(null);
            setIsEditFormOpen(false);
        },

        addFormRef: React.createRef<HTMLDivElement>(),
        editFormRef: React.createRef<HTMLDivElement>()
    };

    return (
        <FormProvider<MasterFeeOtherStudentType> {...formState}>
            <MasterFeeOtherStudent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterFeeOtherStudent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<MasterFeeOtherStudentType>();

    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1' />

                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Fee Other Student
                    </Button>
                </div>

                {/* Table */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<MasterFeeOtherStudentType>
                        {...tableProps}
                        columns={masterFeeOtherStudentList}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Fee Other Student...'
                        noDataTitle='No Fee Other Student Found'
                        noDataDescription='Get started by creating your first Fee Other Student'
                        errorTitle='Error Loading Fee Other Student'
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
        isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeDeleteForm,
        isEditFormOpen,
        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<MasterFeeOtherStudentType>();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Fee Other Student'
                        description='Fill in the details below to create a New Fee Other Student'
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

                            <AddFeeOtherStudentFrom onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {isDeleteFormOpen && selectedRow && (
                <DeleteFeeOtherStudentForm
                    rowData={selectedRow}
                    onClose={closeDeleteForm}
                    onSuccess={() => {
                        closeDeleteForm();
                    }}
                />
            )}

            {/* {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <UpdtaeFeeOtherStudentFrom
                        selectedRow={selectedRow}
                        onClose={closeEditForm}
                        onSuccess={() => {
                            closeEditForm();
                        }}
                    />
                </div>
            )} */}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Fee Other Student'
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
                            <UpdtaeFeeOtherStudentFrom selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
