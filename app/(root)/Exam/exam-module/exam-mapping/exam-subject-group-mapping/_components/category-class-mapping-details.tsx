'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useExamSubjectGroupMappingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamSubjectGroupMapping, IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ExamSubjectGroupingDetailsColumns } from './subject-group-details-columns';
import ToggleExamSubjectGroupingForm from './toggle-form';

interface ExamSubjectGroupingDetailsPageProps {
    rowData: IExamSubjectGroupMapping;
    onClose: () => void;
}

export default function ExamSubjectGroupingDetailsPage({ rowData, onClose }: ExamSubjectGroupingDetailsPageProps) {
    const [details, setDetails] = useState<IExamSubjectGroupingDetails[]>([]);
    //  Call hook properly (React hook must be at top level)
    const [loading, setLoading] = useState(true);
    const {
        data: response,
        error,
        refetchAll
    } = useExamSubjectGroupMappingDetails(rowData?.esG_CompulsoryFlag ?? 'N', rowData?.asmaY_Id ?? 0, rowData?.esG_Id ?? 0);
    //  Handle API response
    useEffect(() => {
        refetchAll();
        if (response) {
            if (response.success && Array.isArray(response.data)) {
                setLoading(false);
                setDetails(response.data);
            } else {
                setLoading(false);
                setDetails([]);
                toast.error(response.message || 'No data found');
            }
        }
    }, [response, rowData.asmaY_Id, rowData.esG_Id, rowData.esG_CompulsoryFlag]);

    //  Handle API error
    useEffect(() => {
        if (error) {
            toast.error('Failed to load exam subject grouping details');
        }
    }, [error]);

    const tableProps = useDataTableProps({
        data: details,
        total: details.length,
        pageIndex: 0,
        pageSize: 5
    });

    return (
        <FormProvider<IExamSubjectGroupingDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[75%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header Section */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <Heading title='Exam Subject Grouping Details' description='View and manage subject group mappings' />
                        <Button
                            variant='secondary'
                            onClick={onClose}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            Close
                        </Button>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<IExamSubjectGroupingDetails>
                        {...tableProps}
                        columns={ExamSubjectGroupingDetailsColumns}
                        isLoading={loading}
                        columnPinning={{ right: ['actions'] }}
                        noDataTitle='No Data Found'
                        noDataDescription='No exam subject group mappings available.'
                        errorTitle='Error Loading Data'
                        showViewOptions={false}
                    />

                    <FormSections />
                </div>
            </div>
        </FormProvider>
    );
}

function FormSections() {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IExamSubjectGroupingDetails>();

    return <>{isToggleFormOpen && selectedRow && <ToggleExamSubjectGroupingForm rowData={selectedRow} onClose={closeToggleForm} />}</>;
}
