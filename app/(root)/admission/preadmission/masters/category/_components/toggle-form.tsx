'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterCategory } from '@/hooks/admission/preadmission/useMasters';
import { masterCategorySchema } from '@/schemas/admission/preadmission/masters';
import { toggleMasterCategory } from '@/server/admission/preadmission/masters/category';
import type { IMasterCategoryList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.delete>;

interface ToggleMasterCategoryFormProps {
    rowData: IMasterCategoryList;
    onClose: () => void;
}

export default function ToggleMasterCategoryForm({ rowData, onClose }: ToggleMasterCategoryFormProps) {
    const { refetchAll } = useMasterCategory();
    const isActive = rowData.amC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCategorySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterCategory(Number(rowData.amC_Id));

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
        <AdaptiveDialog title='Toggle Master Category Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('amC_Id')} defaultValue={rowData.amC_Id} />
                    <p>
                        Are you sure you want to {isActive === 1 ? 'deactivate' : 'activate'} <strong>{rowData.amC_Name}</strong>?
                    </p>
                    <FormError>{errors.amC_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={isActive === 1 ? 'destructive' : 'default'}>
                        {isActive === 1 ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
