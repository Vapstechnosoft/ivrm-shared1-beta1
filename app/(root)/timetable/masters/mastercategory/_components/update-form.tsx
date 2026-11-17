'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { useTimeTableMasterCategory } from '@/hooks/timetable/useMasters';
import { masterTimeTableCategorySchema } from '@/schemas/timetable/masters';
import { addOrUpdateTimetableMasterCategory } from '@/server/timetable/masters/masterCategory';
import type { ITimeTableMasterCategory } from '@/types/timetable/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterTimeTableCategorySchema.addOrUpdate>;

interface UpdateMasterCategoryFormProps {
    onSuccess?: () => void;
    masterbuilding?: string;
    selectedRow: ITimeTableMasterCategory;
}

export default function UpdateMasterCategoryForm({ onSuccess, masterbuilding = '', selectedRow: row }: UpdateMasterCategoryFormProps) {
    const { refetchAll } = useTimeTableMasterCategory();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterTimeTableCategorySchema.addOrUpdate),
        mode: 'onChange'
    });

    useEffect(() => {
        if (row) {
            reset({
                ttmC_Id: row.ttmC_Id,
                ttmC_CategoryName: row.ttmC_CategoryName
            });
        }
    }, [row, reset, setValue]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const { ttmC_CategoryName, ttmC_Id } = data;
            const payload = {
                ttmC_CategoryName: ttmC_CategoryName,
                ttmC_Id: ttmC_Id
            };
            const response = await addOrUpdateTimetableMasterCategory(payload);

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
                                <Label htmlFor='ttmC_CategoryName' className='whitespace-nowrap font-medium text-gray-700 text-sm'>
                                    Category Name
                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <div className='w-full md:w-[250px]'>
                                    <InputText
                                        id='ttmC_CategoryName'
                                        {...register('ttmC_CategoryName')}
                                        error={errors.ttmC_CategoryName?.message}
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
