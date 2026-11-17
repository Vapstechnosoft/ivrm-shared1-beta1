'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterFloor } from '@/hooks/hostel/useMasterFloor';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterFloorForm from './_components/add-form';
import { masterFloorColumns, IMasterFloor } from './_components/columns';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { toast } from 'sonner';
import { deactivateFloor } from '@/server/hostel/hostel-management/masters/floor';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterFloorPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: floorList, isLoading, refetch } = useMasterFloor(searchParams);

    return (
        <FormProvider<IMasterFloor>>
            <PageContent
                floorList={floorList}
                isLoading={isLoading}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function PageContent({
    floorList,
    isLoading,
    refetch
}: {
    floorList: any;
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IMasterFloor>();
    const tableProps = useDataTableProps(floorList);

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
                        Add Floor
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterFloor>
                        {...tableProps}
                        columns={masterFloorColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading floors...'
                        noDataTitle='No Floors Found'
                        noDataDescription='Get started by creating your first floor'
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
    } = useFormContext<IMasterFloor>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Floor'
                        description='Create a new floor record'
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
                            <AddMasterFloorForm onSuccess={() => { closeAddForm(); onSuccess(); }} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Floor'
                        description='Modify floor details'
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
                            <AddMasterFloorForm
                                initialData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterFloorForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterFloorForm({ rowData, onClose, onSuccess }: { rowData: IMasterFloor, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deactivateFloor(rowData.hlmF_Id);
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
            title={rowData.hrmF_ActiveFlag ? 'Deactivate Floor' : 'Activate Floor'}
            description={`Are you sure you want to ${rowData.hrmF_ActiveFlag ? 'deactivate' : 'activate'} ${rowData.hrmF_FloorName}?`}
        />
    );
}
