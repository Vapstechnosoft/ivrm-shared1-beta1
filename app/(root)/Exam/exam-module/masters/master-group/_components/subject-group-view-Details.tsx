'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useMasterSubjectGroupDetails } from '@/hooks/exam/exammodule/usemasters';
import type { IMasterSubjectGroup, IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';
import { X } from 'lucide-react';
import { MasterSubjectGroupDetailsViewColumns } from './subject-group-view-details-columns';

interface MasterSubjectGroupDetailsPageProps {
    rowData: IMasterSubjectGroup;
    onClose: () => void;
}

export default function MasterSubjectGroupDetailsPage({ rowData, onClose }: MasterSubjectGroupDetailsPageProps) {
    const groupId = rowData?.emG_Id;

    // Fetch group details
    const { data: response, isLoading, error } = useMasterSubjectGroupDetails(groupId);
    const tableProps = useDataTableProps(response);

    return (
        <FormProvider<IMasterSubjectGroup>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                {/* Popup Container */}
                <div className='relative mx-auto w-[70%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-1'>
                            <Heading
                                title={`Subject Group Details - ${rowData.emG_GroupName ?? ''}`}
                                description='Detailed view of grade configuration and marks distribution'
                            />
                        </div>
                        <div className='flex gap-2'>

                            <Button
                                type='button'
                                onClick={onClose}
                                variant='ghost'
                                size='sm'
                                className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                                <X className='h-4 w-4 text-destructive' /> Close
                            </Button>
                        </div>
                    </div>

                    {/* Subject Details Table */}
                    <GenericDataTable<IMasterSubjectGroupDetails>
                        {...tableProps}
                        columns={MasterSubjectGroupDetailsViewColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: [] }}
                        loadingMessage='Loading subject group details...'
                        noDataTitle='No Subjects Found'
                        noDataDescription='No subjects available for this group.'
                        errorTitle='Error Loading Subject Details'
                        showViewOptions={false}
                    />
                </div>
            </div>
        </FormProvider>
    );
}
