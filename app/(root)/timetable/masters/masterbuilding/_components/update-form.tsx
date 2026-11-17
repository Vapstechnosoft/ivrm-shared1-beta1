'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterBuilding } from '@/hooks/timetable/useMasters';
import { masterBuildingSchema } from '@/schemas/timetable/masters';
import { addOrUpdateMasterBuilding } from '@/server/timetable/masters/masterbuilding';
import type { IMasterBuildingList } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterBuildingSchema.addOrUpdate>;

interface UpdateMasterBuildingFormProps {
    onSuccess?: () => void;
    masterbuilding?: string;
    selectedRow: IMasterBuildingList;
}

export default function UpdateMasterBuildingForm({ onSuccess, masterbuilding = '', selectedRow: row }: UpdateMasterBuildingFormProps) {
    const { refetchAll } = useMasterBuilding();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterBuildingSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ttmB_Id: row.ttmB_Id,
                ttmB_BuildingName: row.ttmB_BuildingName
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ttmB_BuildingName, ttmB_Id } = data;
            const payload = {
                ttmB_BuildingName: ttmB_BuildingName,
                ttmB_Id: ttmB_Id
            };
            const response = await addOrUpdateMasterBuilding(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${masterbuilding}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='space-y-4'>
                        <div className='flex flex-col items-center justify-center gap-4 md:flex-row'>
                            <div className='flex w-full items-center gap-3 md:w-auto'>
                                <Label htmlFor='ttmB_BuildingName' className='whitespace-nowrap font-medium text-gray-700 text-sm'>
                                    Building Name
                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <div className='w-full md:w-[250px]'>
                                    <InputText
                                        id='ttmB_BuildingName'
                                        {...register('ttmB_BuildingName')}
                                        error={errors.ttmB_BuildingName?.message}
                                        className='w-full transition-colors focus:ring-2 focus:ring-primary/20'
                                        // Remove the label prop if InputText component has one
                                    />
                                </div>
                            </div>
                        </div>

                        {errors.root && <FormError className='text-center'>{errors.root.message}</FormError>}
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
