'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useEventsStudentMapping } from '@/hooks/sports/useEventsStudentMapping';
import { eventsStudentMappingColumns } from './_components/columns';
import EventsStudentMappingForm from './_components/mapping-form';

import { IEventsStudentMappingData } from '@/types/sports/events-student-mapping';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function EventsStudentMappingPage() {
    // This form context is just for providing the "openAddForm" methods if needed, 
    // but here we might manage state locally since the "Add" mode is quite distinct.
    const methods = useForm();
    const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);

    const { gridData } = useEventsStudentMapping();
    const tableProps = useDataTableProps(gridData.data || {});

    const handleCloseForm = () => {
        setIsAddFormOpen(false);
    };

    return (
        <FormProvider {...methods}>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    {/* Header Action */}
                    <div className='flex justify-end'>
                        {!isAddFormOpen && (
                            <Button
                                type='button'
                                onClick={() => setIsAddFormOpen(true)}
                                className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                                <Plus className='h-4 w-4' />
                                Add Mapping
                            </Button>
                        )}
                    </div>

                    {/* Add Form Section */}
                    {isAddFormOpen && (
                        <div className='relative mb-8'>
                            <CollapsibleSection
                                title='Events Student Mapping'
                                defaultOpen={true}
                                variant='default'
                                className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                                <div className='relative'>
                                    <Button
                                        type='button'
                                        onClick={handleCloseForm}
                                        variant='ghost'
                                        size='sm'
                                        className='-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                        <X className='h-4 w-4 text-destructive' /> Close
                                    </Button>
                                    <EventsStudentMappingForm onSuccess={handleCloseForm} />
                                </div>
                            </CollapsibleSection>
                        </div>
                    )}

                    {/* Data Table Section */}
                    <CollapsibleSection
                        title='Events Student Mapping List'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <GenericDataTable<IEventsStudentMappingData>
                            {...tableProps}
                            columns={eventsStudentMappingColumns}
                            isLoading={gridData.isLoading}
                            error={gridData.error}
                            showViewOptions={false}
                            columnPinning={{ right: ['actions'] }}
                            loadingMessage='Loading mapping details...'
                            noDataTitle='No Mapping Found'
                            noDataDescription='Get started by creating your first student mapping'
                            errorTitle='Error Loading Mapping'
                        />
                    </CollapsibleSection>
                </div>
            </div>
        </FormProvider>
    );
}
