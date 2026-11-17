
'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useInvStock } from '@/hooks/inventory/transactions/use-inv-stock';
import type { InvStock } from '@/types/inventory/transactions/inv-stock';
import { Plus, X, Package2, ListChecks, Layers, PlusCircle, Pencil } from 'lucide-react';
import { use } from 'react';
import AddStockForm from './_components/add-form';
import { invStockColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvStockPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useInvStock(searchParams);

    return (
        <FormProvider<InvStock>>
            <InvStockPageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvStockPageContent({
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
        isAddFormOpen,
        isEditFormOpen,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef,
    } = useFormContext<InvStock>();

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_stock',
        totalKey: 'total'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title='Stock Updation'
                        description='Manage and update inventory stock levels across stores'
                    />
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Stock Entry
                    </Button>
                </div>

                {isAddFormOpen && (
                    <div ref={addFormRef}>
                        <CollapsibleSection
                            title='New Stock Updation'
                            description='Enter the stock details'
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
                                <AddStockForm
                                    onSuccess={closeAddForm}
                                />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {isEditFormOpen && selectedRow && (
                    <div ref={editFormRef}>
                        <CollapsibleSection
                            title={`Edit Stock Entry: ${selectedRow.invstO_BatchNo}`}
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
                                <AddStockForm
                                    onSuccess={closeEditForm}
                                    initialData={selectedRow}
                                />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                <CollapsibleSection
                    title='Stock Details'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                    icon={<Layers className='h-5 w-5' />}>
                    <GenericDataTable<InvStock>
                        {...tableProps}
                        data={response?.data?.get_stock || []}
                        columns={invStockColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Retrieving stock records...'
                        noDataTitle='No Stock Records'
                        noDataDescription='Try adjusting your filters or create a new stock entry.'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
