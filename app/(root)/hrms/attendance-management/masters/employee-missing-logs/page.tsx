'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEmployeeMissingLogs } from '@/hooks/hrms/attendance-management/useMasters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import { HRMSCollapsibleSection } from '../_components/hrms-collapsible-section';
import AddEmployeeMissingLogForm from './_components/add-form';
import { type MissingLog, missingLogColumns } from './_components/columns';
import UpdateEmployeeMissingLogForm from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function EmployeeMissingLogsPage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useEmployeeMissingLogs();
    return (
        <FormProvider<MissingLog>>
            <EmployeeMissingLogsPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function EmployeeMissingLogsPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<MissingLog>();
    const tableProps = useDataTableProps(response);
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Employee Missing Log
                    </Button>
                </div>
                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <GenericDataTable<MissingLog>
                        {...tableProps}
                        columns={missingLogColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading employee missing logs...'
                        noDataTitle='No Employee Missing Logs Found'
                        noDataDescription='Get started by creating your first employee missing log'
                        errorTitle='Error Loading Missing Logs'
                    />
                </CollapsibleSection>
                {/* Forms */}
                <FormSections />
            </div>
        </div>
    );
}
function FormSections() {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<MissingLog>();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <HRMSCollapsibleSection
                        title='Add Employee Missing Log'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'
                        closeButton={
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                        }>
                        <AddEmployeeMissingLogForm onSuccess={closeAddForm} />
                    </HRMSCollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <HRMSCollapsibleSection
                        title='Update Employee Missing Log'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'
                        closeButton={
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                        }>
                        <UpdateEmployeeMissingLogForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                    </HRMSCollapsibleSection>
                </div>
            )}
        </>
    );
}
