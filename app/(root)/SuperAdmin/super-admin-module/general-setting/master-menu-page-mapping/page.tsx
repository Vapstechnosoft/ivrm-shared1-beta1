'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getOnLoadData, deleteMasterMenuPageMapping, getModuleDropdown } from '@/server/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import type { IMasterMenuPageMappingDTO } from '@/types/super-admin/super-admin-module/general-setting/master-menu-page-mapping';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import AddMasterMenuPageMappingForm from './_components/add-form';
import { columns } from './_components/columns';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
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

export default function MasterMenuPageMappingPage() {
    return (
        <FormProvider<IMasterMenuPageMappingDTO>>
            <MasterMenuPageMappingPageContent />
        </FormProvider>
    );
}

function MasterMenuPageMappingPageContent() {
    const { openAddForm } = useFormContext<IMasterMenuPageMappingDTO>();
    const [data, setData] = useState<IMasterMenuPageMappingDTO[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);

    // NUQS Hooks for URL State Management
    const [page, setPage] = useQueryState(tableSearchVariables.page.toString(), parseAsInteger.withDefault(1));
    const [pageSize, setPageSize] = useQueryState(tableSearchVariables.page_size.toString(), parseAsInteger.withDefault(10));
    const [searchQuery, setSearchQuery] = useQueryState(tableSearchVariables.search.toString(), parseAsString.withDefault(''));
    const [sortBy, setSortBy] = useQueryState(tableSearchVariables.sort_column.toString(), parseAsString.withDefault(''));
    const [sortDirection, setSortDirection] = useQueryState(tableSearchVariables.sort_direction.toString(), parseAsString.withDefault('asc'));

    const fetchData = useCallback(() => {
        setIsLoading(true);
        const gridPromise = getOnLoadData({
            page,
            page_size: pageSize,
            sort_column: sortBy,
            sort_direction: sortDirection,
            search_query: searchQuery
        });

        const modulePromise = getModuleDropdown();

        Promise.all([gridPromise, modulePromise]).then(([gridRes, moduleRes]) => {
            if (gridRes.success) {
                setData(gridRes.data.GridDetails || []);
                // If API returns pages in onload, keep it, else it might be another call. 
                // User only gave Module Dropdown API.
                setPages(gridRes.data.pages || []);
                setTotalItems(gridRes.total || 0);
            }

            if (moduleRes.success) {
                setModules(moduleRes.data || []);
            }

            setIsLoading(false);
        });
    }, [page, pageSize, sortBy, sortDirection, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                    Add Master Menu Page Mapping
                </Button>
            </div>

            <CollapsibleSection
                title='Master Menu Page Mapping List'
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

            <FormSections onRefresh={refreshData} modules={modules} allPages={pages} />
        </div>
    );
}

function FormSections({ onRefresh, modules, allPages }: { onRefresh: () => void, modules: any[], allPages: any[] }) {
    const {
        isAddFormOpen,
        isDeleteFormOpen,
        selectedRow,
        closeAddForm,
        closeDeleteForm,
        addFormRef
    } = useFormContext<IMasterMenuPageMappingDTO>();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleSuccess = () => {
        closeAddForm();
        onRefresh();
    };

    const handleDelete = async () => {
        if (!selectedRow) return;
        setIsDeleting(true);
        try {
            const res = await deleteMasterMenuPageMapping(selectedRow.ivrmmmpM_Id);
            if (res.success) {
                toast.success('Record deleted successfully');
                closeDeleteForm();
                onRefresh();
            } else {
                toast.error(res.message || 'Failed to delete record');
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
                        title='Add Master Menu Page Mapping'
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
                            <AddMasterMenuPageMappingForm onSuccess={handleSuccess} modules={modules} allPages={allPages} />
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
