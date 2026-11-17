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
import { deactivateMasterCompetitionCategory } from '@/server/sports/masters/competition-category';
import type { IMasterCompetitionCategory } from '@/types/sports/masters/competition-category';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ToggleMasterCompetitionCategoryFormProps {
    rowData: IMasterCompetitionCategory;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ToggleMasterCompetitionCategoryForm({
    rowData,
    onClose,
    onSuccess
}: ToggleMasterCompetitionCategoryFormProps) {
    const queryClient = useQueryClient();
    const isActive = rowData.spccmcC_ActiveFlag;

    const handleConfirm = async () => {
        try {
            const payload = {
                spccmcC_Id: rowData.spccmcC_Id,
                spccmcC_ActiveFlag: rowData.spccmcC_ActiveFlag
            }
            const response = await deactivateMasterCompetitionCategory(payload);

            // Check based on standard API return
            if (response.success || response.returnval === true) {
                toast.success(`Competition Category ${rowData.spccmcC_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                await queryClient.invalidateQueries({ queryKey: ['master-competition-categories'] });
                onSuccess();
                onClose();
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
