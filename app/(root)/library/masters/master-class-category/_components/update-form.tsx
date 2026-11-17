'use client';

import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addOrUpdateMasterClassCategory } from '@/server/library/masters/class-category';
import type { IStaffList, IMasterClassCategory } from '@/types/library/masters/class-category';
import { masterClassCategorySchema } from '@/schemas/library/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useMasterClassCategory } from '@/hooks/library/useMasters';
import { useEffect } from 'react';

type FormSchema = z.infer<typeof masterClassCategorySchema.addOrUpdate>;

interface UpdateMasterClassCategoryFormProps {
    selectedRow: IMasterClassCategory;
    onSuccess?: () => void;
    staffList: IStaffList[];
}

export default function UpdateMasterClassCategoryForm({ selectedRow, onSuccess, staffList }: UpdateMasterClassCategoryFormProps) {
    const { refetchAll } = useMasterClassCategory();

    const form = useForm<FormSchema>({
        resolver: zodResolver(masterClassCategorySchema.addOrUpdate),
        defaultValues: {
            lmcC_Id: selectedRow.lmcC_Id,
            lmcC_CategoryName: selectedRow.lmcC_CategoryName,
            ivrmuL_Id: selectedRow.ivrmuL_Id
        }
    });

    useEffect(() => {
        if (selectedRow) {
            form.reset({
                lmcC_Id: selectedRow.lmcC_Id,
                lmcC_CategoryName: selectedRow.lmcC_CategoryName,
                ivrmuL_Id: selectedRow.ivrmuL_Id
            });
        }
    }, [selectedRow, form]);

    const mutation = useMutation({
        mutationFn: addOrUpdateMasterClassCategory,
        onSuccess: async (data) => {
            if (data.returnval) {
                toast.success('Record Updated Successfully!!!');
                await refetchAll();
                onSuccess?.();
            } else {
                toast.error('Record Not Updated Successfully!!!');
            }
        },
        onError: (error) => {
            toast.error('Failed to update record');
            console.error(error);
        }
    });

    const onSubmit = (data: FormSchema) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <InputText
                    {...form.register('lmcC_CategoryName')}
                    label='Class Category Name'
                    placeholder='Enter Category Name'
                    required
                    error={form.formState.errors.lmcC_CategoryName?.message}
                />

                <Controller
                    control={form.control}
                    name='ivrmuL_Id'
                    render={({ field }) => (
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-medium'>
                                Staff Name <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                value={field.value?.toString()}
                                onValueChange={(value) => field.onChange(Number(value))}
                                searchable>
                                <SelectTrigger className={form.formState.errors.ivrmuL_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder='--Select Staff--' />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map((staff) => (
                                        <SelectItem key={staff.hrmE_Id} value={staff.hrmE_Id.toString()}>
                                            {staff.hrmE_EmployeeFirstName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.ivrmuL_Id && (
                                <span className='text-sm text-red-500'>{form.formState.errors.ivrmuL_Id.message}</span>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className='flex justify-center gap-4'>
                <Button type='submit' disabled={mutation.isPending}>
                    <Save className='mr-2 h-4 w-4' />
                    {mutation.isPending ? 'Update' : 'Update'}
                </Button>
                <Button type='button' variant='destructive' onClick={() => onSuccess?.()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
