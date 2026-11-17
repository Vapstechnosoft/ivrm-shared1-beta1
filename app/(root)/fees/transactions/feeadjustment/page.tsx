'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useFeeAdjustment } from '@/hooks/fees/useTrasactions';
import type { IFeeAdjustmentGridList } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddFeeAdjustmentForm from './_components/add-form';
import { feeAdjustmentColumns } from './_components/columns';
import DeleteFeeAdjustmentForm from './_components/delete-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function feeAdjustment(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useFeeAdjustment(searchParams);

    return (
        <FormProvider<IFeeAdjustmentGridList>>
            <MasterFeeAdjustmentPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function MasterFeeAdjustmentPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IFeeAdjustmentGridList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title='Waived Off' description='' /> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Fee Adjustment
                    </Button>
                </div>
                <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='rounded-xl border bg-white shadow-xl'>
                    <GenericDataTable<IFeeAdjustmentGridList>
                        {...tableProps}
                        columns={feeAdjustmentColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Fee Adjustments...'
                        noDataTitle='No Fee Adjustments Found'
                        noDataDescription='Get started by adding a new Fee Adjustment.'
                        errorTitle='Error Loading Fee Adjustments'
                    />
                </CollapsibleSection>
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, isToggleFormOpen, isDeleteFormOpen, selectedRow, closeAddForm, closeToggleForm, closeDeleteForm, addFormRef } =
        useFormContext<IFeeAdjustmentGridList>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Fee Transaction Adjustment'
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
                            <AddFeeAdjustmentForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {/* {isToggleFormOpen && selectedRow && <ToggleMasterFeesConfigForm rowData={selectedRow} onClose={closeToggleForm} />} */}

            {isDeleteFormOpen && selectedRow && <DeleteFeeAdjustmentForm rowData={selectedRow} onClose={closeDeleteForm} />}
        </>
    );
}
