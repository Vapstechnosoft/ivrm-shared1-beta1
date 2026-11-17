'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useInvMasterItemGroup } from '@/hooks/inventory/masters/use-inv-master-item-group';
import type { IInvMasterItemGroup } from '@/types/inventory/masters/inv-master-group';
import { Plus, X, Boxes, PlusCircle, Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { InvMasterItemGroupColumns } from './_components/item-group-columns';
import { AddItemGroupForm, ToggleItemGroupForm, UpdateItemGroupForm } from './_components/item-group-form';

export default function InvMasterItemGroupPage() {
    return (
        <FormProvider<IInvMasterItemGroup>>
            <ItemGroupPageContent />
        </FormProvider>
    );
}

function ItemGroupPageContent() {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { data: response, isLoading } = useInvMasterItemGroup(params);
    const { openAddForm } = useFormContext<IInvMasterItemGroup>();

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_itemgroup',
        totalKey: 'itemgroupTotal'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='Item Group Master' description='Manage Item Groups' />
                    </div>
                </div>

                <div className='space-y-4 p-1'>
                    {/* Header Actions */}
                    <div className='flex justify-end'>
                        <Button
                            type='button'
                            onClick={openAddForm}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            <Plus className='h-4 w-4' />
                            Add Item Group
                        </Button>
                    </div>

                    {/* Data Table */}
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                        title='Item Group List'
                        icon={<Boxes className='h-5 w-5' />}>
                        <GenericDataTable<IInvMasterItemGroup>
                            {...tableProps}
                            columns={InvMasterItemGroupColumns}
                            isLoading={isLoading}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading Item Groups...'
                            noDataTitle='No Item Groups Found'
                            noDataDescription='Create your first Item Group'
                        />
                    </CollapsibleSection>

                    {/* Forms */}
                    <FormSections response={response} />
                </div>
            </div>
        </div>
    );
}

interface FormSectionsProps {
    response: any;
}

function FormSections({ response }: FormSectionsProps) {
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
    } = useFormContext<IInvMasterItemGroup>();

    const userGroupOptions = (response?.data?.get_usergroup || []).map((item: any) => ({
        label: item.invmG_GroupName,
        value: item.invmG_Id.toString()
    }));

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New Item Group'
                        description='Fill in the details below'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in shadow-lg duration-300'
                        icon={<PlusCircle className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddItemGroupForm onSuccess={closeAddForm} userGroupOptions={userGroupOptions} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Item Group'
                        defaultOpen={true}
                        variant='outline'
                        size='md'
                        className='slide-in-from-top-4 animate-in border-primary/20 shadow-lg duration-300'
                        icon={<Pencil className='h-5 w-5' />}>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <UpdateItemGroupForm selectedRow={selectedRow} onSuccess={closeEditForm} userGroupOptions={userGroupOptions} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleItemGroupForm rowData={selectedRow} onClose={closeToggleForm} />
            )}
        </>
    );
}
