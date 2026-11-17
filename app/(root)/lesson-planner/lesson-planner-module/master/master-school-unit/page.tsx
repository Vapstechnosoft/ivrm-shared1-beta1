'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getSchoolMasterUnitData } from '@/server/lesson-planner/master/school-master-unit';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import { ArrowUpDown, Plus, X } from 'lucide-react';
import { use, useCallback, useEffect, useState } from 'react';
import AddMasterSchoolUnitForm from './_components/add-form';
import { MasterSchoolUnitColumns } from './_components/columns';
import OrderMasterSchoolUnitForm from './_components/order-form';
import ToggleMasterSchoolUnitForm from './_components/toggle-form';
import UpdateMasterSchoolUnitForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSchoolUnitPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [mI_Id, setMI_Id] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);

    const refetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getSchoolMasterUnitData(searchParams as any);
            console.info('School Master Unit Response:', res);
            if (res.success) {
                setData(res);
                setMI_Id((res as any).mI_Id || 0);
                setUserId((res as any).userId || 0);
            } else {
                setData(null);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching school master unit data:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        refetchAll();
    }, [refetchAll]);

    return (
        <FormProvider<IMasterSchoolUnit>>
            <PageContent response={data} isLoading={isLoading} error={error} refetchAll={refetchAll} mI_Id={mI_Id} userId={userId} />
        </FormProvider>
    );
}

function PageContent({
    response,
    isLoading,
    error,
    refetchAll,
    mI_Id,
    userId
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: () => void;
    mI_Id: number;
    userId: number;
}) {
    const { openAddForm } = useFormContext<IMasterSchoolUnit>();
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

    // Explicit mapping to ensure server-side pagination works correctly
    const tableProps = {
        data: Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.getdetails) ? response.data.getdetails : [],
        totalItems: response?.total || response?.data?.total || 0,
        success: response?.success,
        errorMessage: response?.message
    };

    const units = Array.isArray(response?.data) ? response.data : response?.data?.getdetails || [];

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Unit
                    </Button>
                    <Button
                        type='button'
                        onClick={() => setIsOrderFormOpen(true)}
                        variant='outline'
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <ArrowUpDown className='h-4 w-4' />
                        Set Order
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSchoolUnit>
                        {...tableProps}
                        columns={MasterSchoolUnitColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading units...'
                        noDataTitle='No Units Found'
                        noDataDescription='Create a new unit to get started'
                        errorTitle='Error Loading Units'
                    />
                </CollapsibleSection>

                <OrderMasterSchoolUnitForm
                    isOpen={isOrderFormOpen}
                    onClose={() => setIsOrderFormOpen(false)}
                    units={units}
                    onSuccess={refetchAll}
                />

                <FormSections onSuccess={refetchAll} mI_Id={mI_Id} userId={userId} />
            </div>
        </div>
    );
}

function FormSections({
    onSuccess,
    mI_Id,
    userId
}: {
    onSuccess: () => void;
    mI_Id: number;
    userId: number;
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
    } = useFormContext<IMasterSchoolUnit>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Unit'
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
                            <AddMasterSchoolUnitForm
                                onSuccess={() => {
                                    onSuccess();
                                    closeAddForm();
                                }}
                                mI_Id={mI_Id}
                                userId={userId}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Update Unit'
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
                            <UpdateMasterSchoolUnitForm
                                selectedRow={selectedRow}
                                onSuccess={() => {
                                    onSuccess();
                                    closeEditForm();
                                }}
                                mI_Id={mI_Id}
                                userId={userId}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterSchoolUnitForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={onSuccess} />
            )}
        </>
    );
}
