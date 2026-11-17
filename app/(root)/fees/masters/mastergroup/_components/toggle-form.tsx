'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useMasterGroup } from '@/hooks/fees/useMasters';
import { masterGroupSchema } from '@/schemas/fees/masters';
import { toggleMasterGroup } from '@/server/fees/masters/master_group';
import type { IMasterGroupList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterGroupSchema.toggle>;

interface ToggleMasterGroupFormProps {
    rowData: IMasterGroupList;
    onClose: () => void;
}

export default function ToggleMasterGroupForm({ rowData, onClose }: ToggleMasterGroupFormProps) {
    const { refetchAll } = useMasterGroup();
    const isActive = rowData.fmG_ActiceFlag;

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterGroupSchema.toggle),
        mode: 'onChange',
        defaultValues: {
            fmG_Id: rowData.fmG_Id,
            fmG_ActiceFlag: rowData.fmG_ActiceFlag
        }
    });

    function closeDialog() {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormFields | any> = async () => {
        try {
            const response = await toggleMasterGroup(rowData.fmG_Id);

            if (response.success) {
                toast.success(response.message);
                refetchAll();
                closeDialog();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle Master Group status');
        }
    };

    return (
        <AdaptiveDialog title='Toggle Master Group Status' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <input type='hidden' {...register('fmG_Id')} defaultValue={rowData.fmG_Id} />
                    <input type='hidden' {...register('fmG_ActiceFlag')} defaultValue={rowData.fmG_ActiceFlag.toString()} />

                    <div className='space-y-3'>
                        <p className='text-sm text-warning-foreground'>
                            Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.fmG_GroupName}</strong>?
                        </p>
                    </div>
                </AdaptiveBody>

                <AdaptiveFooter>
                    <Button variant='secondary' onClick={closeDialog} type='button' disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        isLoading={isSubmitting}
                        variant={isActive ? 'destructive' : 'default'}
                        loadingText={isActive ? 'Deactivating...' : 'Activating...'}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </AdaptiveFooter>
            </form>
        </AdaptiveDialog>
    );
}
