'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterSubject } from '@/hooks/exam/exammodule/usemasters';
import { masterSubjectSchema } from '@/schemas/exam/exam-module/masters';
import { toggleMasterSubject } from '@/server/exam/exam-module/masters/subject';
import type { IMasterSubject } from '@/types/exam/exam-module/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSubjectSchema.delete>;

interface ToggleMasterSubjectFormProps {
    rowData: IMasterSubject;
    onClose: () => void;
}

export default function ToggleMasterSubjectForm({ rowData, onClose }: ToggleMasterSubjectFormProps) {
    const { refetchAll } = useMasterSubject();
    const isActive = rowData.ismS_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSubjectSchema.delete),
        defaultValues: {
            ismS_Id: rowData?.ismS_Id?.toString() ?? '' // <-- string
        },
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<FormFields> = async (formData) => {
        try {
            const response = await toggleMasterSubject(Number(formData.ismS_Id)); // <-- convert back to number
            if (response.success) {
                toast.success(response.message || `Subject ${rowData?.ismS_ActiveFlag ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                reset();
                onClose();
            } else {
                toast.error(response.message || 'Failed to update subject status');
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
        <AdaptiveDialog title='Toggle Master Subject Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ismS_Id')} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ismS_SubjectName}</strong>?
                    </p>
                    {errors.ismS_Id && <FormError>{errors.ismS_Id.message}</FormError>}
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
