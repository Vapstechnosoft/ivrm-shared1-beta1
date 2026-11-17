'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterLanguage } from '@/hooks/library/useMasters';
import type { IMasterLanguageList } from '@/types/library/masters/masters';
import { Plus, X } from 'lucide-react';
import { use, useEffect } from 'react';
import AddMasterLanguageForm from './_components/add-form';
import { MasterLanguageColumns } from './_components/columns';
import ToggleMasterLanguageForm from './_components/toggle-form';
import UpdateMasterLanguageForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterClassPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetch } = useMasterLanguage(searchParams);

    return (
        <FormProvider<IMasterLanguageList>>
            <MasterClassPageContent response={response} isLoading={isLoading} error={error} refetch={refetch} />
        </FormProvider>
    );
}

function MasterClassPageContent({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IMasterLanguageList>();
    const tableProps = useDataTableProps(response);

    //  const handleSuccess = () => {
    //     refetch();
    // };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title='Fee Head' description='' /> */}</div>

                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Language
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterLanguageList>
                        {...tableProps}
                        columns={MasterLanguageColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Master Language...'
                        noDataTitle='No Records Found'
                        noDataDescription='Start by adding a new Master Language'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch: () => void }) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        //isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeToggleForm,

        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterLanguageList>();

    useEffect(() => {
        if (isEditFormOpen && !selectedRow) {
            console.error('FormSections: Edit form open but selectedRow is undefined');
        }
    }, [isEditFormOpen, selectedRow]);

    // Success handler that refetches data
    const handleSuccess = () => {
        refetch();
    };

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Language'
                        description='Fill in the details below to create a new mapping'
                        defaultOpen
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
                            {
                                <AddMasterLanguageForm
                                    onSuccess={() => {
                                        handleSuccess();
                                        closeAddForm();
                                    }}
                                />
                            }
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Delete Form
            {isDeleteFormOpen && selectedRow && (
                <DeleteMasterLanguageForm
                    rowData={selectedRow}
                    onClose={closeDeleteForm}
                     onSuccess={() => {
                         handleSuccess();
                         closeDeleteForm();
                     }}
                />
            )} */}
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterLanguageForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/* Edit Form */}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Library'
                        description='Update the Master Library details below'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateMasterLanguageForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </>
    );
}
