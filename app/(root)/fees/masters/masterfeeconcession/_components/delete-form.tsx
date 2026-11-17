'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useMasterConcession } from '@/hooks/fees/useMasters';
import { masterConcessionSchema } from '@/schemas/fees/masters';
import { deleteMasterConcession } from '@/server/fees/masters/feemasterconcession';
import type { IMasterConcessionList } from '@/types/fees/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConcessionSchema.delete>;

interface DelteMasterConcessionFormProps {
    rowData: IMasterConcessionList;
    onClose: () => void;
}

export default function DelteMasterConcessionForm({ rowData, onClose }: DelteMasterConcessionFormProps) {
    const { refetchAll } = useMasterConcession();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConcessionSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteMasterConcession(Number(rowData.fmcC_Id));
            if (response?.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AdaptiveDialog title='Delete Master Concession' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmcC_Id')} defaultValue={rowData.fmcC_Id} />
                    <p>Are you sure you want to permanently delete the Selected Data</p>
                    <FormError>{errors.fmcC_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
