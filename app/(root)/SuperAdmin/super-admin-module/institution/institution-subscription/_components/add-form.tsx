'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { institutionSubscriptionSchema } from '@/schemas/super-admin/super-admin-module/institution/institution-subscription';
import { addOrUpdateInstitutionSubscription } from '@/server/super-admin/super-admin-module/institution/institution-subscription';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { useInstitutionSubscriptionDropdown } from '@/hooks/super-admin/super-admin-module/use-master-institution';
import type { IInstitutionDropdown } from '@/types/super-admin/super-admin-module/institution/master-institution';
import { useEffect, useState } from 'react';

// Mock Data Removed

type FormFields = z.infer<typeof institutionSubscriptionSchema.addOrUpdate>;

interface AddInstitutionSubscriptionFormProps {
    onSuccess?: () => void;
}

export default function AddInstitutionSubscriptionForm({ onSuccess }: AddInstitutionSubscriptionFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(institutionSubscriptionSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            misV_ActiveFlag: true
        }
    });

    const { data: institutionResponse, isLoading: isInstitutionLoading } = useInstitutionSubscriptionDropdown();
    const institutionOptions = (institutionResponse?.data?.institutionList || []) as IInstitutionDropdown[];

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Form Data:', data);
            const response = await addOrUpdateInstitutionSubscription(data);

            if (response.success) {
                toast.success(response.message || 'Subscription added successfully');
                reset();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to add Subscription');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => reset();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 pt-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col space-y-2'>
                    <Label htmlFor='mI_Id'>Institution Name <span className='text-red-500'>*</span></Label>
                    <Controller
                        name='mI_Id'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isInstitutionLoading ? "Loading Institutions..." : "Select Institution"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {institutionOptions.map((option) => (
                                        <SelectItem key={option.mI_Id} value={option.mI_Id.toString()}>
                                            {option.mI_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.mI_Id && <FormError>{errors.mI_Id.message}</FormError>}
                </div>

                {/* Start Date Picker */}
                <div className='flex flex-col space-y-2'>
                    <Label>Start Date <span className='text-red-500'>*</span></Label>
                    <Controller
                        control={control}
                        name='misV_FromDate'
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, 'dd-MM-yyyy')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.misV_FromDate && <FormError>{errors.misV_FromDate.message}</FormError>}
                </div>

                {/* End Date Picker */}
                <div className='flex flex-col space-y-2'>
                    <Label>End Date <span className='text-red-500'>*</span></Label>
                    <Controller
                        control={control}
                        name='misV_ToDate'
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, 'dd-MM-yyyy')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.misV_ToDate && <FormError>{errors.misV_ToDate.message}</FormError>}
                </div>

                <div className='flex flex-col space-y-3'>
                    <Label>Subscription Type <span className='text-red-500'>*</span></Label>
                    <Controller
                        control={control}
                        name='misV_SubscriptionType'
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className='flex flex-row space-x-4'
                            >
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Licence' id='r1' />
                                    <Label htmlFor='r1' className='font-normal'>Licence</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Trial' id='r2' />
                                    <Label htmlFor='r2' className='font-normal'>Trial</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.misV_SubscriptionType && <FormError>{errors.misV_SubscriptionType.message}</FormError>}
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
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save
                    </div>
                </Button>
            </div>
        </form>
    );
}
