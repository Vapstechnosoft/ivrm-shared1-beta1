'use client';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog';
import { deactivateInvMasterItem } from '@/server/inventory/masters/inv-master-item';
import { useInvMasterItem } from '@/hooks/inventory/masters/use-inv-master-item';
import type { IInvMasterItem } from '@/types/inventory/masters/inv-master-item';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ToggleInvMasterItemFormProps {
    rowData: IInvMasterItem;
    onClose: () => void;
}

export default function ToggleInvMasterItemForm({ rowData, onClose }: ToggleInvMasterItemFormProps) {
    const { refetchAll } = useInvMasterItem();

    const handleToggle = useCallback(async () => {
        try {
            const result = await deactivateInvMasterItem(rowData);
            if (result.success || result.returnval) {
                toast.success(result.message || 'Record status updated successfully');
                refetchAll();
                onClose();
            } else {
                toast.error(result.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    }, [rowData, refetchAll, onClose]);

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {rowData.invmI_ActiveFlg ? 'Deactivate Record' : 'Activate Record'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {rowData.invmI_ActiveFlg ? 'deactivate' : 'activate'} this item record?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="secondary">Cancel</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant={rowData.invmI_ActiveFlg ? 'destructive' : 'default'}
                            onClick={handleToggle}
                        >
                            Yes, {rowData.invmI_ActiveFlg ? 'Deactivate' : 'Activate'} it
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
