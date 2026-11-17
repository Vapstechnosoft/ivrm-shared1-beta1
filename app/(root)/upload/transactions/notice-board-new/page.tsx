'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useFeeTransactionWaivedOffGrid } from '@/hooks/fees/useTrasactions';
import type { feeTransactionWaivedOffGrid } from '@/types/fees/transactions/transactions';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddUploadNoticeBoardForm from './_components/add-form';
import { uploadNoticeBoardColumns } from './_components/columns';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function UplaodNoticeBoard(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useFeeTransactionWaivedOffGrid(searchParams);

    return (
        <FormProvider<feeTransactionWaivedOffGrid>>
            <UplaodNoticeBoardContentPage response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}
function UplaodNoticeBoardContentPage({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<feeTransactionWaivedOffGrid>();

    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>{/* <Heading title='Third Party Transaction' description='' /> */}</div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Notice Board
                    </Button>
                </div>
                {/* Table */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<feeTransactionWaivedOffGrid>
                        {...tableProps}
                        columns={uploadNoticeBoardColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Upload Notice Board...'
                        noDataTitle='No Upload Notice Board Found'
                        noDataDescription='Get started by creating your first Upload Notice Board'
                        errorTitle='Error While Loading Upload Notice Board'
                    />
                </CollapsibleSection>
                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, closeAddForm, addFormRef } = useFormContext<feeTransactionWaivedOffGrid>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Upload Notice Board'
                        description='Add a new Upload Notice Board record'
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
                            <AddUploadNoticeBoardForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {/* {isToggleFormOpen && selectedRow && <ToggleMasterFeesConfigForm rowData={selectedRow} onClose={closeToggleForm} />} */}
            {/* {isDeleteFormOpen && selectedRow && (
                <DeleteFeeTransactionWaivedOffForm
                    rowData={selectedRow}
                    onClose={closeDeleteForm}
                    onSuccess={() => {
                        closeDeleteForm();
                    }}
                />
            )} */}

            {/* {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Fee Transaction Waived Off'
                        description='Updtae a Fee Transaction Waived Off record'
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
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateFeeTransactionWaiveOffForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )} */}
        </>
    );
}
