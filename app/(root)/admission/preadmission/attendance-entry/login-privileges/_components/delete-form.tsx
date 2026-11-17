'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useLoginPrivileges } from '@/hooks/admission/preadmission/useLoginPrivilege';
import type { ILoginPrivilege } from '@/types/admission/preadmission/login_privilege';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteLoginPrivilegeFormProps {
    rowData: ILoginPrivilege;
    onClose: () => void;
    onSuccess?: () => void | Promise<void>;
}

export default function DeleteLoginPrivilegeForm({ rowData, onClose, onSuccess }: DeleteLoginPrivilegeFormProps) {
    const { deletePrivilege, isDeleting } = useLoginPrivileges();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deletePrivilege({ asaluC_Id: rowData.asaluC_Id, asalucS_Id: rowData.asalucS_Id });
            if (onSuccess && typeof onSuccess === 'function') {
                await onSuccess();
            }
            onClose();
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdaptiveDialog title='Delete Login Privilege' isOpen={true} onClose={onClose}>
            <div className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to delete the privilege for <strong>{rowData.userName}</strong> in class{' '}
                        <strong>
                            {rowData.asmcL_ClassName} : {rowData.asmC_SectionName}
                        </strong>
                        ?
                    </p>
                </AdaptiveBody>
                <AdaptiveFooter>
                    <Button variant='secondary' onClick={onClose} type='button' disabled={isLoading || isDeleting}>
                        Cancel
                    </Button>
                    <Button type='button' onClick={handleDelete} variant='destructive' disabled={isLoading || isDeleting}>
                        {(isLoading || isDeleting) && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Delete
                    </Button>
                </AdaptiveFooter>
            </div>
        </AdaptiveDialog>
    );
}
