'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterShift } from '@/hooks/hrms/attendance-management/useMasters';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import { HRMSCollapsibleSection } from '../_components/hrms-collapsible-section';
import AddMasterShiftForm from './_components/add-form';
import { type MasterShift, masterShiftColumns } from './_components/columns';
import DeleteMasterShiftForm from './_components/delete-form';
import UpdateMasterShiftForm from './_components/update-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function MasterShiftPage(props: { searchParams: SearchParams }) {
    const _searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMasterShift();
    return (
        <FormProvider<MasterShift>>
            <MasterShiftPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}
function MasterShiftPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<MasterShift>();
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
                        Add Master Shift
                    </Button>
                </div>
                {/* Data Table Section */}
                <HRMSCollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                    headerClassName=''>
                    <GenericDataTable<MasterShift>
                        {...tableProps}
                        columns={masterShiftColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master shifts...'
                        noDataTitle='No Master Shifts Found'
                        noDataDescription='Get started by creating your first master shift'
                        errorTitle='Error Loading Shifts'
                    />
                </HRMSCollapsibleSection>
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
    } = useFormContext<MasterShift>();
    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <HRMSCollapsibleSection
                        title='Add Master Shift'
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
                        <AddMasterShiftForm onSuccess={closeAddForm} />
                    </HRMSCollapsibleSection>
                </div>
            )}
            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <HRMSCollapsibleSection
                        title='Update Master Shift'
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
                        <UpdateMasterShiftForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                    </HRMSCollapsibleSection>
                </div>
            )}
            {/* Delete Form */}
            {isDeleteFormOpen && selectedRow && <DeleteMasterShiftForm rowData={selectedRow} onClose={closeDeleteForm} />}
        </>
    );
}
