'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeAmountEntryforStThomas } from '@/hooks/fees/useTrasactions';
import type { IFeeAmountEntryList } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import AddAmountEntryFormStThomas from './_components/add-form';
import { feeAmountEntryColumns } from './_components/columns';
import ToggleMasterAmountEntryFormStThomas from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function FeeAmountEntryPageForStThomas(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const { data: response, isLoading, error } = useFeeAmountEntryforStThomas(selectedAsmayId ?? 0, searchParams);

    useEffect(() => {
        if (!loadingYears && academicYearData?.data && academicYearData.data.length > 0) {
            const firstId = academicYearData.data[0].asmaY_Id;
            setSelectedAsmayId((prev) => prev ?? firstId);
        }
    }, [loadingYears, academicYearData]);

    return (
        <FormProvider<IFeeAmountEntryList>>
            <MasterFeeAmountEntryPageContent
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

function MasterFeeAmountEntryPageContent({
    response,
    isLoading,
    error,
    selectedAsmayId,
    setSelectedAsmayId,
    loadingYears,
    academicYearData
}: {
    response: any;
    isLoading: boolean;
    error: any;
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    loadingYears: boolean;
    academicYearData: any;
}) {
    const { openAddForm } = useFormContext<IFeeAmountEntryList>();
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
                            onValueChange={(v) => setSelectedAsmayId(Number(v))}
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
                    <div className='space-y-1'>{/* <Heading title='Fee Amount Entries' description='' /> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Amount Entry
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IFeeAmountEntryList>
                        {...tableProps}
                        columns={feeAmountEntryColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Fee Amount Entries...'
                        noDataTitle='No Fee Amount Entries Found'
                        noDataDescription='Get started by adding a new Fee Amount Entry.'
                        errorTitle='Error Loading Fee Amount Entries'
                    />
                </CollapsibleSection>

                <FormSections selectedAsmayId={selectedAsmayId} />
            </div>
        </div>
    );
}

function FormSections({ selectedAsmayId }: { selectedAsmayId: number | null }) {
    const { isAddFormOpen, selectedRow, isDeleteFormOpen, closeAddForm, closeToggleForm, addFormRef } =
        useFormContext<IFeeAmountEntryList>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Fee Amount Entry'
                        description='Fill in the details below to create a new Amount Entry.'
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
                            <AddAmountEntryFormStThomas onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {isDeleteFormOpen && selectedRow && (
                <ToggleMasterAmountEntryFormStThomas rowData={selectedRow} onClose={closeToggleForm} asmay_Id={Number(selectedAsmayId)} />
            )}
        </>
    );
}
