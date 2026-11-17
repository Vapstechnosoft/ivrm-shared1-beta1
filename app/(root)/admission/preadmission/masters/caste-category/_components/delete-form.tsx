'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterCasteCategory } from '@/hooks/admission/preadmission/useMasters';
import { masterCasteCategorySchema } from '@/schemas/admission/preadmission/masters';
import { deleteCasteCategory } from '@/server/admission/preadmission/masters/caste_category';
import type { IMasterCasteCategoryList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCasteCategorySchema.delete>;

interface DeleteCastCategoryFormProps {
    rowData: IMasterCasteCategoryList;
    onClose: () => void;
}

export default function DeleteMasterCasteCategoryForm({ rowData, onClose }: DeleteCastCategoryFormProps) {
    const { refetchAll } = useMasterCasteCategory();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterCasteCategorySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteCasteCategory(Number(rowData.imcC_Id));

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
        <AdaptiveDialog title='Delete Master Caste Category' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('imcC_Id')} defaultValue={rowData.imcC_Id} />
                    <p>
                        Are you sure you want to delete <strong>{rowData.imcC_CategoryName}</strong>?
                    </p>
                    <FormError>{errors.imcC_Id?.message}</FormError>
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
