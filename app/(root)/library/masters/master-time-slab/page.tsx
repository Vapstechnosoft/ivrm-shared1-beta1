'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterTimeSlab } from '@/hooks/library/useMasters';
import type { IMasterTimeSlab } from '@/types/library/masters/time-slab';
import { X } from 'lucide-react';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import AddMasterTimeSlabForm from './_components/add-form';
import { MasterTimeSlabColumns } from './_components/columns';
import ToggleTimeSlabForm from './_components/toggle-form';
import UpdateMasterTimeSlabForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterTimeSlabPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterTimeSlab(searchParams);

    return (
        <FormProvider<IMasterTimeSlab>>
            <MasterTimeSlabPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterTimeSlabPageContent({
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
    const { isEditFormOpen, selectedRow, closeEditForm } = useFormContext<IMasterTimeSlab>();
    const tableProps = useDataTableProps(response, { dataKey: 'alldata' });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Entry Form Section */}
                <CollapsibleSection
                    title={isEditFormOpen ? 'EDIT TIME SLAB' : 'MASTER TIME SLAB'}
                    description={isEditFormOpen ? 'Update the details of the selected time slab' : 'Fill in the details below to create a new master time slab'}
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='shadow-lg duration-300'>
                    <div className='relative'>
                        {isEditFormOpen && selectedRow ? (
                            <>
                                <Button
                                    type='button'
                                    onClick={closeEditForm}
                                    variant='ghost'
                                    size='sm'
                                    className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                    <X className='h-4 w-4 text-destructive' /> Cancel
                                </Button>
                                <UpdateMasterTimeSlabForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                            </>
                        ) : (
                            <AddMasterTimeSlabForm />
                        )}
                    </div>
                </CollapsibleSection>

                {/* List Section */}
                <CollapsibleSection
                    title='MASTER TIME SLAB LIST'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterTimeSlab>
                        {...tableProps}
                        columns={MasterTimeSlabColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading time slabs...'
                        noDataTitle='No Time Slabs Found'
                        noDataDescription='Get started by creating your first time slab'
                        errorTitle='Error Loading Time Slabs'
                    />
                </CollapsibleSection>

                {/* Status Toggle Dialog */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IMasterTimeSlab>();

    return (
        <>
            {isToggleFormOpen && selectedRow && (
                <ToggleTimeSlabForm rowData={selectedRow} onClose={closeToggleForm} />
            )}
        </>
    );
}
