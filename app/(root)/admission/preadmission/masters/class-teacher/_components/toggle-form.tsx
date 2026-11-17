'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useClassTeacher } from '@/hooks/admission/preadmission/useMasters';
import { masterClassTeacherSchema } from '@/schemas/admission/preadmission/masters';
import { ToggleMasterClassTeacherForm } from '@/server/admission/preadmission/masters/class_teacher';
import type { IMasterClassTeacherList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterClassTeacherSchema.delete>;

interface ToggleMasterClassTeacherFormProps {
    rowData: IMasterClassTeacherList;
    onClose: () => void;
}

export default function ToggleMasterClassTeachersForm({ rowData, onClose }: ToggleMasterClassTeacherFormProps) {
    const { refetchAll } = useClassTeacher();
    const isActive = rowData.imcT_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterClassTeacherSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await ToggleMasterClassTeacherForm(Number(rowData.imcT_Id));

            if (response.success) {
                toast.success(response.message);
                closeDialog();
                refetchAll();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Class Teacher Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('imcT_Id')} defaultValue={rowData.imcT_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.asmcL_ClassName}</strong>?
                    </p>
                    <FormError>{errors.imcT_Id?.message}</FormError>
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
