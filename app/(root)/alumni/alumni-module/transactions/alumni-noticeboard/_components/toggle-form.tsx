'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deactivateAlumniNoticeBoard } from '@/server/alumni/alumni-notice-board';
import type { IAlumniNoticeBoard } from '@/types/alumni/alumni-notice-board';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleNoticeFormProps {
    rowData: IAlumniNoticeBoard;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleNoticeForm({ rowData, onClose, onSuccess }: ToggleNoticeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isActive = rowData.alntB_ActiveFlag;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response: any = await deactivateAlumniNoticeBoard(rowData.alntB_Id);
            if (response === true || response?.success || response?.data === true) {
                toast.success(`Notice ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Notice Status' isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} notice: <strong>{rowData.alntB_Title}</strong>?
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
