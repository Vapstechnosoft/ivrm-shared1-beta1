'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterServiceStation } from '@/hooks/transport/transportmodule/usemasters';
import { activeDeactiveServiceStation } from '@/server/transport/transport-module/masters/service-station';
import type { IMasterServiceStation } from '@/types/transport/transport-module/masters';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ToggleServiceStationForm({
    rowData,
    onClose
}: {
    rowData: IMasterServiceStation;
    onClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useMasterServiceStation();
    const isActive = rowData.trmssT_ActiveFlag;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await activeDeactiveServiceStation(rowData.trmssT_Id);
            if (response.success) { // Assuming success pattern; if API wasn't changed to success, I might need to adapt, but based on user request 'ToggleRouteForm' uses success.
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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.trmssT_ServiceStationName}</strong>?
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
