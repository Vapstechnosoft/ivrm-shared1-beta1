'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getMasterPages } from '@/server/super-admin/super-admin-module/general-setting/master-page';
import type { IMasterPage } from '@/types/super-admin/super-admin-module/general-setting/master-page';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import AddMasterPageForm from './_components/add-form';
import { columns } from './_components/columns';
import { PageProvider } from './_components/page-context';

export default function MasterPage() {
    return (
        <FormProvider<IMasterPage>>
            <MasterPageContent />
        </FormProvider>
    );
}

function MasterPageContent() {
    const { openAddForm } = useFormContext<IMasterPage>();
    const [data, setData] = useState<IMasterPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination State
    const [page] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        const searchParams = {
            page: page,
            page_size: pageSize
        };

        try {
            const res = await getMasterPages(searchParams);
            if (res.success) {
                setData(res.data || []);
                setTotalItems(res.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch master pages', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <PageProvider refreshData={fetchData}>
            <div className='container space-y-4 p-1'>
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Master Page
                    </Button>
                </div>

                <CollapsibleSection
                    title='Master Pages'
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
                            isPaginationRequired={true}
                            totalItems={totalItems}
                        />
                    </div>
                </CollapsibleSection>

                <FormSections onRefresh={fetchData} />
            </div>
        </PageProvider>
    );
}

function FormSections({ onRefresh }: { onRefresh: () => void }) {
    const { isAddFormOpen, isEditFormOpen, closeAddForm, closeEditForm } = useFormContext<IMasterPage>();

    const closeForm = isEditFormOpen ? closeEditForm : closeAddForm;
    const title = isEditFormOpen ? 'Edit Master Page' : 'Add Master Page';
    const isOpen = isAddFormOpen || isEditFormOpen;

    const handleSuccess = () => {
        closeForm();
        onRefresh();
    };

    return (
        <>
            {isOpen && (
                <CollapsibleSection
                    title={title}
                    defaultOpen={true}
                    variant='outline'
                    size='lg'
                    className='shadow-lg animate-in slide-in-from-top-2'
                >
                    <div className='relative'>
                        <Button
                            type='button'
                            onClick={closeForm}
                            variant='ghost'
                            size='sm'
                            className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                            <X className='h-4 w-4 text-destructive' /> Close
                        </Button>
                        <AddMasterPageForm onSuccess={handleSuccess} />
                    </div>
                </CollapsibleSection>
            )}
        </>
    );
}
