'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getReportDetails } from '@/server/alumni/user-password-creation';
import type { IClass, ISection, IYear } from '@/types/alumni/user-password-creation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type UserPasswordCreationSchema, userPasswordCreationSchema } from './schema';

interface FilterFormProps {
    years: IYear[];
    classes: IClass[];
    sections: ISection[];
    onSuccess: (data: any, filterdata: string) => void;
    onReset: () => void;
    onLoading: (isLoading: boolean) => void;
}

export default function FilterForm({ years, classes, sections, onSuccess, onReset, onLoading }: FilterFormProps) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm<UserPasswordCreationSchema>({
        resolver: zodResolver(userPasswordCreationSchema),
        defaultValues: {
            filterdata: 'reg',
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: ''
        }
    });

    const filterdata = watch('filterdata');

    const onSubmit = async (values: UserPasswordCreationSchema) => {
        onLoading(true);
        try {
            const payload = {
                asmaY_Id: Number(values.asmaY_Id),
                asmcL_Id: Number(values.asmcL_Id),
                asmS_Id: values.asmS_Id ? Number(values.asmS_Id) : 0,
                filterdata: values.filterdata
            };

            const res = await getReportDetails(payload);
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                onSuccess(res.data, values.filterdata);
            } else {
                toast.error(res.message || 'No Records Found');
                onSuccess([], values.filterdata);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch report');
        } finally {
            onLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        onReset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex justify-center'>
                <div className='w-full max-w-md rounded-lg border bg-muted/30 p-4'>
                    <Controller
                        name='filterdata'
                        control={control}
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange} className='flex justify-center gap-8'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='reg' id='all' />
                                    <Label htmlFor='all' className='cursor-pointer'>
                                        All
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='new' id='new' />
                                    <Label htmlFor='new' className='cursor-pointer'>
                                        New
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='Alumni' id='alumni' />
                                    <Label htmlFor='alumni' className='cursor-pointer'>
                                        Alumni
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='asmaY_Id'>
                        Academic Year <span className='text-red-500'>*</span>
                    </Label>
                    <Select onValueChange={(v) => setValue('asmaY_Id', v)} value={watch('asmaY_Id')}>
                        <SelectTrigger id='asmaY_Id'>
                            <SelectValue placeholder='Select Year' />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>
                                    {y.asmaY_Year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                </div>

                <div className='flex flex-col gap-2'>
                    <Label htmlFor='asmcL_Id'>
                        Class <span className='text-red-500'>*</span>
                    </Label>
                    <Select onValueChange={(v) => setValue('asmcL_Id', v)} value={watch('asmcL_Id')}>
                        <SelectTrigger id='asmcL_Id'>
                            <SelectValue placeholder='Select Class' />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((c) => (
                                <SelectItem key={c.asmcL_Id} value={String(c.asmcL_Id)}>
                                    {c.asmcL_ClassName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                </div>

                {filterdata !== 'Alumni' && (
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='asmS_Id'>
                            Section <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(v) => setValue('asmS_Id', v)} value={watch('asmS_Id')}>
                            <SelectTrigger id='asmS_Id'>
                                <SelectValue placeholder='Select Section' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='0'>ALL</SelectItem>
                                {sections.map((s) => (
                                    <SelectItem key={s.asmS_Id} value={String(s.asmS_Id)}>
                                        {s.asmC_SectionName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                    </div>
                )}
            </div>

            <div className='flex justify-center gap-4'>
                <Button type='submit' className='w-32' disabled={isSubmitting}>
                    <Eye className='mr-2 h-4 w-4' /> SHOW
                </Button>
                <Button type='button' variant='outline' className='w-32' onClick={handleCancel}>
                    <X className='mr-2 h-4 w-4' /> Cancel
                </Button>
            </div>
        </form>
    );
}
