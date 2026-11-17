'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { usePromotionalGroupMappings } from '@/hooks/exam/exammodule/exam-mapping';
import type { IPromotionalGroupDetails, IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import PromotionalGroupMappedExamsPage from './promotional-group-mapped-exams-view';
import { PromotionalGroupMappingColumns } from './promotional-group-mapping-columns';
import PromotionalGroupMappingToggleForm from './promotional-group-mapping-toggle';
export default function PromotionalGroupMappingsDetailsPage({
    rowData,
    onClose
}: {
    rowData: IPromotionalSubjectDetails;
    onClose: () => void;
}) {
    return (
        <FormProvider<IPromotionalGroupDetails>>
            <GroupMappingContent rowData={rowData} onClose={onClose} />
        </FormProvider>
    );
}

function GroupMappingContent({ rowData, onClose }: { rowData: IPromotionalSubjectDetails; onClose: () => void }) {
    const { data: response, isLoading, refetchAll } = usePromotionalGroupMappings(rowData?.empS_Id);

    const tableProps = useDataTableProps(response);
    useEffect(() => {
        console.log(response);
        refetchAll();
    }, [rowData]);

    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
            <div className='w-[80%] rounded-2xl bg-white p-6 shadow-xl'>
                <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title={`Group Mappings - ${rowData?.ismS_SubjectName}`}
                            description='List of groups mapped under this subject'
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

                {/* TABLE */}
                <GenericDataTable
                    {...tableProps}
                    isLoading={isLoading}
                    columns={PromotionalGroupMappingColumns}
                    noDataTitle='No Groups Found'
                    showViewOptions={false}
                    columnPinning={{ right: ['mapping', 'actions'] }}
                />

                <GroupMappingSections promSubjObj={rowData} />
            </div>
        </div>
    );
}

/* ==========================================================
   HANDLES POPUP VIEW + EDIT
========================================================== */
function GroupMappingSections({ promSubjObj }: { promSubjObj: IPromotionalSubjectDetails }) {
    const { isToggleFormOpen, isMappedviewOpen, selectedRow, closeMappedview, closeToggleForm } =
        useFormContext<IPromotionalGroupDetails>();

    return (
        <>
            {isToggleFormOpen && selectedRow && <PromotionalGroupMappingToggleForm rowData={selectedRow} onClose={closeToggleForm} promSubjObj={promSubjObj} />}

            {isMappedviewOpen && selectedRow && <PromotionalGroupMappedExamsPage rowData={selectedRow} onClose={closeMappedview} />}
        </>
    );
}
