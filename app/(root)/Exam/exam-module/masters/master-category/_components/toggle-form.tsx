'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterCategory } from '@/hooks/exam/exammodule/usemasters';
import { masterCategorySchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterExamCategory } from '@/server/exam/exam-module/masters/category';
import type { IMasterCategory } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterCategorySchema.delete>;

interface ToggleCategoryFormProps {
    rowData: IMasterCategory;
    onClose: () => void;
}

export default function ToggleCategoryForm({ rowData, onClose }: ToggleCategoryFormProps) {
    const { refetchAll } = useMasterCategory();
    const [loading, setLoading] = useState(false);

    const isActive = !!rowData.emcA_ActiveFlag; // ensure boolean

    const { register, handleSubmit, reset } = useForm<FormFields>({
        resolver: zodResolver(masterCategorySchema.delete),
        defaultValues: { emcA_Id: rowData.emcA_Id },
        mode: 'onChange'
    });

    const closeDialog = () => {
        reset();
        onClose();
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setLoading(true);

            //  Pass correct parameters to API
            const response = await toggleMasterExamCategory(rowData.emcA_Id);

            if (response?.success) {
                toast.success(response.message || `Category ${isActive ? 'deactivated' : 'activated'} successfully`);
                await refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to toggle category');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong while toggling category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Category Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('emcA_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.emcA_CategoryName}</strong>?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={loading} variant={isActive ? 'destructive' : 'default'}>
                        {loading ? (isActive ? 'Deactivating...' : 'Activating...') : isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
