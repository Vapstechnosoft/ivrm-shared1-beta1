'use client';

import { Button } from '@/components/ui/button';
import { CustomMultiSelectBox } from '@/components/ui/custom-multiselect';
import { FormError, Label } from '@/components/ui/extension/field';
import { FormInput } from '@/components/ui/form/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IMasterFloorForm, masterFloorSchema } from '@/schemas/hostel/master-floor.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMasterFloor } from '@/hooks/hostel/useMasterFloor';
import { useHostelDropdownList, useFacilityDropdownList } from '@/hooks/hostel/useMasterHostel';
import { getFloorDetails, saveFloor } from '@/server/hostel/hostel-management/masters/floor';

interface AddMasterFloorFormProps {
    onSuccess: () => void;
    initialData?: any;
}

export default function AddMasterFloorForm({
    onSuccess,
    initialData
}: AddMasterFloorFormProps) {
    const { refetch } = useMasterFloor();
    // Using hooks as requested
    const { data: hostels } = useHostelDropdownList();
    const { data: facilities } = useFacilityDropdownList();

    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const methods = useForm<IMasterFloorForm>({
        resolver: zodResolver(masterFloorSchema),
        defaultValues: {
            hrmF_FloorName: '',
            hrmF_FloorDesc: '',
            hlmH_Id: '',
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

    // Handle Edit Mode Binding
    // Handle Edit Mode Binding
    useEffect(() => {
        const fetchEditDetails = async () => {
            if (initialData?.hlmF_Id) {
                setIsLoadingDetails(true);
                try {
                    console.log('Fetching details for floor:', initialData.hlmF_Id);
                    // Fetch mapped facilities
                    const res = await getFloorDetails(initialData.hlmF_Id);
                    if (res.success && res.data) {
                        // Extract facility IDs from response data.facilities_list
                        const mappedFacilities = res.data.facilities_list || [];
                        const mappedIds = mappedFacilities.map((f: any) => f.hlmftY_Id.toString());

                        setValue('selectedFacilityIds', mappedIds);
                    }

                    // Set other fields from initialData (rowData)
                    setValue('hrmF_FloorName', initialData.hrmF_FloorName);
                    setValue('hrmF_FloorDesc', initialData.hrmF_FloorDesc);
                    // Ensure hlmH_Id is a string for the Select component
                    setValue('hlmH_Id', initialData.hlmH_Id?.toString() || '');

                } catch (error) {
                    console.error("Failed to fetch floor details", error);
                    toast.error("Failed to load floor details.");
                } finally {
                    setIsLoadingDetails(false);
                }
            }
        };

        if (initialData) {
            console.log('Initial Data for Edit:', initialData);
            fetchEditDetails();
        }
    }, [initialData, setValue]);


    const onSubmit = async (data: IMasterFloorForm) => {
        try {
            console.log('Form submission data:', data);
            // Transform form data to API payload
            // Ensure hlmF_Id is passed if it exists in initialData, for update
            const payload = {
                ...data,
                hlmF_Id: initialData?.hlmF_Id || 0,
                hrmF_FloorName: data.hrmF_FloorName,
                hrmF_FloorDesc: data.hrmF_FloorDesc,
                hlmH_Id: Number(data.hlmH_Id),
                selected_facilities: (data.selectedFacilityIds || []).map(id => ({
                    hlmftY_Id: Number(id),
                    hlmfF_ActiveFlg: true
                }))
            };

            console.log('Saving Payload:', payload);

            const result = await saveFloor(payload);
            if (result.success) {
                toast.success(result.message);
                refetch();
                onSuccess();
                if (!initialData) reset();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error('Save error', error);
            toast.error(error.message || 'Failed to save floor');
        }
    };

    if (isLoadingDetails) {
        return <div className="p-4 text-center">Loading floor details...</div>;
    }

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <div className='flex flex-col gap-6 md:flex-row'>
                        <div className='flex flex-1 flex-col gap-4'>

                            {/* Hostel Selection */}
                            <div>
                                <Label>Hostel Name <span className='text-red-500'>*</span></Label>
                                <Controller
                                    control={control}
                                    name='hlmH_Id'
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select value={field.value?.toString()} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Hostel" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                                                    {hostels && hostels.map((h: any) => (
                                                        <SelectItem key={h.hlmH_Id} value={h.hlmH_Id.toString()}>{h.hlmH_Name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                        </>
                                    )}
                                />
                            </div>

                            <FormInput control={control} name="hrmF_FloorName" label="Floor Name" required placeholder='Enter Floor Name' />

                            <div>
                                <Label>Description</Label>
                                <Controller
                                    control={control}
                                    name='hrmF_FloorDesc'
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder='Enter Description' />
                                    )}
                                />
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
