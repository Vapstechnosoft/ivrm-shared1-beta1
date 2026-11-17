'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamTermAndExamMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { ExamTermAndExamMappingSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { toggleExamTermAndExamMapping } from '@/server/exam/exam-module/exam-mapping/examTerm-and-exam-mappiong';
import type { IExamTermAndExamMapping } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type ToggleFormFields = z.infer<typeof ExamTermAndExamMappingSchema.delete>;

interface ToggleExamTermAndExamMappingFormProps {
    rowData: IExamTermAndExamMapping & {
        asmaY_Year: string;
        emcA_CategoryName: string;
    };
    onClose: () => void;
}

export default function ToggleExamTermAndExamMappingForm({ rowData, onClose }: ToggleExamTermAndExamMappingFormProps) {
    const { refetchAll } = useExamTermAndExamMapping();

    const isActive = rowData.ecT_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(ExamTermAndExamMappingSchema.delete),
        defaultValues: {
            ecT_Id: rowData.ecT_Id!,
            asmaY_Id: rowData.asmaY_Id,
            emcA_Id: rowData.emcA_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const response = await toggleExamTermAndExamMapping(values.asmaY_Id, values.emcA_Id, values.ecT_Id);

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
        <AdaptiveDialog title='Toggle Exam Term Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecT_Id')} />
                    <input type='hidden' {...register('asmaY_Id')} />
                    <input type='hidden' {...register('emcA_Id')} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the term{' '}
                        <strong>{rowData.ecT_TermName}</strong> for academic year <strong>{rowData.asmaY_Year}</strong> and category{' '}
                        <strong>{rowData.emcA_CategoryName}</strong>?
                    </p>

                    <FormError>{errors.ecT_Id?.message}</FormError>
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
