'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useRouteLocationMapping } from '@/hooks/transport/transportmodule/usetransaction';
import { activeDeactiveRouteLocationMapping } from '@/server/transport/transport-module/transaction/route-location-mapping';
import type { IRouteLocationMapping } from '@/types/transport/transport-module/transaction';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleFormProps {
    rowData: IRouteLocationMapping;
    onClose: () => void;
}

export default function ToggleForm({ rowData, onClose }: ToggleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useRouteLocationMapping();
    const isActive = rowData.trmrL_ActiveFlag;

    const handleToggle = async () => {
        setIsLoading(true);
        try {

            const response = await activeDeactiveRouteLocationMapping(rowData.trmrL_Id);
            console.log("active deactive response", response);

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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} this mapping for <strong>{rowData.routename || rowData.trmR_RouteName}</strong>?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant={isActive ? 'destructive' : 'default'}
                        onClick={handleToggle}
                        disabled={isLoading}
                        isLoading={isLoading}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
