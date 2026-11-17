'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterDayClasswiseDetails } from '@/hooks/timetable/useMasters';
import type { IMasterDayClassWise } from '@/types/timetable/masters/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import MasterDayClassWiseAddForm from './_components/add-form';
import { masterDayClasswiseColumns } from './_components/columns';
import ToggleMasterDayClasswiseForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterDayClassWisePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterDayClasswiseDetails(searchParams);
    console.log('response', response);
    return (
        <FormProvider<IMasterDayClassWise>>
            <MasterPeriodClassPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterPeriodClassPageContent({
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
    // The API returns all_list for class mapping in the response object
    const tableProps = useDataTableProps(response);

    const { openAddForm } = useFormContext<IMasterDayClassWise>();

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
                        Add Master Day Class
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterDayClassWise>
                        {...tableProps}
                        columns={masterDayClasswiseColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Master Day Class data...'
                        noDataTitle='No Master Day Class Data Found'
                        noDataDescription='Create a new Master Day Class'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                <FormSections onSuccess={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
    const { isToggleFormOpen, selectedRow, closeToggleForm, isAddFormOpen, closeAddForm, addFormRef } =
        useFormContext<IMasterDayClassWise>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Day Class'
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
                            <MasterDayClassWiseAddForm
                                onSuccess={() => {
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterDayClasswiseForm
                    rowData={selectedRow}
                    onClose={() => {
                        closeToggleForm();
                    }}
                />
            )}
        </>
    );
}
