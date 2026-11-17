'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterLifeSkillArea } from '@/hooks/exam/exammodule/usemasters';
import { getMasterLifeSkillAreaOrderList, setMasterLifeSkillAreaOrderList } from '@/server/exam/exam-module/masters/life-skills';
import type { ILifeSkill, ILifeSkillArea } from '@/types/exam/exam-module/masters';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddLifeSkillForm from './_components/add-form';
import { LifeSkillAreaColumns } from './_components/columns';
import ToggleLifeSkillForm from './_components/toggle-form';
import UpdateLifeSkillForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function LifeSkillAreaPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterLifeSkillArea(searchParams);

    return (
        <FormProvider<ILifeSkill>>
            <LifeSkillPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function LifeSkillPageContent({
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
    const { openAddForm } = useFormContext<ILifeSkill>();
    const tableProps = useDataTableProps(response);
    const [orderData, setOrderData] = useState<(ILifeSkillArea & { id: number })[]>([]);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);

    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            setIsOrderloading(true);
            const response = await getMasterLifeSkillAreaOrderList();
            console.log(response);
            const skillOrders: ILifeSkillArea[] = Array.isArray(response.data) ? response.data : [];

            if (skillOrders.length === 0) {
                setIsOrderloading(false);
                return;
            }

            const mappedData = skillOrders.map((d) => ({ ...d, id: d.ecsA_Id }));
            setOrderData(mappedData);
            setIsOrderloading(false);
        } catch (error: any) {
            toast.error(error.message);
            setIsOrderloading(false);
        }
    };

    // Save reordered skills
    const handleOrderSave = async (updatedData: (ILifeSkillArea & { id: number })[]) => {
        setOrderData(updatedData);
        setIsOrderSaving(true);
        try {
            const payload = updatedData.map((item, index) => ({
                ECSA_Id: item.ecsA_Id,
                ECSA_SkillOrder: index + 1
            }));
            const response = await setMasterLifeSkillAreaOrderList(payload);

            // Should check for response.status or success based on your API wrapper
            // Assuming response is the data returned directly or standard wrapper
            // Adjusting based on common pattern in this project:
            if (response?.returnval === true || response?.success === true) {
                toast.success('Order updated successfully');
                refetchAll();
                setOrderModalOpen(false);
            } else {
                toast.error('Failed to update order');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsOrderSaving(false);
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
                        Add Life Skill Area
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ILifeSkillArea>
                        {...tableProps}
                        columns={LifeSkillAreaColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Life Skills...'
                        noDataTitle='No Life Skills Found'
                        noDataDescription='Get started by creating your first Life Skill'
                        errorTitle='Error Loading Life Skills'
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
                            { key: 'ecsA_SkillArea', label: 'Skill Area Name', className: 'text-left' },
                            { key: 'ecsA_SkillOrder', label: 'Skill Area Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Life Skill Order'
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
    } = useFormContext<ILifeSkillArea>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Life Skill Area'
                        description='Fill in the details below to create a new Life Skill Area'
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
                            <AddLifeSkillForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Life Skill Area'
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
                            <UpdateLifeSkillForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleLifeSkillForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
