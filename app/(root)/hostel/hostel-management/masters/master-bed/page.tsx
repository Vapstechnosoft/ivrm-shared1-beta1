'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { useMasterBed } from '@/hooks/hostel/useMasterBed';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import AddMasterBedForm from './_components/add-form';
import { masterBedColumns } from './_components/columns';
import UpdateMasterBedForm from './_components/update-form';
import { IBedDisplay, IHostel } from '@/types/hostel/hostel-management/masters';
import { deleteBed } from '@/server/hostel/hostel-management/masters/bed';

export default function MasterBedPage() {
    const { bedList, hostels, loading, refetch } = useMasterBed();

    return (
        <FormProvider<IBedDisplay>>
            <PageContent
                bedList={bedList}
                hostels={hostels}
                isLoading={loading}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function PageContent({
    bedList,
    hostels,
    isLoading,
    refetch
}: {
    bedList: IBedDisplay[];
    hostels: IHostel[];
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IBedDisplay>();
    const tableProps = useDataTableProps({ data: bedList, total: bedList.length });

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
                        Add Bed
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IBedDisplay>
                        {...tableProps}
                        columns={masterBedColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading beds...'
                        noDataTitle='No Beds Found'
                        noDataDescription='Get started by creating your first bed'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections
                    onSuccess={refetch}
                    hostels={hostels}
                />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
    hostels
}: {
    onSuccess: () => void;
    hostels: IHostel[];
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
    } = useFormContext<IBedDisplay>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Bed'
                        description='Create a new bed'
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
                            <AddMasterBedForm
                                onSuccess={() => { closeAddForm(); onSuccess(); }}
                                hostels={hostels}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Bed'
                        description='Modify bed details'
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
                            <UpdateMasterBedForm
                                rowData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                                hostels={hostels}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterBedForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterBedForm({ rowData, onClose, onSuccess }: { rowData: IBedDisplay, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deleteBed(rowData.hlmB_Id);
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
            title={rowData.hlmB_ActiveFlag ? 'Deactivate Bed' : 'Activate Bed'}
            description={`Are you sure you want to ${rowData.hlmB_ActiveFlag ? 'deactivate' : 'activate'} Bed ${rowData.hlmB_BedName}?`}
        />
    );
}
