'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deactivatePeriodTimeSetting } from '@/server/timetable/masters/periodtimesetting';
import type { IPeriodTimeSettingData } from '@/types/timetable/masters/masters';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToggleFormProps {
    rowData: IPeriodTimeSettingData;
    onClose: () => void;
}

export default function TogglePeriodTimeSettingForm({ rowData, onClose }: ToggleFormProps) {
    const mutation = useMutation({
        mutationFn: deactivatePeriodTimeSetting,
        onSuccess: (response) => {
            if (response.returnval) {
                toast.success('Record Status Updated Successfully');
            } else {
                toast.error('Failed to Update Status');
            }
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message || 'An error occurred');
        }
    });

    const handleConfirm = () => {
        mutation.mutate({
            ttmdpT_Id: rowData.ttmdpT_Id,
            ttmdpT_ActiveFlag: rowData.ttmdpT_ActiveFlag
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{rowData.ttmdpT_ActiveFlag ? 'Deactivate' : 'Activate'} Period Time Setting</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {rowData.ttmdpT_ActiveFlag ? 'deactivate' : 'activate'} the time setting for Period{' '}
                        <strong>{rowData.ttmP_PeriodName}</strong> on <strong>{rowData.ttmD_DayName}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant={rowData.ttmdpT_ActiveFlag ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={mutation.isPending}>
                        {mutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {rowData.ttmdpT_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
