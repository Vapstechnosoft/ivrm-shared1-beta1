'use client';
import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useToggleEmployee } from '@/hooks/hrms/useEmployeeRegister';
import type { IEmployeeList } from '@/types/hrms/hrms-config/employee';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface ToggleEmployeeFormProps {
    rowData: IEmployeeList;
    onClose: () => void;
}
export default function ToggleEmployeeForm({ rowData, onClose }: ToggleEmployeeFormProps) {
    const { mutate: toggleEmployee, isPending } = useToggleEmployee();
    const isActive = rowData.hrmE_ActiveFlag;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            hrmE_Id: rowData.hrmE_Id
        }
    });
    function closeDialog() {
        onClose();
        reset();
    }
    const onSubmit: SubmitHandler<any> = async (_data) => {
        try {
            toggleEmployee(rowData.hrmE_Id, {
                onSuccess: (response: any) => {
                    if (response?.success || (response && response.success === undefined)) {
                        closeDialog();
                    }
                },
                onError: (error: any) => {
                    // Toast error is handled by the hook, but we can keep this for safety
                    console.error('Toggle error:', error);
                }
            });
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
        }
    };
    const employeeName =
        `${rowData.hrmE_EmployeeFirstName} ${rowData.hrmE_EmployeeMiddleName || ''} ${rowData.hrmE_EmployeeLastName || ''}`.trim();
    return (
        <AdaptiveDialog title={isActive ? 'Deactivate Employee' : 'Activate Employee'} isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('hrmE_Id')} defaultValue={rowData.hrmE_Id} />
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'}{' '}
                        <span className="font-semibold text-foreground">{employeeName || rowData.hrmE_EmployeeCode}</span>?
                        {isActive ? ' This employee will no longer be able to log in or be included in payroll.' : ' This employee will be able to log in and be included in payroll.'}
                    </p>
                    <FormError>{errors.hrmE_Id?.message}</FormError>
                    <FormError>{errors.root?.message}</FormError>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='outline' onClick={closeDialog} type='button'>
                        Cancel
                    </Button>
                    <Button type='submit' isLoading={isSubmitting || isPending} variant={isActive ? 'destructive' : 'success'}>
                        {isActive ? 'Deactivate Employee' : 'Activate Employee'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
