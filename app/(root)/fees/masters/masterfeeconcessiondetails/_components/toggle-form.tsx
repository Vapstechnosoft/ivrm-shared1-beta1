'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterConcessionDetails } from '@/hooks/fees/useMasters';
import { masterConcessionDetailsSchema } from '@/schemas/fees/masters';
import { toggleMasterConcessionDetails } from '@/server/fees/masters/masterconcessiondetails';
import type { IMasterConcessionDetailsList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionDetailsSchema.delete>;

interface ToggleFeesConcessionDetailsFormProps {
    rowData: IMasterConcessionDetailsList;
    onClose: () => void;
}

export default function ToggleFeesConcessionDetails({ rowData, onClose }: ToggleFeesConcessionDetailsFormProps) {
    const { refetchAll } = useMasterConcessionDetails();
    const isActive = rowData.fmccD_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionDetailsSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterConcessionDetails(Number(rowData.fmccD_Id), Number(rowData.fmcC_Id));

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
        <AdaptiveDialog title='Toggle Master Fee Head Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmccD_Id')} defaultValue={rowData.fmccD_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmcC_ConcessionName}</strong>?
                    </p>
                    <FormError>{errors.fmccD_Id?.message}</FormError>
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
