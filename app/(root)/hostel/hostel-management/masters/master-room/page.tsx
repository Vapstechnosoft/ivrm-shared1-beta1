'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterRoom } from '@/hooks/hostel/useMasterRoom';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterRoomForm from './_components/add-form';
import { masterRoomColumns } from './_components/columns';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { toast } from 'sonner';
import { deactivateRoom } from '@/server/hostel/hostel-management/masters/room';
import { IRoomDisplay } from '@/types/hostel/hostel-management/masters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterRoomPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: roomList, isLoading, refetchAll } = useMasterRoom(searchParams);

    return (
        <FormProvider<IRoomDisplay>>
            <PageContent
                roomList={roomList}
                isLoading={isLoading}
                refetch={refetchAll}
            />
        </FormProvider>
    );
}

function PageContent({
    roomList,
    isLoading,
    refetch
}: {
    roomList: any;
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IRoomDisplay>();
    const tableProps = useDataTableProps(roomList);

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
                        Add Room
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IRoomDisplay>
                        {...tableProps}
                        columns={masterRoomColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading rooms...'
                        noDataTitle='No Rooms Found'
                        noDataDescription='Get started by creating your first room'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections onSuccess={refetch} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
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
    } = useFormContext<IRoomDisplay>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Room'
                        description='Create a new room record'
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
                            <AddMasterRoomForm onSuccess={() => { closeAddForm(); onSuccess(); }} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Room'
                        description='Modify room details'
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
                            <AddMasterRoomForm
                                initialData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterRoomForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterRoomForm({ rowData, onClose, onSuccess }: { rowData: IRoomDisplay, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deactivateRoom(rowData.hrmrM_Id);
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
            title={rowData.hrmrM_ActiveFlag ? 'Deactivate Room' : 'Activate Room'}
            description={`Are you sure you want to ${rowData.hrmrM_ActiveFlag ? 'deactivate' : 'activate'} Room ${rowData.hrmrM_RoomNo}?`}
        />
    );
}
