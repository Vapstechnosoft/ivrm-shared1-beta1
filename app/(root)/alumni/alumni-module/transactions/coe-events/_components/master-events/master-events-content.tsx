'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useFormContext } from '@/components/ui/form/form-provider';
import { getViewRecordsMaster } from '@/server/alumni/master-coe';
import type { IMasterEvent } from '@/types/alumni/master-coe';
import { Plus, X } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import ViewDetailsDialog from '../view-details-dialog';
import MasterEventsForm from './add-update-form';
import { MasterEventsColumns } from './columns';
import ToggleMasterEventForm from './toggle-form';

interface MasterEventsContentProps {
    initialData: any;
    refreshData: () => void;
    isLoading?: boolean;
}

export default function MasterEventsContent({ initialData, refreshData, isLoading = false }: MasterEventsContentProps) {
    const {
        isAddFormOpen,
        isEditFormOpen,
        isToggleFormOpen,
        isMappedviewOpen,
        selectedRow,
        openAddForm,
        closeAddForm,
        closeEditForm,
        closeToggleForm,
        closeMappedview,
        addFormRef,
        editFormRef
    } = useFormContext<IMasterEvent>();

    const [viewLoading, setViewLoading] = useState(false);
    const [viewData, setViewData] = useState<any[]>([]);

    const handleOpenMappedView = useCallback(async (row: IMasterEvent) => {
        const id = row.COEME_Id || (row as any).coemE_Id;
        if (!id) return;
        setViewLoading(true);
        try {
            const res = await getViewRecordsMaster(id);
            const details = (res as any).event_mapping_list || (res as any).view_records || (res as any).data || [];
            setViewData(details);
        } catch (error) {
            console.error('Failed to fetch mapping details');
        } finally {
            setViewLoading(false);
        }
    }, []);

    // Table data extraction logic
    const tableData = (() => {
        const data = initialData?.data || initialData;
        if (Array.isArray(data)) return data;
        return data?.master_eventlist || data?.master_event_list || [];
    })();

    const parameterlist = (() => {
        const data = initialData?.data || initialData;
        return data?.parameterlist || data?.parameter_list || [];
    })();

    return (
        <div className='space-y-6'>
            <div className='flex justify-end'>
                <Button onClick={openAddForm} className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                    <Plus className='mr-2 h-4 w-4' /> Create New Event
                </Button>
            </div>

            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection title='Create New Event' defaultOpen={true}>
                        <div className='relative'>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={closeAddForm}
                                className='-top-12 absolute right-0 text-destructive hover:bg-destructive/10'>
                                <X className='mr-2 h-4 w-4' /> Close
                            </Button>
                            <MasterEventsForm
                                parameterlist={parameterlist}
                                onSuccess={() => {
                                    refreshData();
                                    closeAddForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isEditFormOpen && selectedRow && (
                <div ref={editFormRef}>
                    <CollapsibleSection title='Edit Event' defaultOpen={true}>
                        <div className='relative'>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={closeEditForm}
                                className='-top-12 absolute right-0 text-destructive hover:bg-destructive/10'>
                                <X className='mr-2 h-4 w-4' /> Close
                            </Button>
                            <MasterEventsForm
                                parameterlist={parameterlist}
                                editData={selectedRow}
                                onSuccess={() => {
                                    refreshData();
                                    closeEditForm();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            <CollapsibleSection
                title='Master Events List'
                defaultOpen={true}
                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <GenericDataTable
                    columns={MasterEventsColumns}
                    data={tableData}
                    isLoading={isLoading}
                    totalItems={tableData.length}
                    success={!!initialData}
                    columnPinning={{ right: ['actions'] }}
                    loadingMessage='Loading events...'
                    noDataTitle='No Master Events Found'
                    noDataDescription='Create a new event to get started.'
                />
            </CollapsibleSection>

            {isToggleFormOpen && selectedRow && (
                <ToggleMasterEventForm rowData={selectedRow} onClose={closeToggleForm} onSuccess={refreshData} />
            )}

            <ViewDetailsDialog
                isOpen={isMappedviewOpen}
                onClose={closeMappedview}
                title={`Mapped Records for ${selectedRow?.COEME_EventName || selectedRow?.coemE_EventName || 'Event'}`}
                loading={viewLoading}
                data={viewData}
            />

            {/* Effect to handle detail loading when modal opens */}
            <DetailLoader isOpen={isMappedviewOpen} selectedRow={selectedRow} onLoad={handleOpenMappedView} />
        </div>
    );
}

function DetailLoader({ isOpen, selectedRow, onLoad }: { isOpen: boolean; selectedRow: any; onLoad: (row: any) => void }) {
    React.useEffect(() => {
        if (isOpen && selectedRow) {
            onLoad(selectedRow);
        }
    }, [isOpen, selectedRow, onLoad]);
    return null;
}
