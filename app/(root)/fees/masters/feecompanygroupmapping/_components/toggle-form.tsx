'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useFeeCompanyGroupMapping } from '@/hooks/fees/useMasters';
import { feeCompanyGroupMappingSchema } from '@/schemas/fees/masters';
import { toggleFeeCompanyGroup } from '@/server/fees/masters/fee_companygroupmapping';
import type { IfeeCompanyGroupMappingList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feeCompanyGroupMappingSchema.delete>;

interface ToggleFeeCompanyGroupFormProps {
    rowData: IfeeCompanyGroupMappingList;
    onClose: () => void;
}

export default function ToggleFeeCompanyGroupForm({ rowData, onClose }: ToggleFeeCompanyGroupFormProps) {
    const { refetchAll } = useFeeCompanyGroupMapping();
    const isActive = rowData.ffgcmA_ActiveId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeCompanyGroupMappingSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleFeeCompanyGroup(Number(rowData.ffgcmA_Id));

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ffgcmA_Id')} defaultValue={rowData.ffgcmA_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>{/* {rowData.ffgcmA_Id} */} selected Data</strong>?
                    </p>
                    <FormError>{errors.ffgcmA_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive ? 'destructive' : 'default'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
