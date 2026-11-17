'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import { usePromotionalGroupMappedExams } from '@/hooks/exam/exammodule/exam-mapping';
import type { IPromotionalGroupDetails, IPromotionalGroupMappedExamDetails } from '@/types/exam/exam-module/exam-mapping';
import { PromotionalGroupMappedExamColumns } from './promotional-group-mapped-exams-columns';
import TogglePromotionalGroupMappedExamForm from './promotional-group-mapped-exams-toggle';

export default function PromotionalGroupMappedExamsPage({
    rowData,
    onClose
}: {
    rowData: IPromotionalGroupDetails;
    onClose: () => void;
}) {
    return (
        <FormProvider<IPromotionalGroupMappedExamDetails>>
            <MappedExamsContent rowData={rowData} onClose={onClose} />
        </FormProvider>
    );
}

/* ==========================================================
   PAGE CONTENT
========================================================== */
function MappedExamsContent({
    rowData,
    onClose
}: {
    rowData: IPromotionalGroupDetails;
    onClose: () => void;
}) {
    const { data: response, isLoading, refetchAll } = usePromotionalGroupMappedExams(rowData.empsG_Id);

    useEffect(() => {
        console.log(response);
        refetchAll();
    }, [rowData, response]);

    const tableProps = useDataTableProps(response);

    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
            <div className='w-[80%] rounded-2xl bg-white p-6 shadow-xl'>
                <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title={`Mapped Exams - ${rowData.empsG_GroupName}`}
                            description='List of exams mapped under this promotional group'
                        />
                    </div>

                    <Button
                        type='button'
                        onClick={onClose}
                        variant='ghost'
                        size='sm'
                        className='w-fit border p-2 shadow-md hover:bg-destructive/10'>
                        <X className='h-4 w-4 text-destructive' /> Close
                    </Button>
                </div>

                {/* TABLE */}
                <GenericDataTable
                    {...tableProps}
                    isLoading={isLoading}
                    columns={PromotionalGroupMappedExamColumns}
                    noDataTitle='No Exams Found'
                    showViewOptions={false}
                    columnPinning={{ right: ['actions'] }}
                />

                <MappedExamSections />
            </div>
        </div>
    );
}

/* ==========================================================
   HANDLES TOGGLE / VIEW POPUPS
========================================================== */
function MappedExamSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IPromotionalGroupMappedExamDetails>();

    return (
        <>{isToggleFormOpen && selectedRow && <TogglePromotionalGroupMappedExamForm rowData={selectedRow} onClose={closeToggleForm} />}</>
    );
}
