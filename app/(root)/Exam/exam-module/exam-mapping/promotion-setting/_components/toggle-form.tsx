'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { usePromotionalSetting } from '@/hooks/exam/exammodule/exam-mapping';

import { ExamSubjectWizardSchema } from '@/schemas/exam/exam-module/exam-mapping';
import { togglePromotionDetails } from '@/server/exam/exam-module/exam-mapping/promotional-setting';

import type { IPromotionSetting } from '@/types/exam/exam-module/exam-mapping';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

/* ---------------------------------------------
   FORM TYPES
--------------------------------------------- */
type ToggleFormFields = z.infer<typeof ExamSubjectWizardSchema.delete>;

interface TogglePromotionSettingFormProps {
    rowData: IPromotionSetting & {
        emE_ExamName?: string;
        emcA_CategoryName?: string;
    };
    onClose: () => void;
}

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */
export default function TogglePromotionSettingForm({ rowData, onClose }: TogglePromotionSettingFormProps) {
    const { refetchAll } = usePromotionalSetting();

    const isActive = rowData.emP_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(ExamSubjectWizardSchema.delete),
        defaultValues: {
            EYCE_Id: rowData.emP_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    /* ---------------------------------------------
       SUBMIT HANDLER
    --------------------------------------------- */
    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const response = await togglePromotionDetails(values.EYCE_Id);

            if (response?.success) {
                toast.success(response.message ?? 'Promotion setting status updated');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message ?? 'Failed to update promotion setting');
            }
        } catch (error: any) {
            toast.error(error?.message ?? 'Something went wrong');
        }
    };

    /* ---------------------------------------------
       UI
    --------------------------------------------- */
    return (
        <AdaptiveDialog title='Toggle Promotion Setting Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('EYCE_Id')} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the promotion setting
                        {rowData.emE_ExamName && (
                            <>
                                {' '}
                                for exam <strong>{rowData.emE_ExamName}</strong>
                            </>
                        )}
                        {rowData.emcA_CategoryName && (
                            <>
                                {' '}
                                and category <strong>{rowData.emcA_CategoryName}</strong>
                            </>
                        )}
                        ?
                    </p>

                    <FormError>{errors.EYCE_Id?.message}</FormError>
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
