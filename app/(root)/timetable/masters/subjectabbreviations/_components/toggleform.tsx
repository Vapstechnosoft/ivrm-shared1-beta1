'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useSSubjectAbbreviation } from '@/hooks/timetable/useMasters';
import { subjectabbreviationsSchema } from '@/schemas/timetable/masters';
import { ToggleSubjectAbbreviation } from '@/server/timetable/masters/subjectabbreviation';
import type { ISubjectAbbreviationList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof subjectabbreviationsSchema.delete>;

interface ToggleStaffAbbreviationFormProps {
    rowData: ISubjectAbbreviationList;
    onClose: () => void;
}

export default function ToggleSubjectAbbreviationForm({ rowData, onClose }: ToggleStaffAbbreviationFormProps) {
    const { refetchAll } = useSSubjectAbbreviation();
    const isActive = rowData.ttmsuaB_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(subjectabbreviationsSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await ToggleSubjectAbbreviation(Number(rowData.ttmsuaB_Id));

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
        <AdaptiveDialog title='Toggle Subject Abbreviation' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('ttmsuaB_Id')} defaultValue={rowData.ttmsuaB_Id} />
                    <p>Are you sure you want to {isActive ? 'deactivate' : 'activate'} Selected Row Data</p>
                    <FormError>{errors.ttmsuaB_Id?.message}</FormError>
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
