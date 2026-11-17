'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateMasterSportsCCGroup } from '@/server/sports/masters/sports-cc-group';
import type { IMasterSportsCCGroup } from '@/types/sports/masters/sports-cc-group';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleMasterSportsCCGroupFormProps {
    rowData: IMasterSportsCCGroup;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterSportsCCGroupForm({ rowData, onClose, onSuccess }: ToggleMasterSportsCCGroupFormProps) {
    const isActive = rowData.spccmsccG_ActiveFlag;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onConfirm = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                spccmsccG_Id: rowData.spccmsccG_Id,
                spccmsccG_ActiveFlag: !isActive
            };

            const response = await deactivateMasterSportsCCGroup(payload);

            if (response?.success || response?.returnVal === true || (response?.message && response?.message !== 'activationFailed')) {
                toast.success(response.message || `Record ${isActive ? 'Deactivated' : 'Activated'} Successfully`);
                onSuccess();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update status');
            }
        } catch (error: any) {
            console.error('Toggle error:', error);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Status' isOpen={true} onClose={onClose}>
            <div className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.spccmsccG_SportsCCGroupName}</strong>?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
