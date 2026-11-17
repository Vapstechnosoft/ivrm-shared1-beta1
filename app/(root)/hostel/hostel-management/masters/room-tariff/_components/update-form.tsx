'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { FormInput } from '@/components/ui/form/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IRoomTariffForm, roomTariffSchema } from '@/schemas/hostel/room-tariff.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IRoomTariff, saveRoomTariff } from '@/server/hostel/hostel-management/masters/room-tariff';

interface UpdateRoomTariffFormProps {
    initialData: IRoomTariff;
    onSuccess: () => void;
    onCancel: () => void;
    yearList: any[];
    roomList: any[];
}

export default function UpdateRoomTariffForm({
    initialData,
    onSuccess,
    onCancel,
    yearList,
    roomList,
}: UpdateRoomTariffFormProps) {
    const methods = useForm<IRoomTariffForm>({
        resolver: zodResolver(roomTariffSchema),
        mode: 'onChange',
        defaultValues: {
            hlmrtF_Id: initialData.hlmrtF_Id,
            asmaY_Id: initialData.asmaY_Id.toString(),
            hrmrM_Id: initialData.hrmrM_Id.toString(),
            hlmrtF_SORate: initialData.hlmrtF_SORate.toString(),
            hlmrtF_RoomRate: initialData.hlmrtF_RoomRate.toString(),
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const onSubmit = async (data: IRoomTariffForm) => {
        try {
            const payload = {
                hlmrtF_Id: initialData.hlmrtF_Id,
                asmaY_Id: Number(data.asmaY_Id),
                hrmrM_Id: Number(data.hrmrM_Id),
                hlmrtF_SORate: Number(data.hlmrtF_SORate),
                hlmrtF_RoomRate: Number(data.hlmrtF_RoomRate),
            };

            const result = await saveRoomTariff(payload);

            if (result?.success) {
                toast.success(result.message || 'Room Tariff updated successfully');
                onSuccess();
            } else {
                toast.error(result?.message || 'Failed to update Room Tariff');
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Academic Year */}
                    <div>
                        <Label>Academic Year <span className='text-red-500'>*</span></Label>
                        <Controller
                            control={control}
                            name='asmaY_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Academic Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearList.map((year: any) => (
                                                <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                    {year.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </>
                            )}
                        />
                    </div>

                    {/* Room */}
                    <div>
                        <Label>Room <span className='text-red-500'>*</span></Label>
                        <Controller
                            control={control}
                            name='hrmrM_Id'
                            render={({ field, fieldState }) => (
                                <>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roomList.map((room: any) => (
                                                <SelectItem key={room.hrmrM_Id} value={room.hrmrM_Id.toString()}>
                                                    {room.hrmrM_RoomNo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormInput
                        control={control}
                        name="hlmrtF_SORate"
                        label="Single Bed Rate"
                        required
                        placeholder="Enter Rate"
                        type="number"
                    />

                    <FormInput
                        control={control}
                        name="hlmrtF_RoomRate"
                        label="Entire Room Rate"
                        required
                        placeholder="Enter Rate"
                        type="number"
                    />
                </div>

                <div className='flex justify-center gap-2'>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                    <Button type='button' variant='outline' onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}