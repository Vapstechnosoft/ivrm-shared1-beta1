'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { toggleAlumniGalleryItem } from '@/server/alumni/alumni-gallery';
import type { IAlumniGallery } from '@/types/alumni/alumni-gallery';
import type React from 'react';
import { toast } from 'sonner';

interface ToggleAlumniGalleryFormProps {
    rowData: IAlumniGallery;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleAlumniGalleryForm({ rowData, onClose, onSuccess }: ToggleAlumniGalleryFormProps) {
    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await toggleAlumniGalleryItem(rowData.algA_Id, 0, 0);
            if (res) {
                toast.success(`Record ${rowData.algA_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                onSuccess?.();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update record status');
        }
    };

    return (
        <AdaptiveDialog title={`${rowData.algA_ActiveFlag ? 'Deactivate' : 'Activate'} Record?`} isOpen={true} onClose={onClose}>
            <form onSubmit={handleConfirm} className='flex flex-col gap-4'>
                <AdaptiveBody>
                    Are you sure you want to {rowData.algA_ActiveFlag ? 'deactivate' : 'activate'} "{rowData.algA_GalleryName}"?
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' variant={rowData.algA_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.algA_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
