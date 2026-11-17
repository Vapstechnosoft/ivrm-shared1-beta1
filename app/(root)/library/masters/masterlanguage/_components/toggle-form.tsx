'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterLanguage } from '@/hooks/library/useMasters';
import { masterLibrarySchema } from '@/schemas/library/masters';
import { toggleMasterLanguage } from '@/server/library/masters/master_language';
import type { IMasterLanguageList } from '@/types/library/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormFields = {
    lmL_Id?: number | string;
};

interface ToggleMasterLanguageFormProps {
    rowData: IMasterLanguageList;
    onClose: () => void;
}

export default function ToggleMasterLanguageForm({ rowData, onClose }: ToggleMasterLanguageFormProps) {
    const { refetchAll } = useMasterLanguage();
    const isActive = rowData.lmL_ActiveFlg;

    const {
        // register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterLibrarySchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            const response = await toggleMasterLanguage(rowData.lmL_Id);

            if (response.success) {
                toast.success(response.message || 'Status updated successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Library Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    {/* Register as number so zod validation receives a number (not a string) */}
                    {/* <input type='hidden' {...register('lmaL_Id', { valueAsNumber: true })} value={rowData.lmL_Id as any} /> */}
                    {/* <input type='hidden' {...register('lmL_Id')} /> */}

                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.lmL_LanguageName}</strong>?
                    </p>
                    {/* <FormError>{errors.lmL_Id?.message}</FormError> */}
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
