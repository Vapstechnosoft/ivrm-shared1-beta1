'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { ClassWorkUploadedList } from '@/hooks/upload/transactions/useClassWork';
import { classWorkSchema } from '@/schemas/upload/transactions/ivrm-classwork.schema';
import { toggleUploadClassWork } from '@/server/upload/transactions/ivrm-classwork/server-action';

import type { IClassWorkDetails } from '@/types/upload/reports/classwork-upload-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
type FormFields = z.infer<typeof classWorkSchema.delete>;
interface ToggleClassWorkFormProps {
    rowData: IClassWorkDetails;
    onClose: () => void;
}

export default function ToggleClassWorkForm({ rowData, onClose }: ToggleClassWorkFormProps) {
    const payload = {
        asmaY_Id: 176
    };
    const { refetchAll } = ClassWorkUploadedList(payload);

        const {
            register,
            handleSubmit,
            reset,
            formState: { errors, isSubmitting }
        } = useForm<FormFields>({
            resolver: zodResolver(classWorkSchema.delete),
            mode: 'onChange'
        });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleUploadClassWork(Number(rowData.icW_Id));
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
        <AdaptiveDialog title='Class Work Upload Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden'{...register('icW_Id')} defaultValue={rowData.icW_Id} />
                    <p>
                        Are you sure you want to {rowData.icW_ActiveFlag ? 'deactivate' : 'activate'} <strong>{rowData.icW_Content}</strong>
                        ?
                    </p>

                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={rowData.icW_ActiveFlag ? 'destructive' : 'default'}>
                        {rowData.icW_ActiveFlag ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
