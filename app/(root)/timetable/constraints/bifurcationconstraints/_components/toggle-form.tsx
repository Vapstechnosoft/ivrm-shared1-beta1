'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { deleteBifurcationConstraintsDetail } from '@/server/timetable/constraints/bifurcationconstraints'; // Uses deletedetails endpoint
import { toast } from 'sonner';

interface ToggleFormProps {
    rowData: any;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleBifurcationConstraints({ rowData, onClose, onSuccess }: ToggleFormProps) {
    const isActive = rowData.ttB_ActiveFlag;
    const action = isActive ? 'Deactivate' : 'Activate';

    const handleConfirm = async () => {
        try {
            const res = await deleteBifurcationConstraintsDetail(rowData.ttB_Id);
            // Legacy response parsing
            // Check promise.returnMsg === "true"
            if (res.returnMsg === 'true' || res.returnMsg === true) {
                toast.success(`Record ${action}d Successfully`);
                onSuccess?.(); // Trigger refresh
                // window.location.reload(); // Handled by onSuccess usually
            } else {
                toast.error(`Failed to ${action} record`);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            onClose();
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>Do you want to {action} this record?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
                        Yes, {action} it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
