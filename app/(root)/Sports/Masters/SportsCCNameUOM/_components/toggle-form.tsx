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
import { deactivateMasterSportsCCNameUOM } from '@/server/sports/masters/sports-cc-name-uom';
import type { IMasterSportsCCNameUOM } from '@/types/sports/masters/sports-cc-name-uom';
import { toast } from 'sonner';

interface ToggleMasterSportsCCNameUOMFormProps {
    rowData: IMasterSportsCCNameUOM;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterSportsCCNameUOMForm({
    rowData,
    onClose,
    onSuccess
}: ToggleMasterSportsCCNameUOMFormProps) {
    const isActive = rowData.spccmsccuoM_ActiveFlag;

    const handleConfirm = async () => {
        try {
            const payload = {
                ...rowData,
                spccmsccuoM_ActiveFlag: !isActive
            }
            const response = await deactivateMasterSportsCCNameUOM(payload);

            if (response?.success || response?.returnVal || response?.retval === true) {
                toast.success(response.message || `Record ${isActive ? 'deactivated' : 'activated'} successfully`);
                onSuccess();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} record`);
            }
            onClose();
        } catch (error) {
            toast.error('An unexpected error occurred');
            onClose();
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to {isActive ? 'deactivate' : 'activate'} this record?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}
                    >
                        Yes, {isActive ? 'Deactivate' : 'Activate'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
