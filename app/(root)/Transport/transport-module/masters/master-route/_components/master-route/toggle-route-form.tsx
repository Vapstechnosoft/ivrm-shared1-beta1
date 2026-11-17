'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterRoute } from '@/hooks/transport/transportmodule/usemasters';
import { activeDeactiveRoute } from '@/server/transport/transport-module/masters/route';
import type { IMasterRoute } from '@/types/transport/transport-module/masters';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ToggleRouteForm({
    rowData,
    onClose
}: {
    rowData: IMasterRoute;
    onClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useMasterRoute();
    const isActive = rowData.trmR_ActiveFlg;

    const handleConfirm = async () => {




        try {
            setIsLoading(true);
            const response = await activeDeactiveRoute(rowData.trmR_Id);

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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.trmR_RouteName}</strong>?
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
