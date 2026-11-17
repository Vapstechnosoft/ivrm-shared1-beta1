'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterRoomCategory } from '@/hooks/hostel/useMasterRoomCategory';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterRoomCategoryForm from './_components/add-form';
import { masterRoomCategoryColumns, IMasterRoomCategory } from './_components/columns';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { toast } from 'sonner';
import { deactivateRoomCategory } from '@/server/hostel/hostel-management/masters/room-category';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterRoomCategoryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: apiResponse, isLoading, refetch } = useMasterRoomCategory(searchParams);

    // Prepare data from API response which contains griddata and feegroupe
    const roomCategoryList = apiResponse?.data?.griddata || [];
    const feeGroups = apiResponse?.data?.feegroupe || [];

    return (
        <FormProvider<IMasterRoomCategory>>
            <PageContent
                roomCategoryList={roomCategoryList}
                feeGroups={feeGroups}
                isLoading={isLoading}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function PageContent({
    roomCategoryList,
    feeGroups,
    isLoading,
    refetch
}: {
    roomCategoryList: any;
    feeGroups: any[];
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IMasterRoomCategory>();
    const tableProps = useDataTableProps(roomCategoryList);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Room Category
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterRoomCategory>
                        {...tableProps}
                        columns={masterRoomCategoryColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading room categories...'
                        noDataTitle='No Room Categories Found'
                    />
                </CollapsibleSection>

                <FormSections feeGroups={feeGroups} onSuccess={refetch} />
            </div>
        </div>
    );
}

function FormSections({ feeGroups, onSuccess }: { feeGroups: any[], onSuccess: () => void }) {
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
    } = useFormContext<IMasterRoomCategory>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Room Category'
                        description='Create a new room category'
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
                            <AddMasterRoomCategoryForm feeGroups={feeGroups} onSuccess={() => { closeAddForm(); onSuccess(); }} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Room Category'
                        description='Modify category details'
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
                            <AddMasterRoomCategoryForm
                                initialData={selectedRow}
                                feeGroups={feeGroups}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterRoomCategoryForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterRoomCategoryForm({ rowData, onClose, onSuccess }: { rowData: IMasterRoomCategory, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deactivateRoomCategory(rowData.hlmrcA_Id);
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
            title={rowData.hlmrcA_ActiveFlag ? 'Deactivate Category' : 'Activate Category'}
            description={`Are you sure you want to ${rowData.hlmrcA_ActiveFlag ? 'deactivate' : 'activate'} ${rowData.hlmrcA_RoomCategory}?`}
        />
    );
}
