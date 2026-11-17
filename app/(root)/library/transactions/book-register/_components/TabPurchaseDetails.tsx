'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BookRegisterPayload } from '@/types/library/masters/bookRegister';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

export default function TabPurchaseDetails({ dropdownData }: { dropdownData: any }) {
    const {
        control,
        register,
        watch,
        formState: { errors }
    } = useFormContext<BookRegisterPayload>();
    const purchaseType = watch('LMB_PurOrDonated');

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col gap-1.5'>
                <Label>
                    Purchase Date <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='Purchase_Date'
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                    mode='single'
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.Purchase_Date && <FormError>{errors.Purchase_Date.message}</FormError>}
            </div>

            <div className='flex flex-col gap-1.5'>
                <Label>
                    Purchased/Donated <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LMB_PurOrDonated'
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Purchased'>Purchased</SelectItem>
                                <SelectItem value='Donated'>Donated</SelectItem>
                                <SelectItem value='Specimen'>Specimen</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LMB_PurOrDonated && <FormError>{errors.LMB_PurOrDonated.message}</FormError>}
            </div>

            {purchaseType === 'Donated' && (
                <>
                    <InputText label='Donor Name' {...register('Donor_Id')} error={errors.Donor_Id?.message} />
                    <InputText label='Donor Address' {...register('LMB_DonorAddress')} error={errors.LMB_DonorAddress?.message} />
                </>
            )}

            <div className='flex flex-col gap-1.5'>
                <Label>Vendor</Label>
                <Controller
                    control={control}
                    name='LMV_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Vendor' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.vendorList?.map((item: any) => (
                                    <SelectItem key={item.lmV_Id} value={item.lmV_Id.toString()}>
                                        {item.lmV_VendorName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className='flex flex-col gap-1.5'>
                <Label>
                    Language <span className='text-red-500'>*</span>
                </Label>
                <Controller
                    control={control}
                    name='LML_Id'
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Language' />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownData?.langlist?.map((item: any) => (
                                    <SelectItem key={item.lmL_Id} value={item.lmL_Id.toString()}>
                                        {item.lmL_LanguageName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.LML_Id && <FormError>{errors.LML_Id.message}</FormError>}
            </div>

            <InputText label='Bill No' {...register('LMB_BillNo')} />
            <InputText label='Voucher No' {...register('Voucher_No')} />
            <InputText label='Price' type='number' {...register('LMB_Price')} />
            <InputText label='Net Price' type='number' {...register('LMB_NetPrice')} />
        </div>
    );
}
