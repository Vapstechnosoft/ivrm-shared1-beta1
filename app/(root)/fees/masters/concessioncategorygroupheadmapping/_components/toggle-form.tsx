'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useConcessionCategoryGroupHeadmappingdata } from '@/hooks/fees/useMasters';
import { masterConcessionCategorygroupHeadMappingSchema } from '@/schemas/fees/masters';
import { toggleConcessionCategoryGroupHeadMapping } from '@/server/fees/masters/concession_category_head_group_mapping';
import type { IConcessionCategoryGroupHeadMappingList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionCategorygroupHeadMappingSchema.delete>;

interface ToggleFeesConcessionCategoryGroupHeadmappingFormProps {
    rowData: IConcessionCategoryGroupHeadMappingList;
    onClose: () => void;
}

export default function ToggleFeesConcessionCategoryGroupHeadmappingDetails({
    rowData,
    onClose
}: ToggleFeesConcessionCategoryGroupHeadmappingFormProps) {
    const { refetchAll } = useConcessionCategoryGroupHeadmappingdata();
    const isActive = rowData.fmaccG_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionCategorygroupHeadMappingSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleConcessionCategoryGroupHeadMapping(Number(rowData.fmaccG_Id));

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
                    <input type='hidden' {...register('fmaccG_Id')} defaultValue={rowData.fmaccG_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmcC_ConcessionName}</strong>?
                    </p>
                    <FormError>{errors.fmaccG_Id?.message}</FormError>
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
