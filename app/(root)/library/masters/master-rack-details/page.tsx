'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterRackDetails } from '@/hooks/library/useMasters';
import type { IMasterRackDetails } from '@/types/library/masters/rack-details';
import { X } from 'lucide-react';
import { use } from 'react';
import AddMasterRackForm from './_components/add-form';
import { MasterRackDetailsColumns } from './_components/columns';
import ToggleRackForm from './_components/toggle-form';
import UpdateMasterRackForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterRackDetailsPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterRackDetails(searchParams);

    return (
        <FormProvider<IMasterRackDetails>>
            <MasterRackDetailsPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterRackDetailsPageContent({
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
    const { isEditFormOpen, selectedRow, closeEditForm } = useFormContext<IMasterRackDetails>();

    const tableProps = useDataTableProps(response?.alldata || []);
    const subjectList = response?.subjectlist || [];

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Entry Form Section */}
                <CollapsibleSection
                    title={isEditFormOpen ? 'EDIT RACK DETAILS' : 'RACK DETAILS ENTRY'}
                    description={
                        isEditFormOpen ? 'Update the details of the selected rack' : 'Fill in the details below to create a new rack entry'
                    }
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
                                <UpdateMasterRackForm selectedRow={selectedRow} onSuccess={closeEditForm} subjectList={subjectList} />
                            </>
                        ) : (
                            <AddMasterRackForm subjectList={subjectList} />
                        )}
                    </div>
                </CollapsibleSection>

                {/* List Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    title='MASTER RACK DETAILS'
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterRackDetails>
                        {...tableProps}
                        data={response?.alldata || []}
                        columns={MasterRackDetailsColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading rack details...'
                        noDataTitle='No Rack Details Found'
                        noDataDescription='Get started by creating your first rack entry'
                        errorTitle='Error Loading Rack Details'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IMasterRackDetails>();

    return (
        <>
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleRackForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
