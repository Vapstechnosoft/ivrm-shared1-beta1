'use client';
import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useDeleteMasterShift, useMasterShift } from '@/hooks/hrms/attendance-management/useMasters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { MasterShift } from './columns';
interface DeleteMasterShiftFormProps {
    rowData: MasterShift;
    onClose: () => void;
}
export default function DeleteMasterShiftForm({ rowData, onClose }: DeleteMasterShiftFormProps) {
    const { refetchAll } = useMasterShift();
    const { mutate: deleteMasterShift, isPending } = useDeleteMasterShift();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<{ id: number }>({
        resolver: zodResolver(z.object({ id: z.number() })),
        mode: 'onChange'
    });
    function closeDialog() {
        onClose();
        reset();
    }
    const onSubmit: SubmitHandler<{ id: number }> = async () => {
        deleteMasterShift(rowData.id, {
            onSuccess: () => {
                refetchAll();
                closeDialog();
            }
        });
    };
    return (
        <AdaptiveDialog title='Delete Master Shift' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('id')} defaultValue={rowData.id} />
                    <p>
                        Are you sure you want to delete <strong>{rowData.shiftName}</strong>?
                    </p>
                    <FormError>{errors.id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting || isPending} variant={'destructive'}>
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
