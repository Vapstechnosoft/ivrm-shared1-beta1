
'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import {
    invTItemConsumptionSchema,
    type InvTItemConsumptionSchema,
} from '@/schemas/inventory/transactions/inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import { Plus, X, PackageMinus, PlusCircle, Pencil } from 'lucide-react';
import { use } from 'react';
import AddItemConsumptionForm from './_components/add-form';
import { invTItemConsumptionColumns } from './_components/columns';
import { ToggleItemConsumptionModal } from './_components/toggle-modal';
import { ViewItemsModal } from './_components/view-items-modal';
import { ViewStaffModal } from './_components/view-staff-modal';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';

export default function InvTItemConsumptionPage(props: { searchParams: SearchParams }) {
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

    const { data: response, isLoading, error } = useInvTItemConsumption(queryParams);

    return (
        <FormProvider<InvTItemConsumption>>
            <InvTItemConsumptionPageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

function InvTItemConsumptionPageContent({
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
        openDeleteForm,
        openToggleForm,
        openDetailsView,
        selectedRow,
        isDetailsViewOpen,
        closeDetailsView,
        isAddFormOpen,
        isEditFormOpen,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef,
        isToggleFormOpen,
        closeToggleForm
    } = useFormContext<InvTItemConsumption>();

    const { deleteMutation } = useInvTItemConsumption();

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_itemconsumption',
        totalKey: 'total' // Adjust if API returns total differently
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title='Item Consumption Transaction'
                        description='Manage item consumption records'
                    />
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Consumption
                    </Button>
                </div>

                {isAddFormOpen && (
                    <div ref={addFormRef}>
                        <CollapsibleSection
                            title='Create New Consumption'
                            description='Enter the consumption details'
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
                                <AddItemConsumptionForm onSuccess={closeAddForm} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {isEditFormOpen && selectedRow && (
                    <div ref={editFormRef}>
                        <CollapsibleSection
                            title={`Edit Consumption: ${selectedRow.invmiC_ICNo}`}
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
                                <AddItemConsumptionForm onSuccess={closeEditForm} initialData={selectedRow} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {isToggleFormOpen && selectedRow && (
                    <ToggleItemConsumptionModal rowData={selectedRow} onClose={closeToggleForm} />
                )}

                {isDetailsViewOpen && selectedRow && selectedRow.invmiC_Remarks === 'VIEW_ITEMS' && (
                    <ViewItemsModal rowData={selectedRow} onClose={closeDetailsView} />
                )}

                {isDetailsViewOpen && selectedRow && selectedRow.invmiC_Remarks === 'VIEW_STAFF' && (
                    <ViewStaffModal rowData={selectedRow} onClose={closeDetailsView} />
                )}

                <CollapsibleSection
                    title='Consumption Records'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                    icon={<PackageMinus className='h-5 w-5' />}>
                    <GenericDataTable<InvTItemConsumption>
                        {...tableProps}
                        data={response?.data?.get_itemconsumption || []}
                        columns={invTItemConsumptionColumns}
                        isLoading={isLoading}
                        error={error}
                        isSearchRequired={true}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Consumption records...'
                        noDataTitle='No Records Found'
                        noDataDescription='Create a new Item Consumption record to start'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
