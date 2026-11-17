'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useYearlyCategorySubjectMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { categorySubjectMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { toggleYearlyCategorySubjectMapping } from '@/server/exam/exam-module/exam-mapping/yearly-category-subject-mapping';
import type { IYearlyCategorySubjectMapping } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof categorySubjectMappingSchema.delete>;

interface ToggleCategorySubjectMappingFormProps {
    rowData: IYearlyCategorySubjectMapping;
    onClose: () => void;
}

export default function ToggleCategorySubjectMappingForm({ rowData, onClose }: ToggleCategorySubjectMappingFormProps) {
    const { refetchAll } = useYearlyCategorySubjectMapping();
    const isActive = rowData.eyC_ActiveFlg; // active flag from mapping table

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(categorySubjectMappingSchema.delete),
        mode: 'onChange'
    });

    const closeDialog = () => {
        onClose();
        reset();
    };

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            if (!rowData.eycG_Id) {
                toast.error('Mapping ID missing');
                return;
            }
            const response = await toggleYearlyCategorySubjectMapping(rowData.eycG_Id);
            if (response?.success) {
                toast.success(response.message || 'Category Subject Mapping status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to toggle mapping status');
            }
        } catch (error: any) {
            console.error('TOGGLE ERROR', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Category Subject Mapping' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('eycG_Id', { valueAsNumber: true })} defaultValue={rowData.eycG_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} the mapping for{' '}
                        <strong>{rowData.emcA_CategoryName}</strong> - <strong>{rowData.emG_GroupName}</strong>?
                    </p>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' type='button' onClick={closeDialog}>
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
