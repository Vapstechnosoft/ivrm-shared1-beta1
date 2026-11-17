'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterMessCategory } from '@/hooks/hostel/useMasterMessCategory';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddMasterMessCategoryForm from './_components/add-form';
import { masterMessCategoryColumns, IMasterMessCategory } from './_components/columns';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { toast } from 'sonner';
import { deactivateMessCategory } from '@/server/hostel/hostel-management/masters/mess-category';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterMessCategoryPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: categoryList, isLoading, refetch } = useMasterMessCategory(searchParams);

    return (
        <FormProvider<IMasterMessCategory>>
            <PageContent
                categoryList={categoryList}
                isLoading={isLoading}
                refetch={refetch}
            />
        </FormProvider>
    );
}

function PageContent({
    categoryList,
    isLoading,
    refetch
}: {
    categoryList: any;
    isLoading: boolean;
    refetch: () => void;
}) {
    const { openAddForm } = useFormContext<IMasterMessCategory>();
    const tableProps = useDataTableProps(categoryList);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Category
                    </Button>
                </div>

                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<IMasterMessCategory>
                        {...tableProps}
                        columns={masterMessCategoryColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading categories...'
                        noDataTitle='No Categories Found'
                    />
                </CollapsibleSection>

                <FormSections onSuccess={refetch} />
            </div>
        </div>
    );
}

function FormSections({ onSuccess }: { onSuccess: () => void }) {
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
    } = useFormContext<IMasterMessCategory>();

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Mess Category'
                        description='Create a new mess category'
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
                            <AddMasterMessCategoryForm onSuccess={() => { closeAddForm(); onSuccess(); }} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Mess Category'
                        description='Modify category details'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddMasterMessCategoryForm
                                initialData={selectedRow}
                                onSuccess={() => { closeEditForm(); onSuccess(); }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterMessCategoryForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
}

function ToggleMasterMessCategoryForm({ rowData, onClose, onSuccess }: { rowData: IMasterMessCategory, onClose: () => void, onSuccess: () => void }) {
    const onConfirm = async () => {
        try {
            const result = await deactivateMessCategory(rowData.hlmmC_Id);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            onClose();
        }
    };

    return (
        <ToggleFormWrapper
            isOpen={true}
            onClose={onClose}
            onConfirm={onConfirm}
            title={rowData.hlmmC_ActiveFlag ? 'Deactivate Category' : 'Activate Category'}
            description={`Are you sure you want to ${rowData.hlmmC_ActiveFlag ? 'deactivate' : 'activate'} ${rowData.hlmmC_Name}?`}
        />
    );
}
