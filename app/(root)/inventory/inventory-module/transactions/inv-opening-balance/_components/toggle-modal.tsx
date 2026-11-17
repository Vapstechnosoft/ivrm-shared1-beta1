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
import { useInvOpeningBalance } from '@/hooks/inventory/transactions/use-inv-opening-balance';
import type { IInvOpeningBalance } from '@/types/inventory/transactions/inv-opening-balance';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ToggleOBModalProps {
    rowData: IInvOpeningBalance;
    onClose: () => void;
}

export function ToggleOBModal({ rowData, onClose }: ToggleOBModalProps) {
    const { toggleActiveMutation } = useInvOpeningBalance();
    const isActive = rowData.invoB_ActiveFlg;

    const handleToggle = useCallback(async () => {
        try {
            const result: any = await toggleActiveMutation.mutateAsync(rowData);
            if (result?.success || result?.returnval) {
                toast.success(result?.message || 'Status updated successfully');
                onClose();
            } else {
                toast.error(result?.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    }, [rowData, toggleActiveMutation, onClose]);

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isActive ? 'Deactivate Record' : 'Activate Record'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} this opening balance record for <strong>{rowData.invmI_ItemName}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="secondary">Cancel</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant={isActive ? 'destructive' : 'default'}
                            onClick={handleToggle}
                        >
                            Yes, {isActive ? 'Deactivate' : 'Activate'} it
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
