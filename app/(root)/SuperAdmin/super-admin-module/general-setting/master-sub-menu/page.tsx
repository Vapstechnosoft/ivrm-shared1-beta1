'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { tableSearchVariables } from '@/lib/data-table.config';
import { deleteMasterSubMenu, getMasterSubMenuData } from '@/server/super-admin/super-admin-module/general-setting/master-sub-menu';
import type { IMasterSubMenu } from '@/types/super-admin/super-admin-module/general-setting/master-sub-menu';
import { Plus, X } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterSubMenuForm from './_components/add-form';
import { columns } from './_components/columns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from '@/components/ui/spinner';

export default function MasterSubMenuPage() {
    return (
        <FormProvider<IMasterSubMenu>>
            <MasterSubMenuPageContent />
        </FormProvider>
    );
}

function MasterSubMenuPageContent() {
    const { openAddForm } = useFormContext<IMasterSubMenu>();
    const [data, setData] = useState<IMasterSubMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);

    // Sync with URL params
    const [page] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false, history: 'push' }).withDefault(10)
    );
    const [sortBy] = useQueryState(
        tableSearchVariables.sort_column,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );
    const [sortDirection] = useQueryState(
        tableSearchVariables.sort_direction,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );
    const [searchQuery] = useQueryState(
        tableSearchVariables.search,
        parseAsString.withOptions({ shallow: false }).withDefault('')
    );

    const fetchData = () => {
        setIsLoading(true);
        getMasterSubMenuData({
            page,
            page_size: pageSize,
            sort_column: sortBy,
            sort_direction: sortDirection,
            search_query: searchQuery
        }).then(res => {
            if (res.success) {
                setData(res.data || []);
                setTotalItems(res.total || 0);
            }
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, sortBy, sortDirection, searchQuery]);

    const refreshData = () => {
        fetchData();
    };

    return (
        <div className='container space-y-4 p-1'>
            {/* Header with Add Button */}
            <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                <Button
                    type='button'
                    onClick={openAddForm}
                    className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Master Sub Menu
                </Button>
            </div>

            <CollapsibleSection
                title='Master Sub Menu'
                defaultOpen={true}
                variant='default'
                size='lg'
                className='shadow-lg'
            >
                <div className='p-4'>
                    <GenericDataTable
                        data={data}
                        columns={columns}
                        isLoading={isLoading}
                        totalItems={totalItems}
                    />
                </div>
            </CollapsibleSection>

            <FormSections onRefresh={refreshData} />
        </div>
    );
}

function FormSections({ onRefresh }: { onRefresh: () => void }) {
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
    } = useFormContext<IMasterSubMenu>();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleSuccess = () => {
        closeAddForm();
        closeEditForm();
        onRefresh();
    };

    const handleDelete = async () => {
        if (!selectedRow || !selectedRow.ivrmmS_Id) return;
        setIsDeleting(true);
        try {
            const res = await deleteMasterSubMenu(selectedRow.ivrmmS_Id);
            if (res.success) {
                toast.success('Record deleted successfully');
                closeDeleteForm();
                onRefresh();
            } else {
                if (res.message && res.message.toLowerCase().includes('already mapping')) {
                    toast.error('This record is already mapped and cannot be deleted.');
                } else {
                    toast.error(res.message || 'Failed to delete record');
                }
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title='Add Master Sub Menu'
                        defaultOpen={true}
                        variant='outline'
                        size='lg'
                        className='shadow-lg animate-in slide-in-from-top-2'
                    >
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            <AddMasterSubMenuForm onSuccess={handleSuccess} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Sub Menu'
                        defaultOpen={true}
                        variant='outline'
                        size='lg'
                        className='shadow-lg animate-in slide-in-from-top-2'
                    >
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                            {/* reusing Add form for edit, passing initial data */}
                            <AddMasterSubMenuForm onSuccess={handleSuccess} initialData={selectedRow} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            <AlertDialog open={isDeleteFormOpen} onOpenChange={closeDeleteForm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? <Spinner className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
