'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeRefundableList, useopeningacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import type { IFeeRefundableList } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import AddFeeRefundableForm from './_components/add-form';
import { feeRefundableColumns } from './_components/columns';
import DeleteFeeRefundableForm from './_components/delete-form';
import FeeRefundableReceiptPage from './_components/receipt';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function FeeRefundablePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);

    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);

    const { data: response, isLoading, error } = useFeeRefundableList(Number(selectedAsmayId), searchParams);
    const { data: academicYearData, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    useEffect(() => {
        if (!loadingYears && academicYearData?.data?.length && selectedAsmayId === null) {
            setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
        }
    }, [loadingYears, academicYearData, selectedAsmayId]);

    return (
        <FormProvider<IFeeRefundableList>>
            <FeeRefundableContent
                response={response}
                isLoading={isLoading}
                error={error}
                selectedAsmayId={selectedAsmayId}
                setSelectedAsmayId={setSelectedAsmayId}
                academicYearData={academicYearData}
                loadingYears={loadingYears}
            />
        </FormProvider>
    );
}

function FeeRefundableContent({
    response,
    isLoading,
    error,
    academicYearData,
    loadingYears,
    selectedAsmayId,
    setSelectedAsmayId
}: {
    response: any;
    isLoading: boolean;
    error: any;
    academicYearData: any;
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    loadingYears: boolean;
}) {
    const { openAddForm } = useFormContext<IFeeRefundableList>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-6 rounded-lg border bg-white px-5 py-4 shadow-sm'>
                        <Label className='whitespace-nowrap text-right'>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>

                        <Select
                            value={selectedAsmayId?.toString() || ''}
                            onValueChange={(v) => setSelectedAsmayId(v ? Number(v) : null)}
                            disabled={loadingYears}>
                            <SelectTrigger className='w-64'>
                                <SelectValue placeholder='Select Academic Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYearData?.data?.map((item: any) => (
                                    <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                        {item.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-1'>{/* <h1 className='font-bold text-2xl'>Fee Preadmission Transactions</h1> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Fee Refundable
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IFeeRefundableList>
                        {...tableProps}
                        columns={feeRefundableColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Fee Refundable...'
                        noDataTitle='No Fee Refundable Found'
                        noDataDescription='Get started by adding a new fee refundable.'
                        errorTitle='Failed to Load Fee Refundable'
                    />
                </CollapsibleSection>

                {/* <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    
                   
                    {!selectedAsmayId ? (
                        <div className='p-6 text-center text-gray-500'>
                            Select Academic Year to fetch data.
                        </div>
                    ) : (
                        <GenericDataTable<IFeeRefundableList>
                            {...tableProps}
                            columns={feeRefundableColumns}
                            isLoading={isLoading}
                            error={error}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading Fee Refundable...'
                            noDataTitle='No Fee Refundable Found'
                            noDataDescription='Get started by adding a new fee refundable.'
                            errorTitle='Failed to Load Fee Refundable'
                        />
                    )}
                </CollapsibleSection> */}

                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const {
        isAddFormOpen,
        isDeleteFormOpen,

        isDetailsViewOpen,
        selectedRow,
        closeDetailsView,
        closeAddForm,
        closeDeleteForm,

        addFormRef
    } = useFormContext<IFeeRefundableList>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Fee Refundable'
                        description='Fill in the details below to create a new fee refundable.'
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
                            <AddFeeRefundableForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isDetailsViewOpen && selectedRow && <FeeRefundableReceiptPage rowData={selectedRow} onClose={closeDetailsView} />}

            {isDeleteFormOpen && selectedRow && <DeleteFeeRefundableForm rowData={selectedRow} onClose={closeDeleteForm} />}
        </>
    );
}
