'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useDeleteLeaveAuthorization, useLeaveAuthorization } from '@/hooks/hrms/leave-management/useMasters';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddLeaveAuthorizationForm from './_components/add-form';
import { type LeaveAuthorization, getLeaveAuthorizationColumns } from './_components/columns';
import UpdateLeaveAuthorizationForm from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function LeaveAuthorizationPage(props: { searchParams: SearchParams }) {
    const [initialSearchParams, setInitialSearchParams] = useState<any>({});

    useEffect(() => {
        const fetchParams = async () => {
            const params = await props.searchParams;
            setInitialSearchParams(params);
        };
        fetchParams();
    }, [props.searchParams]);

    const searchParams = useMemo(() => {
        return initialSearchParams;
    }, [initialSearchParams]);

    const { data: response, isLoading, error } = useLeaveAuthorization(searchParams);
    return (
        <FormProvider<LeaveAuthorization>>
            <LeaveAuthorizationPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function LeaveAuthorizationPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<LeaveAuthorization>();
    const { openEditForm, openDeleteForm } = useFormContext<LeaveAuthorization>();
    const tableProps = useDataTableProps(response);
    const columns = getLeaveAuthorizationColumns({
        onEdit: openEditForm,
        onDelete: (id: number) => {
            // Find the row by id and open delete form
            const row = response?.data?.find((r: LeaveAuthorization) => r.id === id);
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
                        Add Leave Authorization
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<LeaveAuthorization>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave authorizations...'
                        noDataTitle='No Leave Authorizations Found'
                        noDataDescription='Get started by creating your first leave authorization'
                        errorTitle='Error Loading Leave Authorizations'
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
    } = useFormContext<LeaveAuthorization>();
    const { mutate: deleteLeaveAuthorization, isPending: isDeleting } = useDeleteLeaveAuthorization();
    const handleDelete = () => {
        if (selectedRow) {
            // Extract HRLA_Id from the row data if available, otherwise use 0
            const HRLA_Id = (selectedRow as any)._HRLA_Id || 0;
            const HRLAON_Id = selectedRow.id || 0;
            console.log(`🗑️ Deleting Auth - HRLA_Id: ${HRLA_Id}, HRLAON_Id: ${HRLAON_Id}`);
            deleteLeaveAuthorization(
                {
                    HRLA_Id: HRLA_Id,
                    HRLAON_Id: HRLAON_Id
                },
                {
                    onSuccess: () => {
                        closeDeleteForm();
                    }
                }
            );
        }
    };
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Leave Authorization'
                        description='Fill in the details below to create a new leave authorization'
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
                            <AddLeaveAuthorizationForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Leave Authorization'
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
                            <UpdateLeaveAuthorizationForm selectedRow={selectedRow} onSuccess={closeEditForm} onCancel={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>Delete Leave Authorization</h2>
                        <p className='mb-6'>Are you sure you want to delete this leave authorization? This action cannot be undone.</p>
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
        </>
    );
}
