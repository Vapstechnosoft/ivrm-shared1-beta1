'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getDonationAmount } from '@/server/alumni/alumni-donation';
import type { IDonationCategory, IPaymentGateway } from '@/types/alumni/alumni-donation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { type AlumniDonationSchema, alumniDonationSchema } from './schema';

interface DonationFormProps {
    categories: IDonationCategory[];
    gateways: IPaymentGateway[];
    isPaying: boolean;
    onSubmit: (values: AlumniDonationSchema) => Promise<void>;
    className?: string;
}

export default function DonationForm({ categories, gateways, isPaying, onSubmit, className = '' }: DonationFormProps) {
    const form = useForm<AlumniDonationSchema>({
        resolver: zodResolver(alumniDonationSchema),
        defaultValues: {
            nriStatus: '0',
            panNumber: '',
            donationId: '',
            amount: 0,
            paymentGateway: ''
        }
    });

    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = form;

    const selectedDonationId = watch('donationId');
    const nriStatus = watch('nriStatus');
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    const amount = watch('amount');

    const selectedCategory = categories.find((c) => c.almdoN_Id === Number(selectedDonationId));
    const isRegistrationFee = selectedCategory?.almdoN_RegistrationFeeFlag || false;

    // Update amount when donation category changes
    useEffect(() => {
        const fetchAmount = async () => {
            if (selectedCategory) {
                try {
                    const res = await getDonationAmount({ almdoN_Id: selectedCategory.almdoN_Id });
                    const data = res.data as any;
                    const amountList = data?.getamountlist || (Array.isArray(data) ? data : null);

                    if (res.success && amountList && amountList.length > 0) {
                        const item = amountList[0];
                        const fetchedAmount = item.almdoN_Amount || item.ALMDON_Amount || 0;
                        setValue('amount', fetchedAmount);
                    } else {
                        setValue('amount', selectedCategory.almdoN_Amount);
                    }
                } catch (e) {
                    console.error('Failed to fetch amount', e);
                    setValue('amount', selectedCategory.almdoN_Amount);
                }
            }
        };
        fetchAmount();
    }, [selectedCategory, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4 md:col-span-2'>
                    <Label>NRI Status</Label>
                    <Controller
                        control={control}
                        name='nriStatus'
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className='flex gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='1' id='nri-yes' />
                                    <Label htmlFor='nri-yes' className='font-normal'>
                                        Yes
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='0' id='nri-no' />
                                    <Label htmlFor='nri-no' className='font-normal'>
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {nriStatus === '1' && (
                    <div className='md:col-span-2'>
                        <InputText
                            label='PAN Number'
                            placeholder='Enter PAN Number'
                            {...register('panNumber')}
                            error={errors.panNumber?.message}
                        />
                    </div>
                )}

                <div className='md:col-span-2'>
                    <Label>
                        Donation To <span className='text-destructive'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='donationId'
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Donation Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.almdoN_Id} value={category.almdoN_Id.toString()}>
                                            {category.almdoN_DonationName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.donationId && <FormError>{errors.donationId.message}</FormError>}
                </div>

                <div className='md:col-span-2'>
                    <InputText
                        type='number'
                        label='Total Payable'
                        required
                        {...register('amount', {
                            valueAsNumber: true,
                            validate: (val) => {
                                // Find the required base amount for validation
                                // In legacy code $scope.Amount is the base amount
                                if (selectedCategory && val < selectedCategory.almdoN_Amount) {
                                    return `Donation Amount should be Greater Than ${selectedCategory.almdoN_Amount}`;
                                }
                                return true;
                            }
                        })}
                        disabled={isRegistrationFee}
                        error={errors.amount?.message}
                    />
                    {isRegistrationFee && <p className='mt-1 text-muted-foreground text-xs italic'>Amount is fixed for this category.</p>}
                </div>

                <div className='space-y-4 md:col-span-2'>
                    <Label>
                        Select Payment Gateway <span className='text-destructive'>*</span>
                    </Label>
                    <Controller
                        control={control}
                        name='paymentGateway'
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                                {gateways.map((gateway) => (
                                    <Label
                                        key={gateway.fpgD_Id}
                                        htmlFor={`gateway-${gateway.fpgD_Id}`}
                                        className={cn(
                                            'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-background p-4 transition-all hover:bg-muted/50',
                                            field.value === gateway.fpgD_PGName ? 'border-primary' : 'border-muted'
                                        )}>
                                        <RadioGroupItem value={gateway.fpgD_PGName} id={`gateway-${gateway.fpgD_Id}`} className='sr-only' />
                                        {gateway.fpgD_Image ? (
                                            <img
                                                src={gateway.fpgD_Image}
                                                alt={gateway.fpgD_PGName}
                                                className='h-8 w-auto object-contain transition-all'
                                            />
                                        ) : (
                                            <span className='font-medium'>{gateway.fpgD_PGName}</span>
                                        )}
                                    </Label>
                                ))}
                            </RadioGroup>
                        )}
                    />
                    {errors.paymentGateway && <FormError>{errors.paymentGateway.message}</FormError>}
                </div>
            </div>

            <div className='flex flex-wrap gap-4 pt-4'>
                <Button type='submit' size='lg' disabled={isPaying} className='min-w-[200px]'>
                    {isPaying ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className='mr-2 h-4 w-4' />
                            CLICK HERE TO PAY NOW
                        </>
                    )}
                </Button>

                <Button type='button' variant='outline' size='lg' onClick={() => form.reset()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
