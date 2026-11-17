'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { useMasterDepartment } from '@/hooks/library/useMasters';
import { masterDepartmentSchema } from '@/schemas/library/masters';
import { addOrUpdateMasterDepartment } from '@/server/library/masters/department';
import type { IMasterDepartment } from '@/types/library/masters/department';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterDepartmentSchema.addOrUpdate>;

interface UpdateMasterDepartmentFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterDepartment;
}

export default function UpdateMasterDepartmentForm({ onSuccess, className = '', selectedRow: row }: UpdateMasterDepartmentFormProps) {
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

    useEffect(() => {
        if (row) {
            reset({
                lmD_Id: row.lmD_Id,
                lmD_DepartmentName: row.lmD_DepartmentName,
                lmD_DepartmentCode: row.lmD_DepartmentCode,
                lmD_ActiveFlg: row.lmD_ActiveFlg
            });
        }
    }, [row, reset]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                ...data,
                lmD_Id: row.lmD_Id // Ensure ID is present
            };

            const response = await addOrUpdateMasterDepartment(payload);

            if (response.success) {
                toast.success(response.message || 'Record Updated Successfully!!!');
                reset(payload);
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Record Not Updated Successfully!!!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        if (row) {
            reset({
                lmD_Id: row.lmD_Id,
                lmD_DepartmentName: row.lmD_DepartmentName,
                lmD_DepartmentCode: row.lmD_DepartmentCode,
                lmD_ActiveFlg: row.lmD_ActiveFlg
            });
        }
    };

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
