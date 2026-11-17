'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useMasterLifeSkillAreaMapping } from '@/hooks/exam/exammodule/usemasters';
import type { ILifeSkillAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import AddLifeSkillAreaMapping from './_components/add-from';
import { LifeSkillAreaMappingColumns } from './_components/columns';
import ToggleLifeSkillAreaMappingForm from './_components/toggle-form';
import UpdateLifeSkillAreaMappingForm from './_components/update-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function LifeSkillAreaMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMasterLifeSkillAreaMapping(searchParams);

    return (
        <FormProvider<ILifeSkillAreaMapping>>
            <LifeSkillAreaMappingPageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function LifeSkillAreaMappingPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<ILifeSkillAreaMapping>();
    const tableProps = useDataTableProps(response);

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Header Section */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4' />
                        Add Life Skill Area Mapping
                    </Button>
                </div>

                {/* Table Section */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    <GenericDataTable<ILifeSkillAreaMapping>
                        {...tableProps}
                        columns={LifeSkillAreaMappingColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Life Skill Area Mappings...'
                        noDataTitle='No Life Skill Area Mappings Found'
                        noDataDescription='Get started by creating your first Life Skill Area Mapping'
                        errorTitle='Error Loading Life Skill Area Mappings'
                    />
                </CollapsibleSection>

                {/* Forms Section */}
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
        selectedRow,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        addFormRef,
        editFormRef
    } = useFormContext<ILifeSkillAreaMapping>();

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Life Skill Area Mapping'
                        description='Fill in the details below to create a new life skill area mapping'
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
                            <AddLifeSkillAreaMapping onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Life Skill Area Mapping'
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
                            <UpdateLifeSkillAreaMappingForm rowData={selectedRow} onSuccess={closeEditForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleLifeSkillAreaMappingForm rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
