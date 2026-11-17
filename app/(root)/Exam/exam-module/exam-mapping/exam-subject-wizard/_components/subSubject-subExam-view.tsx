'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useEffect, useState } from 'react';

import { useSubExamsMappedList, useSubSubjectsAndSubExamsMappedList, useSubSubjectsMappedList } from '@/hooks/exam/exammodule/exam-mapping';

import type { IExamSubjectWizardDetails, ISubSubjectSubExamMapped } from '@/types/exam/exam-module/exam-mapping';

import { X } from 'lucide-react';
import { SubSubjectModelColumns } from './subSubject-subExam-view-columns';
import ToggleSubSubjectOrSubExamMappedForm from './toggle-mapped-subsub-subexam';

interface SubSubjectModelViewProps {
    rowData: IExamSubjectWizardDetails;
    onClose: () => void;
}

export default function SubSubjectSubExamModelView({ rowData, onClose }: SubSubjectModelViewProps) {
    return (
        <FormProvider<ISubSubjectSubExamMapped>>
            <SubSubjectSubExamModelViewContent rowData={rowData} onClose={onClose} />
        </FormProvider>
    );
}

function SubSubjectSubExamModelViewContent({ rowData, onClose }: SubSubjectModelViewProps) {
    const showSubExam = rowData.eyceS_SubExamFlg;
    const showSubSubject = rowData.eyceS_SubSubjectFlg;

    //  Call hooks
    const subExamsQuery = useSubExamsMappedList(rowData.eyceS_Id);
    const subSubjectsQuery = useSubSubjectsMappedList(rowData.eyceS_Id);
    const bothQuery = useSubSubjectsAndSubExamsMappedList(rowData.eyceS_Id);

    const [details, setDetails] = useState<ISubSubjectSubExamMapped[]>([]);
    const activeHook = showSubExam && showSubSubject ? bothQuery : showSubExam ? subExamsQuery : subSubjectsQuery;

    //  Extract correct refetch
    const refetchAll = activeHook.refetchAll;

    //  Auto-set data when queries update
    useEffect(() => {
        if (!rowData.eyceS_Id) return;

        let active = null;

        if (showSubExam && showSubSubject) {
            active = bothQuery;
        } else if (showSubExam && !showSubSubject) {
            active = subExamsQuery;
        } else if (!showSubExam && showSubSubject) {
            active = subSubjectsQuery;
        }

        if (active?.data?.data) {
            setDetails(active.data.data);
        }
    }, [rowData.eyceS_Id, showSubExam, showSubSubject, subExamsQuery.data, subSubjectsQuery.data, bothQuery.data]);

    const loading = subExamsQuery.isLoading || subSubjectsQuery.isLoading || bothQuery.isLoading;

    const tableProps = useDataTableProps({
        data: details,
        total: details.length,
        pageIndex: 0,
        pageSize: 10
    });

    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
            <div className='relative mx-auto w-[80%] rounded-2xl bg-white p-6 shadow-xl'>
                {/* Header */}
                <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <Heading
                        title={`Mapped ${
                            showSubExam && showSubSubject ? 'Sub-Subjects & Sub-Exams' : showSubExam ? 'Sub-Exams' : 'Sub-Subjects'
                        }`}
                        description={`View all mappings for "${rowData.emE_ExamName}"`}
                    />

                    <Button
                        type='button'
                        onClick={onClose}
                        variant='ghost'
                        size='sm'
                        className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                        <X className='h-4 w-4 text-destructive' /> Close
                    </Button>
                </div>

                {/* Table */}
                <GenericDataTable<ISubSubjectSubExamMapped>
                    {...tableProps}
                    columns={SubSubjectModelColumns(showSubExam, showSubSubject)}
                    isLoading={loading}
                    noDataTitle='No Data Found'
                    noDataDescription='No sub-subjects or sub-exams are mapped for this exam.'
                    errorTitle='Error Loading Data'
                    showViewOptions={false}
                    columnPinning={{ right: ['actions'] }}
                />

                <FormSections rowData={rowData} refetchAll={refetchAll} />
            </div>
        </div>
    );
}

function FormSections({
    rowData,
    refetchAll
}: {
    rowData: any;
    refetchAll: () => void;
}) {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<ISubSubjectSubExamMapped>();

    return (
        <>
            {isToggleFormOpen && selectedRow && (
                <ToggleSubSubjectOrSubExamMappedForm
                    rowData={selectedRow}
                    onClose={closeToggleForm}
                    refetchAll={refetchAll}
                    subsubjectFlag={rowData.eyceS_SubSubjectFlg}
                    subexamFlag={rowData.eyceS_SubExamFlg}
                />
            )}
        </>
    );
}
