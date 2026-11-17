'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useReligionCategoryMapping } from '@/hooks/hrms/useMasters';
import type { IMasterReligionCategoryMappingList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    ircC_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleReligionCategoryMappingFormProps {
    rowData: IMasterReligionCategoryMappingList;
    onClose: () => void;
}

export default function ToggleReligionCategoryMappingForm({ rowData, onClose }: ToggleReligionCategoryMappingFormProps) {
    const { toggleMutation } = useReligionCategoryMapping();
    const isActive = rowData.ircC_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            ircC_Id: rowData.ircC_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            await toggleMutation.mutateAsync(rowData.ircC_Id);
            toast.success(`Mapping ${!isActive ? 'activated' : 'deactivated'} successfully`);
            closeDialog();
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${!isActive ? 'activate' : 'deactivate'} mapping`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Religion-Category Mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ircC_Id', { valueAsNumber: true })} defaultValue={rowData.ircC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} mapping for{' '}
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
