'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamSubjectWizard } from '@/hooks/exam/exammodule/exam-mapping';
import { ExamSubjectWizardSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { toggleExamSubjectWizard } from '@/server/exam/exam-module/exam-mapping/exam-subject-wizard';
import type { IExamSubjectWizard } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type ToggleFormFields = z.infer<typeof ExamSubjectWizardSchema.delete>;

interface ToggleSubjectWizardFormProps {
    rowData: IExamSubjectWizard & {
        emE_ExamName: string;
        emcA_CategoryName: string;
    };
    onClose: () => void;
}

export default function ToggleSubjectWizardForm({ rowData, onClose }: ToggleSubjectWizardFormProps) {
    const { refetchAll } = useExamSubjectWizard();

    const isActive = rowData.eycE_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(ExamSubjectWizardSchema.delete),
        defaultValues: {
            EYCE_Id: rowData.eycE_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const response = await toggleExamSubjectWizard(values.EYCE_Id);

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
        <AdaptiveDialog title='Toggle Subject Wizard Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('EYCE_Id')} />
                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> for exam{' '}
                        <strong>{rowData.emE_ExamName}</strong> and category <strong>{rowData.emcA_CategoryName}</strong>?
                    </p>

                    <FormError>{errors.EYCE_Id?.message}</FormError>
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
