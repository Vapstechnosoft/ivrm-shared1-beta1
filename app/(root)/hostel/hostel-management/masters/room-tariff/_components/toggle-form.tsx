'use client';

import { useForm } from 'react-hook-form';
import { ToggleFormWrapper } from '@/components/ui/form/toggle-form-wrapper';
import { IRoomTariff } from '@/types/hostel/hostel-management/masters';
import { deactivateTariff } from '@/server/hostel/hostel-management/masters/room-tariff';
import { toast } from 'sonner';
import { useFormContext } from '@/components/ui/form/form-provider';

interface ToggleRoomTariffProps {
    data: IRoomTariff;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ToggleRoomTariff({ data, onSuccess, onCancel }: ToggleRoomTariffProps) {
    const form = useForm();
    const { openToggleForm, isToggleFormOpen, closeToggleForm } = useFormContext();

    const { formState: { isSubmitting } } = form;

    const onSubmit = async () => {
        const result = await deactivateTariff(data.hlmrtF_Id);
        if (result?.success) {
            toast.success(result.message || (data.hlmrtF_ActiveFlag ? 'Room Tariff deactivated successfully' : 'Room Tariff activated successfully'));
            onSuccess();
        } else {
            toast.error(result?.message || 'Failed to toggle Room Tariff status');
        }
    };

    return (
        <ToggleFormWrapper
            isOpen={isToggleFormOpen}
            onClose={closeToggleForm}
            onConfirm={form.handleSubmit(onSubmit)}
            title={data.hlmrtF_ActiveFlag ? 'Deactivate Room Category' : 'Activate Room Category'}
            description={`Are you sure you want to ${data.hlmrtF_ActiveFlag ? 'deactivate' : 'activate'
                } ${data.hlmrtF_RoomRate}?`}
        />
    );
}
