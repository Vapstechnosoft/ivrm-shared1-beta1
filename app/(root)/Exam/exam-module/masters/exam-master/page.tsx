'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { use, useState } from 'react';

import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterExam } from '@/hooks/exam/exammodule/usemasters';
import { UpdatedOrderdExams, getMasterExamOrderData } from '@/server/exam/exam-module/masters/exam';
import type { IMasterExam, IMasterExamOrder } from '@/types/exam/exam-module/masters';
import { toast } from 'sonner';
import AddMasterExamForm from './_components/add-form';
import { MasterExamColumns } from './_components/columns';
import ToggleExamForm from './_components/toggle-form';
import UpdateMasterExamForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterExamPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterExam(searchParams);

    return (
        <FormProvider<IMasterExam>>
            <MasterExamPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterExamPageContent({
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
    const { openAddForm } = useFormContext<IMasterExam>();
    const tableProps = useDataTableProps(response);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<(IMasterExamOrder & { id: number })[]>([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);

    // Fetch and open order modal
    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const data = await getMasterExamOrderData();
            const examOrders: IMasterExamOrder[] = Array.isArray(data?.data) ? data.data : [];
            const mappedData = examOrders.map((d) => ({ ...d, id: d.emE_Id }));
            setOrderData(mappedData);
            setIsOrderloading(false);
        } catch (error: any) {
            toast.error(error.message);
            setIsOrderloading(false);
        }
    };

    // Save reordered exams
    const handleOrderSave = async (updatedData: (IMasterExamOrder & { id: number })[]) => {
        setOrderData(updatedData);
        setIsOrderSaving(true);
        try {
            const payload = {
                examDTO: updatedData.map((item, index) => ({
                    emE_Id: item.emE_Id,
                    emE_ExamOrder: index + 1
                }))
            };
            const response = await UpdatedOrderdExams(payload);
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
                        Add Master Exam
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterExam>
                        {...tableProps}
                        columns={MasterExamColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master exams...'
                        noDataTitle='No Master Exams Found'
                        noDataDescription='Get started by creating your first master exam'
                        errorTitle='Error Loading Exams'
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
                            { key: 'emE_ExamName', label: 'Exam Name', className: 'text-left' },
                            { key: 'emE_ExamCode', label: 'Exam Code', className: 'text-left' },
                            { key: 'emE_ExamOrder', label: 'Exam Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Exam Order'
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
    } = useFormContext<IMasterExam>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Exam'
                        description='Fill in the details below to create a new master subject'
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
                            <AddMasterExamForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Exam'
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
                            <UpdateMasterExamForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleExamForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
