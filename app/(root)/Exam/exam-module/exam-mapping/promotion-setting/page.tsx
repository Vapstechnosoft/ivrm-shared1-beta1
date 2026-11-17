'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';

import { usePromotionalSetting } from '@/hooks/exam/exammodule/exam-mapping';
import {
    UpdateOrderedPromotionalSettingDetails,
    getPromotionalSettingDetails
} from '@/server/exam/exam-module/exam-mapping/promotional-setting';

import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { IPromotionSetting, IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import AddPromotionalSetting from './_components/add-form';
import { PromotionSettingColumns } from './_components/columns';
import PromotionalSettingDetailsPage from './_components/promotional-setting-details-view';
import TogglePromotionalSettingForm from './_components/toggle-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function PromotionalSettingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = usePromotionalSetting(searchParams);
    useEffect(() => { console.log(response); }, [response]);

    return (
        <FormProvider<IPromotionSetting>>
            <PromotionalSettingPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function PromotionalSettingPageContent({
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
    const { openAddForm } = useFormContext<IPromotionSetting>();
    const tableProps = useDataTableProps(response);

    const { isOrderDetailsOpen, selectedRow, closeOrderDetails } = useFormContext<IPromotionSetting>();

    const [orderData, setOrderData] = useState<(IPromotionalSubjectDetails & { id: number })[]>([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderLoading, setIsOrderLoading] = useState(true);

    // Fetch order details list when Set Order modal opens
    useEffect(() => {
        (async () => {
            if (isOrderDetailsOpen && selectedRow?.asmaY_Id) {
                try {
                    const response = await getPromotionalSettingDetails(selectedRow.emP_Id);

                    if (response.success && response.data) {
                        const items: IPromotionalSubjectDetails[] = Array.isArray(response.data) ? response.data : [];

                        const mapped = items.map((x) => ({
                            ...x,
                            id: x.emP_Id // the row id for ordering
                        }));

                        setOrderData(mapped);
                    } else {
                        toast.error(response.message || 'Failed to fetch order details');
                    }

                    setIsOrderLoading(false);
                } catch (err: any) {
                    toast.error(err.message || 'Something went wrong');
                    setIsOrderLoading(false);
                }
            }
        })();
    }, [isOrderDetailsOpen, selectedRow]);

    // Save new order
    const handleSaveOrder = async (updated: (IPromotionalSubjectDetails & { id: number })[]) => {
        try {
            setIsOrderSaving(true);

            const temp_Order = updated.map((item, index) => ({
                promO_Id: item.id,
                proM_Id: item.id,
                promO_Order: index + 1
            }));

            const res = await UpdateOrderedPromotionalSettingDetails({ temp_Order });

            if (res?.success) {
                toast.success(res.message || 'Order updated successfully');
                refetchAll();
                closeOrderDetails();
            } else {
                toast.error(res?.message || 'Failed to update order');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setIsOrderSaving(false);
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Promotional Setting
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IPromotionSetting>
                        {...tableProps}
                        columns={PromotionSettingColumns}
                        isLoading={isLoading}
                        error={error}
                        loadingMessage='Loading promotional setting data...'
                        noDataTitle='No Records Found'
                        noDataDescription='Create your first promotional setting'
                        errorTitle='Error Loading Promotional Setting Data'
                        columnPinning={{ right: ['subject_order', 'actions'] }}
                    />
                </CollapsibleSection>

                {/* Set Order Modal */}
                {isOrderDetailsOpen && (
                    <MasterViewDetails
                        isOpen={isOrderDetailsOpen}
                        onClose={closeOrderDetails}
                        isLoading={isOrderLoading}
                        isSaving={isOrderSaving}
                        data={orderData}
                        onSave={handleSaveOrder}
                        tableHeight='500px'
                        title='Set Promotional Order'
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'ismS_SubjectName', label: 'Promotion Subject Name', className: 'text-left' },
                            { key: 'ismS_SubjectCode', label: 'Code', className: 'text-left' },
                            { key: 'empS_SubjOrder', label: 'Order', className: 'text-left' }
                        ]}
                    />
                )}

                <FormSections />
            </div>
        </div>
    );
}

/* -------------------------
        FORM SECTIONS
------------------------- */

function FormSections() {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        isDetailsViewOpen,
        selectedRow,

        addFormRef,
        editFormRef,

        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeDetailsView
    } = useFormContext<IPromotionSetting>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Promotional Setting'
                        description='Fill in the details below'
                        defaultOpen
                        variant='outline'
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
                            <AddPromotionalSetting />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Promotional Setting'
                        defaultOpen
                        variant='outline'
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
                            <AddPromotionalSetting rowData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <TogglePromotionalSettingForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <PromotionalSettingDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
