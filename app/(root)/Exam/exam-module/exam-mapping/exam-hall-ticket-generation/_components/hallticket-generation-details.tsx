'use client';

import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { FormProvider } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { updateHallTicketPublishStatus } from '@/server/exam/exam-module/exam-mapping/hallTicket-generation';

import { usegetHallTicketStudentList } from '@/hooks/exam/exammodule/exam-mapping';
import type { IHallTicketGeneratedItem } from '@/types/exam/exam-module/exam-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HallTicketGeneratedDetailsPageColumns } from './hallticket-generation-details-columns';

interface Props {
    rowData: IHallTicketGeneratedItem; // parent row data (year/class/section/exam info)
    onClose: () => void;
}

export default function HallTicketGeneratedDetailsPage({ rowData, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const {
        data: studentsData,
        isLoading: studentsLoading,
        error: studentsError,
        refetchAll
    } = usegetHallTicketStudentList({
        // MI_Id: 30,
        ASMAY_Id: rowData.asmaY_Id,
        ASMCL_Id: rowData.asmcL_Id,
        ASMS_Id: rowData.asmS_Id,
        EME_Id: rowData.emE_Id
    });

    useEffect(() => {
        if (!rowData) return;

        refetchAll();
    }, [rowData.asmaY_Id, rowData.asmcL_Id, rowData.asmS_Id, rowData.emE_Id]);

    const tableProps = useDataTableProps(studentsData);

    // ---- UPDATE BUTTON HANDLER ----
    async function handleUpdate() {
        setIsSubmitting(true);
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one student');
            return;
        }

        // shape payload
        const payload = selectedRows.map((s) => ({
            amsT_Id: s.amsT_Id,
            ehT_Id: s.ehT_Id
        }));

        const res = await updateHallTicketPublishStatus(payload);

        if (res.success) {
            toast.success(res.message);
            refetchAll();
        } else {
            toast.error(res.message || 'Update failed');
        }
        setIsSubmitting(false);
    }

    return (
        <FormProvider>
            <div className='fixed inset-0 z-50 flex min-h-screen items-start justify-center bg-black/40 pt-[5vh]'>
                <div className='relative mx-auto max-h-[90vh] w-[88%] overflow-y-auto rounded-xl bg-white p-6 shadow-xl'>
                    {/* HEADING */}
                    <Heading
                        title={`STUDENT DETAILS : ${rowData.asmaY_Year} / ${rowData.asmcL_ClassName} / ${rowData.asmC_SectionName} / ${rowData.emE_ExamName}`}
                        description=''
                    />

                    {/* DATA TABLE */}
                    <div className='mt-4'>
                        <GenericDataTable
                            {...tableProps}
                            columns={HallTicketGeneratedDetailsPageColumns}
                            isLoading={studentsLoading}
                            showViewOptions={false}
                            onRowSelectionChange={(rows) => {
                                setSelectedRows(rows);
                            }}
                            noDataTitle='No Students'
                            noDataDescription='No students found for this exam and class.'
                        />
                    </div>

                    {/* BOTTOM BUTTONS */}
                    <div className='flex w-fit justify-center gap-4 border-t pt-4'>
                        <Button onClick={handleUpdate} className='px-6 py-2 text-white'>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>

                        <Button variant='outline' onClick={onClose} className='px-6 py-2'>
                            CLOSE
                        </Button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}
