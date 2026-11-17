'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterReligion } from '@/hooks/admission/preadmission/useMasters';
import { masterReligionSchema } from '@/schemas/admission/preadmission/masters';
import { addOrUpdateMasterReligion } from '@/server/admission/preadmission/masters/religion';
import type { IMasterReligionList } from '@/types/admission/preadmission/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterReligionSchema.addOrUpdate>;

interface UpdateMasterReligionFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterReligionList;
}

export default function UpdateMasterReligionForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterReligionFormProps) {
    const { refetchAll } = useMasterReligion();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterReligionSchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ivrmmR_Id: row.ivrmmR_Id,
                ivrmmR_Name: row.ivrmmR_Name
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ivrmmR_Id, ivrmmR_Name } = data;
            const payload = {
                IVRMMR_Id: ivrmmR_Id,
                IvrmmR_Name: ivrmmR_Name,
                Is_Active: true
            };

            const response = await addOrUpdateMasterReligion(payload);

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
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Religion Name'
                            required
                            id='ivrmmR_Name'
                            {...register('ivrmmR_Name')}
                            defaultValue={row.ivrmmR_Name}
                            error={errors.ivrmmR_Name?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
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
                            Save Master Class
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
