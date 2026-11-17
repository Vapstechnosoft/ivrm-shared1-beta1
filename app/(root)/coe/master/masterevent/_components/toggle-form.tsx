'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterEventCoe } from '@/hooks/coe/usemMaster';
import { toggleUploadEvent } from '@/server/coe/masters/masterevent';
import type { MasterEventCoe } from '@/types/coe/masterevent';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleEventFormProps {
    rowData: MasterEventCoe;
    onClose: () => void;
}

export default function ToggleEventForm({ rowData, onClose }: ToggleEventFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useMasterEventCoe();
    const isActive = rowData.coemE_ActiveFlag;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await toggleUploadEvent(rowData.coemE_Id, rowData.coee_Id);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdaptiveDialog title={isActive ? 'Deactivate Record' : 'Activate Record'} isOpen={true} onClose={onClose}>
            <div className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.coemE_EventName}</strong>?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='button' onClick={handleConfirm} isLoading={isLoading} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
