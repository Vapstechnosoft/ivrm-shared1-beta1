'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useGroupDeptDessgMapping } from '@/hooks/hrms/useMasters';
import type { IMasterGroupDeptDessgMappingList } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const toggleSchema = z.object({
    hrgtddS_Id: z.number()
});

type FormFields = z.infer<typeof toggleSchema>;

interface ToggleGroupDeptDessgMappingFormProps {
    rowData: IMasterGroupDeptDessgMappingList;
    onClose: () => void;
}

export default function ToggleGroupDeptDessgMappingForm({ rowData, onClose }: ToggleGroupDeptDessgMappingFormProps) {
    const { toggleMutation } = useGroupDeptDessgMapping();
    const isActive = rowData.hrgtddS_ActiveFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(toggleSchema),
        mode: 'onChange',
        defaultValues: {
            hrgtddS_Id: rowData.hrgtddS_Id
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            await toggleMutation.mutateAsync(rowData.hrgtddS_Id);
            toast.success(`Mapping ${!isActive ? 'activated' : 'deactivated'} successfully`);
            closeDialog();
        } catch (error: any) {
            toast.error(error?.message || `Failed to ${!isActive ? 'activate' : 'deactivate'} mapping`);
        }
    };

    return (
        <AdaptiveDialog title='Toggle Group-Dept-Designation Mapping Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrgtddS_Id', { valueAsNumber: true })} defaultValue={rowData.hrgtddS_Id} />
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} mapping for{' '}
                        <strong>
                            {rowData.hrmgT_EmployeeGroupType} - {rowData.hrmD_DepartmentName} - {rowData.hrmdeS_DesignationName}
                        </strong>
                        ?
                    </p>
                    <FormError>{errors.hrgtddS_Id?.message}</FormError>
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
