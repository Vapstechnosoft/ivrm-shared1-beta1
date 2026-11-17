'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterConfiguration } from '@/hooks/admission/preadmission/useConfigurations';
import { useAcademicYearDropdown, useMasterCategoryDropdown } from '@/hooks/admission/preadmission/useMasters';
import { masterConfigurationSchema } from '@/schemas/admission/preadmission/masters';
import { addMatserConfiguration } from '@/server/admission/preadmission/configuration/master_configuration';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, Save, Square } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterConfigurationSchema.add>;

interface AddMasterConfigurationProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddMasterConfiguration({ onSuccess, className = '' }: AddMasterConfigurationProps) {
    const { data: academicYear, isLoading: ayLoading } = useAcademicYearDropdown();

    const { data: masterCategory, isLoading: catLoading } = useMasterCategoryDropdown();

    const [_enquiryApplicable, setEnquiryApplicable] = useState(false);
    const [_oralTestApplicable, setOralTestApplicable] = useState(false);
    const [_oralMarksEntry, setOralMarksEntry] = useState(false);
    const [_writtenTestApplicable, setWrittenTestApplicable] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterConfigurationSchema.add),
        defaultValues: {
            asmaY_Id: undefined,
            amC_Id: undefined,

            ispaC_EnquiryApplFlag: 0,
            ispaC_ApplIssueFlag: 0,
            ispaC_EnqSMSFlag: 0,
            ispaC_EnqMailFlag: 0,
            ispaC_EnqMailBackground: 0,
            ispaC_ApplFeeFlag: 0,
            ispaC_ApplnDownladFlag: 0,
            ispaC_ApplSMSFlag: 0,
            ispaC_ApplMailFlag: 0,
            ispaC_ApplMailBackground: 0,
            ispaC_DOBMaxAgeFlag: 0,
            ispaC_DOBMinAgeFlag: 0,
            ispaC_ApplCutOffDateFlag: 0,
            ispaC_ApplNoGenFlag: 0,
            ispaC_DefaultStatusFlag: 0,
            ispaC_OralTestBy: undefined,
            ispaC_EnquiryNoGenFlag: 0,
            ispaC_RgNoGenFlag: 0,
            ispaC_RegSMSFlag: 0,
            ispaC_RegMailFlag: 0,
            ispaC_RegMailBackground: 0,
            ispaC_AdmCategoryFlag: 0,
            ispaC_WrittenTestApplFlag: 0,
            ispaC_MarksEntry: 0,
            ispaC_OralTestApplFlag: 0,
            ispaC_SeatBlockFlag: 0,
            ispaC_FatherAliveFlag: 0,
            ispaC_MotherAliveFlag: 0,
            ispaC_MaritalStatusFlag: 0,
            ispaC_FeePaymentFlag: 0,
            ispaC_AdmissionTransfer: 0,
            ispaC_EnableSiblingsLink: 0,
            ispaC_SibblingConcessionFlag: 0,
            ispaC_ParentConcessionFlag: 0,
            ispaC_ECSFlag: 0,
            ispaC_HostelFlag: 0,
            ispaC_TransaportFlag: 0,
            ispaC_GymFlag: 0,
            ispaC_EnquiryNo_ApplNo_RegNo: 0,
            ispaC_OralByMax_Marks: undefined,
            ispaC_OralByMin_Marks: undefined,
            ispaC_ProspectusFlag: 0,
            ispaC_Transfer_Settings_Flag: 0,
            ispaC_Transfer_Settings_after_payment_Flag: 0,
            ispaC_ProsptFeeApp: 0,
            ispaC_OralTestSchApplFlag: 0,
            ispaC_OralMarksFlag: 0,
            ispaC_RegFeeFlag: 0,
            ispaC_WrittenTestSchApplFlag: 0,
            ispaC_CommonScheduleFlag: 0,
            ispaC_NoofApplications: 0,
            ispaC_Healthapp: 0,
            ispaC_FullPaymentCompFlg: 0,
            ispaC_OfflineFee_Flag: 0,
            ispaC_ApplNoIncrementFlg: false,
            ispaC_ApplNoIncrementBy: 0
        } as Partial<FormFields>
    });
    const watchEnquiry = !!watch('ispaC_EnquiryApplFlag');
    const watchOralTest = !!watch('ispaC_OralTestApplFlag');
    const watchOralMarks = !!watch('ispaC_OralMarksFlag');
    const _watchWrittenTest = !!watch('ispaC_WrittenTestApplFlag');

    function nowISO() {
        return new Date().toISOString();
    }
    const { refetchAll: refetchMasterConfiguration } = useMasterConfiguration();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const payload = {
                createdDate: nowISO(),
                updatedDate: nowISO(),

                ispaC_Id: 0,
                asmaY_Id: data.asmaY_Id ?? 0,
                amC_Id: data.amC_Id ?? 0,

                ispaC_EnquiryApplFlag: data.ispaC_EnquiryApplFlag ?? 0,
                ispaC_ApplIssueFlag: data.ispaC_ApplIssueFlag ?? 0,
                ispaC_EnqSMSFlag: data.ispaC_EnqSMSFlag ?? 0,
                ispaC_EnqMailFlag: data.ispaC_EnqMailFlag ?? 0,
                ispaC_EnqMailBackground: data.ispaC_EnqMailBackground ?? 0,
                ispaC_ApplFeeFlag: data.ispaC_ApplFeeFlag ?? 0,
                ispaC_ApplnDownladFlag: data.ispaC_ApplnDownladFlag ?? 0,
                ispaC_ApplSMSFlag: data.ispaC_ApplSMSFlag ?? 0,
                ispaC_ApplMailFlag: data.ispaC_ApplMailFlag ?? 0,
                ispaC_ApplMailBackground: data.ispaC_ApplMailBackground ?? 0,
                ispaC_DOBMaxAgeFlag: data.ispaC_DOBMaxAgeFlag ?? 0,
                ispaC_DOBMinAgeFlag: data.ispaC_DOBMinAgeFlag ?? 0,
                ispaC_ApplCutOffDateFlag: data.ispaC_ApplCutOffDateFlag ?? 0,
                ispaC_ApplNoGenFlag: data.ispaC_ApplNoGenFlag ?? 0,
                ispaC_DefaultStatusFlag: data.ispaC_DefaultStatusFlag ?? 0,
                ispaC_OralTestBy: data.ispaC_OralTestBy ?? 0,
                ispaC_EnquiryNoGenFlag: data.ispaC_EnquiryNoGenFlag ?? 0,
                ispaC_RgNoGenFlag: data.ispaC_RgNoGenFlag ?? 0,
                ispaC_RegSMSFlag: data.ispaC_RegSMSFlag ?? 0,
                ispaC_RegMailFlag: data.ispaC_RegMailFlag ?? 0,
                ispaC_RegMailBackground: data.ispaC_RegMailBackground ?? 0,
                ispaC_AdmCategoryFlag: data.ispaC_AdmCategoryFlag ?? 0,
                ispaC_WrittenTestApplFlag: data.ispaC_WrittenTestApplFlag ?? 0,
                ispaC_MarksEntry: data.ispaC_MarksEntry ?? 0,
                ispaC_OralTestApplFlag: data.ispaC_OralTestApplFlag ?? 0,
                ispaC_SeatBlockFlag: data.ispaC_SeatBlockFlag ?? 0,
                ispaC_FatherAliveFlag: data.ispaC_FatherAliveFlag ?? 0,
                ispaC_MotherAliveFlag: data.ispaC_MotherAliveFlag ?? 0,
                ispaC_MaritalStatusFlag: data.ispaC_MaritalStatusFlag ?? 0,
                ispaC_FeePaymentFlag: data.ispaC_FeePaymentFlag ?? 0,
                ispaC_AdmissionTransfer: data.ispaC_AdmissionTransfer ?? 0,
                ispaC_EnableSiblingsLink: data.ispaC_EnableSiblingsLink ?? 0,
                ispaC_SibblingConcessionFlag: data.ispaC_SibblingConcessionFlag ?? 0,
                ispaC_ParentConcessionFlag: data.ispaC_ParentConcessionFlag ?? 0,
                ispaC_ECSFlag: data.ispaC_ECSFlag ?? 0,
                ispaC_HostelFlag: data.ispaC_HostelFlag ?? 0,
                ispaC_TransaportFlag: data.ispaC_TransaportFlag ?? 0,
                ispaC_GymFlag: data.ispaC_GymFlag ?? 0,
                ispaC_EnquiryNo_ApplNo_RegNo: data.ispaC_EnquiryNo_ApplNo_RegNo ?? 0,
                ispaC_OralByMax_Marks: data.ispaC_OralByMax_Marks ?? 0,
                ispaC_OralByMin_Marks: data.ispaC_OralByMin_Marks ?? 0,
                ispaC_ProspectusFlag: data.ispaC_ProspectusFlag ?? 0,
                ispaC_Transfer_Settings_Flag: data.ispaC_Transfer_Settings_Flag ?? 0,
                ispaC_Transfer_Settings_after_payment_Flag: data.ispaC_Transfer_Settings_after_payment_Flag ?? 0,
                ispaC_ProsptFeeApp: data.ispaC_ProsptFeeApp ?? 0,
                ispaC_OralTestSchApplFlag: data.ispaC_OralTestSchApplFlag ?? 0,
                ispaC_OralMarksFlag: data.ispaC_OralMarksFlag ?? 0,
                ispaC_RegFeeFlag: data.ispaC_RegFeeFlag ?? 0,
                ispaC_WrittenTestSchApplFlag: data.ispaC_WrittenTestSchApplFlag ?? 0,
                ispaC_CommonScheduleFlag: data.ispaC_CommonScheduleFlag ?? 0,
                ispaC_NoofApplications: data.ispaC_NoofApplications ?? 0,
                ispaC_Healthapp: data.ispaC_Healthapp ?? 0,
                ispaC_FullPaymentCompFlg: data.ispaC_FullPaymentCompFlg ?? 0,
                ispaC_OfflineFee_Flag: data.ispaC_OfflineFee_Flag ?? 0,
                ispaC_ApplNoIncrementFlg: Boolean(data.ispaC_ApplNoIncrementFlg),
                ispaC_ApplNoIncrementBy: data.ispaC_ApplNoIncrementBy ?? 0
            };

            const response = await addMatserConfiguration(payload);
            if (response.success) {
                toast.success(response.message ?? 'Saved');
                reset();
                await refetchMasterConfiguration();
                onSuccess?.();
            } else {
                toast.error(response.message ?? 'Failed');
            }
        } catch (err: any) {
            toast.error(err.message ?? 'Error');
        }
    };

    const handleReset = () => {
        reset();
        setEnquiryApplicable(false);
        setOralTestApplicable(false);
        setOralMarksEntry(false);
        setWrittenTestApplicable(false);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 p-4 sm:p-6'>
                <section className='space-y-4 rounded-md border p-6'>
                    <h2 className='font-medium text-lg text-primary'>General Settings</h2>

                    {/* Wrap both dropdowns in a grid */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1.5'>
                            <Label htmlFor='asmaY_Id'>
                                Academic Year <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent className='max-h-60'>
                                            {ayLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : (
                                                academicYear?.data?.map((y) => (
                                                    <SelectItem key={y.asmaY_Id} value={y.asmaY_Id.toString()}>
                                                        {y.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>

                        {/* ──────────────── Category ──────────────── */}
                        <div className='flex flex-col gap-1.5'>
                            <Label htmlFor='amC_Id'>
                                Category <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='amC_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        key={field.value || 'empty'}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Category' />
                                        </SelectTrigger>
                                        <SelectContent className='max-h-60'>
                                            {catLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : (
                                                masterCategory?.data?.map((cat) => (
                                                    <SelectItem key={cat.amC_Id} value={cat.amC_Id.toString()}>
                                                        {cat.amC_Name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.amC_Id && <FormError>{errors.amC_Id.message}</FormError>}
                        </div>
                    </div>
                </section>

                {/* ─────────────────── GENERAL REGISTRATION SETTINGS ─────────────────── */}
                <section className='space-y-4 rounded-md border p-6'>
                    <h2 className='font-medium text-lg text-primary'>General Registration Settings</h2>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <CustomCheckbox name='ispaC_ProspectusFlag' label='Prospectus Fee' control={control} />
                            <CustomCheckbox name='ispaC_RegSMSFlag' label='Registration SMS' control={control} />
                            <CustomCheckbox name='ispaC_RegMailFlag' label='Registration Email' control={control} />
                            <CustomCheckbox name='ispaC_ApplFeeFlag' label='Application Fee Applicable' control={control} />
                            <CustomCheckbox name='ispaC_ApplSMSFlag' label='Application SMS' control={control} />
                            <CustomCheckbox name='ispaC_ApplMailFlag' label='Application Email' control={control} />
                            <CustomCheckbox name='ispaC_Healthapp' label='Health Certificate Applicable' control={control} />
                        </div>
                        <div className='space-y-4'>
                            <NumberField
                                name='ispaC_NoofApplications'
                                label='Maximum application per user'
                                control={control}
                                placeholder='1'
                            />
                            <NumberField
                                name='ispaC_ApplNoIncrementBy'
                                label='Increment Application No. By'
                                control={control}
                                placeholder='0'
                            />
                            <div className='pt-2'>
                                <CustomCheckbox
                                    name='ispaC_ApplNoIncrementFlg'
                                    label='Application No. Increment'
                                    control={control}
                                    asBoolean
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ────────────────────── ENQUIRY & PROSPECTUS ───────────────────── */}
                <section className='space-y-4 rounded-md border p-6'>
                    <h2 className='font-medium text-lg text-primary'>Enquiry & Prospectus Settings</h2>

                    <CustomCheckbox
                        name='ispaC_EnquiryApplFlag'
                        label='Enquiry Applicable'
                        control={control}
                        onCheckedChange={(checked) => setEnquiryApplicable(checked)}
                    />

                    {watchEnquiry && (
                        <div className='space-y-3 border-gray-100 border-l pl-6'>
                            <CustomCheckbox name='ispaC_EnqSMSFlag' label='Enquiry SMS' control={control} />
                            <CustomCheckbox name='ispaC_EnqMailFlag' label='Enquiry Email' control={control} />
                        </div>
                    )}

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <CustomCheckbox name='ispaC_ProsptFeeApp' label='Prospectus Fee Applicable' control={control} />
                        <CustomCheckbox name='ispaC_ApplnDownladFlag' label='Prospectus Download' control={control} />
                    </div>
                </section>

                {/* ─────────────────────── STUDENT APPLICATION FORM SETTINGS ─────────────────────── */}
                <section className='rounded-md border p-4'>
                    <h2 className='font-medium text-lg text-primary'>Student Application Form Settings</h2>

                    <div className='mt-4 grid grid-cols-2 gap-3'>
                        <CustomCheckbox name='ispaC_ApplCutOffDateFlag' label='Online Application Cut Off Date' control={control} />

                        <CustomCheckbox name='ispaC_DOBMaxAgeFlag' label='Admission maximum age' control={control} />

                        <CustomCheckbox name='ispaC_DOBMinAgeFlag' label='Admission minimum age' control={control} />

                        <CustomCheckbox name='ispaC_HostelFlag' label='Hostel Applicable' control={control} />

                        <CustomCheckbox name='ispaC_TransaportFlag' label='Transport Applicable' control={control} />

                        <CustomCheckbox name='ispaC_SibblingConcessionFlag' label='Sibling concession' control={control} />

                        <CustomCheckbox name='ispaC_ParentConcessionFlag' label='Parent concession' control={control} />

                        <CustomCheckbox name='ispaC_ECSFlag' label='ECS option Applicable' control={control} />

                        <CustomCheckbox name='ispaC_GymFlag' label='Gym Applicable' control={control} />

                        <CustomCheckbox name='ispaC_FatherAliveFlag' label='Father Alive' control={control} />

                        <CustomCheckbox name='ispaC_MotherAliveFlag' label='Mother Alive' control={control} />

                        <CustomCheckbox name='ispaC_MaritalStatusFlag' label='Marital Status' control={control} />
                    </div>
                </section>

                {/* ────────────────────── ORAL & WRITTEN TEST ───────────────────── */}
                <section className='space-y-4 rounded-md border p-6'>
                    <h2 className='font-medium text-lg text-primary'>General Scheduling</h2>

                    <CustomCheckbox
                        name='ispaC_OralTestApplFlag'
                        label='Oral Test Applicable'
                        control={control}
                        onCheckedChange={(checked) => setOralTestApplicable(checked)}
                    />

                    {watchOralTest && (
                        <div className='border-gray-100 border-l pl-6'>
                            <div className='group flex flex-col gap-1.5'>
                                <Label>Oral Test By (Number):</Label>
                                <Controller
                                    name='ispaC_OralTestBy'
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select number' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4].map((n) => (
                                                    <SelectItem key={n} value={n.toString()}>
                                                        {n}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <CustomCheckbox
                        name='ispaC_OralMarksFlag'
                        label='Oral Test Marks Entry'
                        control={control}
                        onCheckedChange={(checked) => setOralMarksEntry(checked)}
                    />

                    {watchOralMarks && (
                        <div className='border-gray-100 border-l pl-6'>
                            <NumberField name='ispaC_OralByMax_Marks' label='Oral Max Marks:' control={control} placeholder='0' />
                        </div>
                    )}

                    <div className='flex items-center gap-6'>
                        <CustomCheckbox name='ispaC_WrittenTestApplFlag' label='Written Test Applicable' control={control} />
                        <CustomCheckbox name='ispaC_CommonScheduleFlag' label='Common Schedule Flag' control={control} />
                    </div>
                </section>

                {/* ────────────────────── PREADMISSION SETTINGS ───────────────────── */}
                <section className='space-y-4 rounded-md border p-6'>
                    <h2 className='font-medium text-lg text-primary'>Preadmission Settings</h2>
                    <div className='space-y-2'>
                        <CustomCheckbox
                            name='ispaC_FullPaymentCompFlg'
                            label='Transfer To Admission directly while making full Payment'
                            control={control}
                        />
                        <CustomCheckbox
                            name='ispaC_Transfer_Settings_after_payment_Flag'
                            label='Transfer To Admission Without Partial/Full payment Confirmation'
                            control={control}
                        />
                        <CustomCheckbox
                            name='ispaC_FeePaymentFlag'
                            label='Option for fee Payment Without Admission Confirmation'
                            control={control}
                        />
                        <CustomCheckbox name='ispaC_AdmissionTransfer' label='Admission Confirmation' control={control} />
                        <CustomCheckbox name='ispaC_OfflineFee_Flag' label='Offline Fee Applicable' control={control} />
                    </div>
                </section>

                {/* ────────────────────── ACTION BUTTONS ───────────────────── */}
                <div className='flex justify-start border-t pt-6'>
                    <div className='flex items-center gap-3 sm:w-auto'>
                        <Button type='button' variant='outline' onClick={handleReset} disabled={isSubmitting}>
                            Reset
                        </Button>
                        <Button type='submit' disabled={isSubmitting} isLoading={isSubmitting} loadingText='Saving...'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

/* ============================== CUSTOM CHECKBOX ============================== */
function CustomCheckbox({
    name,
    label,
    control,
    onCheckedChange,
    asBoolean
}: {
    name: keyof FormFields;
    label: string;
    control: any;
    onCheckedChange?: (checked: boolean) => void;
    asBoolean?: boolean;
}) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div
                    className='flex cursor-pointer items-center gap-2'
                    onClick={() => {
                        if (asBoolean) {
                            const newVal = !field.value;
                            field.onChange(newVal);
                            onCheckedChange?.(newVal);
                        } else {
                            const newVal = field.value ? 0 : 1;
                            field.onChange(newVal);
                            onCheckedChange?.(!!newVal);
                        }
                    }}>
                    {(asBoolean ? Boolean(field.value) : field.value) ? (
                        <CheckSquare className='h-5 w-5 text-primary' />
                    ) : (
                        <Square className='h-5 w-5 text-gray-400' />
                    )}
                    <Label className='cursor-pointer font-normal'>{label}</Label>
                    {/* Remove the display of numeric values */}
                </div>
            )}
        />
    );
}

/* ============================== NUMBER FIELD ============================== */
function NumberField({
    name,
    label,
    control,
    placeholder
}: {
    name: keyof FormFields;
    label: string;
    control: any;
    placeholder?: string;
}) {
    return (
        <div className='group flex flex-col gap-1.5'>
            <Label>{label}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                    <Input
                        type='number'
                        {...field}
                        value={value ? value.toString() : ''}
                        onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            onChange(Math.max(0, val)); // Ensure value is not negative
                        }}
                        min='0'
                        placeholder={placeholder}
                        className='w-full'
                    />
                )}
            />
        </div>
    );
}
