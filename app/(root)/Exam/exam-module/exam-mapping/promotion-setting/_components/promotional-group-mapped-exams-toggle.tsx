'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { usePromotionalGroupMappedExams } from '@/hooks/exam/exammodule/exam-mapping';
import { togglePromotionSubjectGroupExams } from '@/server/exam/exam-module/exam-mapping/promotional-setting';
import type { IPromotionalGroupDetails, IPromotionalGroupMappedExamDetails } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

/* ---------------- Schema ---------------- */
const PromotionalGroupMappedExamToggleSchema = z.object({
    slNo: z.number().min(1, 'Invalid exam')
});

type ToggleFormFields = z.infer<typeof PromotionalGroupMappedExamToggleSchema>;

interface Props {
    rowData: IPromotionalGroupMappedExamDetails;
    onClose: () => void;
}

export default function TogglePromotionalGroupMappedExamForm({ rowData, onClose }: Props) {
    const isActive = rowData.empsgE_ActiveFlg;
    const { refetchAll } = usePromotionalGroupMappedExams(rowData.empsG_Id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(PromotionalGroupMappedExamToggleSchema),
        defaultValues: {
            slNo: rowData.empsgE_Id
        }
    });

    function closeDialog() {
        reset();
        onClose();
    }

    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const response = await togglePromotionSubjectGroupExams(rowData.empsgE_Id);

            if (response.success) {
                toast.success(response.message || 'Exam status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update exam status');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Promotional Group Mapped Exam' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('slNo')} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'Deactivate' : 'Activate'}</strong> <strong>{rowData.emE_ExamName}</strong>
                        ?
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
