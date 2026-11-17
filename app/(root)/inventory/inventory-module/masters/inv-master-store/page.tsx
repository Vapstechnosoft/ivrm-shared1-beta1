'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X, Store, PlusCircle, Pencil } from 'lucide-react';
import { useInvMasterStore } from '@/hooks/inventory/masters/use-inv-master-store';
import type { IInvMasterStore } from '@/types/inventory/masters/inv-master-store';
import AddInvMasterStoreForm from './_components/add-form';
import { invMasterStoreColumns } from './_components/columns';
import ToggleInvMasterStoreForm from './_components/toggle-form';
import UpdateInvMasterStoreForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvMasterStorePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useInvMasterStore(searchParams);

    return (
        <FormProvider<IInvMasterStore>>
            <InvMasterStorePageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function InvMasterStorePageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<IInvMasterStore>();
    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_store',
        totalKey: 'total'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Store
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    title='Store List'
                    icon={<Store className='h-5 w-5' />}>
                    <GenericDataTable<IInvMasterStore>
                        {...tableProps}
                        data={response?.data?.get_store || []}
                        columns={invMasterStoreColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading stores...'
                        noDataTitle='No Stores Found'
                        noDataDescription='Get started by creating your first store'
                        errorTitle='Error Loading Stores'
                    />
                </CollapsibleSection>

                <FormSections empname_list={response?.data?.empname_list || []} />
            </div>
        </div>
    );
}

function FormSections({ empname_list }: { empname_list: any[] }) {
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
    } = useFormContext<IInvMasterStore>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Store'
                        description='Fill in the details below to create a new store'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'
                        icon={<PlusCircle className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddInvMasterStoreForm onSuccess={closeAddForm} empname_list={empname_list} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Store'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'
                        icon={<Pencil className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateInvMasterStoreForm selectedRow={selectedRow} onSuccess={closeEditForm} empname_list={empname_list} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleInvMasterStoreForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
