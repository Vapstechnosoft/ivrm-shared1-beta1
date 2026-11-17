'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterPublisherList } from '@/hooks/library/useMasters';
import { masterPublisherSchema } from '@/schemas/library/masters';
import { toggleMasterPublisher } from '@/server/library/masters/master_publisher';
import type { IMasterPublisherList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterPublisherSchema.delete>;

interface toggleMasterPublisherFormProps {
    rowData: IMasterPublisherList;
    onClose: () => void;
}

export default function ToggleMasterPublisherForm({ rowData, onClose }: toggleMasterPublisherFormProps) {
    const { refetchAll } = useMasterPublisherList();
    const isActive = rowData.lmP_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterPublisherSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            console.log('Toggling Master Publisher with ID:', rowData.lmP_Id);
            const response = await toggleMasterPublisher(Number(rowData.lmP_Id));

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
        <AdaptiveDialog title='Toggle Library Publisher' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lmP_Id')} defaultValue={rowData.lmP_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmP_PublisherName}</strong>?
                    </p>
                    <FormError>{errors.lmP_Id?.message}</FormError>
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
