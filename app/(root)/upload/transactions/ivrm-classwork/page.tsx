'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { ClassWorkUploadedList } from '@/hooks/upload/transactions/useClassWork';

import type { IClassWorkDetails } from '@/types/upload/reports/classwork-upload-report';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddClassWorkForm from './_components/add-form';
import { classWorkColumns } from './_components/columns';
import ToggleClassWorkForm from './_components/toggle-form';
import UpdateClassWorkForm from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function ClassWorkPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const payload = {
        asmaY_Id: 176
    };
    const { data: response, isLoading, error } = ClassWorkUploadedList(payload, searchParams ?? {});
    return (
        <FormProvider<IClassWorkDetails>>
            <ClassWorkContent data={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function ClassWorkContent({
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
                        Add ClassWork
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    title='Class work Upload'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IClassWorkDetails>
                        {...tableProps}
                        columns={classWorkColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading classwork...'
                        noDataTitle='No ClassWork Found'
                        noDataDescription='Get started by creating your first classwork entry'
                        errorTitle='Error Loading ClassWork'
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
        isDetailsViewOpen,
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
                        title='Add New ClassWork'
                        description='Fill in the details below to create a new classwork entry'
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
                            <AddClassWorkForm
                                onSuccess={() => {
                                    closeAddForm();
                                    onSuccess();
                                }}
                                classList={classList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit ClassWork'
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
                            <UpdateClassWorkForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    closeEditForm();
                                    onSuccess();
                                }}
                                classList={[]}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleClassWorkForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                        onSuccess();
                    }}
                />
            )}
        </>
    );
}
