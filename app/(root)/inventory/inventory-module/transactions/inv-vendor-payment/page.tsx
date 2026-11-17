'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useInvVendorPayment } from '@/hooks/inventory/transactions/use-inv-vendor-payment';
import { Plus, X, CreditCard, PlusCircle, Pencil } from 'lucide-react';
import type { InvVendorPayment } from '@/types/inventory/transactions/inv-vendor-payment';
import { use } from 'react';
import AddVendorPaymentForm from './_components/add-form';
import { invVendorPaymentColumns } from './_components/columns';
import { ToggleVendorPaymentModal } from './_components/toggle-modal';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvVendorPaymentPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const {
        data: response,
        isLoading,
        error,
        vendorPayments,
        isVendorPaymentsLoading
    } = useInvVendorPayment(searchParams);

    return (
        <FormProvider<InvVendorPayment>>
            <InvVendorPaymentContent
                response={response}
                vendorPayments={vendorPayments}
                isLoading={isLoading}
                isVendorPaymentsLoading={isVendorPaymentsLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvVendorPaymentContent({
    response,
    vendorPayments,
    isLoading,
    isVendorPaymentsLoading,
    error
}: {
    response: any;
    vendorPayments: any;
    isLoading: boolean;
    isVendorPaymentsLoading: boolean;
    error: any;
}) {
    const {
        openAddForm,
        openEditForm,
        selectedRow,
        isAddFormOpen,
        isEditFormOpen,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef,
        isToggleFormOpen,
        closeToggleForm
    } = useFormContext<InvVendorPayment>();

    const tableProps = useDataTableProps(vendorPayments, {
        dataKey: 'data',
        totalKey: 'total'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title='Vendor Payment'
                        description='Manage vendor payments and track history'
                    />
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Payment
                    </Button>
                </div>

                {isAddFormOpen && (
                    <div ref={addFormRef}>
                        <CollapsibleSection
                            title='New Vendor Payment'
                            description='Enter payment details'
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
                                <AddVendorPaymentForm onSuccess={closeAddForm} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {isEditFormOpen && selectedRow && (
                    <div ref={editFormRef}>
                        <CollapsibleSection
                            title={`Edit Payment: ${selectedRow.invmS_SupplierName} - ${selectedRow.invspT_Id}`}
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
                                <AddVendorPaymentForm onSuccess={closeEditForm} initialData={selectedRow} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {isToggleFormOpen && selectedRow && (
                    <ToggleVendorPaymentModal rowData={selectedRow} onClose={closeToggleForm} />
                )}

                <CollapsibleSection
                    title='Payment History'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                    icon={<CreditCard className='h-5 w-5' />}>
                    <GenericDataTable<InvVendorPayment>
                        {...tableProps}
                        columns={invVendorPaymentColumns}
                        isLoading={isVendorPaymentsLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading payment records...'
                        noDataTitle='No Payments Found'
                        noDataDescription='Create a new vendor payment to start'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
