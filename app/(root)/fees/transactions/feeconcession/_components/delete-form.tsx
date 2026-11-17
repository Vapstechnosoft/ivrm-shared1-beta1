'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { deleteFeeConcession } from '@/server/fees/trasactions/FeeConcession';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type DeleteFormFields = {
    fsC_Id: number;
};

interface DeleteFeeConcessionFormProps {
    rowData: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteFeeConcessionForm({ rowData, onClose, onSuccess }: DeleteFeeConcessionFormProps) {
    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useForm<DeleteFormFields>({
        resolver: zodResolver(
            z.object({
                fsC_Id: z.number().optional()
            })
        )
    });

    const closeDialog = () => {
        reset();
        onClose();
    };

    const onSubmit = async () => {
        try {
            const fsC_Id = rowData.fsC_Id;
            const response = await deleteFeeConcession(fsC_Id);

            if (response.success) {
                toast.success(response.message || 'Concession deleted successfully');
                onSuccess();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to delete');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const studentName = [rowData.studentName].filter(Boolean).join(' ');

    return (
        <AdaptiveDialog title='Delete Opening Balance' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to delete the Fee concession for <strong>{studentName || 'this student'}</strong>?
                    </p>
                    <p className='text-muted-foreground text-sm'>
                        This action <strong>cannot be undone</strong>.
                    </p>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='destructive' isLoading={isSubmitting}>
                        Delete Permanently
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
