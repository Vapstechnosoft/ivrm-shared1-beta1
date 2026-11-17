'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterClassCategory } from '@/hooks/library/useMasters';
import type { IMasterClassCategory } from '@/types/library/masters/class-category';
import { X } from 'lucide-react';
import { use } from 'react';
import AddMasterClassCategoryForm from './_components/add-form';
import { MasterClassCategoryColumns } from './_components/columns';
import ToggleClassCategoryForm from './_components/toggle-form';
import UpdateMasterClassCategoryForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterClassCategoryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterClassCategory(searchParams);

    return (
        <FormProvider<IMasterClassCategory>>
            <MasterClassCategoryPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterClassCategoryPageContent({
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
    const { isEditFormOpen, selectedRow, closeEditForm } = useFormContext<IMasterClassCategory>();
    const tableProps = useDataTableProps(response?.alldata || []);
    const staffList = response?.stafflist || [];

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Entry Form Section */}
                <CollapsibleSection
                    title={isEditFormOpen ? 'EDIT CLASS CATEGORY' : 'MASTER CLASS CATEGORY ENTRY'}
                    description={isEditFormOpen ? 'Update the details of the selected class category' : 'Fill in the details below to create a new class category'}
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
                                <UpdateMasterClassCategoryForm selectedRow={selectedRow} onSuccess={closeEditForm} staffList={staffList} />
                            </>
                        ) : (
                            <AddMasterClassCategoryForm staffList={staffList} />
                        )}
                    </div>
                </CollapsibleSection>

                {/* List Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    title='MASTER CLASS CATEGORY LIST'
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterClassCategory>
                        {...tableProps}
                        data={response?.alldata || []}
                        columns={MasterClassCategoryColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading class categories...'
                        noDataTitle='No Class Categories Found'
                        noDataDescription='Get started by creating your first class category'
                        errorTitle='Error Loading Class Categories'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IMasterClassCategory>();

    return (
        <>
            {isToggleFormOpen && selectedRow && <ToggleClassCategoryForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
