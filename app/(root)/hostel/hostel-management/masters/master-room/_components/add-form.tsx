'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { FormInput } from '@/components/ui/form/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IMasterRoomForm, masterRoomSchema } from '@/schemas/hostel/master-room.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useMasterRoom, useFloorsByHostel, useRoomCategoryByHostel } from '@/hooks/hostel/useMasterRoom';
import { useHostelDropdownList, useFacilityDropdownList } from '@/hooks/hostel/useMasterHostel';
import { getRoomDetails, saveRoom, getMappedFacilitiesForRoom } from '@/server/hostel/hostel-management/masters/room';
import { Checkbox } from '@/components/ui/checkbox';

interface AddMasterRoomFormProps {
    onSuccess: () => void;
    initialData?: any;
}

export default function AddMasterRoomForm({
    onSuccess,
    initialData
}: AddMasterRoomFormProps) {
    const { refetchAll } = useMasterRoom();
    const { data: hostels } = useHostelDropdownList();
    const { data: facilities } = useFacilityDropdownList();

    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const methods = useForm<IMasterRoomForm>({
        resolver: zodResolver(masterRoomSchema),
        defaultValues: {
            hlmH_Id: '',
            hlmF_Id: '',
            hlmrcA_Id: '',
            hrmrM_RoomNo: '',
            hrmrM_BedCapacity: '',
            hrmrM_RoomDesc: '',
            hrmrM_ACFlg: false,
            hrmrM_SharingFlg: false,
            hrmrM_RoomForStudentFlg: false,
            hrmrM_RoomForStaffFlg: false,
            hrmrM_RoomForGuestFlg: false,
            selectedFacilityIds: []
        },
        mode: 'onChange'
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = methods;

    const selectedHostel = useWatch({ control, name: 'hlmH_Id' });

    // Fetch dependent dropdowns
    const { data: floors } = useFloorsByHostel(selectedHostel);
    const { data: roomCategories } = useRoomCategoryByHostel(selectedHostel); // Assuming categories depend on hostel

    // Handle Edit Mode Binding
    useEffect(() => {
        const fetchEditDetails = async () => {
            if (initialData?.hrmrM_Id) {
                setIsLoadingDetails(true);
                try {
                    // Fetch mapped facilities
                    const res = await getMappedFacilitiesForRoom(initialData.hrmrM_Id);
                    let mappedIds: string[] = [];
                    if (res.success && res.data) {
                        const mappedFacilities = Array.isArray(res.data) ? res.data : (res.data.facilities_list || []);
                        mappedIds = mappedFacilities.map((f: any) => f.hlmftY_Id.toString());
                    }

                    setValue('selectedFacilityIds', mappedIds);

                    // Set other fields
                    setValue('hrmrM_RoomNo', initialData.hrmrM_RoomNo);
                    setValue('hrmrM_BedCapacity', initialData.hrmrM_BedCapacity.toString());
                    setValue('hrmrM_RoomDesc', initialData.hrmrM_RoomDesc || '');
                    setValue('hrmrM_ACFlg', initialData.hrmrM_ACFlg);
                    setValue('hrmrM_SharingFlg', initialData.hrmrM_SharingFlg);
                    setValue('hrmrM_RoomForStudentFlg', initialData.hrmrM_RoomForStudentFlg);
                    setValue('hrmrM_RoomForStaffFlg', initialData.hrmrM_RoomForStaffFlg);
                    setValue('hrmrM_RoomForGuestFlg', initialData.hrmrM_RoomForGuestFlg);

                    // Set Dropdowns sequentially to ensure options are loaded (though React Query handles caching well)
                    setValue('hlmH_Id', initialData.hlmH_Id?.toString() || '');

                    // Small timeout or simply setting them works if options are available. 
                    // React Query dependent queries will run when hlmH_Id changes.
                    // We might need to wait for list return or just set value.
                    // Since 'floors' and 'roomCategories' hooks depend on 'selectedHostel', 
                    // setting 'hlmH_Id' triggers them. We just need to ensure values are set.
                    setValue('hlmF_Id', initialData.hlmF_Id?.toString() || '');
                    setValue('hlmrcA_Id', initialData.hlmrcA_Id?.toString() || '');

                } catch (error) {
                    console.error("Failed to fetch room details", error);
                    toast.error("Failed to load room details.");
                } finally {
                    setIsLoadingDetails(false);
                }
            }
        };

        if (initialData) {
            fetchEditDetails();
        }
    }, [initialData, setValue]);

    const onSubmit = async (data: IMasterRoomForm) => {
        try {
            const payload = {
                ...data,
                hrmrM_Id: initialData?.hrmrM_Id || 0,
                hlmH_Id: Number(data.hlmH_Id),
                hlmF_Id: Number(data.hlmF_Id),
                hlmrcA_Id: Number(data.hlmrcA_Id),
                hrmrM_BedCapacity: Number(data.hrmrM_BedCapacity),
                facilities: (data.selectedFacilityIds || []).map(id => ({
                    hlmftY_Id: Number(id),
                    hrmrmF_ActiveFlg: true
                }))
            };

            // Remove helper field
            // @ts-ignore
            payload.selectedFacilityIds = undefined;

            const result = await saveRoom(payload);
            if (result.success) {
                toast.success(result.message);
                refetchAll();
                onSuccess();
                if (!initialData) reset();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error('Save error', error);
            toast.error(error.message || 'Failed to save room');
        }
    };

    if (isLoadingDetails) {
        return <div className="p-4 text-center">Loading room details...</div>;
    }

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <div className='flex flex-col gap-6 md:flex-row'>
                        <div className='flex flex-1 flex-col gap-4'>

                            {/* Hostel Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Hostel Name <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        control={control}
                                        name='hlmH_Id'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select value={field.value} onValueChange={(val) => {
                                                    field.onChange(val);
                                                    setValue('hlmF_Id', ''); // Reset dependent fields
                                                    setValue('hlmrcA_Id', '');
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Hostel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hostels?.map((h: any) => (
                                                            <SelectItem key={h.hlmH_Id} value={h.hlmH_Id.toString()}>{h.hlmH_Name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label>Floor Name <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        control={control}
                                        name='hlmF_Id'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={!selectedHostel}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Floor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {floors?.map((f: any) => (
                                                            <SelectItem key={f.hlmF_Id} value={f.hlmF_Id.toString()}>{f.hrmF_FloorName}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label>Room Category <span className='text-red-500'>*</span></Label>
                                    <Controller
                                        control={control}
                                        name='hlmrcA_Id'
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={!selectedHostel}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Room Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roomCategories?.map((c: any) => (
                                                            <SelectItem key={c.hlmrcA_Id} value={c.hlmrcA_Id.toString()}>{c.hlmrcA_RoomCategory}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </>
                                        )}
                                    />
                                </div>

                                <FormInput control={control} name="hrmrM_RoomNo" label="Room No." required placeholder='Enter Room No.' />
                            </div>

                            <FormInput control={control} name="hrmrM_BedCapacity" label="Bed Capacity" required placeholder='Enter Bed Capacity' type="number" />

                            <div>
                                <Label>Description</Label>
                                <Controller
                                    control={control}
                                    name='hrmrM_RoomDesc'
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder='Enter Description' />
                                    )}
                                />
                            </div>

                            {/* Checkboxes Group */}
                            <div className="flex flex-wrap gap-4 p-4 border rounded-md">
                                {[
                                    { name: 'hrmrM_ACFlg', label: 'AC Room' },
                                    { name: 'hrmrM_SharingFlg', label: 'Sharing Room' },
                                    { name: 'hrmrM_RoomForStudentFlg', label: 'For Student' },
                                    { name: 'hrmrM_RoomForStaffFlg', label: 'For Staff' },
                                    { name: 'hrmrM_RoomForGuestFlg', label: 'For Guest' },
                                ].map((item) => (
                                    <Controller
                                        key={item.name}
                                        control={control}
                                        name={item.name as keyof IMasterRoomForm}
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={item.name}
                                                    checked={field.value as boolean}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <Label htmlFor={item.name} className="cursor-pointer">
                                                    {item.label}
                                                </Label>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Facilities MultiSelect */}
                            <Controller
                                control={control}
                                name="selectedFacilityIds"
                                render={({ field }) => (
                                    <CustomMultiSelectBox
                                        label="Facilities"
                                        options={(facilities?.data || []).map((f: any) => ({
                                            label: f.hlmftY_FacilityName,
                                            value: f.hlmftY_Id.toString()
                                        }))}
                                        value={field.value || []}
                                        onChange={(vals) => field.onChange(vals)}
                                        error={errors.selectedFacilityIds?.message}
                                        isSearchRequired
                                    />
                                )}
                            />

                        </div>
                    </div>

                    <div className='flex justify-center gap-2'>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update' : 'Save')}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                                reset();
                                onSuccess();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
