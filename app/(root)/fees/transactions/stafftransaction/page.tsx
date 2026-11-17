'use client';
import { Button } from '@/components/ui/button';
import { useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeTransactionList } from '@/hooks/fees/useTrasactions';
import type { Ifeetransaction } from '@/types/fees/transactions/transactions';
import { X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import FeeStaffOtherTransaction from './_components/add-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function FeeTransactionPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);

    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    const { data: response, isLoading, error } = useFeeTransactionList(selectedAsmayId ?? 0, searchParams);

    useEffect(() => {
        if (!loadingYears && academicYearData?.data && academicYearData.data.length > 0) {
            const firstId = academicYearData.data[0].asmaY_Id;
            setSelectedAsmayId((prev) => prev ?? firstId);
        }
    }, [loadingYears, academicYearData]);

    return (
        <FormProvider<Ifeetransaction>>
            <FeeTransactionContent
                selectedAsmayId={selectedAsmayId}
                setSelectedAsmayId={setSelectedAsmayId}
                academicYearData={academicYearData}
                loadingYears={loadingYears}
                isLoading={isLoading}
                response={response}
                error={error}
            />
        </FormProvider>
    );
}

function FeeTransactionContent({
    response,
    isLoading,
    error,
    selectedAsmayId,
    setSelectedAsmayId,
    loadingYears,
    academicYearData
}: {
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    response: any;
    isLoading: boolean;
    error: any;
    loadingYears: boolean;
    academicYearData: any;
}) {
    const { openAddForm } = useFormContext<Ifeetransaction>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title='Fee Amount Entries' description='' /> */}</div>

                    {/* <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Fee Staff Other Transaction
                    </Button> */}
                </div>
                <CollapsibleSection
                    title='Fee Staff Other Transaction'
                    description='Fill in the details below to create a new Fee Staff Other Transaction.'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <div className='relative'>
                        <FeeStaffOtherTransaction asmayId={0} />
                    </div>
                </CollapsibleSection>

                {/* <CollapsibleSection
                     defaultOpen={true}
                     variant='default'
                     size='lg'
                     className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                     <GenericDataTable<Ifeetransaction>
                         {...tableProps}
                         columns={feeStaffTransactionColumns}
                         isLoading={isLoading}
                         error={error}
                         columnPinning={{ right: ['actions'] }}
                         loadingMessage='Loading Fee Transactions...'
                         noDataTitle='No Fee Transactions Found'
                         noDataDescription='Get started by adding a new Fee Transaction.'
                         errorTitle='Failed to Load Fee Transactions'
                     />
                 </CollapsibleSection> */}

                {/* <FormSections asmayId={Number(selectedAsmayId ?? 0)} /> */}
            </div>
        </div>
    );
}

function FormSections({ asmayId }: { asmayId: number }) {
    const {
        isAddFormOpen,
        closeAddForm,
        //  isDetailsViewOpen,
        //  closeDetailsView,
        addFormRef
        //  selectedRow,
        //  isDeleteFormOpen,
        //  closeDeleteForm,
        //  isEditFormOpen,
        //  closeEditForm,
        //  editFormRef
    } = useFormContext<Ifeetransaction>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Fee Student Transaction'
                        description='Fill in the details below to create a new fee student transaction.'
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
                            <FeeStaffOtherTransaction onSuccess={closeAddForm} asmayId={asmayId} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
