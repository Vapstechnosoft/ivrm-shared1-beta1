'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterSection } from '@/hooks/admission/preadmission/useMasters';
import { masterSectionSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterSection } from '@/server/admission/preadmission/masters/section';
import type { IMasterSectionList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterSectionSchema.addOrUpdate>;

interface UpdateMasterSectionFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterSectionList;
}

export default function UpdateMasterSectionForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterSectionFormProps) {
    const { refetchAll } = useMasterSection();

    const {
        control,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterSectionSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                asmS_Id: row.asmS_Id,
                asmc_sectioncode: row.asmC_SectionCode,
                asmc_sectionname: row.asmC_SectionName,
                asmc_maxcapacity: row.asmC_MaxCapacity,
                asmc_order: row.asmC_Order
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { asmc_sectioncode, asmc_sectionname, asmc_maxcapacity, asmc_order } = data;
            const payload = {
                ASMS_Id: row.asmS_Id,
                ASMC_SectionCode: asmc_sectioncode,
                ASMC_SectionName: asmc_sectionname,
                ASMC_MaxCapacity: asmc_maxcapacity,
                ASMC_Order: asmc_order,
                ASMC_ActiveFlag: 1
            };

            const response = await addOrUpdateMasterSection(payload);

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
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <InputText
                            label='Class Code'
                            required
                            id='asmc_sectioncode'
                            {...register('asmc_sectioncode')}
                            defaultValue={row.asmC_SectionCode}
                            error={errors.asmc_sectioncode?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <InputText
                            label='Class Name'
                            required
                            id='asmc_sectionname'
                            {...register('asmc_sectionname')}
                            defaultValue={row.asmC_SectionName}
                            error={errors.asmc_sectionname?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmc_maxcapacity'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Max Capacity'
                                        required
                                        id='asmc_maxcapacity'
                                        defaultValue={row.asmC_MaxCapacity || 0}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmc_maxcapacity && <FormError>{errors.asmc_maxcapacity.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Controller
                                name='asmc_order'
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        label='Class Order'
                                        required
                                        id='asmc_order'
                                        defaultValue={row.asmC_Order}
                                        onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                        minValue={0}
                                        step={1}
                                    />
                                )}
                            />
                            {errors.asmc_order && <FormError>{errors.asmc_order.message}</FormError>}
                        </div>
                    </div>
                    {/* Root Error */}
                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                            Save Master Section
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
