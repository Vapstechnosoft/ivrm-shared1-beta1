'use client';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import { use } from 'react';

import { useMasterSubjectGroup } from '@/hooks/exam/exammodule/usemasters';
import type { IMasterSubjectGroup } from '@/types/exam/exam-module/masters';
import { MasterSubjectGroupColumns } from './_components/columns';

import { toggleMasterSubjectGroup } from '@/server/exam/exam-module/masters/subject-group';
import { toast } from 'sonner';
import AddMasterSubjectGroupForm from './_components/add-form';
import MasterSubjectGroupDetailsPage from './_components/subject-group-view-Details';
import ToggleMasterSubjectGroupForm from './_components/toggle-form';
import UpdateMasterSubjectGroupForm from './_components/update-form';
// import MasterSubjectGroupDetailsView from './_components/group-details-view';
// import { masterSubjectGroupSchema } from '@/schemas/exam/exam-module/masters';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterSubjectGroupPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMasterSubjectGroup(searchParams);

    return (
        <FormProvider<IMasterSubjectGroup>>
            <MasterSubjectGroupPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function MasterSubjectGroupPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterSubjectGroup>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Subject Group
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterSubjectGroup>
                        {...tableProps}
                        columns={MasterSubjectGroupColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading subject groups...'
                        noDataTitle='No Subject Groups Found'
                        noDataDescription='Get started by creating your first subject group'
                        errorTitle='Error Loading Subject Groups'
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
        isToggleFormOpen,
        isDetailsViewOpen,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeDetailsView,
        addFormRef,
        editFormRef,
        selectedRow
    } = useFormContext<IMasterSubjectGroup>();

    async function toggleMasterGroup(id: number) {
        try {
            const response = await toggleMasterSubjectGroup(id);
            if (response.success) {
                toast.success(response.message || 'Status updated successfully');
            } else {
                toast.error(response.message || 'Failed to update status');
            }
            return response;
        } catch (error: any) {
            toast.error(error.message || 'Error toggling status');
            return { success: false, message: error.message };
        }
    }

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Subject Group'
                        description='Fill in the details below to create a new subject group'
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
                            <AddMasterSubjectGroupForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Subject Group'
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
                            <UpdateMasterSubjectGroupForm initialData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleMasterSubjectGroupForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/* Details View */}
            {isDetailsViewOpen && selectedRow && <MasterSubjectGroupDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
