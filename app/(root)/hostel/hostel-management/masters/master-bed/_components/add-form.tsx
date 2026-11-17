'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { useFormContext } from '@/components/ui/form/form-provider';
import { FormInput } from '@/components/ui/form/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MasterBedSchema, MasterBedSchemaType } from '@/schemas/hostel/master-bed.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IBedDisplay, IFloor, IHostel, IRoom } from '@/types/hostel/hostel-management/masters';
import { fetchFloors, fetchRooms, saveBed } from '@/server/hostel/hostel-management/masters/bed';

interface AddMasterBedFormProps {
    onSuccess: () => void;
    hostels: IHostel[];
}

export default function AddMasterBedForm({ onSuccess, hostels }: AddMasterBedFormProps) {
    const { closeAddForm } = useFormContext();
    const [floors, setFloors] = useState<IFloor[]>([]);
    const [rooms, setRooms] = useState<IRoom[]>([]);

    const form = useForm<MasterBedSchemaType>({
        resolver: zodResolver(MasterBedSchema),
        defaultValues: {
            HLMH_Id: 0,
            HLMF_Id: 0,
            HRMRM_Id: 0,
            HLMB_BedName: '',
            HLMB_MattressFlg: false,
            HLMB_BedSheetFlg: false,
            HLMB_PillowFlg: false,
            HLMB_StudyTableFlg: false,
            HLMB_LampFlg: false,
        },
    });

    const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;

    const selectedHostel = watch('HLMH_Id');
    const selectedFloor = watch('HLMF_Id');

    // Fetch floors when Hostel changes
    useEffect(() => {
        if (selectedHostel) {
            const loadFloors = async () => {
                const result = await fetchFloors(Number(selectedHostel));
                setFloors(result.floors);
            };
            loadFloors();
        } else {
            setFloors([]);
        }
    }, [selectedHostel]);

    // Fetch rooms when Floor changes
    useEffect(() => {
        if (selectedFloor) {
            const loadRooms = async () => {
                const result = await fetchRooms(Number(selectedFloor));
                setRooms(result.rooms);
            };
            loadRooms();
        } else {
            setRooms([]);
        }
    }, [selectedFloor]);

    const onSubmit = async (data: MasterBedSchemaType) => {
        const result = await saveBed(data);
        if (result.success) {
            toast.success(result.message);
            onSuccess();
            closeAddForm();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="p-4 bg-background rounded-lg border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="space-y-4">
                        {/* Hostel */}
                        <div className="space-y-2">
                            <Label >Hostel Name <span className="text-destructive">*</span></Label>
                            <Controller
                                control={control}
                                name="HLMH_Id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                            setValue('HLMF_Id', 0); // Reset floor
                                            setValue('HRMRM_Id', 0); // Reset room
                                        }}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <SelectTrigger className={errors.HLMH_Id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hostels.map((h) => (
                                                <SelectItem key={h.hlmH_Id} value={h.hlmH_Id.toString()}>
                                                    {h.hlmH_Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.HLMH_Id?.message}</FormError>
                        </div>

                        {/* Floor */}
                        <div className="space-y-2">
                            <Label >Floor Name</Label>
                            <Controller
                                control={control}
                                name="HLMF_Id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                            setValue('HRMRM_Id', 0); // Reset room
                                        }}
                                        value={field.value ? field.value.toString() : ''}
                                        disabled={!selectedHostel}
                                    >
                                        <SelectTrigger className={errors.HLMF_Id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {floors.map((f) => (
                                                <SelectItem key={f.hlmF_Id} value={f.hlmF_Id.toString()}>
                                                    {f.hrmF_FloorName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.HLMF_Id?.message}</FormError>
                        </div>

                        {/* Room */}
                        <div className="space-y-2">
                            <Label>Room Details <span className="text-destructive">*</span></Label>
                            <Controller
                                control={control}
                                name="HRMRM_Id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                        disabled={!selectedFloor}
                                    >
                                        <SelectTrigger className={errors.HRMRM_Id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((r) => (
                                                <SelectItem key={r.hrmrM_Id} value={r.hrmrM_Id.toString()}>
                                                    {r.hrmrM_RoomNo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError>{errors.HRMRM_Id?.message}</FormError>
                        </div>

                        {/* Bed Name */}
                        <FormInput
                            control={control}
                            name="HLMB_BedName"
                            label="Bed Name"
                            placeholder="Enter Bed Name"
                            required
                        />
                    </div>

                    {/* RIGHT COLUMN - Facilities */}
                    <div className="space-y-4">
                        <Label>Facility Flag :</Label>
                        <div className="flex flex-wrap gap-4 p-4 border rounded-md">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="HLMB_MattressFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>Mattress</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="HLMB_BedSheetFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>BedSheet</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="HLMB_PillowFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>Pillow</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="HLMB_StudyTableFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>StudyTable</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="HLMB_LampFlg"
                                    render={({ field }) => (
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <span>Lamp</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4 border-t mt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-32">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={closeAddForm} className="w-32">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
