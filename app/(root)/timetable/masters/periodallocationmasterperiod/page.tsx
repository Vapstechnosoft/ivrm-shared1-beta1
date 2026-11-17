'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { usePeriodAllocation } from '@/hooks/timetable/useMasters';
import type { IPeriodAllocationMasterDay } from '@/types/timetable/masters/masters';
import { use } from 'react';
import { masterPeriodColumns } from './_components/columns';

import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import MasterPeriodForm from './_components/period-form';
import ToggleMasterPeriodForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterPeriodPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = usePeriodAllocation(searchParams);

    return (
        <FormProvider<IPeriodAllocationMasterDay>>
            <MasterPeriodPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterPeriodPageContent({
    response,

    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    // The API returns periodlist in the response object
    const tableProps = useDataTableProps(response);
    const { openAddForm } = useFormContext<IPeriodAllocationMasterDay>();

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'>{/* <Heading title='Mode Of Payment' description='' /> */}</div>

                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Period
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IPeriodAllocationMasterDay>
                        {...tableProps}
                        columns={masterPeriodColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading periods...'
                        noDataTitle='No Periods Found'
                        noDataDescription='Create a period allocation to get started'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                {/* <CollapsibleSection
                    title='Master Period Allocation'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                >
                    <MasterPeriodForm onSuccess={refetchAll} />
                </CollapsibleSection> */}

                <FormSections onSuccess={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
    const { isToggleFormOpen, selectedRow, isAddFormOpen, closeToggleForm, closeAddForm, addFormRef } =
        useFormContext<IPeriodAllocationMasterDay>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Period'
                        description='Fill in the details below to create a new Master Period'
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
                            <MasterPeriodForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterPeriodForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                        onSuccess();
                    }}
                />
            )}
        </>
    );
}
