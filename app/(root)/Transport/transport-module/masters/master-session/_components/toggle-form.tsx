'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterSession } from '@/hooks/transport/transportmodule/usemasters';
import { activeDeactiveSession } from '@/server/transport/transport-module/masters/master-session';
import type { IMasterSession } from '@/types/transport/transport-module/masters';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ToggleSessionForm({
    rowData,
    onClose
}: {
    rowData: IMasterSession;
    onClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useMasterSession();
    const isActive = rowData.trmS_ActiveFlg;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await activeDeactiveSession(rowData.trmS_Id);

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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.trmS_SessionName}</strong>?
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
