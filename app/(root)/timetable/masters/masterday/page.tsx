'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterDay } from '@/hooks/timetable/useMasters';
import { getMasterDaySetOrderDetails, saveSetOrderMasterDay } from '@/server/timetable/masters/masterday';
import type { IMasterDayList, IMasterDaySetOrderList } from '@/types/timetable/masters/masters';
import { List, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddMasterDayForm from './_components/add-form';
import { masterDayColumns } from './_components/columns';
import ToggleMasterDaytForm from './_components/toggle-form';
import UpdateMasterDayForm from './_components/update-form';

// import AddMasterModeOfPaymentForm from './_components/add-form';
// import { modeOfPaymentColumns } from './_components/columns';
// import ToggleMasterModeOfPaymentForm from './_components/toggle-form';
// import UpdateMasterModeOfPaymentForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterDayPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterDay(searchParams);

    console.log('response', response);

    return (
        <FormProvider<IMasterDayList>>
            <MasterDayPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterDayPageContent({
    response,
    isLoading,
    error,
    refetchAll
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { openAddForm } = useFormContext<IMasterDayList>();
    const tableProps = useDataTableProps(response);

    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<
        (IMasterDaySetOrderList & { id: number; ttmD_DayName: string; ttmD_DayCode: string; ttmD_Id: number })[]
    >([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);

    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const response = await getMasterDaySetOrderDetails();

            console.log('response in handleSetOrder', response);

            if (response.success && response.data) {
                const masterdaydata: IMasterDaySetOrderList[] = Array.isArray(response.data) ? response.data : [];

                const mappedData = masterdaydata.map((d, index) => ({
                    ...d,
                    id: d.ttmD_Id,
                    ttmD_DayName: d.ttmD_DayName,
                    ttmD_DayCode: d.ttmD_DayCode,
                    ttmD_Id: d.ttmD_Id
                }));
                console.log('mappedData in handleSetOrder', mappedData);
                setOrderData(mappedData);
                setIsOrderloading(false);
            } else {
                toast.error('Failed to fetch Fee Heads.');
                setIsOrderloading(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong while fetching Heads.');
        }
    };

    const handleOrderSave = async (updatedData: (IMasterDaySetOrderList & { id: number })[]) => {
        try {
            setIsOrderSaving(true);
            // const updatedOrderData = updatedData.map((item, index) => ({
            //     //  ismS_Id: item.ismS_Id,
            //     // mI_Id: item.mI_Id,
            //     // ismS_OrderFlag: index + 1

            //     ttmD_DayName: item.ttmD_DayName,
            //     ttmD_DayCode: item.ttmD_DayCode,
            //     ttmD_Id: item.ttmD_Id,
            //     order_Id: index + 1
            // }));

            // const payload = {
            //     courseDTO: updatedOrderData
            // };

            const updatedOrderData = updatedData.map((item, index) => ({
                ttmD_Id: item.ttmD_Id,
                order_Id: index + 1
            }));

            // Create the payload matching your desired structure
            const payload = {
                mI_Id: 30, // You'll need to get this from somewhere
                ordeidss: updatedOrderData
            };

            const jsdata = JSON.stringify(payload);
            console.log('payload in handleOrderSave', jsdata);
            const jsondata = JSON.stringify(payload);
            console.log('payload in handleOrderSave', jsondata);

            const response = await saveSetOrderMasterDay(payload);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                setIsOrderSaving(false);
                setOrderModalOpen(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            //toast.error(error.message);
        } finally {
            setIsOrderSaving(false);
            setOrderModalOpen(false);
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'>{/* <Heading title='Mode Of Payment' description='' /> */}</div>
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={handleSetOrder}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-3'>
                        <div className='flex items-center'>
                            <List className='mr-2 h-4 w-4' />
                            Set Order
                        </div>
                    </Button>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Master Day
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterDayList>
                        {...tableProps}
                        columns={masterDayColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master day data...'
                        noDataTitle='No Master Day Found'
                        noDataDescription='Add a new master day to get started'
                        errorTitle='Error Loading Master Day Data'
                    />
                </CollapsibleSection>

                {orderModalOpen && (
                    <MasterViewDetails
                        isOpen={orderModalOpen}
                        onClose={() => setOrderModalOpen(false)}
                        data={orderData}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'ttmD_DayName', label: 'MasterDay Head', className: 'text-left' },

                            { key: 'ttmD_DayCode', label: 'MasterDay Code', className: 'text-center' },

                            { key: 'order_Id', label: 'Current Order', className: 'text-center w-24' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Master Order'
                    />
                )}

                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
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
    } = useFormContext<IMasterDayList>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Day'
                        description='Fill in the details below to create a new Master Day'
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
                            <AddMasterDayForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Day'
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
                            <UpdateMasterDayForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleMasterDaytForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
