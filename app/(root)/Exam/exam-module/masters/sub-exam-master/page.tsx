'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterSubExam } from '@/hooks/exam/exammodule/usemasters';
import { UpdatedOrderdSubExams, getMasterSubExamOrderData } from '@/server/exam/exam-module/masters/sub-exam';
import type { IMasterSubExam } from '@/types/exam/exam-module/masters';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddSubExamForm from './_components/add-form';
import { MasterSubExamColumns } from './_components/columns';
import ToggleSubExamForm from './_components/toggle-form';
import UpdateSubExamForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * ======================
 * SUB EXAM PAGE
 * ======================
 */
export default function SubExamPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterSubExam(searchParams);

    return (
        <FormProvider<IMasterSubExam>>
            <SubExamPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

/**
 * ======================
 * SUB EXAM PAGE CONTENT
 * ======================
 */
function SubExamPageContent({
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
    const { openAddForm } = useFormContext<IMasterSubExam>();
    const tableProps = useDataTableProps(response);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<(IMasterSubExam & { id: number })[]>([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);
    const handleSetOrder = async () => {
        try {
            // Type the API response
            setOrderModalOpen(true);
            const data: { data: IMasterSubExam[] } = await getMasterSubExamOrderData();

            // Map each item and add 'id' field for table usage
            const mappedData: (IMasterSubExam & { id: number })[] = data.data.map((d: IMasterSubExam) => ({
                ...d,
                id: d.emsE_Id // for row identification
            }));

            setOrderData(mappedData); // use mappedData here
            setIsOrderloading(false);
        } catch (error: any) {
            toast.error(error?.message || 'Error fetching sub-exam list.');
        }
    };

    const handleOrderSave = async (updatedData: (IMasterSubExam & { id: number })[]) => {
        try {
            setIsOrderSaving(true);
            // Map updated data with new order
            const updatedOrderData = updatedData.map((item, index) => ({
                EMSE_Id: item.emsE_Id,
                EMSE_SubExamOrder: (index + 1).toString()
            }));

            const payload = {
                sub_exam: updatedOrderData
            };
            const response = await UpdatedOrderdSubExams(payload);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                setIsOrderSaving(false);
                setOrderModalOpen(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong.');
        } finally {
            setIsOrderSaving(false);
            setOrderModalOpen(false);
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* HEADER SECTION */}
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
                        Add Sub Exam
                    </Button>
                </div>

                {/* DATA TABLE SECTION */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSubExam>
                        {...tableProps}
                        columns={MasterSubExamColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading sub exams...'
                        noDataTitle='No Sub Exams Found'
                        noDataDescription='Get started by creating your first sub exam.'
                        errorTitle='Error Loading Sub Exams'
                    />
                </CollapsibleSection>
                {/* Set Order Modal */}
                {orderModalOpen && (
                    <MasterViewDetails
                        isOpen={orderModalOpen}
                        onClose={() => setOrderModalOpen(false)}
                        data={orderData}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'emsE_SubExamName', label: 'Sub-Exam Name', className: 'text-left' },
                            { key: 'emsE_SubExamCode', label: 'Sub-Exam Code', className: 'text-left' },
                            { key: 'emsE_SubExamOrder', label: 'Sub-Exam Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Sub-Exam Order'
                    />
                )}

                {/* FORM SECTIONS */}
                <FormSections />
            </div>
        </div>
    );
}

/**
 * ======================
 * FORM SECTIONS
 * ======================
 */
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
    } = useFormContext<IMasterSubExam>();

    return (
        <>
            {/* ADD FORM */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Sub Exam'
                        description='Fill in the details below to create a new sub exam.'
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

                            <AddSubExamForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* EDIT FORM */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Sub Exam'
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

                            <UpdateSubExamForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* TOGGLE FORM */}
            {isToggleFormOpen && selectedRow && <ToggleSubExamForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
