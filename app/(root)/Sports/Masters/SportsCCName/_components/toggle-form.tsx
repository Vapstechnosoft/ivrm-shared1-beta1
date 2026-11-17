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
import { toast } from 'sonner';
import { deactivateSportsCCName } from '@/server/sports/masters/sports-cc-name';

interface ToggleFormProps {
    id: number;
    activeFlag: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ToggleForm = ({ id, activeFlag, onSuccess, onCancel }: ToggleFormProps) => {
    const handleConfirm = async () => {
        try {
            const result = await deactivateSportsCCName({ spccmscC_Id: id });
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
                onCancel();
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
            onCancel();
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will {activeFlag ? 'deactivate' : 'activate'} the record.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        {activeFlag ? 'Deactivate' : 'Activate'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
