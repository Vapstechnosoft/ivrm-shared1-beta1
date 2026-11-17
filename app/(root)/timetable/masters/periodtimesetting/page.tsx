'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';

import { Button } from '@/components/ui/button';
import { usePeriodTimeSettingDetails } from '@/hooks/timetable/useMasters';
import type { IPeriodTimeSettingData } from '@/types/timetable/masters/masters';
import { use } from 'react';
import { periodTimeSettingColumns } from './_components/columns';
import PeriodTimeSettingForm from './_components/period-time-setting-form';
import TogglePeriodTimeSettingForm from './_components/toggle-form';

import { Plus, X } from 'lucide-react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function PeriodTimeSettingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);

    // Using simple query hook pattern here for now as there isn't a dedicated hook in useMasters yet

    const { data: response, isLoading, error, refetchAll } = usePeriodTimeSettingDetails(searchParams);

    return (
        <FormProvider<IPeriodTimeSettingData>>
            <PeriodTimeSettingPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function PeriodTimeSettingPageContent({
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
    // The API returns 'gridview' in the response object based on legacy controller
    // $scope.gridOptions.data = promise.gridview;
    const tableProps = useDataTableProps(response);
    const { openAddForm } = useFormContext<IPeriodTimeSettingData>();

    return (
        <div className='min-h-screen'>
            {/* <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'></div>
                   
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Peiod Time Setting
                    </Button>
                </div> */}
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Break Time Settings
                    </Button>
                </div>
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IPeriodTimeSettingData>
                        {...tableProps}
                        columns={periodTimeSettingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading settings...'
                        noDataTitle='No Settings Found'
                        noDataDescription='Create a period time setting to get started'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                {/* <CollapsibleSection
                    title='Period Time Settings'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg'
                >
                    <PeriodTimeSettingForm onSuccess={refetchAll} />
                </CollapsibleSection> */}

                <FormSections onSuccess={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
    const { isToggleFormOpen, isAddFormOpen, selectedRow, closeAddForm, addFormRef, closeToggleForm } =
        useFormContext<IPeriodTimeSettingData>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Period Time Setting'
                        description='Fill in the details below to create a new Period Time Setting'
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
                            <PeriodTimeSettingForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {isToggleFormOpen && selectedRow && (
                <TogglePeriodTimeSettingForm
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
