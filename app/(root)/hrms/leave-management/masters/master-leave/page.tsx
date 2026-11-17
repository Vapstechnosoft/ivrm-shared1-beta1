'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useDeleteMasterLeave, useMasterLeave, useToggleMasterLeave, useUpdateMasterLeave } from '@/hooks/hrms/leave-management/useMasters';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterLeaveForm from './_components/add-form';
import { type MasterLeave, getMasterLeaveColumns } from './_components/columns';
import UpdateMasterLeaveForm from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function MasterLeavePage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);

    // Normalize searchParams for API
    const normalizedParams = {
        page: Number(searchParams.page) || 1,
        page_size: Number(searchParams.page_size) || 10,
        search_query: String(searchParams.search_query || ''),
        sort_column: String(searchParams.sort_column || ''),
        sort_direction: String(searchParams.sort_direction || 'asc') as 'asc' | 'desc'
    };

    const { data: response, isLoading, error } = useMasterLeave(normalizedParams);

    return (
        <FormProvider<MasterLeave>>
            <MasterLeavePageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function MasterLeavePageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<MasterLeave>();
    const { openEditForm, openDeleteForm, openToggleForm } = useFormContext<MasterLeave>();
    const tableProps = useDataTableProps(response);
    const columns = getMasterLeaveColumns({
        onEdit: openEditForm,
        onDelete: (id: number) => {
            // Find the row by id and open delete form
            const row = response?.data?.find((r: MasterLeave) => r.id === id);
            if (row) {
                openDeleteForm(row);
            }
        },
        onToggleStatus: openToggleForm
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
                        Add Master Leave
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<MasterLeave>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master leaves...'
                        noDataTitle='No Master Leaves Found'
                        noDataDescription='Get started by creating your first master leave'
                        errorTitle='Error Loading Master Leaves'
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
        isToggleFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeDeleteForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<MasterLeave>();
    const _queryClient = useQueryClient();
    const { mutate: updateMasterLeave } = useUpdateMasterLeave();
    const { mutate: toggleMasterLeave, isPending: isToggling } = useToggleMasterLeave();
    const { mutate: deleteMasterLeave, isPending: isDeleting } = useDeleteMasterLeave();

    const handleDelete = () => {
        if (selectedRow) {
            deleteMasterLeave(selectedRow.id, {
                onSuccess: () => {
                    closeDeleteForm();
                }
            });
        }
    };

    const handleToggleStatus = () => {
        if (selectedRow) {
            toggleMasterLeave(selectedRow.id, {
                onSuccess: () => {
                    closeToggleForm();
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
                        title='Add New Master Leave'
                        description='Fill in the details below to create a new master leave'
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
                            <AddMasterLeaveForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Leave'
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
                            <UpdateMasterLeaveForm selectedRow={selectedRow} onSuccess={closeEditForm} onCancel={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>Delete Master Leave</h2>
                        <p className='mb-6'>Are you sure you want to delete this master leave? This action cannot be undone.</p>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' onClick={closeDeleteForm} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Toggle Status Form */}
            {isToggleFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>{selectedRow.isActive ? 'Activate' : 'Deactivate'} Master Leave</h2>
                        <p className='mb-6'>
                            Are you sure you want to {selectedRow.isActive ? 'Activate' : 'Deactivate'} this master leave?
                        </p>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' onClick={closeToggleForm} disabled={isToggling}>
                                Cancel
                            </Button>
                            <Button
                                type='button'
                                variant={selectedRow.isActive ? 'default' : 'destructive'}
                                onClick={handleToggleStatus}
                                disabled={isToggling}
                                className={selectedRow.isActive ? 'bg-green-600 text-white hover:bg-green-700' : ''}>
                                {isToggling
                                    ? selectedRow.isActive
                                        ? 'Activating...'
                                        : 'Deactivating...'
                                    : selectedRow.isActive
                                      ? 'Activate'
                                      : 'Deactivate'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
