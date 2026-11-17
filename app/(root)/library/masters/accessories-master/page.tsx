'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterAccessories } from '@/hooks/library/useMasters';
import type { IMasterAccessories } from '@/types/library/masters/accessories';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterAccessoriesForm from './_components/add-form';
import { MasterAccessoriesColumns } from './_components/columns';
import ToggleAccessoriesForm from './_components/toggle-form';
import UpdateMasterAccessoriesForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterAccessoriesPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterAccessories(searchParams);

    return (
        <FormProvider<IMasterAccessories>>
            <MasterAccessoriesPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterAccessoriesPageContent({
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
    const { isEditFormOpen, selectedRow, closeEditForm } = useFormContext<IMasterAccessories>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Entry Form Section */}
                <CollapsibleSection
                    title={isEditFormOpen ? 'EDIT ACCESSORIES' : 'ACCESSORIES ENTRY'}
                    description={isEditFormOpen ? 'Update the details of the selected accessory' : 'Fill in the details below to create a new master accessory'}
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
                                <UpdateMasterAccessoriesForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                            </>
                        ) : (
                            <AddMasterAccessoriesForm />
                        )}
                    </div>
                </CollapsibleSection>

                {/* List Section */}
                <CollapsibleSection
                    title='ACCESSORIES LIST'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterAccessories>
                        {...tableProps}
                        columns={MasterAccessoriesColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading accessories...'
                        noDataTitle='No Accessories Found'
                        noDataDescription='Get started by creating your first accessory'
                        errorTitle='Error Loading Accessories'
                    />
                </CollapsibleSection>

                {/* Toggle Form (Modals match this architecture's pattern for deactivation) */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const {
        isToggleFormOpen,
        selectedRow,
        closeToggleForm,
    } = useFormContext<IMasterAccessories>();

    return (
        <>
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleAccessoriesForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
