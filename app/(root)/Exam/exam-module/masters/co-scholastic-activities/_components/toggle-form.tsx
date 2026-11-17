'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useCoScholasticActivity } from '@/hooks/exam/exammodule/usemasters';
import { coScholasticActivitySchema } from '@/schemas/exam/exam-module/masters';
import { toggleCoScholasticActivity } from '@/server/exam/exam-module/masters/co-scholastic-activity';
import type { ICoScholasticActivity } from '@/types/exam/exam-module/masters';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coScholasticActivitySchema.delete>;

interface ToggleExamFormProps {
    rowData: ICoScholasticActivity;
    onClose: () => void;
}

export default function ToggleCoScholasticActivityForm({ rowData, onClose }: ToggleExamFormProps) {
    const { refetchAll } = useCoScholasticActivity();
    const isActive = rowData.ecacT_ActiveFlag; // ✅ use exam active flag

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coScholasticActivitySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleCoScholasticActivity(Number(rowData.ecacT_Id));

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
                    <input type='hidden' {...register('ecacT_Id')} defaultValue={rowData.ecacT_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ecacT_SkillName}</strong>?
                    </p>
                    <FormError>{errors.ecacT_Id?.message}</FormError>
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
