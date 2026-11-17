'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamSubjectWizardDetails } from '@/hooks/exam/exammodule/exam-mapping';
import { toggleExamSubjectWizardDetails } from '@/server/exam/exam-module/exam-mapping/exam-subject-wizard';
import type { IExamSubjectWizardDetails } from '@/types/exam/exam-module/exam-mapping';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ToggleExamSubjectWizardDetailsFormProps {
    rowData: IExamSubjectWizardDetails;
    onClose: () => void;
}

interface ToggleFormFields {
    EYCES_Id: number | null;
}

export default function ToggleExamSubjectWizardDetailsForm({ rowData, onClose }: ToggleExamSubjectWizardDetailsFormProps) {
    const { refetchAll } = useExamSubjectWizardDetails(rowData.eycE_Id);
    const isActive = rowData.eyceS_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        defaultValues: {
            EYCES_Id: rowData.eyceS_Id
        }
    });

    const closeDialog = () => {
        onClose();
        reset();
    };

    const onSubmit = async (values: ToggleFormFields) => {
        if (!values.EYCES_Id) {
            setError('EYCES_Id', {
                type: 'manual',
                message: 'Record ID is required'
            });
            return;
        }

        try {
            const response = await toggleExamSubjectWizardDetails(rowData.eyceS_Id);
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
        <AdaptiveDialog title='Toggle Subject Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('EYCES_Id')} />
                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the subject{' '}
                        <strong>{rowData.ismS_SubjectName}</strong> ({rowData.ismS_SubjectCode}) for exam{' '}
                        <strong>{rowData.emE_ExamName}</strong> under category <strong>{rowData.emcA_CategoryName}</strong>?
                    </p>

                    <FormError>{errors.EYCES_Id?.message}</FormError>
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
