'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useInvMasterUserGroup } from '@/hooks/inventory/masters/use-inv-master-user-group';
import type { IInvMasterUserGroup } from '@/types/inventory/masters/inv-master-group';
import { Plus, X, UserCog, PlusCircle, Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { InvMasterUserGroupColumns } from './_components/user-group-columns';
import { AddUserGroupForm, ToggleUserGroupForm, UpdateUserGroupForm } from './_components/user-group-form';

export default function InvMasterUserGroupPage() {
    return (
        <FormProvider<IInvMasterUserGroup>>
            <UserGroupPageContent />
        </FormProvider>
    );
}

function UserGroupPageContent() {
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const { data: response, isLoading } = useInvMasterUserGroup(params);
    const { openAddForm } = useFormContext<IInvMasterUserGroup>();

    const tableProps = useDataTableProps(response?.data, {
        dataKey: 'get_usergroup',
        totalKey: 'usergroupTotal'
    });

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading title='User Group Master' description='Manage User Groups' />
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
                            Add User Group
                        </Button>
                    </div>

                    {/* Data Table */}
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'
                        title='User Group List'
                        icon={<UserCog className='h-5 w-5' />}>
                        <GenericDataTable<IInvMasterUserGroup>
                            {...tableProps}
                            columns={InvMasterUserGroupColumns}
                            isLoading={isLoading}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading User Groups...'
                            noDataTitle='No User Groups Found'
                            noDataDescription='Create your first User Group'
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
    } = useFormContext<IInvMasterUserGroup>();

    const mainGroupOptions = (response?.data?.get_maingroupdd || []).map((item: any) => ({
        label: item.invmG_GroupName,
        value: item.invmG_Id.toString()
    }));

    return (
        <>
            {/* Add Form */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add New User Group'
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
                            <AddUserGroupForm onSuccess={closeAddForm} mainGroupOptions={mainGroupOptions} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Edit Form */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit User Group'
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
                            <UpdateUserGroupForm selectedRow={selectedRow} onSuccess={closeEditForm} mainGroupOptions={mainGroupOptions} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && (
                <ToggleUserGroupForm rowData={selectedRow} onClose={closeToggleForm} />
            )}
        </>
    );
}
