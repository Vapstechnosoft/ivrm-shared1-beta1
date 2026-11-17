'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import { useExamLoginPrivilegesDetails } from '@/hooks/exam/exammodule/exam-mapping';
import { toggleExamLoginPrivilege } from '@/server/exam/exam-module/exam-mapping/exam-login-privilages';
import type { ILoginPrivilegeDetails } from '@/types/exam/exam-module/exam-mapping';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormFields {
    lpD_Id: number;
}

interface ToggleLoginPrivilegeFormProps {
    rowData: ILoginPrivilegeDetails;
    elpId: number;
    asmclId: number;
    asmsId: number;
    onClose: () => void;
}

export default function ToggleLoginPrivilegeForm({ rowData, elpId, asmclId, asmsId, onClose }: ToggleLoginPrivilegeFormProps) {
    const { refetchAll } = useExamLoginPrivilegesDetails(elpId, asmclId, asmsId);
    const isActive = rowData.activeFlg;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        defaultValues: { lpD_Id: rowData.elpsS_Id }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields> = async () => {
        try {
            console.info(rowData.elpS_Id);
            const response = await toggleExamLoginPrivilege(Number(rowData.elpS_Id));
            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle privilege status');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Login Privilege Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('lpD_Id')} defaultValue={rowData.asmS_Id} />
                    <p>
                        Are you sure you want to <strong>{isActive ? 'deactivate' : 'activate'}</strong> the login privilege for{' '}
                        <strong>
                            {rowData.ismS_SubjectName} - {rowData.emsS_SubSubjectName}
                        </strong>
                        ?
                    </p>
                    <p className='text-muted-foreground text-sm'>
                        Category: <strong>{rowData.asmcL_ClassName}</strong> | Class: <strong>{rowData.asmcL_ClassName}</strong> | Subject:{' '}
                        <strong>{rowData.ismS_SubjectName}</strong>
                    </p>
                    <FormError>{errors.lpD_Id?.message}</FormError>
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
