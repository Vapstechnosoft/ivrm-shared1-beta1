'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterConfiguration } from '@/hooks/admission/preadmission/useConfigurations';
import type { IMasterConfiguration } from '@/types/admission/preadmission/masters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterConfiguration from './_components/add-form';
import { masterConfigurationColumns } from './_components/columns';
import EditMasterConfiguration from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterConfigurationPage({
    searchParams
}: {
    searchParams: SearchParams;
}) {
    const params = use(searchParams);
    const { data: response, isLoading, error, refetch } = useMasterConfiguration(params);

    return (
        <FormProvider<IMasterConfiguration>>
            <MasterConfigurationPageContent response={response} isLoading={isLoading} error={error} refetch={refetch} />
        </FormProvider>
    );
}

function MasterConfigurationPageContent({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch?: () => void;
}) {
    const { openAddForm } = useFormContext<IMasterConfiguration>();

    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Configuration
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterConfiguration>
                        {...tableProps}
                        columns={masterConfigurationColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master configurations...'
                        noDataTitle='No Master Configurations Found'
                        noDataDescription='Get started by creating your first master configuration'
                        errorTitle='Error Loading Configurations'
                    />
                </CollapsibleSection>

                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch?: () => void }) {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IMasterConfiguration>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Configuration'
                        description='Fill in the details below to create a new configuration'
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
                                <X className='mr-1 h-4 w-4 text-destructive' />
                                Close
                            </Button>
                            <AddMasterConfiguration
                                onSuccess={() => {
                                    refetch?.();
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow ? (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Configuration'
                        description='Update the details below'
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
                                <X className='mr-1 h-4 w-4 text-destructive' />
                                Close
                            </Button>
                            <EditMasterConfiguration
                                key={selectedRow.ispaC_Id ?? 'edit-form'}
                                initialData={selectedRow}
                                onSuccess={() => {
                                    refetch?.();
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            ) : isEditFormOpen ? (
                <div className='rounded-md border border-red-200 bg-red-50 p-4'>
                    <p className='font-medium text-red-600'>Error: Invalid or no configuration selected for editing.</p>
                </div>
            ) : null}
        </>
    );
}
