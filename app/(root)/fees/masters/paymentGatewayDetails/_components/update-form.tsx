'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterPaymentInstitutionName, useMasterPaymentgateway_dropdown, useMasterPaymentgatewaydetails } from '@/hooks/fees/useMasters';
import { paymentgatewaydetailsSchema } from '@/schemas/fees/masters';
import { addOrUpdatepaymentgatewaydetails } from '@/server/fees/masters/fee_payment_gateway_details';
import type { IMasterPaymentGatewayList } from '@/types/fees/masters/masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus, Save } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof paymentgatewaydetailsSchema.addOrUpdate>;

interface UpdateFormProps {
    onSuccess?: () => void;
    selectedRow: IMasterPaymentGatewayList;
}

export default function UpdatePaymentGatewayDetailsForm({ onSuccess, selectedRow }: UpdateFormProps) {
    const { refetchAll } = useMasterPaymentgatewaydetails();
    const { data: gatewaydata, isLoading: gatewayLoading, error: gatewayError } = useMasterPaymentgateway_dropdown();
    const { data: response } = useMasterPaymentInstitutionName();
    const institutionName = response?.data?.[0].mI_Name;

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(paymentgatewaydetailsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fpgD_MobileActiveFlag: false,
            submerchantIds: [{ id: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'submerchantIds'
    });

    useEffect(() => {
        if (institutionName) {
            setValue('institution_Name', institutionName);
        }
    }, [institutionName]);

    const getSubmerchantIds = () => {
        if (selectedRow.submerchantIds) {
            try {
                const parsed = JSON.parse(selectedRow.submerchantIds);
                if (Array.isArray(parsed)) {
                    return parsed.map((item: any) => ({
                        id: item.fpgD_SubMerchantId || item.id || ''
                    }));
                }
            } catch {}
        }

        if (selectedRow.fpgD_SubMerchantId) {
            return [{ id: selectedRow.fpgD_SubMerchantId }];
        }

        return [{ id: '' }];
    };

    useEffect(() => {
        if (selectedRow) {
            reset({
                fpgD_MerchantId: selectedRow.fpgD_MerchantId || '',
                fpgD_SaltKey: selectedRow.fpgD_SaltKey || '',
                fpgD_Image: selectedRow.fpgD_Image || '',
                fpgD_URL: selectedRow.fpgD_URL || '',
                fpgD_AccNo: selectedRow.fpgD_AccNo || '',
                fpgD_MerchantKey: selectedRow.fpgD_AuthorisationKey || '',
                impG_Id: selectedRow.impG_Id || 0,
                fpgD_MobileActiveFlag: selectedRow.fpgD_MobileActiveFlag ?? false,
                submerchantIds: getSubmerchantIds()
            });
        }
    }, [selectedRow, reset]);

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        const payload = {
            // user_id: 20612,
            // mi_id: 30,
            fpgD_Id: selectedRow.fpgD_Id,
            fpgD_SaltKey: data.fpgD_SaltKey,
            fpgD_MerchantId: data.fpgD_MerchantId,
            fpgD_Image: data.fpgD_Image,
            fpgD_URL: data.fpgD_URL,
            fpgD_AccNo: data.fpgD_AccNo,
            // submerchantIds:
            //     data.submerchantIds?.filter((item) => item.id.trim() !== '').map((item) => ({ fpgD_SubMerchantId: item.id })) || [],

            submerchantIds: data.submerchantIds?.filter((item) => item.id.trim() !== '').map((item) => item.id) || [],

            fpgD_AuthorisationKey: data.fpgD_MerchantKey,
            impG_Id: data.impG_Id,
            fpgD_MobileActiveFlag: data.fpgD_MobileActiveFlag
        };

        console.log('Payload to be sent:', JSON.stringify(payload));

        try {
            const response = await addOrUpdatepaymentgatewaydetails(payload);

            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <InputText
                label='Institution Name'
                id='institution_Name'
                disabled
                {...register('institution_Name')}
                error={errors.institution_Name?.message}
                className='transition-colors focus:ring-2 focus:ring-primary/20'
            />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fpgD_MerchantId'>
                        Merchant Id <span className='text-red-500'>*</span>
                    </label>
                    <InputText id='fpgD_MerchantId' {...register('fpgD_MerchantId')} error={errors.fpgD_MerchantId?.message} />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fpgD_SaltKey'>
                        Salt Key<span className='text-red-500'>*</span>
                    </label>
                    <InputText id='fpgD_SaltKey' {...register('fpgD_SaltKey')} error={errors.fpgD_SaltKey?.message} />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fpgD_Image'>
                        Image<span className='text-red-500'>*</span>
                    </label>
                    {/* <InputText
                        id='fpgD_Image'
                        {...register('fpgD_Image')}
                        error={errors.fpgD_Image?.message}
                        onKeyDown={(e) => {
                           
                            if (['-', '+', 'e', 'E', ' '].includes(e.key)) {
                                e.preventDefault();
                            }

                            
                            if (!/^[a-zA-Z0-9]$/.test(e.key) && e.key.length === 1) {
                                e.preventDefault();
                            }
                        }}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            
                            input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                        }}
                    /> */}
                    <InputText
                        //   label="Image"
                        //   required
                        id='fpgD_Image'
                        {...register('fpgD_Image', {
                            required: 'Image URL is required',
                            validate: (value) =>
                                value.startsWith('http://') || value.startsWith('https://') || 'URL must begin with http:// or https://'
                        })}
                        error={errors.fpgD_Image?.message}
                    />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fpgD_URL'>
                        URL<span className='text-red-500'>*</span>
                    </label>

                    <InputText
                        id='fpgD_URL'
                        {...register('fpgD_URL', {
                            required: 'URL is required',
                            validate: (value) =>
                                value.startsWith('http://') || value.startsWith('https://') || 'URL must begin with http:// or https://'
                        })}
                        error={errors.fpgD_URL?.message}
                    />
                    {/* <InputText
                        id='fpgD_URL'
                        {...register('fpgD_URL')}
                        error={errors.fpgD_URL?.message}
                        onKeyDown={(e) => {
                           
                            if (['-', '+', 'e', 'E', ' '].includes(e.key)) {
                                e.preventDefault();
                            }

                           
                            if (!/^[a-zA-Z0-9]$/.test(e.key) && e.key.length === 1) {
                                e.preventDefault();
                            }
                        }}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                           
                            input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                        }}
                    /> */}
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='fpgD_AccNo'>
                        Account Number<span className='text-red-500'>*</span>
                    </label>
                    <InputText
                        id='fpgD_AccNo'
                        {...register('fpgD_AccNo')}
                        error={errors.fpgD_AccNo?.message}
                        onKeyDown={(e) => {
                            // Block minus, plus, special chars used in number inputs
                            if (['-', '+', ' '].includes(e.key)) {
                                e.preventDefault();
                            }

                            // Block other special characters
                            if (!/^[a-zA-Z0-9]$/.test(e.key) && e.key.length === 1) {
                                e.preventDefault();
                            }
                        }}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            // Keep only alphanumeric values
                            input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                        }}
                    />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor='Merchent Key'>
                        Merchent Key<span className='text-red-500'>*</span>
                    </label>
                    <InputText
                        id='fpgD_MerchantKey'
                        {...register('fpgD_MerchantKey')}
                        error={errors.fpgD_MerchantKey?.message}
                        onKeyDown={(e) => {
                            // Block minus, plus, special chars used in number inputs
                            if (['-', '+', ' '].includes(e.key)) {
                                e.preventDefault();
                            }

                            // Block other special characters
                            if (!/^[a-zA-Z0-9]$/.test(e.key) && e.key.length === 1) {
                                e.preventDefault();
                            }
                        }}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            // Keep only alphanumeric values
                            input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                        }}
                    />
                </div>

                <div className='group flex flex-col gap-1.5'>
                    <Label htmlFor='impG_Id'>
                        Gateway Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='impG_Id'
                        rules={{ required: 'Gateway Name is required' }}
                        control={control}
                        defaultValue={selectedRow?.impG_Id ?? 0}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value ? field.value.toString() : ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Gateway' />
                                </SelectTrigger>
                                <SelectContent>
                                    {gatewayLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : gatewayError ? (
                                        <SelectItem value='error' disabled>
                                            Error loading
                                        </SelectItem>
                                    ) : (
                                        gatewaydata?.data?.map((item) => (
                                            <SelectItem key={item.impG_Id} value={item.impG_Id.toString()}>
                                                {item.impG_PGName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.impG_Id && <FormError>{errors.impG_Id.message}</FormError>}
                </div>
            </div>

            <div className='col-span-6'>
                {fields.map((field, index) => (
                    <div key={field.id} className='mb-4 flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
                        <label htmlFor={`submerchantIds.${index}.id`} className='gap-3 whitespace-nowrap font-medium text-gray-700 text-sm'>
                            Sub Merchant Id<span className='ml-1 text-red-500'>*</span>
                        </label>

                        <div className='flex w-full items-center gap-1 md:w-3/2'>
                            <input
                                id={`submerchantIds.${index}.id`}
                                type='text'
                                {...register(`submerchantIds.${index}.id`, { required: true })}
                                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
                                onKeyDown={(e) => {
                                    // Block minus, plus, special chars used in number inputs
                                    if (['-', '+', ' '].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    // Block other special characters
                                    if (!/^[a-zA-Z0-9]$/.test(e.key) && e.key.length === 1) {
                                        e.preventDefault();
                                    }
                                }}
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    // Keep only alphanumeric values
                                    input.value = input.value.replace(/[^A-Za-z0-9]/g, '');
                                }}
                            />

                            {index === fields.length - 1 && fields.length < 5 && (
                                <button
                                    type='button'
                                    onClick={() => append({ id: '' })}
                                    className='rounded-md border p-2 transition hover:bg-gray-100'>
                                    <Plus className='h-4 w-4 text-gray-600' />
                                </button>
                            )}

                            {fields.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => remove(index)}
                                    className='rounded-md border p-2 transition hover:bg-gray-100'>
                                    <Minus className='h-4 w-4 text-gray-600' />
                                </button>
                            )}
                        </div>

                        {errors.submerchantIds?.[index]?.id && (
                            <p className='mt-1 text-red-500 text-xs'>{errors.submerchantIds[index]?.id?.message || 'Required'}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className='group flex items-center space-x-2'>
                <Controller
                    name='fpgD_MobileActiveFlag'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => field.onChange(checked)}
                            id='fpgD_MobileActiveFlag'
                        />
                    )}
                />
                <Label htmlFor='fpgD_MobileActiveFlag'>Enable Payment in Mobile App</Label>
            </div>

            <div className='flex gap-3 border-t pt-4'>
                <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting}>
                    Reset
                </Button>
                <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Saving...'>
                    <Save className='mr-2 h-4 w-4' />
                    Update
                </Button>
            </div>
        </form>
    );
}
