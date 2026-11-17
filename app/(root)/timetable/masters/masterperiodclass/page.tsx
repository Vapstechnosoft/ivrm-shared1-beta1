'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { usePeriodAllocation } from '@/hooks/timetable/useMasters';
import type { IMasterPeriodClassList } from '@/types/timetable/masters/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import { masterPeriodClassColumns } from './_components/columns';
import MasterPeriodClassForm from './_components/period-class-form';
import ToggleMasterPeriodClassForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterPeriodClassPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = usePeriodAllocation(searchParams);

    return (
        <FormProvider<IMasterPeriodClassList>>
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
    const tableProps = useDataTableProps(response?.all_list ? { ...response, data: response.all_list } : response);
    const dataList = response?.all_list || [];
    const { openAddForm } = useFormContext<IMasterPeriodClassList>();

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
                        Add Master Period Allocation Class
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterPeriodClassList>
                        {...tableProps}
                        data={dataList}
                        columns={masterPeriodClassColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading period class mappings...'
                        noDataTitle='No Mappings Found'
                        noDataDescription='Create a class period mapping to get started'
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
        useFormContext<IMasterPeriodClassList>();

    return (
        <>
            {/* {isAddFormOpen && (
                <div>
                    <CollapsibleSection
                        title='Add Master Period Allocation Class'
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
                            <MasterPeriodClassForm
                                onSuccess={() => {
                                    closeAddForm();
                                    onSuccess();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )} */}

            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Period Allocation Class'
                        description='Fill in the details below to create a new Period class'
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
                            <MasterPeriodClassForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterPeriodClassForm
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
