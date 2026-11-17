'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterFeeOnlinePaymentHeadGroupTable } from '@/hooks/fees/useMasters';

import type { IMasterOnlinePaymentHeadgroupList } from '@/types/fees/masters/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterOnlinePaymentHeadGroupForm from './_components/add-form';
import { masterClassYearlyCategoryColumns } from './_components/columns';
import DeleteMasterOnlinePaymentHeadGroupForm from './_components/delete-form';
import UpdateMasterOnlinePaymentHeadGroupMappingForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterOnlinePaymentHeadGroupPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMasterFeeOnlinePaymentHeadGroupTable(searchParams);

    return (
        <FormProvider<IMasterOnlinePaymentHeadgroupList>>
            <MasterFeeheadPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function MasterFeeheadPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterOnlinePaymentHeadgroupList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title="Online Payment Head Group" description="" /> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Online Payment Head Group
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterOnlinePaymentHeadgroupList>
                        {...tableProps}
                        columns={masterClassYearlyCategoryColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Online Payment Head Groups...'
                        noDataTitle='No Online Payment Head Groups Found'
                        noDataDescription='Get started by creating your first Online Payment Head Group'
                        errorTitle='Error Loading Online Payment Head Groups'
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
        isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeDeleteForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterOnlinePaymentHeadgroupList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Online Payment Head Group'
                        description='Fill in the details below to create a new New Online Payment Head Group'
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
                            <AddMasterOnlinePaymentHeadGroupForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Online Payment Head Group'
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
                            <UpdateMasterOnlinePaymentHeadGroupMappingForm selectedRow={selectedRow as any} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {/* {isToggleFormOpen && selectedRow && (
                <ToggleMasterOnlinePaymentHeadGroupForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                />
            )} */}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <DeleteMasterOnlinePaymentHeadGroupForm
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
