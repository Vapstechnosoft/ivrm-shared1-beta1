'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { getMasterModules } from '@/server/super-admin/super-admin-module/general-setting/module';
import type { IMasterModule } from '@/types/super-admin/super-admin-module/general-setting/module';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';
import AddMasterModuleForm from './_components/add-form';
import { columns } from './_components/columns';
import { ModuleProvider } from './_components/module-context';

export default function MasterModulePage() {
    return (
        <FormProvider<IMasterModule>>
            <MasterModulePageContent />
        </FormProvider>
    );
}

function MasterModulePageContent() {
    const { openAddForm } = useFormContext<IMasterModule>();
    const [data, setData] = useState<IMasterModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination State
    // Pagination State synced with URL
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
            const res = await getMasterModules(searchParams);
            if (res.success) {
                setData(res.data || []);
                setTotalItems(res.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch master modules', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers for pagination


    return (
        <ModuleProvider refreshData={fetchData}>
            <div className='container space-y-4 p-1'>
                {/* Header with Add Button */}
                <div className='flex gap-4 sm:flex-row sm:items-center sm:justify-self-end'>
                    <Button
                        type='button'
                        onClick={openAddForm}
                        className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Master Module
                    </Button>
                </div>

                <CollapsibleSection
                    title='Master Modules'
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
        </ModuleProvider>
    );
}

function FormSections({ onRefresh }: { onRefresh: () => void }) {
    const { isAddFormOpen, isEditFormOpen, closeAddForm, closeEditForm } = useFormContext<IMasterModule>();

    const closeForm = isEditFormOpen ? closeEditForm : closeAddForm;
    const title = isEditFormOpen ? 'Edit Master Module' : 'Add Master Module';
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
                        <AddMasterModuleForm onSuccess={handleSuccess} />
                    </div>
                </CollapsibleSection>
            )}
        </>
    );
}
