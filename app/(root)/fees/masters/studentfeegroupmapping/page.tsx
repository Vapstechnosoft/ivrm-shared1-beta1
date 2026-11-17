'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import React, { use, useState } from 'react';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useStudentFeeGroupMapping } from '@/hooks/fees/useMasters';

import type { IMasterStudentFeeGroupMappingList } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import AddMasterStudentFeeGroupMapping from './_components/add-form';
import { masterStudentFeeGroupMapping } from './_components/columns';
import DeleteStudentFeeGroupMappingForm from './_components/delete-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterStudentGroupMappingPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useStudentFeeGroupMapping(searchParams);
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
        <FormProvider<IMasterStudentFeeGroupMappingList> {...formState}>
            <MasterStudentFeeGroupMapping response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterStudentFeeGroupMapping({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<IMasterStudentFeeGroupMappingList>();

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
                        Add Student Fee Group Mapping
                    </Button>
                </div>

                {/* Table */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterStudentFeeGroupMappingList>
                        {...tableProps}
                        columns={masterStudentFeeGroupMapping}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Student Fee Group Mapping...'
                        noDataTitle='No Student Fee Group Mapping Found'
                        noDataDescription='Get started by creating your first Student Fee Group Mapping'
                        errorTitle='Error Loading Student Fee Group Mapping'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, isDeleteFormOpen, selectedRow, closeAddForm, closeDeleteForm, addFormRef } =
        useFormContext<IMasterStudentFeeGroupMappingList>();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Student Fee Group Mapping'
                        description='Fill in the details below to create a New Student Fee Group Mapping'
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

                            <AddMasterStudentFeeGroupMapping onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* {isOrderDetailsOpen && <MasterViewDetail onSuccess={closeOrderDetails} />} */}

            {isDeleteFormOpen && selectedRow && (
                <DeleteStudentFeeGroupMappingForm
                    rowData={selectedRow}
                    onClose={closeDeleteForm}
                    onSuccess={() => {
                        closeDeleteForm();
                    }}
                />
            )}
        </>
    );
}
