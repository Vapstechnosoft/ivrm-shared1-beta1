'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useStaffAbbreviation } from '@/hooks/timetable/useMasters';
import { staffabbreviationsSchema } from '@/schemas/timetable/masters';
import { ToggleStaffAbbreviation } from '@/server/timetable/masters/staffabbreviation';
import type { IStaffAbbreviationList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof staffabbreviationsSchema.delete>;

interface ToggleStaffAbbreviationFormProps {
    rowData: IStaffAbbreviationList;
    onClose: () => void;
}

export default function ToggleStaffAbbreviationForm({ rowData, onClose }: ToggleStaffAbbreviationFormProps) {
    const { refetchAll } = useStaffAbbreviation();
    const isActive = rowData.ttmsaB_ActiveFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(staffabbreviationsSchema.delete),
        mode: 'onChange'
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await ToggleStaffAbbreviation(Number(rowData.ttmsaB_Id));

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
        <AdaptiveDialog title='Toggle Staff Abbreviation' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('TTMSAB_Id')} defaultValue={rowData.ttmsaB_Id} />
                    <p>Are you sure you want to {isActive ? 'deactivate' : 'activate'} Selected Row Data</p>
                    <FormError>{errors.TTMSAB_Id?.message}</FormError>
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
