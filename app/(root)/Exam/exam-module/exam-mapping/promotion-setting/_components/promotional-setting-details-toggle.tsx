'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { usePromotionalSetting, usePromotionalSettingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import { togglePromotionSubjects } from '@/server/exam/exam-module/exam-mapping/promotional-setting';
import type { IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

/* ---------------- Schema ---------------- */
const PromotionalToggleSchema = z.object({
    slNo: z.number().min(1, 'Invalid subject')
});

type ToggleFormFields = z.infer<typeof PromotionalToggleSchema>;

interface Props {
    rowData: IPromotionalSubjectDetails;
    onClose: () => void;
}

export default function PromotionalSettingDetailsToggleForm({ rowData, onClose }: Props) {
    const isActive = rowData.empS_ActiveFlag;
    const { refetchAll } = usePromotionalSettingDetails(rowData.emP_Id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(PromotionalToggleSchema),
        defaultValues: {
            slNo: rowData.empS_Id
        }
    });


    function closeDialog() {
        reset();
        onClose();
    }

    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const response = await togglePromotionSubjects(rowData.empS_Id);

            if (response.success) {
                toast.success(response.message || 'Promotional status updated');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Promotional Subject' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('slNo')} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'Deactivate' : 'Activate'}</strong>{' '}
                        <strong>{rowData.ismS_SubjectName}</strong> for promotion?
                    </p>

                    <FormError>{errors.slNo?.message}</FormError>
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
