'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterCoeInitialData } from '@/hooks/coe/usemMaster';
import { toggleMappedEvent } from '@/server/coe/masters/masterevent';


import type { MappedEventCoe } from '@/types/coe/master-coe';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleFormProps {
    rowData: MappedEventCoe;
    onClose: () => void;
}

export default function ToggleForm({ rowData, onClose }: ToggleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetch } = useMasterCoeInitialData();
    const isActive = rowData.coee_ActiveFlag;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            console.log("toggle Data:", rowData);

            const response = await toggleMappedEvent(rowData.coemE_Id, rowData.coeE_Id);

            if (response.success) {
                toast.success(response.message);
                refetch();
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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} the mapped event for <strong>{rowData.coee_MailSubject}</strong>?

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
