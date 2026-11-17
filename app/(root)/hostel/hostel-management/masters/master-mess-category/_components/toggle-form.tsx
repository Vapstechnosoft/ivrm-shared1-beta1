'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterMessCategory } from '@/hooks/hostel/useMasterMessCategory';
import { masterMessCategoryMappingDeleteSchema, IMasterMessCategoryMappingDisplay } from '@/schemas/hostel/mess-category-mapping.schema';
import { deactivateMessCategory } from '@/server/hostel/hostel-management/masters/mess-category';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterMessCategoryMappingDeleteSchema>;

interface ToggleMasterMessCategoryFormProps {
    rowData: IMasterMessCategoryMappingDisplay;
    onClose: () => void;
}

export default function ToggleMasterMessCategoryForm({ rowData, onClose }: ToggleMasterMessCategoryFormProps) {
    const { refetchAll } = useMasterMessCategory();
    const isActive = rowData.hlmmmC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterMessCategoryMappingDeleteSchema),
        defaultValues: {
            hlmmmC_Id: rowData?.hlmmmC_Id?.toString() ?? ''
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const response = await deactivateMessCategory(Number(formData.hlmmmC_Id));
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                reset();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const closeDialog = () => {
        reset();
        onClose();
    };

    return (
        <AdaptiveDialog title='Toggle Mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hlmmmC_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} the mapping between <strong>{rowData.hlmM_Name}</strong> and <strong>{rowData.hlmmC_Name}</strong>?
                    </p>
                    {errors.hlmmmC_Id && <FormError>{errors.hlmmmC_Id.message}</FormError>}
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
