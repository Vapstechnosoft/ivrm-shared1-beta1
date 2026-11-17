'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useEmployeeShiftMapping } from '@/hooks/hrms/attendance-management/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { deleteEmployeeShiftMapping } from '@/server/hrms/attendance-management/masters/employee-shift-mapping';
import type { IMasterEmployeeShiftMappingList } from '@/types/hrms/attendance-management/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.employeeShiftMapping.delete>;

interface DeleteEmployeeShiftMappingFormProps {
    rowData: IMasterEmployeeShiftMappingList;
    onClose: () => void;
}

export default function DeleteEmployeeShiftMappingForm({ rowData, onClose }: DeleteEmployeeShiftMappingFormProps) {
    const { refetchAll } = useEmployeeShiftMapping();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.employeeShiftMapping.delete),
        mode: 'onChange',
        defaultValues: {
            foest_Id: Number(rowData.FOEST_Id) || 0
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await deleteEmployeeShiftMapping(Number(rowData.FOEST_Id));

            if (response?.success) {
                toast.success(response.message || 'Employee shift mapping deleted successfully');
                refetchAll();
                closeDialog();
            } else {
                toast.error(response?.message || 'Failed to delete employee shift mapping');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete employee shift mapping');
        }
    };

    return (
        <AdaptiveDialog title='Delete Employee Shift Mapping' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input
                        type='hidden'
                        {...register('foest_Id', {
                            valueAsNumber: true,
                            value: Number(rowData.FOEST_Id) || 0
                        })}
                    />
                    <p>
                        Are you sure you want to delete shift mapping for{' '}
                        <strong>{rowData.EmployeeName || rowData.ShiftName || 'this record'}</strong>?
                    </p>
                    <FormError>{errors.foest_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting} variant={'destructive'}>
                        Delete
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
