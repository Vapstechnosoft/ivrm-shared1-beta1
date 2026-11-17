'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { useEventsSponsor } from '@/hooks/sports/useEventsSponsor';
import type { IEventSponsorMapping } from '@/types/sports/transactions/events-sponsor';
import { Plus, X, Loader2 } from 'lucide-react';
import AddEventSponsorMappingForm from './_components/add-form';
import { eventSponsorColumns } from './_components/columns';
import UpdateEventSponsorMappingForm from './_components/update-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventsSponsorMappingPage() {
    return (
        <FormProvider<IEventSponsorMapping>>
            <EventsSponsorMappingPageContent />
        </FormProvider>
    );
}

function EventsSponsorMappingPageContent() {
    const { details } = useEventsSponsor();
    const {
        openAddForm,
        isAddFormOpen,
        isEditFormOpen,
        selectedRow,
        closeAddForm,
        closeEditForm,
        addFormRef,
        editFormRef
    } = useFormContext<IEventSponsorMapping>();

    const gridData = details.data?.data?.sponsormappingList || [];
    const tableProps = useDataTableProps({ ...details.data, data: gridData });

    return (
        <div className='container mx-auto space-y-6 p-4'>
            {/* Action Header */}
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold tracking-tight'>Events Sponsor Mapping</h1>
                <Button
                    type='button'
                    onClick={openAddForm}
                    disabled={isAddFormOpen}
                    className='shadow-md transition-all duration-200 hover:scale-105 active:scale-95'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New Mapping
                </Button>
            </div>

            {/* Add Form Section */}
            {isAddFormOpen && (
                <div ref={addFormRef} className='animate-in fade-in slide-in-from-top-4 duration-300'>
                    <Card className='border-primary/20 shadow-lg'>
                        <CardHeader className='flex flex-row items-center justify-between bg-primary/5 pb-2'>
                            <CardTitle className='text-lg font-semibold'>Add Events Sponsor Mapping</CardTitle>
                            <Button
                                type='button'
                                onClick={closeAddForm}
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive'>
                                <X className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <AddEventSponsorMappingForm onSuccess={closeAddForm} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Form Section */}
            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef} className='animate-in fade-in slide-in-from-top-4 duration-300'>
                    <Card className='border-primary/20 shadow-lg'>
                        <CardHeader className='flex flex-row items-center justify-between bg-primary/5 pb-2'>
                            <CardTitle className='text-lg font-semibold'>Edit Events Sponsor Mapping</CardTitle>
                            <Button
                                type='button'
                                onClick={closeEditForm}
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive'>
                                <X className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <UpdateEventSponsorMappingForm selectedRow={selectedRow} onSuccess={closeEditForm} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Data Table Section */}
            <Card className='shadow-md'>
                <CardHeader className='border-b bg-muted/30 pb-3'>
                    <CardTitle className='text-lg font-medium'>Mapping Records</CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    <GenericDataTable<IEventSponsorMapping>
                        {...tableProps}
                        columns={eventSponsorColumns}
                        isLoading={details.isLoading}
                        error={details.error}
                        showViewOptions={false}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Fetching mapping details...'
                        noDataTitle='No Mapping records'
                        noDataDescription='No sponsor mappings found for the events.'
                        errorTitle='Error loading mappings'
                    />
                </CardContent>
            </Card>
        </div>
    );
}
