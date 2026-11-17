'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterReference } from '@/hooks/admission/preadmission/useMasters';
import { masterReferenceSchema } from '@/schemas/admission/preadmission/masters';
import { deleteMasterReference } from '@/server/admission/preadmission/masters/reference';
import type { IMasterReferenceList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterReferenceSchema.delete>;

interface DeleteMasterReferenceFormProps {
    rowData: IMasterReferenceList;
    onClose: () => void;
}

export default function DeleteMasterReferenceForm({ rowData, onClose }: DeleteMasterReferenceFormProps) {
    const { refetchAll } = useMasterReference();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterReferenceSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteMasterReference(Number(rowData.pamR_Id));

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
        <AdaptiveDialog title='Delete Master Reference' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('pamR_Id')} defaultValue={rowData.pamR_Id} />
                    <p>
                        Are you sure you want to delete <strong>{rowData.pamR_ReferenceName}</strong>?
                    </p>
                    <FormError>{errors.pamR_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={'destructive'}>
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
