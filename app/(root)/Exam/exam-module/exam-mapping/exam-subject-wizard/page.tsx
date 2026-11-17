'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useExamSubjectWizard } from '@/hooks/exam/exammodule/exam-mapping';
import { UpdateOrderedSubjectDetails, getExamSubjectWizardDetails } from '@/server/exam/exam-module/exam-mapping/exam-subject-wizard';
import type { IExamSubjectOrder, IExamSubjectWizard } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddExamSubjectWizard from './_components/add-from';
// import ExamSubjectWizardDetailsPage from './_components/exam-subject-wizard-details';
import { ExamSubjectWizardColumns } from './_components/columns';
import ExamSubjectWizardDetailsPage from './_components/exam-subject-wizard-details';
import ToggleSubjectWizardForm from './_components/toggle-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function ExamSubjectWizardPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useExamSubjectWizard(searchParams);
    console.log('grid', response);
    return (
        <FormProvider<IExamSubjectWizard>>
            <ExamSubjectWizardPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function ExamSubjectWizardPageContent({
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
    const { openAddForm } = useFormContext<IExamSubjectWizard>();
    const tableProps = useDataTableProps(response);
    const { isOrderDetailsOpen, selectedRow, closeOrderDetails } = useFormContext<IExamSubjectWizard>();
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);
    const [orderData, setOrderData] = useState<(IExamSubjectOrder & { id: number })[]>([]);

    useEffect(() => {
        (async () => {
            if (isOrderDetailsOpen && selectedRow?.eycE_Id) {
                try {
                    const response = await getExamSubjectWizardDetails(selectedRow.eycE_Id);

                    if (response.success && response.data) {
                        const subjects: IExamSubjectOrder[] = Array.isArray(response.data) ? response.data : [];

                        const mappedData = subjects.map((d) => ({ ...d, id: d.ismS_Id }));
                        setOrderData(mappedData);
                    } else {
                        toast.error(response.message || 'Failed to fetch subjects.');
                    }
                    setIsOrderloading(false);
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong while fetching subjects.');
                    setIsOrderloading(false);
                }
            }
        })();
    }, [isOrderDetailsOpen, selectedRow]);

    // Save new order
    const handleSubjectOrderDetailsSave = async (updatedData: (IExamSubjectOrder & { id: number })[]) => {
        try {
            setIsOrderSaving(true);

            // Transform data into required format
            const temp_Subject_Order = updatedData.map((item, index) => ({
                eyceS_Id: item.eyceS_Id,
                eycE_Id: item.eycE_Id,
                ismS_Id: item.ismS_Id,
                eyceS_SubjectOrder: index + 1 // Assign order based on new index
            }));

            const payload = { temp_Subject_Order };
            const response = await UpdateOrderedSubjectDetails(payload);

            if (response?.success) {
                toast.success(response.message || 'Subject order updated successfully');
                refetchAll();
                closeOrderDetails();
            } else {
                toast.error(response?.message || 'Failed to update subject order');
            }
        } catch (error: any) {
            console.error('Error updating order:', error);
            toast.error(error.message || 'Something went wrong');
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
                        Add Exam Subject Wizard
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IExamSubjectWizard>
                        {...tableProps}
                        columns={ExamSubjectWizardColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['subject_order', 'actions'] }}
                        //showSearchColumns={true}
                        loadingMessage='Loading exam subject wizard data...'
                        noDataTitle='No Exam Subject Wizard Records Found'
                        noDataDescription='Get started by creating your first exam subject wizard entry'
                        errorTitle='Error Loading Exam Subject Wizard Data'
                    />
                </CollapsibleSection>
                {/* Set Order Modal */}
                {isOrderDetailsOpen && (
                    <MasterViewDetails
                        isOpen={isOrderDetailsOpen}
                        onClose={closeOrderDetails}
                        data={orderData}
                        isLoading={isOrderloading}
                        isSaving={isOrderSaving}
                        columns={[
                            { key: 'id', label: 'SLNO', className: 'text-center w-12' },
                            { key: 'ismS_SubjectName', label: 'Subject Name', className: 'text-left' },
                            { key: 'ismS_SubjectCode', label: 'Subject Code', className: 'text-left' },
                            { key: 'eyceS_SubjectOrder', label: 'Subject Order', className: 'text-left' }
                        ]}
                        onSave={handleSubjectOrderDetailsSave}
                        tableHeight='500px'
                        title='Set Master Subject Order'
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
        isDetailsViewOpen,
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef,
        closeDetailsView
    } = useFormContext<IExamSubjectWizard>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Exam Subject Wizard'
                        description='Fill in the details below to create a new exam subject mapping'
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
                            <AddExamSubjectWizard onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Exam Subject Wizard'
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
                            <AddExamSubjectWizard rowData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleSubjectWizardForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <ExamSubjectWizardDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
