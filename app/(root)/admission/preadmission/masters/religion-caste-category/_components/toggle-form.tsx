'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterReligionCasteCategory } from '@/hooks/admission/preadmission/useMasters';
import { masterReligionCasteCategorySchema } from '@/schemas/admission/preadmission/masters';
import { toggleMasterReligionCasteCategory } from '@/server/admission/preadmission/masters/religion_caste_category';
import type { IMasterReligionCasteCategoryList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterReligionCasteCategorySchema.delete>;

interface ToggleMasterClassCategoryFormProps {
    rowData: IMasterReligionCasteCategoryList;
    onClose: () => void;
}

export default function ToggleMasterClassCategoryForm({ rowData, onClose }: ToggleMasterClassCategoryFormProps) {
    const { refetchAll } = useMasterReligionCasteCategory();
    const isActive = rowData.ircC_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterReligionCasteCategorySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterReligionCasteCategory(Number(rowData.ircC_Id));

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
        <AdaptiveDialog title='Toggle Master Class Category Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ircC_Id')} defaultValue={rowData.ircC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>
                            {rowData.ivrmmR_Name} - {rowData.imcC_CategoryName}
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.ircC_Id?.message}</FormError>
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
