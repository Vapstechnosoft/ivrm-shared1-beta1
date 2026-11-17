'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterCourse } from '@/hooks/hrms/useMasters';
import { toggleMasterCourse } from '@/server/hrms/hrmsConfig/master/course';
import type { IMasterCourseList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmC_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterCourseFormProps {
    rowData: IMasterCourseList;
    onClose: () => void;
}

export default function ToggleMasterCourseForm({ rowData, onClose }: ToggleMasterCourseFormProps) {
    const { refetchAll } = useMasterCourse();
    const isActive = rowData.hrmC_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmC_Id: rowData.hrmC_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterCourse(Number(rowData.hrmC_Id));

            if (response?.success) {
                toast.success(response?.message || `Course ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} course`);
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} course`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Course Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmC_Id', { valueAsNumber: true })} defaultValue={rowData.hrmC_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmC_QulaificationName}</strong>?
                    </p>
                    <FormError>{errors.hrmC_Id?.message}</FormError>
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
