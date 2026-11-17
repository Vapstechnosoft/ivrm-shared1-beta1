'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { usePromotionalGroupMappings } from '@/hooks/exam/exammodule/exam-mapping';
import { togglePromotionSubjectGroups } from '@/server/exam/exam-module/exam-mapping/promotional-setting';
import type { IPromotionalGroupDetails, IPromotionalSubjectDetails } from '@/types/exam/exam-module/exam-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

/* ---------------- Schema ---------------- */
const PromotionalGroupToggleSchema = z.object({
    slNo: z.number().min(1, 'Invalid group')
});

type ToggleFormFields = z.infer<typeof PromotionalGroupToggleSchema>;

interface Props {
    rowData: IPromotionalGroupDetails;
    promSubjObj: IPromotionalSubjectDetails;
    onClose: () => void;
}

export default function PromotionalGroupMappingToggleForm({ rowData, promSubjObj, onClose }: Props) {
    const isActive = rowData.empsG_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ToggleFormFields>({
        resolver: zodResolver(PromotionalGroupToggleSchema),
        defaultValues: { slNo: rowData.empsG_Id }
    });
    const { refetchAll } = usePromotionalGroupMappings(promSubjObj.empS_Id);
    const closeDialog = () => {
        reset();
        onClose();
    };

    const onSubmit = async (values: ToggleFormFields) => {
        try {
            const res = await togglePromotionSubjectGroups(rowData.empsG_Id);

            if (res.success) {
                toast.success(res.message || 'Group status updated');
                closeDialog();
                refetchAll();
            } else {
                toast.error(res.message || 'Failed to update status');
            }
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Promotional Group' isOpen onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('slNo')} />

                    <p>
                        Are you sure you want to <strong>{isActive ? 'Deactivate' : 'Activate'}</strong>{' '}
                        <strong>{rowData.empsG_GroupName}</strong>?
                    </p>

                    <FormError>{errors.slNo?.message}</FormError>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button type='button' variant='secondary' onClick={closeDialog}>
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
