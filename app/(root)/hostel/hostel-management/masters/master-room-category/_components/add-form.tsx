'use client';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form/form-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormError, Label } from '@/components/ui/extension/field';
import { Textarea } from '@/components/ui/textarea';
import { IMasterRoomCategoryForm, masterRoomCategorySchema } from '@/schemas/hostel/master-room-category.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMasterRoomCategory } from '@/hooks/hostel/useMasterRoomCategory';
import { saveRoomCategory } from '@/server/hostel/hostel-management/masters/room-category';
import { useHostelDropdownList } from '@/hooks/hostel/useMasterHostel';

interface AddMasterRoomCategoryFormProps {
    onSuccess: () => void;
    initialData?: any;
    feeGroups?: any[];
}

export default function AddMasterRoomCategoryForm({
    onSuccess,
    initialData,
    feeGroups = []
}: AddMasterRoomCategoryFormProps) {
    const { refetch } = useMasterRoomCategory();
    const { data: hostels } = useHostelDropdownList();

    const methods = useForm<IMasterRoomCategoryForm>({
        resolver: zodResolver(masterRoomCategorySchema),
        defaultValues: {
            hlmrcA_RoomCategory: '',
            hlmrcA_Description: '',
            hlmrcA_MaxCapacity: '',
            hlmrcA_RoomRate: '',
            hlmrcA_SORate: '0',
            hlmH_Id: '',
            fmG_Id: '',
            hlmrcA_ACFlg: false,
            hlmrcA_SharingFlg: false
        },
        mode: 'onChange'
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting }
    } = methods;

    useEffect(() => {
        if (initialData) {
            setValue('hlmrcA_RoomCategory', initialData.hlmrcA_RoomCategory);
            setValue('hlmrcA_Description', initialData.hlmrcA_Description);
            setValue('hlmrcA_MaxCapacity', initialData.hlmrcA_MaxCapacity?.toString());
            setValue('hlmrcA_RoomRate', initialData.hlmrcA_RoomRate?.toString());
            setValue('hlmrcA_SORate', initialData.hlmrcA_SORate?.toString());
            setValue('hlmrcA_ACFlg', initialData.hlmrcA_ACFlg);
            setValue('hlmrcA_SharingFlg', initialData.hlmrcA_SharingFlg);

            if (initialData.hlmH_Id) setValue('hlmH_Id', initialData.hlmH_Id.toString());
            if (initialData.fmG_Id) setValue('fmG_Id', initialData.fmG_Id.toString());
        }
    }, [initialData, setValue]);

    const onSubmit = async (data: IMasterRoomCategoryForm) => {
        try {
            const payload = {
                ...data,
                hlmrcA_Id: initialData?.hlmrcA_Id || 0,
                hlmH_Id: Number(data.hlmH_Id),
                fmG_Id: Number(data.fmG_Id),
                hlmrcA_MaxCapacity: Number(data.hlmrcA_MaxCapacity),
                hlmrcA_RoomRate: Number(data.hlmrcA_RoomRate),
                hlmrcA_SORate: Number(data.hlmrcA_SORate || 0)
            };

            const result = await saveRoomCategory(payload);
            if (result.success) {
                toast.success(result.message);
                refetch();
                onSuccess();
                if (!initialData) reset();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save room category');
        }
    };

    return (
        <div className='flex w-full flex-col gap-6'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md' noValidate>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

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

                        {/* Fee Group Selection */}
                        <div>
                            <Label>Fee Group <span className='text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='fmG_Id'
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select value={field.value?.toString()} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Fee Group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {feeGroups.map((fg: any) => (
                                                    <SelectItem key={fg.fmG_Id} value={fg.fmG_Id.toString()}>{fg.fmG_GroupName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                    </>
                                )}
                            />
                        </div>

                        <FormInput control={control} name="hlmrcA_RoomCategory" label="Category Name" required placeholder='Enter Category Name' />
                        <FormInput control={control} name="hlmrcA_MaxCapacity" label="Max Capacity" required type="number" placeholder='Enter Max Capacity' />
                        <FormInput control={control} name="hlmrcA_RoomRate" label="Room Rate" required type="number" placeholder='Enter Room Rate' />
                        <FormInput control={control} name="hlmrcA_SORate" label="SO Rate" type="number" placeholder='Enter SO Rate' />

                        <div className="col-span-1 md:col-span-2">
                            <Label>Description</Label>
                            <Controller
                                control={control}
                                name='hlmrcA_Description'
                                render={({ field }) => (
                                    <Textarea {...field} placeholder='Enter Description' />
                                )}
                            />
                        </div>

                        <div className="flex gap-6 mt-2">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="hlmrcA_ACFlg"
                                    render={({ field }) => (
                                        <Checkbox id="ac" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <label htmlFor="ac" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    AC Required
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="hlmrcA_SharingFlg"
                                    render={({ field }) => (
                                        <Checkbox id="sharing" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <label htmlFor="sharing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sharing Allowed
                                </label>
                            </div>
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
