'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { usePreAdmissionAcademicYear } from '@/hooks/admission/preadmission/useConfigurations';
import type { IMasterAcademicYearMasterList } from '@/types/admission/preadmission/configaration';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddAcademicYearMasterForm from './_components/add-form';
import { masterAcademicYearColumns } from './_components/columns';
import ReorderAcademicYearForm from './_components/reorder-form';
import TogglePreAdmissionAcademicYearForm from './_components/toggle-form';
import UpdateMasterAcademicYearForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterAcademicYearPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = use(props.searchParams);

    const {
        data: academicYearResponse,
        isLoading: isLoadingAcademicYear,
        error: academicYearError
    } = usePreAdmissionAcademicYear(searchParams);

    return (
        <FormProvider<IMasterAcademicYearMasterList>>
            <MasterAcademicYearPageContent response={academicYearResponse} isLoading={isLoadingAcademicYear} error={academicYearError} />
        </FormProvider>
    );
}

function MasterAcademicYearPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IMasterAcademicYearMasterList>();
    const tableProps = useDataTableProps(response);

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
                        Add Master Academic Year
                    </Button>
                </div>

                {/* Data Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <div className='mb-2 flex items-end justify-between'>
                        <p className='font-semibold text-destructive text-sm'>Note: Only one preadmission flag should be activated.</p>
                        <ReorderAcademicYearForm />
                    </div>

                    <GenericDataTable<IMasterAcademicYearMasterList>
                        {...tableProps}
                        columns={masterAcademicYearColumns}
                        isLoading={isLoading}
                        error={error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading master Academic Year...'
                        noDataTitle='No Master Academic Year Found'
                        noDataDescription='Get started by creating your first Master Academic Year'
                        errorTitle='Error Loading Master Academic Year'
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
        isToggleFormOpen,
        isEditFormOpen,
        closeToggleForm,
        selectedRow,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterAcademicYearMasterList>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Master Academic Year'
                        description='Fill in the details below to create a new Master Academic Year'
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
                            <AddAcademicYearMasterForm onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Academic Year'
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
                            <UpdateMasterAcademicYearForm selectedRow={selectedRow as any} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <TogglePreAdmissionAcademicYearForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
