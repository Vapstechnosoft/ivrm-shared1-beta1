'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useExamSubjectWizardDetails } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamSubjectWizard, IExamSubjectWizardDetails } from '@/types/exam/exam-module/exam-mapping';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ToggleExamSubjectWizardDetailsForm from './details-toggle-form';
import { ExamSubjectWizardDetailsColumns } from './exam-subject-wizard-details-columns';
import SubSubjectSubExamModelView from './subSubject-subExam-view';

interface ExamSubjectWizardDetailsPageProps {
    rowData: IExamSubjectWizard;
    onClose: () => void;
}

export default function ExamSubjectWizardDetailsPage({ rowData, onClose }: ExamSubjectWizardDetailsPageProps) {
    return (
        <FormProvider<IExamSubjectWizardDetails>>
            <ExamSubjectWizardDetailsPageContent rowData={rowData} onClose={onClose} />
        </FormProvider>
    );
}

function ExamSubjectWizardDetailsPageContent({
    rowData,
    onClose
}: {
    rowData: IExamSubjectWizard;
    onClose: () => void;
}) {
    const [details, setDetails] = useState<IExamSubjectWizardDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: response, isLoading, error, refetchAll } = useExamSubjectWizardDetails(rowData?.eycE_Id);
    useEffect(() => {
        refetchAll();
    }, [rowData]);
    // -------------------------
    // Set Details When API Responds
    // -------------------------
    useEffect(() => {
        if (!rowData?.eycE_Id) return;
        if (!response) return;

        try {
            const apiResponse = response as unknown as {
                success: boolean;
                message: string;
                data: IExamSubjectWizardDetails[];
            };

            const data = apiResponse?.data || [];
            setDetails(data);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to parse Exam Subject Wizard details');
        }
    }, [rowData?.eycE_Id, response]);

    // -------------------------
    // Data table setup
    // -------------------------
    const tableProps = useDataTableProps({
        data: details,
        total: details.length,
        pageIndex: 0,
        pageSize: 10
    });

    // -------------------------
    // Render
    // -------------------------
    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
            <div className='relative mx-auto w-[80%] rounded-2xl bg-white p-6 shadow-xl'>
                {/* Header */}
                <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title={`Exam Subject Wizard ${rowData.emE_ExamName ? `- ${rowData.emE_ExamName}` : ''}`}
                            description={`View all subject mappings for "${rowData.emE_ExamName}"`}
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
                <GenericDataTable<IExamSubjectWizardDetails>
                    {...tableProps}
                    columns={ExamSubjectWizardDetailsColumns}
                    isLoading={isLoading}
                    noDataTitle='No Subjects Found'
                    noDataDescription='No subjects are mapped for this exam.'
                    errorTitle='Error Loading Details'
                    showViewOptions={false}
                    columnPinning={{ right: ['mapping', 'actions'] }}
                />

                <FormSections />
            </div>
        </div>
    );
}

export function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm, isMappedviewOpen, closeMappedview } =
        useFormContext<IExamSubjectWizardDetails>();

    return (
        <>
            {/* Toggle Form */}
            {isToggleFormOpen && selectedRow && <ToggleExamSubjectWizardDetailsForm rowData={selectedRow} onClose={closeToggleForm} />}

            {/* Mapped View */}
            {isMappedviewOpen && selectedRow && <SubSubjectSubExamModelView rowData={selectedRow} onClose={closeMappedview} />}
        </>
    );
}
