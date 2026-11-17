'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import {
    useLeaveTransactionManualList,
    useDeleteLeaveTransactionManual
} from '@/hooks/hrms/leave-management/useLeaveTransactionManual';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type LeaveTransactionManual, getLeaveTransactionManualColumns } from './_components/columns';
import { AddLeaveTransactionManualForm } from './_components/add-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function LeaveTransactionManualPage(props: { searchParams: SearchParams }) {
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

    const { data: response, isLoading, error, refetch: refetchAll } = useLeaveTransactionManualList(searchParams);

    return (
        <FormProvider<LeaveTransactionManual>>
            <LeaveTransactionManualPageContent
                response={response}
                isLoading={isLoading}
                error={error}
                refetch={refetchAll}
            />
        </FormProvider>
    );
}

function LeaveTransactionManualPageContent({
    response,
    isLoading,
    error,
    refetch
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}) {
    const { openAddForm, openEditForm, openDeleteForm } = useFormContext<LeaveTransactionManual>();
    const tableProps = useDataTableProps(response);

    const columns = getLeaveTransactionManualColumns({
        onEdit: openEditForm,
        onDelete: (id: number) => {
            const row = response?.data?.find((r: LeaveTransactionManual) => r.id === id);
            if (row) {
                openDeleteForm(row);
            }
        }
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-2xl tracking-tight'>Leave Transaction Manual</h1>
                        <p className='text-muted-foreground text-sm'>
                            Manage manual leave transactions for employees
                        </p>
                    </div>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Leave Transaction
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<LeaveTransactionManual>
                        {...tableProps}
                        columns={columns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading leave transactions...'
                        noDataTitle='No Leave Transactions Found'
                        noDataDescription='Get started by creating your first leave transaction'
                        errorTitle='Error Loading Leave Transactions'
                    />
                </CollapsibleSection>

                {/* Forms */}
                <FormSections refetch={refetch} />
            </div>
        </div>
    );
}

function FormSections({ refetch }: { refetch: () => void }) {
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
    } = useFormContext<LeaveTransactionManual>();

    const { mutate: deleteLeaveTransaction, isPending: isDeleting } = useDeleteLeaveTransactionManual();

    const handleDelete = () => {
        if (selectedRow) {
            deleteLeaveTransaction(
                {
                    HRELTD_Id: selectedRow.id,
                    HRELT_Id: selectedRow.transactionId
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
                        title='Add New Leave Transaction'
                        description='Fill in the details below to create a new leave transaction'
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
                            <div className='rounded-lg border bg-card p-6 shadow-sm'>
                                <AddLeaveTransactionManualForm
                                    onSuccess={() => {
                                        closeAddForm();
                                        refetch();
                                    }}
                                    onCancel={closeAddForm}
                                />
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Leave Transaction'
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
                            <div className='rounded-lg border bg-muted/50 p-6'>
                                <p className='text-center text-muted-foreground'>
                                    Edit form component will be implemented here
                                </p>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteFormOpen && selectedRow && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg'>
                        <h2 className='mb-4 font-semibold text-lg'>Delete Leave Transaction</h2>
                        <p className='mb-2'>Are you sure you want to delete this leave transaction?</p>
                        <div className='mb-6 rounded-md bg-muted p-3'>
                            <p className='text-sm'>
                                <strong>Employee:</strong> {selectedRow.employeeName}
                            </p>
                            <p className='text-sm'>
                                <strong>Leave Type:</strong> {selectedRow.leaveName}
                            </p>
                            <p className='text-sm'>
                                <strong>Total Days:</strong> {selectedRow.totalDays}
                            </p>
                        </div>
                        <p className='mb-6 text-destructive text-sm'>This action cannot be undone.</p>
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
