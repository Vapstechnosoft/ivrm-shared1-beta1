'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useRoomCategory } from '@/hooks/hostel/useRoomCategory';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddRoomCategoryForm from './_components/add-form';
import { roomCategoryColumns } from './_components/columns';
import UpdateRoomCategoryForm from './_components/update-form';
import { ToggleRoomCategory } from './_components/toggle-form';
import { IRoomCategory } from '@/types/hostel/hostel-management/masters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// -------------------------
// MAIN PAGE
// -------------------------
export default function RoomCategoryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, refetchAll } = useRoomCategory(searchParams);

    return (
        <FormProvider<IRoomCategory>>
            <PageContent
                response={response}
                isLoading={isLoading}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

// -------------------------
// PAGE CONTENT
// -------------------------
function PageContent({
    response,
    isLoading,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    refetchAll: () => void;
}) {
    const { openAddForm, openEditForm, openToggleForm } = useFormContext<IRoomCategory>();

    const gridData = response?.data?.griddata || [];
    const hostelList = response?.data?.hostellist || [];
    const feeGroupList = response?.data?.feegroupe || [];

    const updatedResponse = { ...response, data: gridData }
    console.log(updatedResponse)
    const tableProps = useDataTableProps(updatedResponse)

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
                        Add Room Category
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IRoomCategory>
                        {...tableProps}
                        columns={roomCategoryColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading room categories...'
                        noDataTitle='No Room Categories Found'
                        noDataDescription='Get started by creating your first room category'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections
                    onSuccess={refetchAll}
                    hostelList={hostelList}
                    feeGroupList={feeGroupList}
                />
            </div>
        </div>
    );
}

// -------------------------
// FORM SECTIONS
// -------------------------
function FormSections({
    onSuccess,
    hostelList,
    feeGroupList
}: {
    onSuccess: () => void;
    hostelList: any[];
    feeGroupList: any[];
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
    } = useFormContext<IRoomCategory>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Room Category'
                        description='Fill in the details below to create a new room category'
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
                            <AddRoomCategoryForm
                                onSuccess={() => { closeAddForm(); onSuccess(); }}
                                onCancel={closeAddForm}
                                hostelList={hostelList}
                                feeGroupList={feeGroupList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Room Category'
                        description='Modify room category details'
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
                            <UpdateRoomCategoryForm
                                initialData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                                onCancel={closeEditForm}
                                hostelList={hostelList}
                                feeGroupList={feeGroupList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleRoomCategory
                    data={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={() => { closeToggleForm(); onSuccess(); }}
                />
            )}
        </>
    );
}
