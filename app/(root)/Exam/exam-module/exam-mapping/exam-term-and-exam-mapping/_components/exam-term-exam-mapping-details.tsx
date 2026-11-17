'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { useExamTermAndExamMappingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import type { IExamTermAndExamMapping, IExamTermAndExamMappingDetails } from '@/types/exam/exam-module/exam-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ToggleExamTermAndExamMappingForm from './details-toggle-form';
import { ExamTermAndExamMappingDetailsColumns } from './exam-term-exam-mapping-details-columns';

interface ExamTermAndExamMappingDetailsPageProps {
    rowData: IExamTermAndExamMapping;
    onClose: () => void;
}

export default function ExamTermAndExamMappingDetailsPage({ rowData, onClose }: ExamTermAndExamMappingDetailsPageProps) {
    const [details, setDetails] = useState<IExamTermAndExamMappingDetails[]>([]);
    const {
        data: response,
        error,
        isLoading,
        refetchAll
    } = useExamTermAndExamMappingDetails(rowData?.asmaY_Id ?? 0, rowData?.emcA_Id ?? 0, rowData?.ecT_Id ?? 0);

    useEffect(() => {
        refetchAll();
        if (response) {
            if (response.success && Array.isArray(response.data)) {
                setDetails(response.data);
            } else {
                setDetails([]);
                toast.error(response.message || 'No data found');
            }
        }
    }, [response, rowData.asmaY_Id, rowData.emcA_Id, rowData.ecT_Id]);

    useEffect(() => {
        if (error) {
            toast.error('Failed to load exam term & exam mapping details');
        }
    }, [error]);

    const tableProps = useDataTableProps({
        data: details,
        total: details.length,
        pageIndex: 0,
        pageSize: 5
    });

    return (
        <FormProvider<IExamTermAndExamMappingDetails>>
            <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[10vh]'>
                <div className='relative mx-auto w-[75%] rounded-2xl bg-white p-6 shadow-xl'>
                    {/* Header */}
                    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <Heading title='Exam Term & Exam Mapping Details' description='View and manage term-exam mappings' />
                        <Button
                            variant='secondary'
                            onClick={onClose}
                            className='w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                            Close
                        </Button>
                    </div>

                    {/* Data Table */}
                    <GenericDataTable<IExamTermAndExamMappingDetails>
                        {...tableProps}
                        columns={ExamTermAndExamMappingDetailsColumns}
                        isLoading={isLoading}
                        columnPinning={{ right: ['actions'] }}
                        noDataTitle='No Details Found'
                        noDataDescription='No term-exam mappings available.'
                        errorTitle='Error Loading Data'
                        showViewOptions={false}
                    />

                    {/* Toggle Section */}
                    <FormSections parentRowData={rowData} />
                </div>
            </div>
        </FormProvider>
    );
}

interface FormSectionsProps {
    parentRowData: IExamTermAndExamMapping;
}

function FormSections({ parentRowData }: FormSectionsProps) {
    const { isToggleFormOpen, selectedRow, closeToggleForm } = useFormContext<IExamTermAndExamMappingDetails>();

    return (
        <>
            {isToggleFormOpen && selectedRow && (
                <ToggleExamTermAndExamMappingForm
                    rowData={{
                        ...selectedRow,
                        asmaY_Id: parentRowData.asmaY_Id,
                        emcA_Id: parentRowData.emcA_Id,
                        ecT_TermName: parentRowData.ecT_TermName
                    }}
                    onClose={closeToggleForm}
                />
            )}
        </>
    );
}
