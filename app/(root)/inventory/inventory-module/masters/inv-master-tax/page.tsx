'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X, Percent, PlusCircle, Pencil } from 'lucide-react';
import { useInvMasterTax } from '@/hooks/inventory/masters/use-inv-master-tax';
import type { IInvMasterTax } from '@/types/inventory/masters/inv-master-tax';
import AddInvMasterTaxForm from './_components/add-form';
import { getInvMasterTaxColumns } from './_components/columns';
import ToggleInvMasterTaxForm from './_components/toggle-form';
import UpdateInvMasterTaxForm from './_components/update-form';
import TaxLedgerSheet from './_components/tax-ledger-sheet';
import { useState } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvMasterTaxPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useInvMasterTax(searchParams);

    return (
        <FormProvider<IInvMasterTax>>
            <InvMasterTaxPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function InvMasterTaxPageContent({
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
    const { openAddForm } = useFormContext<IInvMasterTax>();

    // Server action returns: { success: true, data: { get_tax: [...] } }
    // So 'response' here is that full object.
    // useDataTableProps expects the object containing the array.

    const tableProps = useDataTableProps(response, {
        dataKey: 'data',
        totalKey: 'total'
    });
    const [isLedgerSheetOpen, setIsLedgerSheetOpen] = useState(false);
    const [selectedTaxForLedger, setSelectedTaxForLedger] = useState<IInvMasterTax | null>(null);

    const handleViewLedger = (row: IInvMasterTax) => {
        setSelectedTaxForLedger(row);
        setIsLedgerSheetOpen(true);
    };

    const columns = getInvMasterTaxColumns(handleViewLedger);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Tax
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    title='Tax List'
                    icon={<Percent className='h-5 w-5' />}>
                    <GenericDataTable<IInvMasterTax>
                        {...tableProps}
                        data={response?.data || []}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading taxes...'
                        noDataTitle='No Taxes Found'
                        noDataDescription='Get started by creating your first tax'
                        errorTitle='Error Loading Taxes'
                    />
                </CollapsibleSection >

                {/* Tax Ledger Sheet */}
                {
                    isLedgerSheetOpen && (
                        <TaxLedgerSheet
                            isOpen={isLedgerSheetOpen}
                            onClose={() => setIsLedgerSheetOpen(false)}
                            tax={selectedTaxForLedger}
                        />
                    )
                }

                <FormSections />
            </div >
        </div >
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
    } = useFormContext<IInvMasterTax>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Tax'
                        description='Fill in the details below to create a new tax'
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
                            <AddInvMasterTaxForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Tax'
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
                            <UpdateInvMasterTaxForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleInvMasterTaxForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
