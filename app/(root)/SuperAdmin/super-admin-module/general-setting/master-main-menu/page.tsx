'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getMasterMainMenuData, deleteMasterMainMenu } from '@/server/super-admin/super-admin-module/general-setting/master-main-menu';
import type { IMasterMainMenu } from '@/types/super-admin/super-admin-module/general-setting/master-main-menu';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterMainMenuForm from './_components/add-form';
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

import { useSearchParams } from 'next/navigation';

export default function MasterMainMenuPage() {
    return (
        <FormProvider<IMasterMainMenu>>
            <MasterMainMenuPageContent />
        </FormProvider>
    );
}

function MasterMainMenuPageContent() {
    const { openAddForm } = useFormContext<IMasterMainMenu>();
    const [data, setData] = useState<IMasterMainMenu[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '10');

    // Fetch data when page/pageSize changes
    const fetchData = () => {
        setIsLoading(true);
        getMasterMainMenuData(page, pageSize).then((res: any) => {
            if (res.success) {
                setData(res.data || []);
                setTotalRecords(res.total || 0);

                // Debug log
                console.log(`Fetched Page ${page}, Size ${pageSize}, Total ${res.total}, Records ${res.data?.length}`);
            } else {
                toast.error(res.message || 'Failed to load grid data');
            }
            setIsLoading(false);
        }).catch(err => {
            console.error("Fetch error:", err);
            toast.error('An error occurred while loading data');
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize]); // Refetch when page/pageSize changes

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
                    Add Master Main Menu
                </Button>
            </div>

            <CollapsibleSection
                title='Master Main Menu'
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
                        totalItems={totalRecords}
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
    } = useFormContext<IMasterMainMenu>();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleSuccess = () => {
        closeAddForm();
        closeEditForm();
        onRefresh();
    };

    const handleDelete = async () => {
        if (!selectedRow) return;
        setIsDeleting(true);
        try {
            const res = await deleteMasterMainMenu(selectedRow.ivrmmM_Id);
            if (res.success) {
                toast.success('Record deleted successfully');
                closeDeleteForm();
                onRefresh();
            } else {
                if (res.message && (res.message.toLowerCase().includes('mapping') || res.message.toLowerCase().includes('exist'))) {
                    toast.error('Cannot delete menu. Sub menu or institute mapping exists');
                } else {
                    // Fallback to the same message as per user request for generic failures which are likely dependency issues
                    toast.error('Cannot delete menu. Sub menu or institute mapping exists');
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
                        title='Add Master Main Menu'
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
                            <AddMasterMainMenuForm onSuccess={handleSuccess} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection
                        title='Edit Master Main Menu'
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
                            <AddMasterMainMenuForm onSuccess={handleSuccess} initialData={selectedRow} />
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
