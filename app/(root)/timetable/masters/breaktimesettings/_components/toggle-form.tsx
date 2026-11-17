'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { useBreakTimeSettingDetails } from '@/hooks/timetable/useMasters';
import { deactivateBreakTimeSettings } from '@/server/timetable/masters/breaktimesettings';
import type { IBreakTimeSettingsList } from '@/types/timetable/masters/masters';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ToggleBreakTimeSettingsFormProps {
    rowData: IBreakTimeSettingsList;
    onClose: () => void;
}

export default function ToggleBreakTimeSettingsForm({ rowData, onClose }: ToggleBreakTimeSettingsFormProps) {
    const { refetchAll } = useBreakTimeSettingDetails();
    const isActive = rowData.ttmB_ActiveFlag;

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm();

    function closeDialog() {
        onClose();
    }

    const onSubmit = async () => {
        try {
            // Legacy sends the whole object
            const response = await deactivateBreakTimeSettings(rowData);

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
        <AdaptiveDialog title='Toggle Break Time Settings' isOpen={true} onClose={closeDialog}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <AdaptiveBody className='flex flex-col gap-5'>
                    <p>
                        Are you sure you want to {isActive ? 'deactivate' : 'activate'} <strong>{rowData.ttmB_BreakName}</strong>?
                    </p>
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
