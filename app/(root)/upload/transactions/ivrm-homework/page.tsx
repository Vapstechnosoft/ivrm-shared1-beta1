'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddHomeWorkForm from './_components/add-form';
import UpdateHomeWorkForm from './_components/update-form';

import { HomeWorkUploadedList } from '@/hooks/upload/transactions/useHomeWork';
import type { IHomeWorkDetails } from '@/types/upload/reports/homework-upload-report';
import { homeWorkColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function HomeWorkPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);

    const payload = {
        asmaY_Id: 176
    };

    const { data: response, isLoading, error } = HomeWorkUploadedList(payload, searchParams ?? {});

    return (
        <FormProvider<IHomeWorkDetails>>
            <HomeWorkContent data={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function HomeWorkContent({
    data,
    isLoading,
    error
}: {
    data: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<any>();
    const tableProps = useDataTableProps(data);

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
                        Add Homework
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    title='Homework Upload'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IHomeWorkDetails>
                        {...tableProps}
                        columns={homeWorkColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading homework...'
                        noDataTitle='No Homework Found'
                        noDataDescription='Get started by creating your first homework entry'
                        errorTitle='Error Loading homework'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections yearList={data?.yearlist || []} classList={data?.classlist || []} onSuccess={() => {}} />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
    yearList,
    classList
}: {
    onSuccess: () => void;
    yearList: any[];
    classList: any[];
}) {
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
    } = useFormContext<any>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New HomeWork'
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
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>

                            <AddHomeWorkForm
                                classList={classList}
                                yearList={yearList}
                                onSuccess={() => {
                                    closeAddForm();
                                    onSuccess();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit HomeWork'
                        defaultOpen
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>

                            <UpdateHomeWorkForm
                                selectedRow={selectedRow}
                                classList={classList}
                                yearList={yearList}
                                onSuccess={() => {
                                    closeEditForm();
                                    onSuccess();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Toggle Form */}
            {/* {isToggleFormOpen && selectedRow && (
                <ToggleHomeWorkForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                        onSuccess();
                    }}
                />
            )} */}
        </>
    );
}
