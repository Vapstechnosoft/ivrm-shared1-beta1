'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trustMasterSchema } from '@/schemas/super-admin/super-admin-module/trust-masters';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoopIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Plus, Save, Trash2 } from 'lucide-react';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { getCountryList, getStateList, saveTrustMaster } from '@/server/super-admin/super-admin-module/masters/trust-master';
import { useCountryListData, useStateListData, useTrustMasterData } from '@/hooks/super-admin/super-admin-module/use-trust-masters';
import { toast } from 'sonner';
import type { z } from 'zod';


type FormFields = z.infer<typeof trustMasterSchema.addOrUpdate>;

interface AddTrustMasterFormProps {
    onSuccess?: () => void;
    onRefresh?: () => void;
    className?: string;
}

export default function AddTrustMasterForm({ onSuccess, onRefresh, className = '' }: AddTrustMasterFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(trustMasterSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            mO_Name: '',
            mO_OrganisationType: '',
            mO_Address1: '',
            mO_Address2: '',
            mO_Address3: '',
            mO_Landmark: '',
            ivrmmcT_Name: '',
            mO_Pincode: '',
            mT_Domain_name: '',
            mT_Currency: 'INR', // Default currency
            phones: [{ mopN_PhoneNo: '', moP_Flag: '' }],
            mobiles: [{ momN_MobileNo: '', moM_Flag: '' }],
            emails: [{ moE_EmailId: '', moE_Flag: '' }]
        }
    });

    const queryClient = useQueryClient();


    const selectedCountryId = watch('ivrmmC_Id');

    const { data: countryData, isLoading: loadingCountries } = useCountryListData();
    const countryList = countryData?.data || [];

    const { data: stateData, isLoading: loadingStates } = useStateListData(Number(selectedCountryId));
    const stateList = stateData?.data || [];

    // const [stateList, setStateList] = React.useState<any[]>([]);
    // const [loadingStates, setLoadingStates] = React.useState(false);

    React.useEffect(() => {
        // fetchStates is no longer needed as we use the hook
    }, []);

    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: 'phones'
    });

    const { fields: mobileFields, append: appendMobile, remove: removeMobile } = useFieldArray({
        control,
        name: 'mobiles'
    });

    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: 'emails'
    });

    const onSubmit = async (data: FormFields) => {
        try {
            console.log('Form Data:', data);

            // Transform data to match API payload
            const payload = {
                ...data,
                mO_Id: data.mO_Id || 0,
                mO_Pincode: Number(data.mO_Pincode),
                phones: data.phones?.map(p => ({ ...p, mopN_Id: 0, mopN_PhoneNo: Number(p.mopN_PhoneNo) })) || [],
                mobiles: data.mobiles?.map(m => ({ ...m, momN_Id: 0, momN_MobileNo: Number(m.momN_MobileNo) })) || [],
                emails: data.emails?.map(e => ({ ...e, moE_Id: 0 })) || [],
                mO_AboutInstitute: data.mO_AboutInstitute || '',
                mO_ContactDetails: data.mO_ContactDetails || '',
                mO_Logo: data.mO_Logo || ''
            };

            const response = await saveTrustMaster(payload);
            if (response.success) {
                toast.success('Trust Master saved successfully');
                reset();
                onRefresh?.();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to save Trust Master');
            }
        } catch (error: any) {
            console.error('Save Error:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };


    const contactFlags = ['Office', 'Residence', 'Personal'];

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Left Column */}
                    <div className='space-y-4'>
                        <InputText label='Trust Name' required {...register('mO_Name')} error={errors.mO_Name?.message} />

                        <div className='flex flex-col gap-1.5'>
                            <Label>Trust Type <span className='ml-1 text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='mO_OrganisationType'
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Yearly'>Yearly</SelectItem>
                                            <SelectItem value='Semester'>Semester</SelectItem>
                                            <SelectItem value='Group'>Group</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.mO_OrganisationType && <FormError>{errors.mO_OrganisationType.message}</FormError>}
                        </div>

                        <InputTextarea label='Address1' required maxLength={40} {...register('mO_Address1')} error={errors.mO_Address1?.message} />
                        <InputTextarea label='Address2' required maxLength={40} {...register('mO_Address2')} error={errors.mO_Address2?.message} />
                        <InputTextarea label='Address3' required maxLength={40} {...register('mO_Address3')} error={errors.mO_Address3?.message} />
                        <InputText label='Landmark' {...register('mO_Landmark')} error={errors.mO_Landmark?.message} />

                        <div className='flex flex-col gap-1.5'>
                            <Label>Country <span className='ml-1 text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='ivrmmC_Id'
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? String(field.value) : undefined}
                                        disabled={loadingCountries}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingCountries ? 'Loading...' : 'Select Country'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countryList.map((c) => (
                                                <SelectItem key={c.ivrmmC_Id} value={String(c.ivrmmC_Id)}>
                                                    {c.ivrmmC_CountryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ivrmmC_Id && <FormError>{errors.ivrmmC_Id.message}</FormError>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='space-y-4'>
                        <div className='flex flex-col gap-1.5'>
                            <Label>State <span className='ml-1 text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name='ivrmmS_Id'
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? String(field.value) : undefined}
                                        disabled={loadingStates || !selectedCountryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={!selectedCountryId ? 'Select Country First' : loadingStates ? 'Loading...' : 'Select State'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stateList.map((s: any) => (
                                                <SelectItem key={s.ivrmmS_Id} value={String(s.ivrmmS_Id)}>
                                                    {s.ivrmmS_Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.ivrmmS_Id && <FormError>{errors.ivrmmS_Id.message}</FormError>}
                        </div>

                        <InputText label='City' required {...register('ivrmmcT_Name')} error={errors.ivrmmcT_Name?.message} />
                        <InputText label='Pincode' required maxLength={6} {...register('mO_Pincode')} error={errors.mO_Pincode?.message} />
                        <InputText label='Website' {...register('mO_Website')} error={errors.mO_Website?.message} />

                        {/* Dynamic Phones */}
                        <div className='space-y-2 rounded-md border p-3'>
                            <div className='flex items-center justify-between'>
                                <Label>Phone No <span className='ml-1 text-red-500'>*</span></Label>
                                {phoneFields.length < 5 && (
                                    <Button type='button' variant='outline' size='sm' onClick={() => appendPhone({ mopN_PhoneNo: '', moP_Flag: '' })}>
                                        <Plus className='mr-1 h-3 w-3' /> Add
                                    </Button>
                                )}
                            </div>
                            {phoneFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2 items-start'>
                                    <div className='flex-1'>
                                        <InputText
                                            placeholder='Phone No'
                                            {...register(`phones.${index}.mopN_PhoneNo`)}
                                            error={errors.phones?.[index]?.mopN_PhoneNo?.message}
                                        />
                                    </div>
                                    <div className='w-40'>
                                        <Controller
                                            control={control}
                                            name={`phones.${index}.moP_Flag`}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger><SelectValue placeholder='Type' /></SelectTrigger>
                                                    <SelectContent>
                                                        {contactFlags.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.phones?.[index]?.moP_Flag && <FormError>{errors.phones[index]?.moP_Flag?.message}</FormError>}
                                    </div>
                                    {index > 0 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removePhone(index)}>
                                            <Trash2 className='h-4 w-4 text-red-500' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Mobiles */}
                        <div className='space-y-2 rounded-md border p-3'>
                            <div className='flex items-center justify-between'>
                                <Label>Mobile No <span className='ml-1 text-red-500'>*</span></Label>
                                {mobileFields.length < 5 && (
                                    <Button type='button' variant='outline' size='sm' onClick={() => appendMobile({ momN_MobileNo: '', moM_Flag: '' })}>
                                        <Plus className='mr-1 h-3 w-3' /> Add
                                    </Button>
                                )}
                            </div>
                            {mobileFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2 items-start'>
                                    <div className='flex-1'>
                                        <InputText
                                            placeholder='Mobile No'
                                            {...register(`mobiles.${index}.momN_MobileNo`)}
                                            error={errors.mobiles?.[index]?.momN_MobileNo?.message}
                                        />
                                    </div>
                                    <div className='w-40'>
                                        <Controller
                                            control={control}
                                            name={`mobiles.${index}.moM_Flag`}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger><SelectValue placeholder='Type' /></SelectTrigger>
                                                    <SelectContent>
                                                        {contactFlags.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.mobiles?.[index]?.moM_Flag && <FormError>{errors.mobiles[index]?.moM_Flag?.message}</FormError>}
                                    </div>
                                    {index > 0 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removeMobile(index)}>
                                            <Trash2 className='h-4 w-4 text-red-500' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Emails */}
                        <div className='space-y-2 rounded-md border p-3'>
                            <div className='flex items-center justify-between'>
                                <Label>Email ID <span className='ml-1 text-red-500'>*</span></Label>
                                {emailFields.length < 5 && (
                                    <Button type='button' variant='outline' size='sm' onClick={() => appendEmail({ moE_EmailId: '', moE_Flag: '' })}>
                                        <Plus className='mr-1 h-3 w-3' /> Add
                                    </Button>
                                )}
                            </div>
                            {emailFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2 items-start'>
                                    <div className='flex-1'>
                                        <InputText
                                            placeholder='Email ID'
                                            {...register(`emails.${index}.moE_EmailId`)}
                                            error={errors.emails?.[index]?.moE_EmailId?.message}
                                        />
                                    </div>
                                    <div className='w-40'>
                                        <Controller
                                            control={control}
                                            name={`emails.${index}.moE_Flag`}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger><SelectValue placeholder='Type' /></SelectTrigger>
                                                    <SelectContent>
                                                        {contactFlags.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.emails?.[index]?.moE_Flag && <FormError>{errors.emails[index]?.moE_Flag?.message}</FormError>}
                                    </div>
                                    {index > 0 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removeEmail(index)}>
                                            <Trash2 className='h-4 w-4 text-red-500' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <InputText label='Fax' {...register('mO_FaxNo')} error={errors.mO_FaxNo?.message} />

                        <InputText label='Domain Name' required {...register('mT_Domain_name')} error={errors.mT_Domain_name?.message} />
                        <div className='flex flex-col gap-1.5'>
                            <Label>Currency</Label>
                            <Controller
                                control={control}
                                name='mT_Currency'
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder='Select Currency' /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='INR'>INR</SelectItem>
                                            <SelectItem value='USD'>USD</SelectItem>
                                            <SelectItem value='EUR'>EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.mT_Currency && <FormError>{errors.mT_Currency.message}</FormError>}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => reset()}
                        disabled={isSubmitting}
                        className='order-3 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
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
                            Save Trust
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
