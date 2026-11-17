'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useCoScholasticActivityAreaMapping } from '@/hooks/exam/exammodule/exam-mapping';
import { toggleCoScholasticActivityArea } from '@/server/exam/exam-module/masters/co-scholastic-area';
import type { ICoScholasticActivityAreaMapping } from '@/types/exam/exam-module/exam-mapping';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormFields {
    ecactaM_Id: number;
}

interface ToggleCoScholasticActivityFormProps {
    rowData: ICoScholasticActivityAreaMapping;
    onClose: () => void;
}

export default function ToggleCoScholasticActivityAreaForm({ rowData, onClose }: ToggleCoScholasticActivityFormProps) {
    const { refetchAll } = useCoScholasticActivityAreaMapping();
    const isActive = rowData.ecactaM_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        defaultValues: { ecactaM_Id: rowData.ecactaM_Id }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleCoScholasticActivityArea(Number(rowData.ecactaM_Id));
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Co-Scholastic activity area mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ecactaM_Id')} defaultValue={rowData.ecactaM_Id} />
                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the mapping for{' '}
                        <strong>
                            {rowData.ecacT_SkillName} - {rowData.ecactA_SkillArea}
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.ecactaM_Id?.message}</FormError>
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
