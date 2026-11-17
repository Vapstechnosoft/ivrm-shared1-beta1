'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { toggleMappedSubSubjectOrSubExam } from '@/server/exam/exam-module/exam-mapping/exam-subject-wizard';
import type { ISubSubjectSubExamMapped } from '@/types/exam/exam-module/exam-mapping';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ToggleSubSubjectOrSubExamMappedFormProps {
    rowData: ISubSubjectSubExamMapped;
    onClose: () => void;
    refetchAll: () => void;
    subsubjectFlag: boolean;
    subexamFlag: boolean;
}

interface ToggleFormFields {
    EYCESSS_Id: number | null;
}

export default function ToggleSubSubjectOrSubExamMappedForm({
    rowData,
    onClose,
    refetchAll,
    subsubjectFlag,
    subexamFlag
}: ToggleSubSubjectOrSubExamMappedFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        defaultValues: {
            EYCESSS_Id: rowData.eycessS_Id ?? null
        }
    });

    const closeDialog = () => {
        onClose();
        reset();
    };

    const onSubmit = async (values: ToggleFormFields) => {
        if (!values.EYCESSS_Id) {
            setError('EYCESSS_Id', {
                type: 'manual',
                message: 'Record ID is required'
            });
            return;
        }

        try {
            // Call the server function instead of api.put
            const response = await toggleMappedSubSubjectOrSubExam(values.EYCESSS_Id);

            if (response.success) {
                toast.success(response.message || 'Mapped SubSubject/SubExam status updated successfully');
                refetchAll?.();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update mapped record status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while updating status');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Mapped Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('EYCESSS_Id')} />

                    <p>
                        Are you sure you want to <strong>{rowData.eycessS_ActiveFlg ? 'deactivate' : 'activate'}</strong> this mapped{' '}
                        <strong>{rowData.ismS_SubjectName || 'SubSubject/SubExam'}</strong> for exam{' '}
                        <strong>{rowData.emsE_SubExamName}</strong>?
                    </p>

                    <FormError>{errors.EYCESSS_Id?.message}</FormError>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' type='button' onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={rowData.eycessS_ActiveFlg ? 'destructive' : 'default'}>
                        {rowData.eycessS_ActiveFlg ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
