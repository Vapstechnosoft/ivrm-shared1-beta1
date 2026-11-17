'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterFeehead } from '@/hooks/fees/useMasters';
import { getfeeheadSetorderdata, updateSetOrder } from '@/server/fees/masters/feehead';

import type { IFeeHeadsList, IFeeHeadsListSetOrder } from '@/types/fees/masters/masters';
import { List, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddMasterFeeHeadForm from './_components/add-form';
import { feeheadColumns } from './_components/columns';
import ToggleMasterClassForm from './_components/toggle-form';
import UpdateMasterFeeheadForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterFeeheadPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterFeehead(searchParams);

    return (
        <FormProvider<IFeeHeadsList>>
            <MasterFeeheadPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterFeeheadPageContent({
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
    const { openAddForm } = useFormContext<IFeeHeadsList>();
    const tableProps = useDataTableProps(response);

    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<
        (IFeeHeadsListSetOrder & { id: number; fmH_PDAFlag_: string; fmH_RefundFlag_: string; fmH_SpecialFeeFlag_: string })[]
    >([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);

    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const response = await getfeeheadSetorderdata();

            console.log('response in handleSetOrder', response);

            if (response.success && response.data) {
                const feeheaddata: IFeeHeadsListSetOrder[] = Array.isArray(response.data) ? response.data : [];

                const mappedData = feeheaddata.map((d, index) => ({
                    ...d,
                    id: d.fmH_Id,
                    fmH_PDAFlag_: d.fmH_PDAFlag ? '✅' : '❌',
                    // fmH_RefundFlag_: d.fmH_RefundFlag ? '✅' : '❌',
                    fmH_RefundFlag_: d.fmH_RefundFlag ? '✅' : '❌',
                    fmH_SpecialFeeFlag_: d.fmH_SpecialFeeFlag ? '✅' : '❌',
                    fmH_Flag: d.fmH_Flag
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

    const handleOrderSave = async (updatedData: (IFeeHeadsListSetOrder & { id: number })[]) => {
        try {
            setIsOrderSaving(true);
            const updatedOrderData = updatedData.map((item, index) => ({
                //  ismS_Id: item.ismS_Id,
                // mI_Id: item.mI_Id,
                // ismS_OrderFlag: index + 1

                fmH_FeeName: item.fmH_FeeName,
                fmH_Flag: item.fmH_Flag,
                fmH_RefundFlag: item.fmH_RefundFlag,
                fmH_PDAFlag: item.fmH_PDAFlag,
                fmH_SpecialFeeFlag: item.fmH_SpecialFeeFlag,
                fmH_Id: item.id,
                fmH_Order: index + 1
            }));

            const payload = {
                courseDTO: updatedOrderData
            };

            const jsondata = JSON.stringify(payload);
            console.log('payload in handleOrderSave', jsondata);

            const response = await updateSetOrder(payload);

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
                {/* Header */}
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <div className='space-y-1'>{/* <Heading title='Fee Head' description='' /> */}</div>

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
                        Add fee Head
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IFeeHeadsList>
                        {...tableProps}
                        columns={feeheadColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Master Fees Head'
                        noDataTitle='No Master Fees Head Found'
                        noDataDescription='Get started by creating your first master class'
                        errorTitle='Error Loading Master Fees Head'
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
                            { key: 'fmH_FeeName', label: 'Fee Head', className: 'text-left' },

                            { key: 'fmH_PDAFlag_', label: 'PDA Expense', className: 'text-center' },
                            { key: 'fmH_RefundFlag_', label: 'Refundable', className: 'text-center' },
                            { key: 'fmH_SpecialFeeFlag_', label: 'Special Fee Head', className: 'text-center' },
                            { key: 'fmH_Flag', label: 'Fee Head Type', className: 'text-center w-24' },
                            { key: 'fmH_Order', label: 'Current Order', className: 'text-center w-24' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Fee Head Order'
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
    } = useFormContext<IFeeHeadsList>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Fee Head'
                        description='Fill in the details below to create a new Fee Head'
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
                            <AddMasterFeeHeadForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Fee Head'
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
                            <UpdateMasterFeeheadForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && <ToggleMasterClassForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
