'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GitCompareArrows, Plus, X } from 'lucide-react';
import { use, useState } from 'react';

import { MasterViewDetails } from '@/components/ui/set-order/generic-set-order';
import { useMasterSubSubject } from '@/hooks/exam/exammodule/usemasters';
import { UpdatedOrderdSubSubjects, getMasterSubSubjectOrderData } from '@/server/exam/exam-module/masters/sus-subject';
import type { IMasterSubSubject } from '@/types/exam/exam-module/masters';
import { toast } from 'sonner';
import AddMasterSubSubjectForm from './_components/add-form';
import { subSubjectColumns } from './_components/columns';
import ToggleMasterSubSubjectForm from './_components/toggle-form';
import UpdateMasterSubSubjectForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSubSubjectPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useMasterSubSubject(searchParams);

    return (
        <FormProvider<IMasterSubSubject>>
            <MasterSubSubjectPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function MasterSubSubjectPageContent({
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
    const { openAddForm } = useFormContext<IMasterSubSubject>();
    const tableProps = useDataTableProps(response);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState<(IMasterSubSubject & { id: number })[]>([]);
    const [isOrderSaving, setIsOrderSaving] = useState(false);
    const [isOrderloading, setIsOrderloading] = useState(true);
    const handleSetOrder = async () => {
        try {
            setOrderModalOpen(true);
            const response = await getMasterSubSubjectOrderData();

            if (response.success && response.data) {
                const data = Array.isArray(response.data) ? response.data : [];
                const mapped = data.map((d: IMasterSubSubject) => ({ ...d, id: d.emsS_Id }));
                setOrderData(mapped);
                setIsOrderSaving(false);
                setIsOrderloading(false);
            } else {
                toast.error(response.message || 'Failed to fetch sub-subjects.');
                setIsOrderSaving(false);
                setIsOrderloading(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong while fetching sub-subjects.');
        }
    };
    const handleOrderSave = async (updatedData: (IMasterSubSubject & { id: number })[]) => {
        try {
            setIsOrderSaving(true);
            // Build the DTO array
            const subsubjectDTO = updatedData.map((item, index) => ({
                emsS_Id: item.emsS_Id,
                emsS_Order: index + 1 // Correct property name
            }));

            // Wrap it in the correct payload structure
            const payload = { subsubjectDTO };
            // Send the payload to the API
            const response = await UpdatedOrderdSubSubjects(payload);

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
                <div className='flex items-center justify-end gap-4'>
                    <Button type='button' onClick={handleSetOrder} className='w-fit transition-all duration-200 hover:scale-90'>
                        <GitCompareArrows className='h-4 w-4 transition-transform duration-200 group-hover:rotate-90' />
                        Set Order
                    </Button>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='mr-2 h-4 w-4' />
                        Add SubSubject
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSubSubject>
                        {...tableProps}
                        columns={subSubjectColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading subsubjects...'
                        noDataTitle='No SubSubjects Found'
                        noDataDescription='Get started by creating your first subsubject'
                        errorTitle='Error Loading SubSubjects'
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
                            { key: 'id', label: 'SL.No', className: 'text-center w-12' },
                            { key: 'emsS_SubSubjectName', label: 'Sub Subject Name', className: 'text-left' },
                            { key: 'emsS_SubSubjectCode', label: 'Sub Subject Code', className: 'text-left' },
                            { key: 'emsS_Order', label: 'Order', className: 'text-left' }
                        ]}
                        onSave={handleOrderSave}
                        tableHeight='500px'
                        title='Set Sub-Subject Order'
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
    } = useFormContext<IMasterSubSubject>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New SubSubject'
                        description='Fill in the details below to create a new subsubject'
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
                            <AddMasterSubSubjectForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit SubSubject'
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
                            <UpdateMasterSubSubjectForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterSubSubjectForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
