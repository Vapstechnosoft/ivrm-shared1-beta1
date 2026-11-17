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
import { deactivateInvMasterSupplier } from '@/server/inventory/masters/inv-master-supplier';
import { useInvMasterSupplier } from '@/hooks/inventory/masters/use-inv-master-supplier';
import type { IInvMasterSupplier } from '@/types/inventory/masters/inv-master-supplier';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ToggleInvMasterSupplierFormProps {
    rowData: IInvMasterSupplier;
    onClose: () => void;
}

export default function ToggleInvMasterSupplierForm({ rowData, onClose }: ToggleInvMasterSupplierFormProps) {
    const { refetchAll } = useInvMasterSupplier();

    const handleToggle = useCallback(async () => {
        try {
            const result = await deactivateInvMasterSupplier(rowData);
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
                        {rowData.invmS_ActiveFlg ? 'Deactivate Record' : 'Activate Record'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {rowData.invmS_ActiveFlg ? 'deactivate' : 'activate'} this supplier record?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="secondary">Cancel</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant={rowData.invmS_ActiveFlg ? 'destructive' : 'default'}
                            onClick={handleToggle}
                        >
                            Yes, {rowData.invmS_ActiveFlg ? 'Deactivate' : 'Activate'} it
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
