'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterSubject } from '@/hooks/exam/exammodule/usemasters';
import { UpdatedOrderdSubjects, getMasterSubjectOrderData } from '@/server/exam/exam-module/masters/subject';
import type { IMasterSubject, IMasterSubjectOrder } from '@/types/exam/exam-module/masters';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import AddMasterSubjectForm from './_components/add-form';
import { examSubjectColumns } from './_components/columns';
import ToggleMasterSubjectForm from './_components/toggle-form';
import UpdateMasterSubjectForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSubjectPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterSubject(searchParams);

    return (
        <FormProvider<IMasterSubject>>
            <MasterSubjectPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterSubjectPageContent({
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
    const { openAddForm } = useFormContext<IMasterSubject>();
    const tableProps = useDataTableProps(response);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<(IMasterSubjectOrder & { id: number })[]>([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);


    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const response = await getMasterSubjectOrderData();

            if (response.success && response.data) {
                const subjects: IMasterSubjectOrder[] = Array.isArray(response.data) ? response.data : [];

                const mappedData = subjects.map((d) => ({ ...d, id: d.ismS_Id }));
                setOrderData(mappedData);
                setIsOrderloading(false);
            } else {
                toast.error(response.message || 'Failed to fetch subjects.');
                setIsOrderloading(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong while fetching subjects.');
        }
    };

    // Save new order
    const handleOrderSave = async (updatedData: (IMasterSubjectOrder & { id: number })[]) => {
        try {
            setIsOrderSaving(true);
            const updatedOrderData = updatedData.map((item, index) => ({
                ismS_Id: item.ismS_Id,
                mI_Id: item.mI_Id,
                ismS_OrderFlag: index + 1
            }));

            const payload = {
                subject_list_Order: updatedOrderData // ✅ correct variable name
            };

            const response = await UpdatedOrderdSubjects(payload);

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
                        Add Master Subject
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSubject>
                        {...tableProps}
                        total={response?.total}
                        columns={examSubjectColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master subjects...'
                        noDataTitle='No Master Subjects Found'
                        noDataDescription='Get started by creating your first master subject'
                        errorTitle='Error Loading Subjects'
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
                            { key: 'ismS_SubjectName', label: 'Subject Name', className: 'text-left' },
                            { key: 'ismS_SubjectCode', label: 'Subject Code', className: 'text-left' },
                            { key: 'ismS_OrderFlag', label: 'Subject Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Master Subject Order'
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
    } = useFormContext<IMasterSubject>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Subject'
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
                            <AddMasterSubjectForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Subject'
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
                            <UpdateMasterSubjectForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterSubjectForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
