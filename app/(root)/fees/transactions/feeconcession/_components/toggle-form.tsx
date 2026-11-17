'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { toggleMasterfeeconfig } from '@/server/fees/configuration/feeconfiguration';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleMasterFeesConfigFormProps {
    configId: number; // fmC_Id or asmay_id
    isActive: boolean; // current status
    configName?: string; // optional display name
    onClose: () => void;
    onSuccess?: () => void; // to refetch parent table
}

export default function ToggleMasterFeesConfigForm({
    configId,
    isActive,
    configName = 'this configuration',
    onClose,
    onSuccess
}: ToggleMasterFeesConfigFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggle = async () => {
        if (!configId) {
            toast.error('Invalid configuration ID');
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await toggleMasterfeeconfig(configId);

            if (response.success) {
                toast.success(response.message || `Configuration ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeDialog = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <AdaptiveDialog title='Toggle Configuration Status' isOpen={true} onClose={closeDialog}>
            <div className='flex flex-col gap-6'>
                <AdaptiveBody className='space-y-4'>
                    <p className='text-muted-foreground text-sm'>
                        Are you sure you want to{' '}
                        <strong className={isActive ? 'text-destructive' : 'text-green-600'}>{isActive ? 'deactivate' : 'activate'}</strong>{' '}
                        <span className='font-medium text-foreground'>"{configName}"</span>?
                    </p>
                    <p className='text-muted-foreground text-xs'>
                        This will {isActive ? 'stop' : 'allow'} fee transactions for this academic year configuration.
                    </p>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} disabled={isSubmitting} type='button'>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleToggle}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        variant={isActive ? 'destructive' : 'default'}
                        className='min-w-28'>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
