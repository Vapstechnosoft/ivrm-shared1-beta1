'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useCoScholasticArea } from '@/hooks/exam/exammodule/usemasters';
import { coScholasticAreaSchema } from '@/schemas/exam/exam-module/masters';
import { toggleCoScholasticArea } from '@/server/exam/exam-module/masters/co-scholastic-area';
import type { ICoScholasticArea } from '@/types/exam/exam-module/masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coScholasticAreaSchema.delete>;

interface ToggleExamFormProps {
    rowData: ICoScholasticArea;
    onClose: () => void;
}

export default function ToggleCoScholasticAreaForm({ rowData, onClose }: ToggleExamFormProps) {
    const { refetchAll } = useCoScholasticArea();
    const isActive = rowData.ecactA_ActiveFlag; // ✅ use exam active flag

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coScholasticAreaSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleCoScholasticArea(Number(rowData.ecactA_Id));

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
        <AdaptiveDialog title='Toggle Exam Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecactA_Id')} defaultValue={rowData.ecactA_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ecactA_SkillArea}</strong>?
                    </p>
                    <FormError>{errors.ecactA_Id?.message}</FormError>
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
