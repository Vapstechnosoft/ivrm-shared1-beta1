'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RoomCategorySchema, RoomCategorySchemaType } from '@/schemas/hostel/room-category.schema';
import { IFeeGroup, IHostel, IRoomCategory } from '@/types/hostel/hostel-management/masters';
import { saveRoomCategory } from '@/server/hostel/hostel-management/masters/room-category';
import { useRoomCategory } from '@/hooks/hostel/useRoomCategory';

interface UpdateRoomCategoryFormProps {
    initialData: IRoomCategory;
    onSuccess?: () => void;
    onCancel?: () => void;
    hostelList: IHostel[];
    feeGroupList: IFeeGroup[];
    className?: string;
}

export default function UpdateRoomCategoryForm({
    initialData,
    onSuccess,
    onCancel,
    hostelList,
    feeGroupList,
    className = ''
}: UpdateRoomCategoryFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RoomCategorySchemaType>({
        resolver: zodResolver(RoomCategorySchema),
        mode: 'onChange',
        defaultValues: {
            hlmrcA_Id: initialData.hlmrcA_Id,
            HLMH_Id: initialData.hlmH_Id,
            FMG_Id: initialData.fmG_Id,
            HLMRCA_RoomCategory: initialData.hlmrcA_RoomCategory,
            HLMRCA_SORate: initialData.hlmrcA_SORate,
            HLMRCA_RoomRate: initialData.hlmrcA_RoomRate,
            HLMRCA_MaxCapacity: initialData.hlmrcA_MaxCapacity,
            HLMRCA_Description: initialData.hlmrcA_Description,
            hlmrcA_ACFlg: initialData.hlmrcA_ACFlg,
            hlmrcA_SharingFlg: initialData.hlmrcA_SharingFlg,
            hlmrcA_ActiveFlag: initialData.hlmrcA_ActiveFlag,
        },
    });

    const sharingFlag = watch('hlmrcA_SharingFlg');
    const { refetchAll } = useRoomCategory();

    // Reset form when initialData changes
    useEffect(() => {
        reset({
            hlmrcA_Id: initialData.hlmrcA_Id,
            HLMH_Id: initialData.hlmH_Id,
            FMG_Id: initialData.fmG_Id,
            HLMRCA_RoomCategory: initialData.hlmrcA_RoomCategory,
            HLMRCA_SORate: initialData.hlmrcA_SORate,
            HLMRCA_RoomRate: initialData.hlmrcA_RoomRate,
            HLMRCA_MaxCapacity: initialData.hlmrcA_MaxCapacity,
            HLMRCA_Description: initialData.hlmrcA_Description,
            hlmrcA_ACFlg: initialData.hlmrcA_ACFlg,
            hlmrcA_SharingFlg: initialData.hlmrcA_SharingFlg,
            hlmrcA_ActiveFlag: initialData.hlmrcA_ActiveFlag,
        });
    }, [initialData, reset]);

    useEffect(() => {
        if (!sharingFlag) {
            setValue('HLMRCA_RoomRate', 0);
        }
    }, [sharingFlag, setValue]);

    const onSubmit: SubmitHandler<RoomCategorySchemaType> = async (data) => {
        try {
            const result = await saveRoomCategory(data);

            if (result?.success) {
                toast.success('Room Category updated successfully');
                onSuccess?.();
                refetchAll();
            } else {
                if (result?.message) {
                    toast.error(result?.message);
                } else {
                    toast.error('Failed to update Room Category');
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        reset({
            hlmrcA_Id: initialData.hlmrcA_Id,
            HLMH_Id: initialData.hlmH_Id,
            FMG_Id: initialData.fmG_Id,
            HLMRCA_RoomCategory: initialData.hlmrcA_RoomCategory,
            HLMRCA_SORate: initialData.hlmrcA_SORate,
            HLMRCA_RoomRate: initialData.hlmrcA_RoomRate,
            HLMRCA_MaxCapacity: initialData.hlmrcA_MaxCapacity,
            HLMRCA_Description: initialData.hlmrcA_Description,
            hlmrcA_ACFlg: initialData.hlmrcA_ACFlg,
            hlmrcA_SharingFlg: initialData.hlmrcA_SharingFlg,
            hlmrcA_ActiveFlag: initialData.hlmrcA_ActiveFlag,
        });
        toast.info('Form reset to original values');
    };

    return (
        <div className={`${className} items-center justify-center`}>
            <form onSubmit={handleSubmit(onSubmit)} className='items-center justify-center space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Hostel Name */}
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='HLMH_Id'>
                                Hostel Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(val) => setValue('HLMH_Id', Number(val))}
                                value={watch('HLMH_Id')?.toString() || ''}
                            >
                                <SelectTrigger className={errors.HLMH_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="--Select Hostel--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hostelList.map((hostel) => (
                                        <SelectItem key={hostel.hlmH_Id} value={hostel.hlmH_Id.toString()}>
                                            {hostel.hlmH_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.HLMH_Id && <FormError>{errors.HLMH_Id.message}</FormError>}
                        </div>

                        {/* Fee Group */}
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='FMG_Id'>
                                Fee Group <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(val) => setValue('FMG_Id', Number(val))}
                                value={watch('FMG_Id')?.toString() || ''}
                            >
                                <SelectTrigger className={errors.FMG_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="--Select Fee Group--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {feeGroupList.map((group) => (
                                        <SelectItem key={group.fmG_Id} value={group.fmG_Id.toString()}>
                                            {group.fmG_GroupName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.FMG_Id && <FormError>{errors.FMG_Id.message}</FormError>}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Room Category */}
                        <InputText
                            label='Room Category'
                            required
                            id='HLMRCA_RoomCategory'
                            {...register('HLMRCA_RoomCategory')}
                            error={errors.HLMRCA_RoomCategory?.message}
                            placeholder='Enter Room Category Name'
                        />

                        {/* Single Bed Occupancy Rate */}
                        <InputText
                            label='Single Bed Occupancy Rate'
                            required
                            id='HLMRCA_SORate'
                            {...register('HLMRCA_SORate', { valueAsNumber: true })}
                            error={errors.HLMRCA_SORate?.message}
                            placeholder='Enter Rate'
                            type='number'
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Multiple Bed Occupancy Rate */}
                        <InputText
                            label='Multiple Bed Occupancy Rate'
                            id='HLMRCA_RoomRate'
                            {...register('HLMRCA_RoomRate', { valueAsNumber: true })}
                            error={errors.HLMRCA_RoomRate?.message}
                            placeholder='Enter Rate'
                            type='number'
                            disabled={!sharingFlag}
                        />

                        {/* Max Capacity */}
                        <InputText
                            label='Max Capacity'
                            required
                            id='HLMRCA_MaxCapacity'
                            {...register('HLMRCA_MaxCapacity', { valueAsNumber: true })}
                            error={errors.HLMRCA_MaxCapacity?.message}
                            placeholder='Enter Max Capacity'
                            type='number'
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-4'>
                            <div className='flex items-center space-x-2'>
                                <Controller
                                    name='hlmrcA_ACFlg'
                                    control={useForm().control}
                                    render={({ field }) => (
                                        <>
                                            <Checkbox
                                                id="acFlag"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <Label htmlFor="acFlag">Whether This Room Have AC?</Label>
                                        </>
                                    )}
                                />
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Controller
                                    name='hlmrcA_SharingFlg'
                                    control={useForm().control}
                                    render={({ field }) => (
                                        <>
                                            <Checkbox
                                                id="shareFlag"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <Label htmlFor="shareFlag">Whether This Room is Sharing?</Label>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='HLMRCA_Description'>
                                Description <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <textarea
                                id='HLMRCA_Description'
                                {...register('HLMRCA_Description')}
                                className='min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                placeholder='Enter Description...'
                            />
                            {errors.HLMRCA_Description && <FormError>{errors.HLMRCA_Description.message}</FormError>}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Reset
                    </Button>

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Category
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}