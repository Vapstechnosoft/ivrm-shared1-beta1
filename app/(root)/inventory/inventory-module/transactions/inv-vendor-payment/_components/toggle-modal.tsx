'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useInvVendorPayment } from '@/hooks/inventory/transactions/use-inv-vendor-payment';
import type { InvVendorPayment } from '@/types/inventory/transactions/inv-vendor-payment';

interface ToggleModalProps {
    rowData: InvVendorPayment;
    onClose: () => void;
}

export const ToggleVendorPaymentModal = ({ rowData, onClose }: ToggleModalProps) => {
    const { deactivateMutation } = useInvVendorPayment();

    const handleConfirm = () => {
        deactivateMutation.mutate(rowData.invspT_Id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const action = rowData.invspT_ActiveFlg ? 'Deactivate' : 'Activate';

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to {action} this vendor payment record?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deactivateMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={deactivateMutation.isPending}
                        className={rowData.invspT_ActiveFlg ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}
                    >
                        {deactivateMutation.isPending ? 'Processing...' : `Yes, ${action} it`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
