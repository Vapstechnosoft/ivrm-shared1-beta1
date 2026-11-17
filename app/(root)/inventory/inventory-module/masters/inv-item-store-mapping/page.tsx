
'use client';

import { Suspense, use, useState } from 'react';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useInvItemStoreMapping } from '@/hooks/inventory/masters/use-inv-item-store-mapping';
import { Plus, X, ListChecks } from 'lucide-react';
import AddInvItemStoreMappingForm from './_components/add-form';
import { invItemStoreMappingColumns } from './_components/columns';
import type { IInvItemStoreMapping } from '@/types/inventory/masters/inv-item-store-mapping';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function InvItemStoreMappingPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useInvItemStoreMapping(searchParams);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    const tableProps = useDataTableProps(response?.data?.get_mapped_items || [], {
        dataKey: 'get_mapped_items'
    });

    return (
        <div className='min-h-screen bg-slate-50/50 dark:bg-slate-950/50'>
            <div className='container space-y-6 p-6 mx-auto max-w-[1600px]'>
                <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border'>
                    <Heading
                        title='Item Store Mapping'
                        description='Manage associations between items and stores'
                    />
                    <Button
                        type='button'
                        onClick={() => setIsAddFormOpen(true)}
                        className='w-fit shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90'
                        disabled={isAddFormOpen}
                    >
                        <Plus className='h-4 w-4 mr-2' />
                        New Mapping
                    </Button>
                </div>

                {isAddFormOpen && (
                    <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
                        <div className='relative'>
                            <Button
                                type='button'
                                onClick={() => setIsAddFormOpen(false)}
                                variant='ghost'
                                size='sm'
                                className='absolute top-3 right-3 z-10 hover:bg-destructive/10 text-destructive rounded-full h-8 w-8 p-0'>
                                <X className='h-4 w-4' />
                            </Button>
                            <AddInvItemStoreMappingForm
                                response={response}
                                onSuccess={() => setIsAddFormOpen(false)}
                            />
                        </div>
                    </div>
                )}

                <CollapsibleSection
                    title={
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-primary" />
                            <span>Mapped Items</span>
                        </div>
                    }
                    defaultOpen={true}
                    variant='default'
                    className='shadow-lg border-none bg-white dark:bg-slate-900'>
                    <div className="p-1">
                        <GenericDataTable<IInvItemStoreMapping>
                            {...tableProps}
                            data={response?.data?.get_mapped_items || []}
                            columns={invItemStoreMappingColumns}
                            isLoading={isLoading}
                            error={error}
                            loadingMessage='Retrieving mapped items...'
                            noDataTitle='No Mappings Found'
                            noDataDescription='Create a new mapping to associate items with stores.'
                        />
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
}

