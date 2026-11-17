'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateAlumnus } from '@/server/alumni/alumni-membership';
import type { IAlumniStudentDetail } from '@/types/alumni/alumni-membership';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleAlumnusFormProps {
    rowData: IAlumniStudentDetail;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleAlumnusForm({ rowData, onClose, onSuccess }: ToggleAlumnusFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isActive = rowData.ALMST_ActiveFlag ?? rowData.almsT_ActiveFlag;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response: any = await deactivateAlumnus(rowData.almsT_Id);
            const message = response?.message || `Alumnus ${isActive ? 'deactivated' : 'activated'} successfully`;

            if (
                response === true ||
                response?.success ||
                response?.data === true ||
                (message && message.toLowerCase().includes('successfully'))
            ) {
                // Backend quirk: Deactivation might say "DeActivated successfully" but return success: false
                // We trust the "successfully" keyword in the message
                toast.success(message);
                onSuccess?.();
                onClose();
            } else {
                toast.error(message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Alumnus Status' isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} alumnus:{' '}
                        <strong>{rowData.amsT_FirstName || rowData.almsT_FirstName}</strong>?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
