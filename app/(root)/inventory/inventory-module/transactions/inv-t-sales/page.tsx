'use client';

import { use, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X, ShoppingCart, PlusCircle, Pencil } from 'lucide-react';
import { useInvTSales } from '@/hooks/inventory/transactions/use-inv-t-sales';
import type { IInvTSales } from '@/types/inventory/transactions/inv-t-sales';
import AddSalesForm from './_components/add-form';
import { getInvTSalesColumns } from './_components/columns';
import UpdateSalesForm from './_components/update-form';
// import ViewSalesDetailsModal from './_components/view-details-modal';
import { ToggleSalesModal } from './_components/toggle-modal';
import { ViewReceiptModal } from './_components/view-receipt-modal';
import { Heading } from '@/components/layout/heading';
import { ViewReceiptItemModal } from './_components/view-receipt-item-modal';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';

export default function InvTSalesPage(props: { searchParams: SearchParams }) {
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

    const { data: response, isLoading, error } = useInvTSales(queryParams);

    return (
        <FormProvider<IInvTSales>>
            <InvTSalesPageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvTSalesPageContent({
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
    } = useFormContext<IInvTSales>();

    const [isItemViewOpen, setIsItemViewOpen] = useState(false);
    const [itemRowData, setItemRowData] = useState<IInvTSales | null>(null);

    const handleViewItem = (row: IInvTSales) => {
        setItemRowData(row);
        setIsItemViewOpen(true);
    };

    const closeViewItem = () => {
        setIsItemViewOpen(false);
        setItemRowData(null);
    };

    // const { deleteMutation, toggleActiveMutation } = useInvTSales(); // Moved to columns component

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_Sale',
        totalKey: 'total'
    });

    const columns = useMemo(() => getInvTSalesColumns(handleViewItem), []);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title='Sales Transaction'
                        description='Manage sales transactions'
                    />
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Sale
                    </Button>
                </div>

                <FormSections />

                <CollapsibleSection
                    title='Sales List'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                    icon={<ShoppingCart className='h-5 w-5' />}>
                    <GenericDataTable<IInvTSales>
                        {...tableProps}
                        data={response?.data?.get_Sale || []}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        isSearchRequired={true}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Sales records...'
                        noDataTitle='No Sales Found'
                        noDataDescription='Create a new Sales record to start'
                        errorTitle='Error Loading Sales Data'
                    />
                </CollapsibleSection>

                {isToggleFormOpen && selectedRow && (
                    <ToggleSalesModal rowData={selectedRow} onClose={closeToggleForm} />
                )}

                {isDetailsViewOpen && selectedRow && (
                    <ViewReceiptModal
                        rowData={selectedRow}
                        onClose={closeDetailsView}
                    />
                )}

                {isItemViewOpen && itemRowData && (
                    <ViewReceiptItemModal
                        rowData={itemRowData}
                        onClose={closeViewItem}
                    />
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
    } = useFormContext<IInvTSales>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Create New Sale'
                        description='Enter the sales details'
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
                            <AddSalesForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title={`Edit Sale: ${selectedRow.invmsL_SalesNo}`}
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
                            <UpdateSalesForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                            {/* <div>Update Form Placeholder</div> */}
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
