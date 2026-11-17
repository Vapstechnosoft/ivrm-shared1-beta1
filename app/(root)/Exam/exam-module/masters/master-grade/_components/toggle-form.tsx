'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterGrade } from '@/hooks/exam/exammodule/usemasters';
import { masterGradeSchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterGrade } from '@/server/exam/exam-module/masters/grade';
import type { IMasterGrade } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterGradeSchema.delete>;

interface ToggleMasterGradeFormProps {
    rowData: IMasterGrade;
    onClose: () => void;
}

export default function ToggleMasterGradeForm({ rowData, onClose }: ToggleMasterGradeFormProps) {
    const { refetchAll } = useMasterGrade();
    const isActive = rowData.emgR_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGradeSchema.delete),
        defaultValues: {
            emgR_Id: rowData.emgR_Id
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const response = await toggleMasterGrade(Number(formData.emgR_Id)); // <-- convert back to number
            if (response.success) {
                toast.success(response.message || `Grade ${rowData?.emgR_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                reset();
                onClose();
            } else {
                toast.error(response.message || 'Failed to update grade status');
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
        <AdaptiveDialog title='Toggle Master Grade Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('emgR_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.emgR_GradeName}</strong>?
                    </p>
                    {errors.emgR_Id && <FormError>{errors.emgR_Id.message}</FormError>}
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
