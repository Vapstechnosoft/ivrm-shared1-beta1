'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamTermAndExamMappingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import { toggleExamTermAndExamMappingDetails } from '@/server/exam/exam-module/exam-mapping/examTerm-and-exam-mappiong';
import type { IExamTermAndExamMappingDetails } from '@/types/exam/exam-module/exam-mapping';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormFields {
    ecteX_Id: number;
}

interface ToggleExamTermAndExamMappingFormProps {
    rowData: IExamTermAndExamMappingDetails & { asmaY_Id: number; emcA_Id: number; ecT_TermName: string };
    onClose: () => void;
}

export default function ToggleExamTermAndExamMappingForm({ rowData, onClose }: ToggleExamTermAndExamMappingFormProps) {
    // Custom hook to refetch data after toggle
    const { refetchAll } = useExamTermAndExamMappingDetails(rowData.asmaY_Id, rowData.emcA_Id, rowData.ecT_Id);

    const isActive = rowData.ecteX_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        defaultValues: { ecteX_Id: rowData.ecteX_Id }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            // Call backend API for toggle
            const response = await toggleExamTermAndExamMappingDetails(Number(rowData.ecteX_Id));

            if (response.success) {
                toast.success(response.message || 'Status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while updating status');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Exam Term & Exam Mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecteX_Id')} defaultValue={rowData.ecteX_Id} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the exam{' '}
                        <strong>{rowData.emE_ExamName}</strong> under term <strong>{rowData.ecT_TermName}</strong>?
                    </p>

                    <FormError>{errors.ecteX_Id?.message}</FormError>
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
