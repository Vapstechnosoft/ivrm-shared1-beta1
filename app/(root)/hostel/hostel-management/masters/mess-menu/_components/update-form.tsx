'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessMenuSchema, MessMenuSchemaType } from '@/schemas/hostel/mess-menu.schema';
import { saveMessMenu } from '@/server/hostel/hostel-management/masters/menu';
import { IMessMenu } from '@/types/hostel/hostel-management/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw, Save } from 'lucide-react';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateMessMenuFormProps {
    rowData: IMessMenu;
    onSuccess?: () => void;
    messList: { hlmM_Id: number; hlmM_Name: string }[];
    categoryList: { hlmmC_Id: number; hlmmC_Name: string }[];
    className?: string;
}

export default function UpdateMessMenuForm({ rowData, onSuccess, messList, categoryList, className = '' }: UpdateMessMenuFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<MessMenuSchemaType>({
        resolver: zodResolver(MessMenuSchema),
        mode: 'onChange',
        defaultValues: {
            hlmmN_Id: rowData.hlmmN_Id,
            hlmM_Id: rowData.hlmM_Id,
            hlmmC_Id: rowData.hlmmC_Id,
            hlmmN_MenuName: rowData.hlmmN_MenuName,
            hlmmN_MenuDesc: rowData.hlmmN_MenuDesc,
        },
    });

    // Reset form when rowData changes
    useEffect(() => {
        if (rowData) {
            reset({
                hlmmN_Id: rowData.hlmmN_Id,
                hlmM_Id: rowData.hlmM_Id,
                hlmmC_Id: rowData.hlmmC_Id,
                hlmmN_MenuName: rowData.hlmmN_MenuName,
                hlmmN_MenuDesc: rowData.hlmmN_MenuDesc,
            });
        }
    }, [rowData, reset]);

    const onSubmit: SubmitHandler<MessMenuSchemaType> = async (data) => {
        try {
            const result = await saveMessMenu(data);

            if (result.success) {
                toast.success(result.message);
                onSuccess?.();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleReset = () => {
        reset({
            hlmmN_Id: rowData.hlmmN_Id,
            hlmM_Id: rowData.hlmM_Id,
            hlmmC_Id: rowData.hlmmC_Id,
            hlmmN_MenuName: rowData.hlmmN_MenuName,
            hlmmN_MenuDesc: rowData.hlmmN_MenuDesc,
        });
        toast.info('Form reset to original values');
    };

    return (
        <div className={`${className} items-center justify-center`}>
            <form onSubmit={handleSubmit(onSubmit)} className='items-center justify-center space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Mess Name */}
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='hlmM_Id'>
                                Mess Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(val) => setValue('hlmM_Id', Number(val))}
                                value={watch('hlmM_Id')?.toString() || ''}
                            >
                                <SelectTrigger className={errors.hlmM_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select Mess" />
                                </SelectTrigger>
                                <SelectContent>
                                    {messList.map((mess) => (
                                        <SelectItem key={mess.hlmM_Id} value={mess.hlmM_Id.toString()}>
                                            {mess.hlmM_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.hlmM_Id && <FormError>{errors.hlmM_Id.message}</FormError>}
                        </div>

                        {/* Mess Category */}
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='hlmmC_Id'>
                                Mess Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                onValueChange={(val) => setValue('hlmmC_Id', Number(val))}
                                value={watch('hlmmC_Id')?.toString() || ''}
                            >
                                <SelectTrigger className={errors.hlmmC_Id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryList.map((cat) => (
                                        <SelectItem key={cat.hlmmC_Id} value={cat.hlmmC_Id.toString()}>
                                            {cat.hlmmC_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.hlmmC_Id && <FormError>{errors.hlmmC_Id.message}</FormError>}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {/* Menu Name */}
                        <InputText
                            label='Menu Name'
                            required
                            id='hlmmN_MenuName'
                            {...register('hlmmN_MenuName')}
                            error={errors.hlmmN_MenuName?.message}
                            placeholder='Enter Menu Name'
                        />

                        {/* Description */}
                        <div className='group flex flex-col gap-2'>
                            <Label htmlFor='hlmmN_MenuDesc'>
                                Description
                            </Label>
                            <textarea
                                id='hlmmN_MenuDesc'
                                {...register('hlmmN_MenuDesc')}
                                className='min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                placeholder='Enter Description'
                            />
                            {errors.hlmmN_MenuDesc && <FormError>{errors.hlmmN_MenuDesc.message}</FormError>}
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
                            Update Menu
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}