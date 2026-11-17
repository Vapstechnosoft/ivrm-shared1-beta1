'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterPaymentInstitutionName, useMasterPaymentgateway_dropdown, useMasterPaymentgatewaydetails } from '@/hooks/fees/useMasters';
import { paymentgatewaydetailsSchema } from '@/schemas/fees/masters';
import { addOrUpdatepaymentgatewaydetails } from '@/server/fees/masters/fee_payment_gateway_details';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof paymentgatewaydetailsSchema.addOrUpdate>;

interface AddpaymentgatewaydetailsProps {
    onSuccess?: () => void;
    gatewaydetails?: string;
}

export default function AddAddpaymentgatewaydetailsPropsForm({ onSuccess, gatewaydetails = '' }: AddpaymentgatewaydetailsProps) {
    const { refetchAll } = useMasterPaymentgatewaydetails();
    const { data: response } = useMasterPaymentInstitutionName();
    const institutionName = response?.data?.[0].mI_Name;

    const {
        data: gatewaydata,
        isLoading: gatewayLoading,
        error: gatewayError,
        refetchAll: refetchgateway
    } = useMasterPaymentgateway_dropdown();

    const {
        control,
        watch,
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(paymentgatewaydetailsSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            fpgD_MobileActiveFlag: false,
            submerchantIds: [{ id: '' }]
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'submerchantIds'
    });

    useEffect(() => {
        if (institutionName) {
            setValue('institution_Name', institutionName);
        }
    }, [institutionName]);

    function OnReset() {
        reset();
        refetchgateway();
        replace([{ id: '' }]);
    }

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const payload = {
                // user_id: 20612,
                // mi_id: 30,
                fpgD_SaltKey: data.fpgD_SaltKey,
                fpgD_MerchantId: data.fpgD_MerchantId,
                fpgD_Image: data.fpgD_Image,
                fpgD_URL: data.fpgD_URL,
                fpgD_AccNo: data.fpgD_AccNo,
                // submerchantIds: submerchantIds
                //     .filter((item) => item.id.trim() !== '')
                //     .map((item) => ({
                //         fpgD_SubMerchantId: item.id
                //     })),
                // submerchantIds: submerchantIds.filter((item) => item.id.trim() !== '').map((item) => Number.parseInt(item.id, 10)),

                // submerchantIds: submerchantIds
                //   .filter(({ id }) => id.trim())
                //   .map(({ id }) => String(id)),

                submerchantIds: data.submerchantIds?.filter((item) => item.id.trim() !== '').map((item) => item.id) ?? [],

                fpgD_AuthorisationKey: data.fpgD_MerchantKey,

                impG_Id: data.impG_Id,
                fpgD_MobileActiveFlag: data.fpgD_MobileActiveFlag
            };

            console.log('Payload to be sent:', JSON.stringify(payload));

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
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset({
            fpgD_MerchantId: '',
            fpgD_SaltKey: '',
            fpgD_Image: '',
            fpgD_URL: '',
            fpgD_AccNo: '',
            fpgD_MerchantKey: '',
            impG_Id: 0,
            fpgD_MobileActiveFlag: false
        });

        replace([{ id: '' }]);
    };

    const [submerchantIds, setSubmerchantIds] = useState([{ id: '' }]);

    const handleChange = (index: number, value: string) => {
        const updated = [...submerchantIds];
        updated[index].id = value;
        setSubmerchantIds(updated);
    };

    const addNew = () => {
        if (submerchantIds.length < 5) {
            setSubmerchantIds([...submerchantIds, { id: '' }]);
        }
    };

    // const remove = (index: number) => {
    //     const updated = [...submerchantIds];
    //     updated.splice(index, 1);
    //     setSubmerchantIds(updated);
    // };

    return (
        <div className={`${gatewaydetails}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <InputText
                    label='Institution Name'
                    id='institution_Name'
                    disabled
                    {...register('institution_Name')}
                    error={errors.institution_Name?.message}
                    className='transition-colors focus:ring-2 focus:ring-primary/20'
                />
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <InputText
                            label='Merchant Id'
                            required
                            id='fpgD_MerchantId'
                            {...register('fpgD_MerchantId')}
                            error={errors.fpgD_MerchantId?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
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

                        <div className='group flex flex-col gap-1.5'>
                            <InputText
                                label='Salt Key'
                                required
                                id='fpgD_SaltKey'
                                {...register('fpgD_SaltKey')}
                                error={errors.fpgD_SaltKey?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
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
                            {/* {errors.fpgD_SaltKey && <FormError>{errors.fpgD_SaltKey.message}</FormError>} */}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            {/* <InputText
                                label='Image'
                                required
                                id='fpgD_Image'
                                {...register('fpgD_Image')}
                                error={errors.fpgD_Image?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
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
                                label='Image'
                                required
                                id='fpgD_Image'
                                {...register('fpgD_Image', {
                                    required: 'Image URL is required',
                                    validate: (value) =>
                                        value.startsWith('http://') ||
                                        value.startsWith('https://') ||
                                        'URL must begin with http:// or https://'
                                })}
                                error={errors.fpgD_Image?.message}
                            />

                            {/* {errors.fpgD_Image && <FormError>{errors.fpgD_Image.message}</FormError>} */}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <InputText
                                label='URL'
                                required
                                id='fpgD_URL'
                                {...register('fpgD_URL', {
                                    required: 'URL is required',
                                    validate: (value) =>
                                        value.startsWith('http://') ||
                                        value.startsWith('https://') ||
                                        'URL must begin with http:// or https://'
                                })}
                                error={errors.fpgD_URL?.message}
                            />
                            {/* <InputText
                                label='URL'
                                required
                                id='fpgD_URL'
                                {...register('fpgD_URL')}
                                error={errors.fpgD_URL?.message}
                                className='transition-colors focus:ring-2 focus:ring-primary/20'
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
                            {/* {errors.fpgD_URL && <FormError>{errors.fpgD_URL.message}</FormError>} */}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <InputText
                            label='Account Number'
                            required
                            id='fpgD_AccNo'
                            {...register('fpgD_AccNo')}
                            error={errors.fpgD_AccNo?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
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
                        <InputText
                            label='Merchant Key'
                            required
                            id='fpgD_MerchantKey'
                            {...register('fpgD_MerchantKey')}
                            error={errors.fpgD_MerchantKey?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
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

                        <div className='group flex flex-col gap-1.5'>
                            <Label aria-label='Gateway' htmlFor='fmT_Id'>
                                Gateway Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='impG_Id'
                                rules={{ required: true }}
                                control={control}
                                // defaultValue={0}

                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                        value={field.value ? String(field.value) : ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Gateway' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gatewayLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading....
                                                </SelectItem>
                                            ) : gatewayError ? (
                                                <SelectItem value='error' disabled>
                                                    Error fetching gateways..
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

                        {/* <div className='col-span-6'>
                            {submerchantIds.map((item, index) => (
                                <div key={index} className='mb-4 flex flex-col gap-2 md:flex-row md:items-center'>
                                    <label htmlFor={`submrchntId-${index}`} className='font-medium text-gray-700 text-sm md:w-1/4'>
                                        Sub Merchant Id<span className='ml-1 text-red-500'>*</span>
                                    </label>

                                    <div className='flex w-full items-center gap-2 md:w-3/4'>
                                        <input
                                            id={`submrchntId-${index}`}
                                            type='text'
                                            name={`submrchntId-${index}`}
                                            value={item.id}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            pattern='[0-9a-zA-Z]*'
                                            required
                                            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
                                        />

                                        {index === submerchantIds.length - 1 && submerchantIds.length < 5 && (
                                            <button
                                                type='button'
                                                onClick={addNew}
                                                className='rounded-md border p-2 transition hover:bg-gray-100'>
                                                <Plus className='h-4 w-4 text-gray-600' />
                                            </button>
                                        )}

                                       
                                        {submerchantIds.length > 1 && (
                                            <button
                                                type='button'
                                                onClick={() => remove(index)}
                                                className='rounded-md border p-2 transition hover:bg-gray-100'>
                                                <Minus className='h-4 w-4 text-gray-600' />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div> */}

                        <div className='col-span-6'>
                            {fields.map((field, index) => (
                                <div key={field.id} className='mb-4 flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
                                    <label
                                        htmlFor={`submerchantIds.${index}.id`}
                                        className='gap-3 whitespace-nowrap font-medium text-gray-700 text-sm'>
                                        Sub Merchant Id<span className='ml-1 text-red-500'>*</span>
                                    </label>

                                    <div className='flex w-full items-center gap-1 md:w-3/2'>
                                        <input
                                            id={`submerchantIds.${index}.id`}
                                            type='text'
                                            {...register(`submerchantIds.${index}.id`)}
                                            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
                                                errors.submerchantIds?.[index]?.id ? '' : ''
                                            }`}
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

                                        {index === fields.length - 1 && fields.length < 10 && (
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
                                        <p className='text-red-500 text-xs'>{errors.submerchantIds[index]?.id?.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                <div className='group flex flex-col gap-1.5'>
                    <div className='group flex flex-row gap-6'>
                        <Controller
                            name='fpgD_MobileActiveFlag'
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean) => {
                                            field.onChange(checked);
                                        }}
                                        id='fpgD_MobileActiveFlag'
                                    />
                                    <Label htmlFor='fpgD_MobileActiveFlag'>Enable Payment in Mobile App:</Label>
                                </div>
                            )}
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
                            Save Payment GatewayDetails
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
