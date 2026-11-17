'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeTransactionList } from '@/hooks/fees/useTrasactions';
import type { IFeeAcademicYearDropdownList } from '@/types/fees/reports/reports';
import type { Ifeetransaction } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import StudentFeeTransaction from './_components/add-form';
import { feeTransactionColumns } from './_components/columns';
import DeleteFeeTransactionForm from './_components/delete-form';
import ReceiptViewPage from './_components/receiptview';
import UpdateStudentFeeTransaction from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function FeeTransactionPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    const { data: response, isLoading, error } = useFeeTransactionList(selectedAsmayId ?? 0, searchParams);

    useEffect(() => {
        if (!loadingYears && academicYearData?.data && academicYearData.data.length > 0) {
            const firstId = academicYearData.data[0].asmaY_Id;
            if (selectedAsmayId && academicYearData?.data) {
                const selectedItem = academicYearData.data.find((item) => item.asmaY_Id === selectedAsmayId);
                if (selectedItem) {
                    setSelectedAcademicYear(selectedItem.asmaY_Year);
                }
            }
            setSelectedAsmayId((prev) => prev ?? firstId);
        }
    }, [loadingYears, academicYearData]);

    return (
        <FormProvider<Ifeetransaction>>
            <FeeTransactionContent
                selectedAsmayId={selectedAsmayId}
                setSelectedAsmayId={setSelectedAsmayId}
                setSelectedAcademicYear={setSelectedAcademicYear}
                academicYearData={academicYearData}
                loadingYears={loadingYears}
                isLoading={isLoading}
                response={response}
                error={error}
                selectedasmayYear={selectedAcademicYear}
            />
        </FormProvider>
    );
}

function FeeTransactionContent({
    response,
    isLoading,
    error,
    selectedAsmayId,
    selectedasmayYear,
    setSelectedAsmayId,
    setSelectedAcademicYear,
    loadingYears,
    academicYearData
}: {
    selectedasmayYear: string;
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    setSelectedAcademicYear: (year: string) => void;
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
                    <div className='flex items-center gap-6 rounded-lg border bg-white px-5 py-4 shadow-sm'>
                        <Label className='whitespace-nowrap text-right'>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            value={selectedAsmayId?.toString() || ''}
                            onValueChange={(v) => {
                                setSelectedAsmayId(Number(v));
                                const selectedItem = academicYearData?.data?.find(
                                    (item: IFeeAcademicYearDropdownList) => item.asmaY_Id === Number(v)
                                );
                                setSelectedAcademicYear(selectedItem.asmaY_Year);
                            }}
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
                        Add Fee Student Transaction
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<Ifeetransaction>
                        {...tableProps}
                        columns={feeTransactionColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Fee Transactions...'
                        noDataTitle='No Fee Transactions Found'
                        noDataDescription='Get started by adding a new Fee Transaction.'
                        errorTitle='Failed to Load Fee Transactions'
                    />
                </CollapsibleSection>

                <FormSections asmayId={Number(selectedAsmayId ?? 0)} asmayYear={selectedasmayYear} />
            </div>
        </div>
    );
}

function FormSections({ asmayId, asmayYear }: { asmayId: number; asmayYear: string }) {
    const {
        isAddFormOpen,
        closeAddForm,
        isDetailsViewOpen,
        closeDetailsView,
        addFormRef,
        selectedRow,
        isDeleteFormOpen,
        closeDeleteForm,
        isEditFormOpen,
        closeEditForm,
        editFormRef
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
                            <StudentFeeTransaction onSuccess={closeAddForm} asmayId={asmayId} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isDetailsViewOpen && selectedRow && (
                <ReceiptViewPage rowData={selectedRow} onClose={closeDetailsView} asmayId={asmayId} asmayYear={asmayYear} />
            )}
            {isDeleteFormOpen && selectedRow && (
                <DeleteFeeTransactionForm
                    rowData={selectedRow}
                    asmayId={asmayId}
                    onClose={closeDeleteForm}
                    onSuccess={() => {
                        closeDeleteForm();
                    }}
                />
            )}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Fee Transaction Waived Off'
                        description='Updtae a Fee Transaction Waived Off record'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateStudentFeeTransaction
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    closeEditForm();
                                }}
                                asmayId={asmayId}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
