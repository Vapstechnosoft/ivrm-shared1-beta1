'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDepartment } from '@/hooks/library/useMasters';
import { masterDepartmentSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterDepartment } from '@/server/library/masters/department';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDepartmentSchema.addOrUpdate>;

interface AddMasterDepartmentFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterDepartmentForm({ onSuccess, className = '' }: AddMasterDepartmentFormProps) {
    const { refetchAll } = useMasterDepartment();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterDepartmentSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            lmD_Id: 0,
            lmD_DepartmentName: '',
            lmD_DepartmentCode: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                // Legacy doesn't seem to require much else.
                lmD_ActiveFlg: true, // Default to true on add? Legacy doesn't specify.
                lmD_Id: 0
            };

            const response = await addOrUpdateMasterDepartment(payload);

            // Legacy: if (promise.returnval != null && promise.duplicate != null)
            // if (promise.duplicate == false)
            // if (promise.returnval == true)

            if (response.success) {
                toast.success(response.message || 'Record Inserted Successfully!!!');
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Record Not Inserted Successfully!!!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <InputText
                            label='Department Name'
                            required
                            {...register('lmD_DepartmentName')}
                            error={errors.lmD_DepartmentName?.message}
                        />
                        <InputText
                            label='Department Code'
                            required
                            {...register('lmD_DepartmentCode')}
                            error={errors.lmD_DepartmentCode?.message}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
