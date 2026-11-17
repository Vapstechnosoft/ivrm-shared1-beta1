'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterGrade } from '@/hooks/hrms/useMasters';
import { toggleMasterGrade } from '@/server/hrms/hrmsConfig/master/grade';
import type { IMasterGradeList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrmG_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleMasterGradeFormProps {
    rowData: IMasterGradeList;
    onClose: () => void;
}

export default function ToggleMasterGradeForm({ rowData, onClose }: ToggleMasterGradeFormProps) {
    const { refetchAll } = useMasterGrade();
    const isActive = rowData.hrmG_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrmG_Id: rowData.hrmG_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterGrade(Number(rowData.hrmG_Id));

            if (response?.success) {
                toast.success(response?.message || `Grade ${isActive ? 'deactivated' : 'activated'} successfully`);
                refetchAll();
                closeDialog();
            } else {
                const retrunMsg = (response as any)?.retrunMsg || '';
                if (retrunMsg === 'Mapped') {
                    toast.error('Cannot deactivate - Grade is currently assigned/in use');
                } else {
                    toast.error(response?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} grade`);
                }
            }
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} grade`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Grade Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmG_Id', { valueAsNumber: true })} defaultValue={rowData.hrmG_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.hrmG_GradeName}</strong>?
                    </p>
                    <FormError>{errors.hrmG_Id?.message}</FormError>
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
