'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteLeaveCredit, useLeaveCredit, useSaveLeaveCredit } from '@/hooks/hrms/leave-management/useTransactions';
import { Plus, X } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { type LeaveCredit, getLeaveCreditColumns } from './_components/columns';
import { LeaveTransferForm, type LeaveTransferFormData } from './_components/leave-transfer-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function LeaveTransferPage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useLeaveCredit();
    return (
        <FormProvider<LeaveCredit>>
            <LeaveTransferPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function LeaveTransferPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<LeaveCredit>();
    const { openEditForm, openDeleteForm } = useFormContext<LeaveCredit>();
    const tableProps = useDataTableProps(response);
    const columns = getLeaveCreditColumns({
        onEdit: openEditForm,
        onDelete: (id: number) => {
            const row = response?.data?.find((r: LeaveCredit) => r.id === id);
            if (row) {
                openDeleteForm(row);
            }
        }
    });
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Leave Transfer
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<LeaveCredit>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave transfers...'
                        noDataTitle='No Leave Transfers Found'
                        noDataDescription='Get started by creating your first leave transfer'
                        errorTitle='Error Loading Leave Transfers'
                    />
                </CollapsibleSection>
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
        isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeDeleteForm,
        addFormRef,
        editFormRef
    } = useFormContext<LeaveCredit>();
    const { refetchAll } = useLeaveCredit();
    const { mutate: saveCredit } = useSaveLeaveCredit();
    const { mutate: deleteCredit } = useDeleteLeaveCredit();
    const [activeTab, setActiveTab] = useState('Leave Updation');
    const handleFormSubmit = (formData: LeaveTransferFormData) => {
        const submitData: LeaveCredit = {
            id: selectedRow?.id || 0,
            createdAt: selectedRow?.createdAt || new Date(),
            leaveYear: formData.leaveYear,
            leaveName: formData.leaveName,
            employeeName: selectedRow?.employeeName || '',
            leaveCredit: selectedRow?.leaveCredit || 0,
            leaveBalance: selectedRow?.leaveBalance || 0,
            type: formData.type,
            department: formData.department,
            designation: formData.designation
        };
        saveCredit(submitData, {
            onSuccess: () => {
                toast.success(selectedRow ? 'Leave transfer updated successfully' : 'Leave transfer saved successfully');
                refetchAll();
                closeEditForm();
                closeAddForm();
            }
        });
    };
    const handleDelete = () => {
        if (selectedRow) {
            deleteCredit(selectedRow.id, {
                onSuccess: () => {
                    toast.success('Leave transfer deleted successfully');
                    refetchAll();
                    closeDeleteForm();
                }
            });
        }
    };
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Leave Transfer'
                        description='Fill in the details to process leave transfer'
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
                            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                                <TabsList className='grid w-full grid-cols-3'>
                                    <TabsTrigger value='Leave Updation'>Leave Updation</TabsTrigger>
                                    <TabsTrigger value='Leave Addition'>Leave Addition</TabsTrigger>
                                    <TabsTrigger value='Leave CarryForward'>Leave CarryForward</TabsTrigger>
                                </TabsList>
                                <TabsContent value='Leave Updation' className='mt-4'>
                                    <LeaveTransferForm activeTab='Leave Updation' onSubmit={handleFormSubmit} onCancel={closeAddForm} />
                                </TabsContent>
                                <TabsContent value='Leave Addition' className='mt-4'>
                                    <LeaveTransferForm activeTab='Leave Addition' onSubmit={handleFormSubmit} onCancel={closeAddForm} />
                                </TabsContent>
                                <TabsContent value='Leave CarryForward' className='mt-4'>
                                    <LeaveTransferForm activeTab='Leave CarryForward' onSubmit={handleFormSubmit} onCancel={closeAddForm} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Leave Transfer'
                        description='Update leave transfer information'
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
                            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                                <TabsList className='grid w-full grid-cols-3'>
                                    <TabsTrigger value='Leave Updation'>Leave Updation</TabsTrigger>
                                    <TabsTrigger value='Leave Addition'>Leave Addition</TabsTrigger>
                                    <TabsTrigger value='Leave CarryForward'>Leave CarryForward</TabsTrigger>
                                </TabsList>
                                <TabsContent value='Leave Updation' className='mt-4'>
                                    <LeaveTransferForm
                                        activeTab='Leave Updation'
                                        onSubmit={handleFormSubmit}
                                        onCancel={closeEditForm}
                                        defaultValues={{
                                            type: selectedRow.type,
                                            department: selectedRow.department,
                                            designation: selectedRow.designation,
                                            leaveYear: selectedRow.leaveYear,
                                            leaveName: selectedRow.leaveName
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent value='Leave Addition' className='mt-4'>
                                    <LeaveTransferForm
                                        activeTab='Leave Addition'
                                        onSubmit={handleFormSubmit}
                                        onCancel={closeEditForm}
                                        defaultValues={{
                                            type: selectedRow.type,
                                            department: selectedRow.department,
                                            designation: selectedRow.designation,
                                            leaveYear: selectedRow.leaveYear,
                                            leaveName: selectedRow.leaveName
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent value='Leave CarryForward' className='mt-4'>
                                    <LeaveTransferForm
                                        activeTab='Leave CarryForward'
                                        onSubmit={handleFormSubmit}
                                        onCancel={closeEditForm}
                                        defaultValues={{
                                            type: selectedRow.type,
                                            department: selectedRow.department,
                                            designation: selectedRow.designation,
                                            leaveYear: selectedRow.leaveYear,
                                            leaveName: selectedRow.leaveName
                                        }}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>Delete Leave Transfer</h2>
                        <p className='mb-6'>Are you sure you want to delete this leave transfer? This action cannot be undone.</p>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' onClick={closeDeleteForm}>
                                Cancel
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
