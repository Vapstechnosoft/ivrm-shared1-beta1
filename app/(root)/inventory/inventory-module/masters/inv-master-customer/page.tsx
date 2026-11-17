'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X, Users, PlusCircle, Pencil } from 'lucide-react';
import { Heading } from '@/components/layout/heading';
import { useInvMasterCustomer } from '@/hooks/inventory/masters/use-inv-master-customer';
import { invMasterCustomerColumns } from './_components/columns';
import AddCustomerForm from './_components/add-form';
import UpdateCustomerForm from './_components/update-form';
import { ToggleCustomerModal } from './_components/toggle-form';
import type { IInvMasterCustomer } from '@/types/inventory/masters/inv-master-customer';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvMasterCustomerPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useInvMasterCustomer(searchParams);

    return (
        <FormProvider<IInvMasterCustomer>>
            <InvMasterCustomerPageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvMasterCustomerPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const {
        openAddForm,
        selectedRow,
        isToggleFormOpen,
        closeToggleForm
    } = useFormContext<IInvMasterCustomer>();

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_customer',
        totalKey: 'total'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title='Customer Master'
                        description='Manage Customer Details'
                    />
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Customer
                    </Button>
                </div>

                <FormSections />

                <CollapsibleSection
                    title='Customer List'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                    icon={<Users className='h-5 w-5' />}>
                    <GenericDataTable<IInvMasterCustomer>
                        {...tableProps}
                        data={response?.data?.get_customer || []}
                        columns={invMasterCustomerColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Customer records...'
                        noDataTitle='No Customers Found'
                        noDataDescription='Create a new Customer to start'
                        errorTitle='Error Loading Customer Data'
                    />
                </CollapsibleSection>

                {isToggleFormOpen && selectedRow && (
                    <ToggleCustomerModal rowData={selectedRow} onClose={closeToggleForm} />
                )}
            </div>
        </div>
    );
}

function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<IInvMasterCustomer>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Create New Customer'
                        description='Enter the customer details'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='animate-in slide-in-from-top-4 duration-300 shadow-md mb-6'
                        icon={<PlusCircle className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='absolute top-[-3.5rem] right-0 hover:bg-destructive/10 text-destructive'>
                                <X className='h-4 w-4 mr-1' /> Close
                            </Button>
                            <AddCustomerForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title={`Edit Customer: ${selectedRow.invmC_CustomerName || ''}`}
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='animate-in slide-in-from-top-4 duration-300 shadow-md mb-6 border-primary/20'
                        icon={<Pencil className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='absolute top-[-3.5rem] right-0 hover:bg-destructive/10 text-destructive'>
                                <X className='h-4 w-4 mr-1' /> Close
                            </Button>
                            <UpdateCustomerForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
