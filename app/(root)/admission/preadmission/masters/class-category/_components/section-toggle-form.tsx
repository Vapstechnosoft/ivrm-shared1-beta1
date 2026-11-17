'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterClassCategory } from '@/hooks/admission/preadmission/useMasters';
import { masterClassCategorySchema } from '@/schemas/admission/preadmission/masters';
import { toggleMasterClassCategorySection } from '@/server/admission/preadmission/masters/class_category';
import type { IMasterClassCategorySectionList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassCategorySchema.delete>;

interface ToggleMasterClassCategorySectionFormProps {
    SectionRow: IMasterClassCategorySectionList;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ToggleMasterClassCategorySectionForm({
    SectionRow,
    onClose,
    onSuccess
}: ToggleMasterClassCategorySectionFormProps) {
    const { refetchAll } = useMasterClassCategory();
    const isActive = SectionRow.asmccS_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassCategorySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterClassCategorySection(Number(SectionRow.asmccS_Id));

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                if (onSuccess) onSuccess();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Category Class Section' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('asmcC_Id')} defaultValue={SectionRow.asmcC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <strong>
                            {SectionRow.amC_Name} - {SectionRow.asmcL_ClassName} - {SectionRow.asmC_SectionName}
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.asmcC_Id?.message}</FormError>
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
