
'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X, RotateCcw, Wallet, PlusCircle, Pencil, List } from 'lucide-react';
import { useInvOpeningBalance } from '@/hooks/inventory/transactions/use-inv-opening-balance';
import type { IInvOpeningBalance } from '@/types/inventory/transactions/inv-opening-balance';
import AddOBForm from './_components/add-form';
import { invOpeningBalanceColumns } from './_components/columns';
import { ToggleOBModal } from './_components/toggle-modal';
import { Heading } from '@/components/layout/heading';
// import UpdateOBForm from './_components/update-form'; // To be implemented
// import ViewOBDetailsModal from './_components/view-details-modal'; // To be implemented

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';

export default function InvOpeningBalancePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);

    // Pagination & Search State synced with URL
    const [currentPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );
    const [searchQuery] = useQueryState(
        tableSearchVariables.search,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );

    const queryParams = {
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
        search_query: searchQuery
    };

    const { data: response, isLoading, error } = useInvOpeningBalance(queryParams);

    return (
        <FormProvider<IInvOpeningBalance>>
            <InvOpeningBalancePageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvOpeningBalancePageContent({
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
        openEditForm,
        openToggleForm,
        openDetailsView,
        selectedRow,
        isDetailsViewOpen,
        closeDetailsView,
        isToggleFormOpen,
        closeToggleForm
    } = useFormContext<IInvOpeningBalance>();

    const { toggleActiveMutation, storesQuery } = useInvOpeningBalance(); // Unused here, kept if logic needs restore

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_openingbalance',
        totalKey: 'total'
    });

    // Force fetching from new API in AddOBForm by passing empty list
    const storeList: any[] = [];

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Opening Balance
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    title='Opening Balance Records'
                    icon={<Wallet className='h-5 w-5' />}>
                    <GenericDataTable<IInvOpeningBalance>
                        {...tableProps}
                        data={response?.data?.get_openingbalance || []}
                        columns={invOpeningBalanceColumns}
                        isLoading={isLoading}
                        error={error}
                        isSearchRequired={true}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Retrieving Opening Balance records...'
                        noDataTitle='No Records Found'
                        noDataDescription='Begin by creating your first Opening Balance entry.'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                <FormSections
                    storeList={storeList}
                    itemList={response?.data?.get_item || []}
                />

                {isToggleFormOpen && selectedRow && (
                    <ToggleOBModal rowData={selectedRow} onClose={closeToggleForm} />
                )}
            </div>
        </div>
    );
}

function FormSections({ storeList, itemList }: { storeList: any[], itemList: any[] }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<IInvOpeningBalance>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Opening Balance'
                        description='Fill in the details below to record opening balance'
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
                            <AddOBForm onSuccess={closeAddForm} storeList={storeList} itemList={itemList} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Opening Balance'
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
                            <AddOBForm
                                onSuccess={closeEditForm}
                                storeList={storeList}
                                itemList={itemList}
                                initialData={selectedRow}
                                isEdit={true}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
