'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useFeePreadmissionTransactionList,
    useFeeProspectusTransactionList,
    useacademicyerdropdowndatafee
} from '@/hooks/fees/useTrasactions';
import type { IFeePreAdmissionTransactionDetails } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import AddFeePreAdmissionTransactionForm from './_components/add-form';
import { feePreAdmissionTransactionEntryColumns } from './_components/columns';
import ReceiptViewPage from './_components/receiptview';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function FeePreadmissionTransactionPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const urlAsmayId = Number(searchParams?.asmay_Id || searchParams?.id || 0);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<'admission' | 'prospectus'>('admission');

    const { data: academicYearData, isLoading: loadingYears } = useacademicyerdropdowndatafee();

    // Auto-select academic year with correct priority
    useEffect(() => {
        if (loadingYears || !academicYearData?.data?.length) return;

        // const years = academicYearData.data;

        // // Priority 1: URL parameter (asmay_Id or id)
        // if (urlAsmayId && years.some((y: any) => y.asmaY_Id === urlAsmayId)) {
        //     setSelectedAsmayId(urlAsmayId);
        //     return;
        // }

        // // Priority 2: Current active academic year (from API flag: asmaY_IsCurrent)
        // const currentYear = years.find((y: any) => y.asmaY_IsCurrent === true);
        // if (currentYear) {
        //     setSelectedAsmayId(currentYear.asmaY_Id);
        //     return;
        // }

        // // Priority 3: Fallback to the most recent year by ID (higher ID = newer)
        // const latestYear = years.slice().sort((a: any, b: any) => b.asmaY_Id - a.asmaY_Id)[0];

        // if (latestYear) {
        //     setSelectedAsmayId(latestYear.asmaY_Id);
        // }

        setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
    }, [academicYearData, loadingYears, urlAsmayId]);

    const resolvedSearchParams = Object.fromEntries(Object.entries(searchParams || {}).filter(([_, v]) => v != null));

    // const preAdmissionQuery = useFeePreadmissionTransactionList(selectedAsmayId || 0, resolvedSearchParams);
    // const prospectusQuery = useFeeProspectusTransactionList(selectedAsmayId || 0, resolvedSearchParams);
    // const activeQuery = transactionType === 'admission' ? preAdmissionQuery : prospectusQuery;

    const preAdmissionQuery = useFeePreadmissionTransactionList(selectedAsmayId, resolvedSearchParams);

    const prospectusQuery = useFeeProspectusTransactionList(selectedAsmayId, resolvedSearchParams);

    useEffect(() => {
        if (!selectedAsmayId) return;

        if (transactionType === 'admission') {
            preAdmissionQuery.refetch();
        } else {
            prospectusQuery.refetch();
        }
    }, [transactionType, selectedAsmayId]);

    const activeQuery = transactionType === 'admission' ? preAdmissionQuery : prospectusQuery;

    //const { data: response, isLoading, error, refetch } = activeQuery;

    console.log('activeQuery', transactionType);
    const { data: response, isLoading, error, refetch } = activeQuery;

    return (
        <FormProvider<IFeePreAdmissionTransactionDetails>>
            <PreadmissionTransactionContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                selectedAsmayId={selectedAsmayId}
                setSelectedAsmayId={setSelectedAsmayId}
                academicYearData={academicYearData}
                loadingYears={loadingYears}
                transactionType={transactionType}
                setTransactionType={setTransactionType}
            />
        </FormProvider>
    );
}

// Rest of your components remain EXACTLY the same
function PreadmissionTransactionContent({
    response,
    isLoading,
    error,
    refetch,
    selectedAsmayId,
    setSelectedAsmayId,
    academicYearData,
    loadingYears,
    transactionType,
    setTransactionType
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
    selectedAsmayId: number;
    setSelectedAsmayId: (id: number) => void;
    academicYearData: any;
    loadingYears: boolean;
    transactionType: 'admission' | 'prospectus';
    setTransactionType: (type: 'admission' | 'prospectus') => void;
}) {
    const { openAddForm } = useFormContext<IFeePreAdmissionTransactionDetails>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-4'>
                <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center'>
                        <div className='flex items-center gap-4 rounded-lg border bg-white px-5 py-4 shadow-sm'>
                            <Label className='whitespace-nowrap font-semibold'>
                                Academic Year <span className='text-red-600'>*</span>
                            </Label>
                            <Select
                                value={selectedAsmayId.toString()}
                                onValueChange={(v) => setSelectedAsmayId(Number(v))}
                                disabled={loadingYears}>
                                <SelectTrigger className='w-64'>
                                    <SelectValue placeholder='Select Academic Year' />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingYears ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : academicYearData?.data?.length ? (
                                        academicYearData.data.map((item: any) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value='no-data' disabled>
                                            No years found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex items-center gap-4 rounded-lg border bg-white px-5 py-4 shadow-sm'>
                            <Label className='whitespace-nowrap font-semibold'>Transaction Type</Label>
                            <RadioGroup
                                value={transactionType}
                                onValueChange={(value) => setTransactionType(value as 'admission' | 'prospectus')}
                                className='flex'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='admission' id='admission' />
                                    <Label htmlFor='admission' className='cursor-pointer font-medium'>
                                        Pre-Admission
                                    </Label>
                                </div>
                                <div className='ml-6 flex items-center space-x-2'>
                                    <RadioGroupItem value='prospectus' id='prospectus' />
                                    <Label htmlFor='prospectus' className='cursor-pointer font-medium'>
                                        Prospectus
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Button onClick={openAddForm} className='w-fit shadow-md transition-all hover:scale-105'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add {transactionType === 'admission' ? 'Pre-Admission' : 'Prospectus'} Transaction
                    </Button>
                </div>

                {!selectedAsmayId ? (
                    <div className='rounded-lg border bg-white p-12 text-center shadow-lg'>
                        <p className='font-semibold text-2xl text-muted-foreground'>Please select an Academic Year</p>
                        <p className='mt-2 text-lg text-muted-foreground'>
                            to view {transactionType === 'admission' ? 'pre-admission' : 'prospectus'} transactions
                        </p>
                    </div>
                ) : (
                    <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='shadow-lg'>
                        <GenericDataTable<IFeePreAdmissionTransactionDetails>
                            {...tableProps}
                            columns={feePreAdmissionTransactionEntryColumns}
                            isLoading={isLoading}
                            error={error}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage={`Loading ${transactionType === 'admission' ? 'Pre-Admission' : 'Prospectus'} Transactions...`}
                            noDataTitle={`No ${transactionType === 'admission' ? 'Pre-Admission' : 'Prospectus'} Transactions Found`}
                            noDataDescription='Get started by adding a new transaction.'
                        />
                    </CollapsibleSection>
                )}

                <FormSections transactionType={transactionType} selectedAsmayId={selectedAsmayId} />
            </div>
        </div>
    );
}

function FormSections({ transactionType, selectedAsmayId }: { transactionType: 'admission' | 'prospectus'; selectedAsmayId: number }) {
    const { isAddFormOpen, isDetailsViewOpen, selectedRow, closeDetailsView, closeAddForm, addFormRef } =
        useFormContext<IFeePreAdmissionTransactionDetails>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title={`Add New ${transactionType === 'admission' ? 'Pre-Admission' : 'Prospectus'} Transaction`}
                        description='Fill in the details below to create a new transaction.'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddFeePreAdmissionTransactionForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {isDetailsViewOpen && selectedRow && (
                <ReceiptViewPage rowData={selectedRow} onClose={closeDetailsView} asmayId={selectedAsmayId} />
            )}
        </>
    );
}
