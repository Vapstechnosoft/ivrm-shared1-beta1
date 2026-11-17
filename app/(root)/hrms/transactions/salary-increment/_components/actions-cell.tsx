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
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteSalaryIncrement } from '@/hooks/hrms/useTransactions';
import type { SalaryIncrementGridItem } from '@/types/hrms/salary-increment';
import type { Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
interface ActionsCellProps {
    row: Row<SalaryIncrementGridItem>;
}
export function ActionsCell({ row }: ActionsCellProps) {
    const { mutate: deleteIncrement, isPending: isDeleting } = useDeleteSalaryIncrement();
    const handleDelete = () => {
        deleteIncrement(row.original.HREIC_Id, {
            onSuccess: () => {
                toast.success('Salary increment deleted successfully!');
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to delete salary increment.');
            }
        });
    };
    return (
        <div className='flex justify-center'>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive'>
                        <span className='sr-only'>Delete</span>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the salary increment for{' '}
                            <strong>{row.original.EmployeeName || 'this employee'}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
