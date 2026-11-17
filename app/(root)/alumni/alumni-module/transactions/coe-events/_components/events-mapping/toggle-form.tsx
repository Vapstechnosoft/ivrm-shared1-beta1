'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateEvent } from '@/server/alumni/master-coe';
import type { IEventsMapping } from '@/types/alumni/master-coe';
import type React from 'react';
import { toast } from 'sonner';

interface ToggleEventsMappingFormProps {
    rowData: IEventsMapping;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleEventsMappingForm({ rowData, onClose, onSuccess }: ToggleEventsMappingFormProps) {
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const coeeId = rowData.coeE_Id || (rowData as any).COEE_Id;
            const isActive = rowData.coeE_ActiveFlag || (rowData as any).COEE_ActiveFlag;

            // Use deactivate API for both activation and deactivation as it acts as a toggle
            const res = await deactivateEvent(coeeId);

            const isSuccess = res.success === true || res.returnval === true || res.message?.toLowerCase().includes('successfully');

            if (isSuccess) {
                toast.success(res.message || `Mapping ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else {
                toast.error(res.message || 'Failed to update mapping status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update mapping status');
        }
    };

    return (
        <AdaptiveDialog
            title={`${rowData.coeE_ActiveFlag || (rowData as any).COEE_ActiveFlag ? 'Deactivate' : 'Activate'} Mapping?`}
            isOpen={true}
            onClose={onClose}>
            <form onSubmit={handleConfirm} className='flex flex-col gap-4'>
                <AdaptiveBody>
                    Are you sure you want to {rowData.coeE_ActiveFlag || (rowData as any).COEE_ActiveFlag ? 'deactivate' : 'activate'} the
                    mapping for event &quot;{rowData.coemE_EventName || (rowData as any).COEME_EventName}&quot;?
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' variant={rowData.coeE_ActiveFlag || (rowData as any).COEE_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.coeE_ActiveFlag || (rowData as any).COEE_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
