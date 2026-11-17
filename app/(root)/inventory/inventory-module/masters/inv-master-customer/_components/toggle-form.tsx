'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useInvMasterCustomer } from '@/hooks/inventory/masters/use-inv-master-customer';
import { AlertTriangle } from 'lucide-react';

interface ToggleCustomerModalProps {
    rowData: any;
    onClose: () => void;
}

export function ToggleCustomerModal({ rowData, onClose }: ToggleCustomerModalProps) {
    const { deleteMutation } = useInvMasterCustomer();
    const isActive = rowData.invmC_ActiveFlg;

    const handleConfirm = () => {
        deleteMutation.mutate(
            { ...rowData, invmC_ActiveFlg: !isActive },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        Confirm Action
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>{rowData.invmC_CustomerName}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant={isActive ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        isLoading={deleteMutation.isPending}
                    >
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
