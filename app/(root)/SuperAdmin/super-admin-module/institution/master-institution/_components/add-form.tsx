'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { institutionMasterSchema } from '@/schemas/super-admin/super-admin-module/institution/master-institution';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useCountryDropdown, useStateDropdown } from '@/hooks/super-admin/super-admin-module/use-master-institution';
import type { ICountryDropdown, IStateDropdown } from '@/types/super-admin/super-admin-module/institution/master-institution';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof institutionMasterSchema.addOrUpdate>;

// Simulated VC Details Master Data
const vcMasterData = [
    { mvidcoN_Id: 1, mvidcoN_VCNames: 'Google Meet', mvidcoN_VCCode: 'GM' },
    { mvidcoN_Id: 2, mvidcoN_VCNames: 'Zoom', mvidcoN_VCCode: 'ZM' },
    { mvidcoN_Id: 3, mvidcoN_VCNames: 'Microsoft Teams', mvidcoN_VCCode: 'MT' }
];

interface AddMasterInstitutionFormProps {
    onSuccess?: () => void;
    onRefresh?: () => void;
    className?: string;
}

export default function AddMasterInstitutionForm({ onSuccess, onRefresh, className = '' }: AddMasterInstitutionFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(institutionMasterSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            mI_Name: '',
            mI_OrganisationType: '',
            mI_Address1: '',
            mI_Address2: '',
            mI_Address3: '',
            ivrmmcT_Name: '',
            mI_Pincode: '',
            mI_FaxNo: '',

            // Arrays (No flags)
            phones: [{ mipN_PhoneNo: '' }],
            mobiles: [{ mimN_MobileNo: '' }],
            emails: [{ miE_EmailId: '' }],
            emails1: [{ mI_SMSAlertToemailids: '' }],

            // Defaults
            mI_SchoolCollegeFlag: '',
            mI_NAAC_InstitutionTypeFlg: '',
            mI_NAAC_SubInstitutionTypeFlg: '',
            mI_CreditType: '',
            mI_DateSeparator: '/',
            mI_GradingSystem: '',
            mI_FontSize: '12',
            mI_WeekStartDay: 'Monday',
            mI_DateFormat: 'DD/MM/YYYY',
            mI_FranchiseFlag: false,

            // VC (Initialize with master data)
            vcDetails: vcMasterData.map(vc => ({
                mvidcoN_Id: vc.mvidcoN_Id,
                checkedvalue: false,
                mvidconinT_HostedURL: ''
            }))
        }
    });

    const schoolCollegeFlag = useWatch({ control, name: 'mI_SchoolCollegeFlag' });
    const naacType = useWatch({ control, name: 'mI_NAAC_InstitutionTypeFlg' });
    const vcDetailsWatch = useWatch({ control, name: 'vcDetails' });
    const countryId = useWatch({ control, name: 'ivrmmC_Id' });

    const [showMSTeams, setShowMSTeams] = React.useState(false);

    const { data: countryResponse, isLoading: isCountriesLoading } = useCountryDropdown();
    const countryList = (countryResponse?.data || []) as ICountryDropdown[];

    const { data: stateResponse, isLoading: isStatesLoading } = useStateDropdown(countryId);
    const stateList = (stateResponse?.data || []) as IStateDropdown[];

    // Reset state when country changes
    useEffect(() => {
        if (countryId) {
            setValue('ivrmmS_Id', undefined as any);
        }
    }, [countryId, setValue]);

    // Dynamic Lists
    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control, name: 'phones' });
    const { fields: mobileFields, append: appendMobile, remove: removeMobile } = useFieldArray({ control, name: 'mobiles' });
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control, name: 'emails' });
    const { fields: smsEmailFields, append: appendSmsEmail, remove: removeSmsEmail } = useFieldArray({ control, name: 'emails1' });
    const { fields: vcFields, replace: replaceVC } = useFieldArray({ control, name: 'vcDetails' });

    const onSubmit = async (data: FormFields) => {
        try {
            console.log('Form Data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Institution Master added successfully (Simulation)');
            reset();
            onRefresh?.();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* LEFT COLUMN */}
                    <div className='space-y-4'>
                        <div className='space-y-1'>
                            <InputText label='Trust Id (Simulated)' type='number' required {...register('mO_Id')} error={errors.mO_Id?.message} />
                        </div>

                        <div className='space-y-1'>
                            <Label>Institution Type <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='mI_OrganisationType' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select Type' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Yearly'>Yearly</SelectItem>
                                        <SelectItem value='Semester'>Semester</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.mI_OrganisationType?.message}</FormError>
                        </div>

                        <InputTextarea label='Address1' required maxLength={40} {...register('mI_Address1')} error={errors.mI_Address1?.message} />
                        <InputTextarea label='Address3' required maxLength={40} {...register('mI_Address3')} error={errors.mI_Address3?.message} />

                        <div className='space-y-1'>
                            <Label>State <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='ivrmmS_Id' render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined} disabled={!countryId || isStatesLoading}>
                                    <SelectTrigger><SelectValue placeholder={!countryId ? 'Select Country First' : isStatesLoading ? 'Loading States...' : 'Select State'} /></SelectTrigger>
                                    <SelectContent>
                                        {stateList.map((s) => <SelectItem key={s.ivrmmS_Id} value={String(s.ivrmmS_Id)}>{s.ivrmmS_Name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.ivrmmS_Id?.message}</FormError>
                        </div>

                        <InputText label='Pincode' required maxLength={6} {...register('mI_Pincode')} error={errors.mI_Pincode?.message} />

                        {/* Mobiles */}
                        <div className='space-y-2'>
                            <Label>Mobile Number <span className='text-red-500'>*</span></Label>
                            {mobileFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2'>
                                    <InputText placeholder='Mobile No' maxLength={10} {...register(`mobiles.${index}.mimN_MobileNo`)} error={errors.mobiles?.[index]?.mimN_MobileNo?.message} />
                                    {index === mobileFields.length - 1 && mobileFields.length < 3 && (
                                        <Button type='button' variant='outline' size='icon' onClick={() => appendMobile({ mimN_MobileNo: '' })}><Plus className='h-3 w-3' /></Button>
                                    )}
                                    {mobileFields.length > 1 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removeMobile(index)}><Trash2 className='h-4 w-4 text-red-500' /></Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Emails */}
                        <div className='space-y-2'>
                            <Label>Email-ID <span className='text-red-500'>*</span></Label>
                            {emailFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2'>
                                    <InputText placeholder='Email ID' {...register(`emails.${index}.miE_EmailId`)} error={errors.emails?.[index]?.miE_EmailId?.message} />
                                    {index === emailFields.length - 1 && emailFields.length < 3 && (
                                        <Button type='button' variant='outline' size='icon' onClick={() => appendEmail({ miE_EmailId: '' })}><Plus className='h-3 w-3' /></Button>
                                    )}
                                    {emailFields.length > 1 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removeEmail(index)}><Trash2 className='h-4 w-4 text-red-500' /></Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='space-y-1'>
                            <Label>Font Color</Label>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 border rounded-md'><Plus className='h-4 w-4' /></div>
                                <input type='text' placeholder='Click Here' {...register('mI_FontColor')} className='form-input border rounded-md px-2 py-1' />
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <Label>Week Start Day</Label>
                            <Controller control={control} name='mI_WeekStartDay' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='space-y-1'>
                            <Label>Date Format</Label>
                            <Controller control={control} name='mI_DateFormat' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        {['YMD', 'DMY', 'MDY'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='flex items-center gap-2'>
                            <Label>Franchise Flag</Label>
                            <Controller control={control} name='mI_FranchiseFlag' render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            )} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Background Image</Label>
                            <input type='file' accept='image/*' className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' />
                        </div>

                        <InputTextarea label='About Institution' maxLength={1100} {...register('mI_AboutInstitute')} error={errors.mI_AboutInstitute?.message} />
                        <InputTextarea label='TAN' maxLength={10} {...register('mI_TAN')} error={errors.mI_TAN?.message} />
                        <InputTextarea label='PAN' maxLength={10} {...register('mI_PAN')} error={errors.mI_PAN?.message} />
                        <InputText label='80G Registration No' {...register('mI_80GRegNo')} error={errors.mI_80GRegNo?.message} />

                        {/* SMS Alerts */}
                        <div className='space-y-2'>
                            <Label>SMS Credit Alert Email <span className='text-red-500'>*</span></Label>
                            {smsEmailFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2'>
                                    <InputText placeholder='Alert Email' {...register(`emails1.${index}.mI_SMSAlertToemailids`)} error={errors.emails1?.[index]?.mI_SMSAlertToemailids?.message} />
                                    {index === smsEmailFields.length - 1 && smsEmailFields.length < 10 && (
                                        <Button type='button' variant='outline' size='icon' onClick={() => appendSmsEmail({ mI_SMSAlertToemailids: '' })}><Plus className='h-3 w-3' /></Button>
                                    )}
                                    {smsEmailFields.length > 1 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removeSmsEmail(index)}><Trash2 className='h-4 w-4 text-red-500' /></Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='space-y-1'>
                            <Label>Credential Type <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='mI_CreditType' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='OTP'>OTP</SelectItem>
                                        <SelectItem value='Admno'>Admno</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.mI_CreditType?.message}</FormError>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className='space-y-4'>
                        <InputText label='Institution Name' required {...register('mI_Name')} error={errors.mI_Name?.message} />

                        <div className='space-y-1'>
                            <Label>Affiliation <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='mI_Affiliation' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='University'>University</SelectItem>
                                        <SelectItem value='ICSC'>ICSC</SelectItem>
                                        <SelectItem value='CBSC'>CBSC</SelectItem>
                                        <SelectItem value='State'>State</SelectItem>
                                        <SelectItem value='Autonomous'>Autonomous</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.mI_Affiliation?.message}</FormError>
                        </div>

                        <InputTextarea label='Address2' required maxLength={40} {...register('mI_Address2')} error={errors.mI_Address2?.message} />

                        <div className='space-y-1'>
                            <Label>Country <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='ivrmmC_Id' render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined}>
                                    <SelectTrigger><SelectValue placeholder={isCountriesLoading ? 'Loading countries...' : 'Select Country'} /></SelectTrigger>
                                    <SelectContent>
                                        {countryList.map(c => <SelectItem key={c.ivrmmC_Id} value={String(c.ivrmmC_Id)}>{c.ivrmmC_CountryName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.ivrmmC_Id?.message}</FormError>
                        </div>

                        <InputText label='City' required {...register('ivrmmcT_Name')} error={errors.ivrmmcT_Name?.message} />
                        <InputText label='Fax' {...register('mI_FaxNo')} error={errors.mI_FaxNo?.message} />

                        {/* Phones */}
                        <div className='space-y-2'>
                            <Label>Phone No <span className='text-red-500'>*</span></Label>
                            {phoneFields.map((field, index) => (
                                <div key={field.id} className='flex gap-2'>
                                    <InputText placeholder='Phone No' maxLength={10} {...register(`phones.${index}.mipN_PhoneNo`)} error={errors.phones?.[index]?.mipN_PhoneNo?.message} />
                                    {index === phoneFields.length - 1 && phoneFields.length < 3 && (
                                        <Button type='button' variant='outline' size='icon' onClick={() => appendPhone({ mipN_PhoneNo: '' })}><Plus className='h-3 w-3' /></Button>
                                    )}
                                    {phoneFields.length > 1 && (
                                        <Button type='button' variant='ghost' size='icon' onClick={() => removePhone(index)}><Trash2 className='h-4 w-4 text-red-500' /></Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='space-y-1'>
                            <Label>Form Color</Label>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 border rounded-md'><Plus className='h-4 w-4' /></div>
                                <input type='text' placeholder='Click Here' {...register('mI_FormColor')} className='form-input border rounded-md px-2 py-1' />
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <Label>Font Size</Label>
                            <Controller control={control} name='mI_FontSize' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        {['12', '14', '16', '24'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='space-y-1'>
                            <Label>School/College/University</Label>
                            <Controller control={control} name='mI_SchoolCollegeFlag' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select Type' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='S'>School</SelectItem>
                                        <SelectItem value='C'>College</SelectItem>
                                        <SelectItem value='U'>University</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <div className='space-y-1'>
                            <Label>NAAC Institution Type <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='mI_NAAC_InstitutionTypeFlg' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={!schoolCollegeFlag}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    {/* Simplified Options based on flag */}
                                    <SelectContent>
                                        <SelectItem value='School'>School</SelectItem>
                                        <SelectItem value='Affiliated College'>Affiliated College</SelectItem>
                                        <SelectItem value='Deemed'>Deemed University</SelectItem>
                                        <SelectItem value='University'>University</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.mI_NAAC_InstitutionTypeFlg?.message}</FormError>
                        </div>

                        <div className='space-y-1'>
                            <Label>NAAC Sub Institution <span className='text-red-500'>*</span></Label>
                            <Controller control={control} name='mI_NAAC_SubInstitutionTypeFlg' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Others'>Others</SelectItem>
                                        <SelectItem value='DEEMED_HSU'>HS University</SelectItem>
                                        <SelectItem value='DEEMED_GU'>General University</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                            <FormError>{errors.mI_NAAC_SubInstitutionTypeFlg?.message}</FormError>
                        </div>

                        <div className='space-y-1'>
                            <Label>Date Separator</Label>
                            <Controller control={control} name='mI_DateSeparator' render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='/'>/</SelectItem>
                                        <SelectItem value='.'>.</SelectItem>
                                        <SelectItem value='-'>-</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>

                        <InputText label='Grading System' {...register('mI_GradingSystem')} />
                        <InputText label='Sub Domain Name' required {...register('mI_Subdomain')} error={errors.mI_Subdomain?.message} />

                        <div className='space-y-2'>
                            <Label>Logo</Label>
                            <input type='file' accept='image/*' className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' />
                        </div>

                        <InputTextarea label='Contact Details' maxLength={200} {...register('mI_ContactDetails')} error={errors.mI_ContactDetails?.message} />
                        <InputText label='SMS Credit Alert Count' {...register('mI_SMSCountAlert')} error={errors.mI_SMSCountAlert?.message} />
                        <InputText label='SMS Entity ID' required {...register('mI_EntityId')} error={errors.mI_EntityId?.message} />
                    </div>

                    {/* VIDEO CONFERENCING */}
                    <div className='col-span-1 border-t pt-4 lg:col-span-2'>
                        <h3 className='mb-2 text-lg font-semibold text-blue-600'>Video Conferencing</h3>
                        <div className='overflow-x-auto rounded-md border'>
                            <table className='w-full text-left text-sm'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='p-2'>SL. NO.</th>
                                        <th className='p-2'>Select</th>
                                        <th className='p-2'>VC Names</th>
                                        <th className='p-2'>VC Code</th>
                                        <th className='p-2'>VC Host URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vcFields.map((field, index) => {
                                        const master = vcMasterData.find(m => m.mvidcoN_Id === field.mvidcoN_Id);
                                        return (
                                            <tr key={field.id} className='border-t'>
                                                <td className='p-2'>{index + 1}</td>
                                                <td className='p-2'>
                                                    <Controller control={control} name={`vcDetails.${index}.checkedvalue`} render={({ field: cbField }) => (
                                                        <Checkbox checked={!!cbField.value} onCheckedChange={cbField.onChange} />
                                                    )} />
                                                </td>
                                                <td className='p-2'>{master?.mvidcoN_VCNames}</td>
                                                <td className='p-2'>{master?.mvidcoN_VCCode}</td>
                                                <td className='p-2'>
                                                    <InputText {...register(`vcDetails.${index}.mvidconinT_HostedURL`)} placeholder='Host URL' />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='space-y-1'>
                                <Label>VC Student Flag</Label>
                                <Controller control={control} name='mI_VCStudentFlag' render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                        <SelectContent>
                                            {vcMasterData.map(vc => <SelectItem key={vc.mvidcoN_Id} value={String(vc.mvidcoN_Id)}>{vc.mvidcoN_VCNames}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
                            <div className='space-y-1'>
                                <Label>VC Others Flag</Label>
                                <Controller control={control} name='mI_VCOthersFlag' render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue placeholder='Select' /></SelectTrigger>
                                        <SelectContent>
                                            {vcMasterData.map(vc => <SelectItem key={vc.mvidcoN_Id} value={String(vc.mvidcoN_Id)}>{vc.mvidcoN_VCNames}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* MS TEAMS SETTINGS */}
                    <div className='col-span-1 border-t pt-4 lg:col-span-2'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-blue-600'>MS TEAMS SETTINGS</h3>
                            <div className='flex items-center gap-2'>
                                <Label>Enable MS Teams Integration</Label>
                                <Checkbox checked={showMSTeams} onCheckedChange={(checked) => setShowMSTeams(!!checked)} />
                            </div>
                        </div>

                        {showMSTeams && (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-300'>
                                <InputText label='MSTeams Client Id' {...register('mI_MSTeamsClientId')} error={errors.mI_MSTeamsClientId?.message} />
                                <InputText label='MSTeams Tenent Id' {...register('mI_MSTeamsTenentId')} />
                                <InputText label='Clinet Secret Code' {...register('mI_MSTemasClinetSecretCode')} />
                                <InputText label='App Access Tocken URL' {...register('mI_MSTeamsAppAccessTockenURL')} />
                                <InputText label='Teams Admin Username' {...register('mI_MSTeamsAdminUsername')} />

                                <InputText label='User Access Tocken URL' {...register('mI_MSTeamsUserAceessTockenURL')} />
                                <InputText label='Meeting Schedule URL' {...register('mI_MSTeamsMeetingScheduleURL')} />
                                <InputText label='Grant Type' {...register('mI_MSTeamsGrantType')} />
                                <InputText label='MS Teams Scope' {...register('mI_MSTeamsScope')} />
                                <InputText label='Teams Admin Password' {...register('mI_MSTeamsAdminPassword')} type='password' />
                            </div>
                        )}
                    </div>

                </div>

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-center'>
                    <Button type='submit' disabled={isSubmitting} className='order-1 w-32' isLoading={isSubmitting} loadingText='Saving...'>
                        <Save className='mr-2 h-4 w-4' /> Save
                    </Button>
                    <Button type='button' variant='outline' onClick={() => reset()} disabled={isSubmitting} className='order-2 w-32'>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
