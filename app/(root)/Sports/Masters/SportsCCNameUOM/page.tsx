'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterSportsCCNameUOM } from '@/hooks/sports/useMasterSportsCCNameUOM';
import type { IMasterSportsCCNameUOM } from '@/types/sports/masters/sports-cc-name-uom';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterSportsCCNameUOMForm from './_components/add-form';
import { MasterSportsCCNameUOMColumns } from './_components/columns';
import ToggleMasterSportsCCNameUOMForm from './_components/toggle-form';
import UpdateMasterSportsCCNameUOMForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSportsCCNameUOMPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterSportsCCNameUOM(searchParams);

    // Access nested data safely
    const apiData = response as any;
    const sportsCCNameUOMList = apiData?.data?.sportsccUom || [];
    const sportsCCNameList = apiData?.data?.sportsccName || [];
    const uomList = apiData?.data?.uom || [];

    return (
        <FormProvider<IMasterSportsCCNameUOM>>
            <MasterSportsCCNameUOMPageContent
                sportsCCNameUOMList={sportsCCNameUOMList}
                sportsCCNameList={sportsCCNameList}
                uomList={uomList}
                isLoading={isLoading}
                error={error}
                refetchAll={refetchAll}
            />
        </FormProvider>
    );
}

function MasterSportsCCNameUOMPageContent({
    sportsCCNameUOMList,
    sportsCCNameList,
    uomList,
    isLoading,
    error,
    refetchAll
}: {
    sportsCCNameUOMList: IMasterSportsCCNameUOM[];
    sportsCCNameList: any[];
    uomList: any[];
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        selectedRow,
        openAddForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterSportsCCNameUOM>();

    // const tableProps = useDataTableProps(sportsCCNameUOMList); // Incorrect usage as sportsCCNameUOMList is an array

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Sports CC Name UOM
                    </Button>
                </div>

                <CollapsibleSection
                    title="Sports CC Name UOM List"
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSportsCCNameUOM>
                        data={sportsCCNameUOMList}
                        columns={MasterSportsCCNameUOMColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading records...'
                        noDataTitle='No Records Found'
                        noDataDescription='Get started by creating your first record'
                        errorTitle='Error Loading Data'
                    />
                </CollapsibleSection>

                <>
                    {/* Add Form */}
                    {isAddFormOpen && (
                        <div ref={addFormRef}>
                            <CollapsibleSection
                                title='Add New Sports CC Name UOM'
                                description='Select sports name and UOM below to create a new record'
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
                                    <AddMasterSportsCCNameUOMForm
                                        onSuccess={closeAddForm}
                                        sportsCCNameList={sportsCCNameList}
                                        uomList={uomList}
                                    />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Edit Form */}
                    {isEditFormOpen && selectedRow && (
                        <div ref={editFormRef}>
                            <CollapsibleSection
                                title='Edit Sports CC Name UOM'
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
                                    <UpdateMasterSportsCCNameUOMForm
                                        selectedRow={selectedRow}
                                        onSuccess={closeEditForm}
                                        sportsCCNameList={sportsCCNameList}
                                        uomList={uomList}
                                    />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}
                </>

                {/* Toggle Form */}
                {isToggleFormOpen && selectedRow && (
                    <ToggleMasterSportsCCNameUOMForm
                        rowData={selectedRow}
                        onClose={closeToggleForm}
                        onSuccess={refetchAll}
                    />
                )}
            </div>
        </div>
    );
}
