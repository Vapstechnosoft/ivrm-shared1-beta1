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
import { deactivateInvMasterTax } from '@/server/inventory/masters/inv-master-tax';
import { useInvMasterTax } from '@/hooks/inventory/masters/use-inv-master-tax';
import type { IInvMasterTax } from '@/types/inventory/masters/inv-master-tax';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ToggleInvMasterTaxFormProps {
    rowData: IInvMasterTax;
    onClose: () => void;
}

export default function ToggleInvMasterTaxForm({ rowData, onClose }: ToggleInvMasterTaxFormProps) {
    const { refetchAll } = useInvMasterTax();

    const handleToggle = useCallback(async () => {
        try {
            const result = await deactivateInvMasterTax(rowData);
            // API returns { success: true, message: "Status updated successfully" }
            if (result.success || result.returnval) {
                toast.success(result.message || 'Record status updated successfully');
                refetchAll(); // call the hook's refetch function
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
                        {rowData.invmT_ActiveFlg ? 'Deactivate Record' : 'Activate Record'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {rowData.invmT_ActiveFlg ? 'deactivate' : 'activate'} this tax record?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="secondary">Cancel</Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant={rowData.invmT_ActiveFlg ? 'destructive' : 'default'}
                            onClick={handleToggle}
                        >
                            Yes, {rowData.invmT_ActiveFlg ? 'Deactivate' : 'Activate'} it
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
