'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateDetails } from '@/server/lesson-planner/transactions/school-subject-master-topic-mapping';
import type { ISchoolSubjectTopicMapping } from '@/types/lesson-planner/transactions/school-subject-master-topic-mapping';
import type React from 'react';
import { toast } from 'sonner';

interface ToggleSchoolTopicFormProps {
    rowData: ISchoolSubjectTopicMapping;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleSchoolTopicForm({ rowData, onClose, onSuccess }: ToggleSchoolTopicFormProps) {
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res: any = await deactivateDetails(rowData.lpmT_Id, !rowData.lpmT_ActiveFlag);
            const isSuccess = res.success || res.message?.toLowerCase().includes('successfully');

            if (isSuccess) {
                toast.success(res.message || `Record ${rowData.lpmT_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else {
                toast.error(res.message || 'Failed to update record status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update record status');
        }
    };

    return (
        <AdaptiveDialog title={`${rowData.lpmT_ActiveFlag ? 'Deactivate' : 'Activate'} Record?`} isOpen={true} onClose={onClose}>
            <form onSubmit={handleConfirm} className='flex flex-col gap-4'>
                <AdaptiveBody>
                    Are you sure you want to {rowData.lpmT_ActiveFlag ? 'deactivate' : 'activate'} this record for topic "
                    {rowData.lpmT_TopicName}"?
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' variant={rowData.lpmT_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.lpmT_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
