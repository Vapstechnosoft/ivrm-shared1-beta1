'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useVehicleRouteMapping } from '@/hooks/transport/transportmodule/usetransaction';
import { activeDeactiveVehicleRouteMapping } from '@/server/transport/transport-module/transaction/vehicle-route-mapping';
import type { IVehicleRouteMapping } from '@/types/transport/transport-module/transaction';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleFormProps {
    rowData: IVehicleRouteMapping;
    onClose: () => void;
}

export default function ToggleForm({ rowData, onClose }: ToggleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { refetchAll } = useVehicleRouteMapping();
    const isActive = rowData.trvR_ActiveFlg;

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await activeDeactiveVehicleRouteMapping(rowData.trvR_Id);

            if (response.success) {
                toast.success(response.message || 'Status Updated Successfully');
                refetchAll();
                onClose();
            } else {
                toast.error(response.message || 'Failed to Update Status');
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
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.trmV_VehicleName}</strong> record?
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
