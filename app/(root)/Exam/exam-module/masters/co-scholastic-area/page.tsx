'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';

import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useCoScholasticArea } from '@/hooks/exam/exammodule/usemasters';
import { UpdatedOrderdCoScholasticArea, getCoScholasticAreaOrderData } from '@/server/exam/exam-module/masters/co-scholastic-area';
import type { ICoScholasticArea } from '@/types/exam/exam-module/masters';
import { GitCompareArrows, List, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddCoScholasticAreaForm from './_components/add-form';
import { CoScholasticAreaColumns } from './_components/columns';
import ToggleCoScholasticAreaForm from './_components/toggle-form';
import UpdateCoScholasticAreaForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function CoScholasticAreaPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useCoScholasticArea(searchParams);

    return (
        <FormProvider<ICoScholasticArea>>
            <CoScholasticAreaPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function CoScholasticAreaPageContent({
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
    const { openAddForm } = useFormContext<ICoScholasticArea>();
    const tableProps = useDataTableProps(response);
    const [orderData, setOrderData] = useState<(ICoScholasticArea & { id: number })[]>([]);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);

    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const data = await getCoScholasticAreaOrderData();
            const examOrders: ICoScholasticArea[] = Array.isArray(data?.data) ? data.data : [];
            const mappedData = examOrders.map((d) => ({ ...d, id: d.ecactA_Id }));
            setOrderData(mappedData);
            setIsOrderloading(false);
        } catch (error: any) {
            toast.error(error.message);
            setIsOrderloading(false);
        }
    };

    // Save reordered exams
    const handleOrderSave = async (updatedData: (ICoScholasticArea & { id: number })[]) => {
        setOrderData(updatedData);
        setIsOrderSaving(true);
        try {
            const payload = updatedData.map((item, index) => ({
                ecactA_Id: item.ecactA_Id,
                ecactA_SkillOrder: index + 1
            }));
            const response = await UpdatedOrderdCoScholasticArea(payload);
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                setIsOrderSaving(false);
                setOrderModalOpen(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
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
                    <Button type='button' onClick={handleSetOrder} className='w-fit transition-all duration-200 hover:scale-90'>
                        <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                        Set Order
                    </Button>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Area
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ICoScholasticArea>
                        {...tableProps}
                        columns={CoScholasticAreaColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading co-scholastic Area...'
                        noDataTitle='No Co-Scholastic Area Found'
                        noDataDescription='Get started by creating your first co-scholastic area'
                        errorTitle='Error Loading Co-Scholastic Area'
                    />
                </CollapsibleSection>
                {/* Order Modal */}
                {orderModalOpen && (
                    <MasterViewDetails
                        isOpen={orderModalOpen}
                        onClose={() => setOrderModalOpen(false)}
                        data={orderData}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'ecactA_SkillArea', label: 'Activity Area', className: 'text-left' },
                            { key: 'ecactA_SkillOrder', label: 'Activity Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Co-Scholastic Area Order'
                    />
                )}
                {/* Forms */}
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
    } = useFormContext<ICoScholasticArea>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Co-Scholastic Area'
                        description='Fill in the details below to create a new co-scholastic area'
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
                            {<AddCoScholasticAreaForm onSuccess={closeAddForm} />}
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Co-Scholastic Area'
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
                            <UpdateCoScholasticAreaForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleCoScholasticAreaForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
