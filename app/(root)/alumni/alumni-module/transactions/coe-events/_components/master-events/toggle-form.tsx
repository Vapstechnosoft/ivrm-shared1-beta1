'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateMasterEvent } from '@/server/alumni/master-coe';
import type { IMasterEvent } from '@/types/alumni/master-coe';
import type React from 'react';
import { toast } from 'sonner';

interface ToggleMasterEventFormProps {
    rowData: IMasterEvent;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleMasterEventForm({ rowData, onClose, onSuccess }: ToggleMasterEventFormProps) {
    const isActive = rowData.COEME_ActiveFlag ?? (rowData as any).coemE_ActiveFlag;
    const eventName = rowData.COEME_EventName || (rowData as any).coemE_EventName;

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const coemeId = rowData.COEME_Id || (rowData as any).coemE_Id;
            // Use deactivate API specifically if deactivating, as requested by user
            // Otherwise fallback to switch1 which might still work for activation
            // Use deactivate API for both activation and deactivation as it acts as a toggle
            const res = await deactivateMasterEvent(coemeId);

            const isSuccess = res.success === true || res.returnval === true || res.message?.toLowerCase().includes('successfully');

            if (isSuccess) {
                toast.success(res.message || `Event ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else {
                toast.error(res.message || 'Failed to update event status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update event status');
        }
    };

    return (
        <AdaptiveDialog title={`${isActive ? 'Deactivate' : 'Activate'} Event?`} isOpen={true} onClose={onClose}>
            <form onSubmit={handleConfirm} className='flex flex-col gap-4'>
                <AdaptiveBody>
                    Are you sure you want to {isActive ? 'deactivate' : 'activate'} the event &quot;{eventName}&quot;?
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
