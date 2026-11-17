'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Plus, X } from 'lucide-react';
import BifurcationConstraintsForm from './bifurcation-constraints-form';
import { type IBifurcationConstraintList, columns } from './columns';
import ToggleBifurcationConstraints from './toggle-form';

interface BifurcationConstraintsProps {
    initialData: any; // Result from getBifurcationConstraintsDetails
}

export default function BifurcationConstraints({ initialData }: BifurcationConstraintsProps) {
    return (
        <FormProvider>
            <BifurcationConstraintsContent initialData={initialData} />
        </FormProvider>
    );
}

function BifurcationConstraintsContent({ initialData }: BifurcationConstraintsProps) {
    const { isAddFormOpen, isEditFormOpen, selectedRow, openAddForm, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IBifurcationConstraintList>();

    // Refresh function or data handling.
    // GenericDataTable usually takes data. If we need to refresh data after save,
    // we should use a query hook or revalidate server path.
    // For now assuming static initialData unless we use useQuery.
    // Standard here seems to be hybrid. `page.tsx` fetches initialData.
    // Ideally we should use `useQuery` or `useRouter().refresh()` in onSuccess.
    // `initialData` works for initial load.
    // I will use `dataList` derived from props.
    // Note: If using `useRouter().refresh()`, the prop `initialData` updates.

    // Legacy: detailslist contains the grid data.
    //const dataList = initialData?.detailslist || [];

    // tableProps handles pagination object if provided by API, else defaults.
    const tableProps = useDataTableProps(initialData);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    {!isAddFormOpen && !isEditFormOpen && (
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Bifurcation Constraints
                        </Button>
                    )}
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IBifurcationConstraintList>
                        isLoading={false}
                        {...tableProps}
                        //data={dataList}
                        columns={columns}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading constraints...'
                        noDataTitle='No Bifurcation Constraints Found'
                        noDataDescription='Add a new constraint to get started'
                    />
                </CollapsibleSection>

                <FormSections initialData={initialData} />
            </div>
        </div>
    );
}

function FormSections({ initialData }: { initialData: any }) {
    const { isAddFormOpen, isEditFormOpen, selectedRow, closeAddForm, closeEditForm, addFormRef, editFormRef } =
        useFormContext<IBifurcationConstraintList>();

    const handleSuccess = () => {
        closeAddForm();
        closeEditForm();
        // Trigger server refresh
        // In a real app we'd call router.refresh() or similar.
        // Assuming user will navigate or implicit refresh happens via parent.
        // I'll add window.location.reload() or standard revalidation call if I had the hook.
        // Using window.location for now as simplest fallback or prefer standard router refresh if imported.
        window.location.reload();
    };

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Bifurcation Constraints'
                        description='Fill in the details below'
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
                            <BifurcationConstraintsForm initialData={initialData} onSuccess={handleSuccess} onCancel={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Bifurcation Constraints'
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
                            <BifurcationConstraintsForm
                                initialData={initialData}
                                editData={selectedRow}
                                onSuccess={handleSuccess}
                                onCancel={closeEditForm}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form (Alert Dialog) */}
            {useFormContext().isToggleFormOpen && useFormContext().selectedRow && (
                <ToggleBifurcationConstraints
                    rowData={useFormContext().selectedRow}
                    onClose={useFormContext().closeToggleForm}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}
