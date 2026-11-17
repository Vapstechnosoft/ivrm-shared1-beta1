// app/exam/exam-module/student-marks-publish/_components/student-details.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { FormProvider } from '@/components/ui/form/form-provider';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { StudentsMarksPublish, getStudentWisePublishMarksData } from '@/server/exam/exam-module/marks-entry/student-wise-publish-marks';
import type { IStudentDetails } from '@/types/exam/exam-module/marks-entry';
import { Bell, Mail, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StudentMarksPublishColumns } from './student-details-columns';

interface Props {
    searchParams: any;
    studentData: any[];
    isLoading: boolean;
    onClose: () => void;
    onRefresh: (params: any, data: any[]) => void;
    searchPayload: any;
}

export default function StudentMarksPublishDetails({ searchParams, studentData, isLoading, onClose, onRefresh, searchPayload }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<IStudentDetails[]>([]);
    const [smsFlag, setSmsFlag] = useState(false);
    const [emailFlag, setEmailFlag] = useState(false);
    const [notificationFlag, setNotificationFlag] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const tableProps = useDataTableProps({
        data: studentData,
        isLoading: isLoading || localLoading
    });

    // Handle refresh when search params change
    useEffect(() => {
        if (searchParams) {
            // Optionally refresh data when search params change
        }
    }, [searchParams]);

    // Handle refresh search
    const handleRefresh = async () => {
        if (!searchParams) return;

        setLocalLoading(true);
        try {
            // Simulate API call to refresh data
            const { data: response } = await getStudentWisePublishMarksData(searchPayload);
            const apiStudents = Array.isArray(response) ? response : [];
            onRefresh(searchParams, apiStudents);
        } catch (error: any) {
            toast.error('Failed to refresh data');
        } finally {
            setLocalLoading(false);
        }
    };

    // ---- UPDATE BUTTON HANDLER ----
    async function handleUpdate() {
        setIsSubmitting(true);

        if (selectedRows.length === 0) {
            toast.warning('Please select at least one student');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                emE_Id: searchParams.emE_Id || 0,
                emE_ExamName: searchParams.emE_ExamName || '',
                asmaY_Id: searchParams.asmaY_Id,
                radiotype: searchParams.radiotype,

                // flags
                smsflag: smsFlag,
                emailflag: emailFlag,
                notifyflag: notificationFlag,

                // optional / backend-required
                ismS_SubjectName: searchParams.ismS_SubjectName || '',

                // students list
                selectedstudentslist: selectedRows.map((s) => ({
                    amsT_Id: s.amsT_Id,
                    estmP_Id: s.estmP_Id,
                    amsT_FirstName: s.amsT_FirstName,
                    estmP_PublishToStudentFlg: s.estmP_PublishToStudentFlg
                }))
            };
            console.log('update payload', payload);
            const response = await StudentsMarksPublish(payload);

            if (!response?.success) {
                toast.error(response?.message || 'Update failed');
                return;
            }
            console.log('response', response);
            console.log('selectedRows', selectedRows);
            toast.success(`${selectedRows.length} ${response.message}`);
            handleRefresh();
            // reset UI
            setSelectedRows([]);
            setSmsFlag(false);
            setEmailFlag(false);
            setNotificationFlag(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update records');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <FormProvider>
            <div className='relative w-fit'>
                {/* Close Button - Top Right */}
                <Button type='button' onClick={onClose} variant='ghost' size='sm' className='z-10 flex w-fit'>
                    <X className='mr-2 h-4 w-4' />
                    Close
                </Button>
                <div className='mt-4'>
                    <GenericDataTable
                        {...tableProps}
                        columns={StudentMarksPublishColumns}
                        isLoading={isLoading || localLoading}
                        showViewOptions={false}
                        onRowSelectionChange={(rows) => {
                            setSelectedRows(rows);
                        }}
                        noDataTitle='No Students Found'
                        noDataDescription='No student marks data available for the selected criteria.'
                    />
                </div>

                {/* Communication Options */}
                {selectedRows.length > 0 && (
                    <div className='mt-6 flex justify-center gap-6 border-t pt-6'>
                        <div className='flex items-center space-x-2'>
                            <Checkbox id='sms' checked={smsFlag} onCheckedChange={(checked) => setSmsFlag(checked as boolean)} />
                            <Label htmlFor='sms' className='flex items-center gap-2'>
                                <Send className='h-4 w-4' />
                                SMS
                            </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Checkbox id='email' checked={emailFlag} onCheckedChange={(checked) => setEmailFlag(checked as boolean)} />
                            <Label htmlFor='email' className='flex items-center gap-2'>
                                <Mail className='h-4 w-4' />
                                EMAIL
                            </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Checkbox
                                id='notification'
                                checked={notificationFlag}
                                onCheckedChange={(checked) => setNotificationFlag(checked as boolean)}
                            />
                            <Label htmlFor='notification' className='flex items-center gap-2'>
                                <Bell className='h-4 w-4' />
                                NOTIFICATION
                            </Label>
                        </div>
                    </div>
                )}

                {/* BOTTOM BUTTONS */}
                <div className='mt-6 flex w-fit justify-center gap-4 pt-4'>
                    <Button type='button' variant='outline' size='sm' onClick={handleRefresh} disabled={localLoading}>
                        {localLoading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>

                    <Button onClick={handleUpdate} disabled={isSubmitting || selectedRows.length === 0} className='px-8 py-2'>
                        {isSubmitting ? 'Updating...' : 'UPDATE'}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}
