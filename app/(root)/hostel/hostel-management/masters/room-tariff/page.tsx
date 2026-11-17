'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useRoomTariff } from '@/hooks/hostel/useRoomTariff';
import { Plus, X } from 'lucide-react';
import { use, useEffect } from 'react';
import AddRoomTariffForm from './_components/add-form';
import { roomTariffColumns } from './_components/columns';
import ToggleRoomTariff from './_components/toggle-form';
import { IRoomTariff } from '@/types/hostel/hostel-management/masters';
import UpdateRoomTariffForm from './_components/update-form';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// -------------------------
// MAIN PAGE
// -------------------------
export default function RoomTariffPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, refetchAll } = useRoomTariff(searchParams);


    return (
        <FormProvider<IRoomTariff>>
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
    const { openAddForm } = useFormContext<IRoomTariff>();
    const { data: yearData } = useAcademicYearDropdown();
    const { data: roomData } = { data: [] }
    useEffect(() => {
        console.log(response);
    }, [response]);
    const tableProps = useDataTableProps(response);

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
                        Add Room Tariff
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IRoomTariff>
                        {...tableProps}
                        columns={roomTariffColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading room tariffs...'
                        noDataTitle='No Room Tariffs Found'
                        noDataDescription='Get started by creating your first room tariff'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections
                    onSuccess={refetchAll}
                    yearList={yearData?.data ?? []}
                    roomList={roomData ?? []}
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
    yearList,
    roomList
}: {
    onSuccess: () => void;
    yearList: any[];
    roomList: any[];
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
    } = useFormContext<IRoomTariff>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Room Tariff'
                        description='Fill in the details below to create a new room tariff'
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
                            <AddRoomTariffForm
                                onSuccess={() => { closeAddForm(); onSuccess(); }}
                                onCancel={closeAddForm}
                                yearList={yearList}
                                roomList={roomList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Room Tariff'
                        description='Modify room tariff details'
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
                            <UpdateRoomTariffForm
                                initialData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                                onCancel={closeEditForm}
                                yearList={yearList}
                                roomList={roomList}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleRoomTariff
                    data={selectedRow}
                    onCancel={closeToggleForm}
                    onSuccess={() => { closeToggleForm(); onSuccess(); }}
                />
            )}
        </>
    );
}
