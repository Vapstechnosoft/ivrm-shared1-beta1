'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamSubjectGroupMappingDetails } from '@/hooks/exam/exammodule/exam-mapping';
import { toggleExamSubjectGroupMappingSubject } from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import type { IExamSubjectGroupingDetails } from '@/types/exam/exam-module/exam-mapping';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormFields {
    esgS_Id: number;
}

interface ToggleExamSubjectGroupingFormProps {
    rowData: IExamSubjectGroupingDetails;
    onClose: () => void;
}

export default function ToggleExamSubjectGroupingForm({ rowData, onClose }: ToggleExamSubjectGroupingFormProps) {
    const { refetchAll } = useExamSubjectGroupMappingDetails(rowData.esG_CompulsoryFlag, rowData.asmaY_Id, rowData.esG_Id); // Custom hook to refetch table data after toggle
    const isActive = rowData.esgS_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        defaultValues: { esgS_Id: rowData.esgS_Id }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            // Call your backend API here
            const response = await toggleExamSubjectGroupMappingSubject(Number(rowData.esgS_Id));

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Subject Group Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('esgS_Id')} defaultValue={rowData.esgS_Id} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the subject{' '}
                        <strong>{rowData.ismS_SubjectName}</strong> in group <strong>{rowData.esG_SubjectGroupName}</strong>?
                    </p>

                    <FormError>{errors.esgS_Id?.message}</FormError>
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
