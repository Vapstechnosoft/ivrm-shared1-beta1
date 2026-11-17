'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { useMasterMess } from '@/hooks/hostel/useMasterMess';
import { deleteMess, IMess } from '@/server/hostel/hostel-management/masters/mess';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import AddMasterMessForm from './_components/add-form';
import { masterMessColumns } from './_components/columns';
import UpdateMasterMessForm from './_components/update-form';
import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterMessPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, refetchAll } = useMasterMess(searchParams);

    return (
        <FormProvider<IMess>>
            <PageContent
                response={response}
                isLoading={isLoading}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

function PageContent({
    response,
    isLoading,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    refetchAll: () => void;
}) {
    const { openAddForm } = useFormContext<IMess>();

    // Transform response data to match GenericDataTable expectations
    // API returns data in response.data.get_messlist, but GenericDataTable expects response.data to be the array
    const processedResponse = {
        ...response,
        data: response?.data?.get_messlist || []
    };

    const tableProps = useDataTableProps(processedResponse);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Mess
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMess>
                        {...tableProps}
                        columns={masterMessColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading messes...'
                        noDataTitle='No Messes Found'
                        noDataDescription='Get started by creating your first mess'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections
                    onSuccess={refetchAll}
                />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
}: {
    onSuccess: () => void;
}) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMess>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Mess'
                        description='Create a new mess'
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
                            <AddMasterMessForm
                                onSuccess={() => { closeAddForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Mess'
                        description='Modify mess details'
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
                            <UpdateMasterMessForm
                                rowData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterMessForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterMessForm({ rowData, onClose, onSuccess }: { rowData: IMess, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deleteMess(rowData.hlmM_Id);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            onClose();
        }
    };

    return (
        <ToggleFormWrapper
            isOpen={true}
            onClose={onClose}
            onConfirm={onConfirm}
            title={rowData.hlmM_ActiveFlag ? 'Deactivate Mess' : 'Activate Mess'}
            description={`Are you sure you want to ${rowData.hlmM_ActiveFlag ? 'deactivate' : 'activate'} Mess ${rowData.hlmM_Name}?`}
        />
    );
}
