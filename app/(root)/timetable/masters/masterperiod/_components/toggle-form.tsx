'use client';
import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivatePeriod } from '@/server/timetable/masters/periodallocation';
import type { IMasterPeriodList } from '@/types/timetable/masters/masters';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ToggleMasterPeriodFormProps {
    rowData: IMasterPeriodList;
    onClose: () => void;
}

export default function ToggleMasterPeriodForm({ rowData, onClose }: ToggleMasterPeriodFormProps) {
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const payload = {
                ttmP_Id: rowData.ttmP_Id,
                ttmP_ActiveFlag: rowData.ttmP_ActiveFlag
            };
            return await deactivatePeriod(rowData.ttmP_Id);
        },
        onSuccess: (response) => {
            if (response.returnval) {
                toast.success('Status updated successfully');
                onClose();
            } else {
                toast.error('Failed to update status');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred');
        }
    });

    return (
        <AdaptiveDialog title={rowData.ttmP_ActiveFlag ? 'Deactivate Period' : 'Activate Period'} isOpen={true} onClose={onClose}>
            <div className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>Are you sure you want to {rowData.ttmP_ActiveFlag ? 'deactivate' : 'activate'} this period?</p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button onClick={() => mutate()} isLoading={isPending} variant={rowData.ttmP_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.ttmP_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
