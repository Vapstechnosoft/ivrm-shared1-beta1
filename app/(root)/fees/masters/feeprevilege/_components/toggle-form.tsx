'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeePrevilegeList } from '@/hooks/fees/useMasters';
import { feePrivilegeSchema } from '@/schemas/fees/masters';
import { deleteFeePrivilege } from '@/server/fees/masters/fee_previlege';
import type { IFeePrivilegeList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feePrivilegeSchema.delete>;

interface ToggleMasterTermFeeHeadFormProps {
    rowData: IFeePrivilegeList;
    onClose: () => void;
}

export default function ToggleMasterFeePrevilageForm({ rowData, onClose }: ToggleMasterTermFeeHeadFormProps) {
    const { refetchAll } = useFeePrevilegeList();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feePrivilegeSchema.delete),
        mode: 'onChange'
    });
    console.log('rowData', rowData);

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteFeePrivilege(Number(rowData.fgL_Id));

            console.log(response);
            if (response?.success) {
                toast.success(response.message || 'Deleted successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete');
            }
        } catch (error: any) {
            toast.error(error.message ?? 'Failed to delete');
        }
    };

    return (
        <AdaptiveDialog title='Delete Fee Previlige' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fgL_Id')} defaultValue={rowData.fgL_Id} />
                    <p>
                        Are you sure you want to <strong>permanently delete</strong> the selected Row
                    </p>
                    <FormError>{errors.fgL_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
