'use client';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useMasterFeeOnlinePaymentHeadGroupTable,
    useMasterOnlinePaymentHeadGroup,
    useMasterOnlinePaymentHeadGroupClass,
    useMasterOnlinePaymentHeadGroupGroupName,
    useMasterOnlinePaymentHeadGroupHeadName,
    useMasterOnlinePaymentHeadGroupInstallment,
    useMasterOnlinePaymentHeadGroupSubMerchant,
    useMasterTerms
} from '@/hooks/fees/useMasters';
import { masterOnlinePaymentHeadGroupSchema } from '@/schemas/fees/masters';
import { GetInstallmentMasterDropdown, addMasterOnlinePaymentHeadGroup } from '@/server/fees/masters/online_payment_head_group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof masterOnlinePaymentHeadGroupSchema.addOrUpdate>;

export interface SelectedRowData {
    fopM_Id: number;
    asmaY_Id?: number;
    asmcL_ID?: number;
    className?: string;
    fpgd_id?: number;
    submerchandId?: string;
    fmg_id?: number;
    groupName?: string;
    fmh_HeadId?: number;
    headName?: string;
    fti_id?: number;
    installmentName?: string;
    fmt_id?: number;
    termName?: string;
    institutionName?: string;
}

interface UpdateFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: SelectedRowData;
}

export default function UpdateMasterStudentFeeGroupMappingsForm({ onSuccess, className = '', selectedRow }: UpdateFormProps) {
    // Local state
    const { refetchAll } = useMasterFeeOnlinePaymentHeadGroupTable();
    const [academicYear, setAcademicYear] = useState<number | null>(selectedRow?.asmaY_Id || null);
    const [classId, setClassId] = useState<number | null>(selectedRow?.asmcL_ID || null);
    const [subMerchantId, setSubMerchantId] = useState<number | null>(selectedRow?.fpgd_id || null);
    const [groupId, setGroupId] = useState<number | null>(selectedRow?.fmg_id || null);
    const [selectedHeads, setSelectedHeads] = useState<number[]>([]);
    const [installmentId, setInstallmentId] = useState<number | null>(selectedRow?.fti_id || null);
    const [termId, setTermId] = useState<number | null>(selectedRow?.fmt_id || null);
    const [headSearchTerm, setHeadSearchTerm] = useState('');

    // Data hooks
    const { data: academicYearData, isLoading: academicYearLoading, error: academicYearError } = useMasterOnlinePaymentHeadGroup();
    const { data: masterClass, isLoading: masterClassLoading } = useMasterOnlinePaymentHeadGroupClass(academicYear ?? undefined);
    const { data: masterSubMerchant, isLoading: masterSubMerchantLoading } = useMasterOnlinePaymentHeadGroupSubMerchant(
        academicYear ?? undefined
    );
    const { data: masterGroupName, isLoading: masterGroupNameLoading } = useMasterOnlinePaymentHeadGroupGroupName(
        academicYear ?? undefined
    );
    const {
        data: masterHeadName,
        isLoading: masterHeadNameLoading,
        refetch: refetchHeadNames
    } = useMasterOnlinePaymentHeadGroupHeadName(academicYear ?? undefined, groupId ?? undefined);
    const { data: masterInstallment, isLoading: masterInstallmentLoading } = useMasterOnlinePaymentHeadGroupInstallment(
        academicYear ?? undefined
    );
    const { data: masterTerms, isLoading: masterTermsLoading } = useMasterTerms();

    // Form
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterOnlinePaymentHeadGroupSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            mI_Id: '30',
            institutionName: 'vidya_vikas_vidya_samste',
            asmaY_Id: selectedRow.asmaY_Id,
            classCategory: selectedRow.asmcL_ID?.toString() || '',
            subMerchantId: selectedRow.fpgd_id?.toString() || '',
            groupName: selectedRow.fmg_id?.toString() || '',
            installmentName: selectedRow.fti_id?.toString() || '',
            terms: selectedRow.fmt_id?.toString() || '',
            academicYear: selectedRow.asmaY_Id?.toString() || ''
        }
    });

    // Options state
    const [classCategoryOptions, setClassCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [subMerchantIdOptions, setSubMerchantIdOptions] = useState<{ value: string; label: string }[]>([]);
    const [groupNameOptions, setGroupNameOptions] = useState<{ value: string; label: string }[]>([]);
    const [headOptions, setHeadOptions] = useState<{ value: string; label: string }[]>([]);
    const [installmentOptions, setInstallmentOptions] = useState<{ value: string; label: string }[]>([]);
    const [termsOptions, setTermsOptions] = useState<{ value: string; label: string }[]>([]);

    const filteredHeadOptions = headOptions.filter((o) => o.label.toLowerCase().includes(headSearchTerm.toLowerCase()));

    // Sync selectedRow → state & form
    useEffect(() => {
        if (!selectedRow) return;

        const heads = selectedRow.fmh_HeadId ? [selectedRow.fmh_HeadId] : [];
        setAcademicYear(selectedRow.asmaY_Id || null);
        setClassId(selectedRow.asmcL_ID || null);
        setSubMerchantId(selectedRow.fpgd_id || null);
        setGroupId(selectedRow.fmg_id || null);
        setSelectedHeads(heads);
        setInstallmentId(selectedRow.fti_id || null);
        setTermId(selectedRow.fmt_id || null);

        reset({
            mI_Id: '30',
            institutionName: 'vidya_vikas_vidya_samste',
            asmaY_Id: selectedRow.asmaY_Id,
            classCategory: selectedRow.asmcL_ID?.toString() || '',
            subMerchantId: selectedRow.fpgd_id?.toString() || '',
            groupName: selectedRow.fmg_id?.toString() || '',
            installmentName: selectedRow.fti_id?.toString() || '',
            terms: selectedRow.fmt_id?.toString() || '',
            academicYear: selectedRow.asmaY_Id?.toString() || ''
        });
    }, [selectedRow, reset]);

    // Populate institute
    useEffect(() => {
        setValue('institutionName', 'vidya_vikas_vidya_samste');
    }, [setValue]);

    // Refetch heads on group/academic year change
    useEffect(() => {
        if (academicYear && groupId) {
            refetchHeadNames();
        } else {
            setHeadOptions([]);
            setSelectedHeads([]);
        }
    }, [academicYear, groupId, refetchHeadNames]);

    // Fetch installments dynamically when heads change
    useEffect(() => {
        const fetchInstallments = async () => {
            if (!academicYear || !classId || !groupId || !!selectedHeads) {
                setInstallmentOptions([]);
                return;
            }

            try {
                const payload: any = {
                    // mi_Id: Number(getValues('mI_Id') ?? 30),
                    asmaY_Id: academicYear,
                    fmg_Id: groupId ?? classId
                };

                const typedSelectedHeads: any[] = selectedHeads || [];

                if (typedSelectedHeads.length > 0) {
                    payload.selectedheadList = typedSelectedHeads.map((h) => ({ fmH_Id: h }));
                }

                const res = await GetInstallmentMasterDropdown(payload);
                if (res?.data && Array.isArray(res.data)) {
                    const opts = res.data.map((c: any) => ({
                        value: String(c.ftI_Id ?? c.ftI_ID ?? c.fti_id),
                        label: c.ftI_Name ?? c.ftI_NAME ?? c.fti_name ?? c.Name ?? ''
                    }));
                    const unique = opts.filter((o, i, a) => a.findIndex((t) => t.value === o.value) === i);
                    setInstallmentOptions(unique);
                } else {
                    setInstallmentOptions([]);
                }
            } catch (err) {
                console.error('Error fetching installments:', err);
                setInstallmentOptions([]);
            }
        };

        fetchInstallments();
    }, [academicYear, classId, groupId, selectedHeads, getValues]);

    // Map options
    useEffect(() => {
        if (masterClass?.data && Array.isArray(masterClass.data)) {
            setClassCategoryOptions(
                masterClass.data.map((c: any) => ({
                    value: c.asmcL_ID.toString(),
                    label: c.asmcL_ClassName
                }))
            );
        } else {
            setClassCategoryOptions([]);
        }
    }, [masterClass?.data]);

    useEffect(() => {
        if (masterSubMerchant?.data && Array.isArray(masterSubMerchant.data)) {
            setSubMerchantIdOptions(
                masterSubMerchant.data.map((c: any) => ({
                    value: c.fpgD_Id.toString(),
                    label: c.fpgD_MerchantId
                }))
            );
        } else {
            setSubMerchantIdOptions([]);
        }
    }, [masterSubMerchant?.data]);

    useEffect(() => {
        if (masterGroupName?.data && Array.isArray(masterGroupName.data)) {
            setGroupNameOptions(
                masterGroupName.data.map((c: any) => ({
                    value: c.fmg_id.toString(),
                    label: c.groupName
                }))
            );
        } else {
            setGroupNameOptions([]);
        }
    }, [masterGroupName?.data]);

    useEffect(() => {
        if (masterHeadName?.data && Array.isArray(masterHeadName.data)) {
            setHeadOptions(
                masterHeadName.data.map((c: any) => ({
                    value: c.fmh_HeadId.toString(),
                    label: c.fmh_HeadName
                }))
            );
        } else {
            setHeadOptions([]);
        }
    }, [masterHeadName?.data]);

    useEffect(() => {
        if (masterInstallment?.data && Array.isArray(masterInstallment.data)) {
            const opts = masterInstallment.data.map((c: any) => ({
                value: String(c.ftI_Id ?? c.ftI_ID ?? c.fti_id),
                label: c.ftI_Name ?? c.ftI_NAME ?? c.fti_name ?? c.Name ?? ''
            }));
            const unique = opts.filter((o, i, a) => a.findIndex((t) => t.value === o.value) === i);
            setInstallmentOptions(unique);
        } else {
            setInstallmentOptions([]);
        }
    }, [masterInstallment?.data]);

    useEffect(() => {
        if (masterTerms?.data && Array.isArray(masterTerms.data)) {
            setTermsOptions(
                masterTerms.data.map((c: any) => ({
                    value: c.fmT_Id.toString(),
                    label: c.fmT_Name
                }))
            );
        } else {
            setTermsOptions([]);
        }
    }, [masterTerms?.data]);

    // Submit
    const onSubmit: SubmitHandler<FormFields> = async () => {
        if (!academicYear) {
            toast.error('Please select Academic Year');
            return;
        }
        if (!classId) {
            toast.error('Please select Class');
            return;
        }
        if (!subMerchantId) {
            toast.error('Please select Sub Merchant Id');
            return;
        }
        if (!groupId) {
            toast.error('Please select Group Name');
            return;
        }
        if (selectedHeads.length === 0) {
            toast.error('Please select at least one Head Name');
            return;
        }
        if (!termId) {
            toast.error('Please select Terms');
            return;
        }
        if (!installmentId) {
            toast.error('Please select Installment');
            return;
        }

        const payload = {
            fopM_Id: selectedRow.fopM_Id,
            // mI_Id: Number(getValues('mI_Id') ?? 30),
            asmaY_Id: academicYear,
            asmcL_ID: classId,
            fpgd_id: subMerchantId,
            fmg_id: groupId,
            selectedheadList: selectedHeads.map((headId) => ({ fmH_Id: headId })),
            fmt_id: termId,
            fti_id: installmentId
            // user_id: 1001
        };

        console.log('Update payload:', JSON.stringify(payload)); // Log the payload);

        try {
            const response = await addMasterOnlinePaymentHeadGroup(payload);
            if (response.success) {
                toast.success(response.message || 'Online Payment Head Group updated successfully');
                await refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to update');
            }
        } catch (error: any) {
            console.error('Error updating:', error);
            toast.error(error.message || 'An error occurred while updating');
        }
    };

    const handleReset = () => {
        if (!selectedRow) return;

        setAcademicYear(selectedRow.asmaY_Id || null);
        setClassId(selectedRow.asmcL_ID || null);
        setSubMerchantId(selectedRow.fpgd_id || null);
        setGroupId(selectedRow.fmg_id || null);
        setSelectedHeads(selectedRow.fmh_HeadId ? [selectedRow.fmh_HeadId] : []);
        setInstallmentId(selectedRow.fti_id || null);
        setTermId(selectedRow.fmt_id || null);
        setHeadSearchTerm('');

        reset({
            mI_Id: '30',
            institutionName: 'vidya_vikas_vidya_samste',
            asmaY_Id: selectedRow.asmaY_Id,
            classCategory: selectedRow.asmcL_ID?.toString() || '',
            subMerchantId: selectedRow.fpgd_id?.toString() || '',
            groupName: selectedRow.fmg_id?.toString() || '',
            installmentName: selectedRow.fti_id?.toString() || '',
            terms: selectedRow.fmt_id?.toString() || '',
            academicYear: selectedRow.asmaY_Id?.toString() || ''
        });
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        {/* Institute */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='institutionName'>
                                Institute <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='institutionName'
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value || 'vidya_vikas_vidya_samste'} disabled>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Vidya Vikas Vidya Samste (R)' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='vidya_vikas_vidya_samste'>Vidya Vikas Vidya Samste (R)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Academic Year */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='asmaY_Id'>
                                Academic Year <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='asmaY_Id'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            const numValue = Number(value);
                                            field.onChange(numValue);
                                            setAcademicYear(numValue);
                                            setClassId(null);
                                            setSubMerchantId(null);
                                            setGroupId(null);
                                            setSelectedHeads([]);
                                            setInstallmentId(null);
                                        }}
                                        value={field.value?.toString() || ''}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : academicYearError ? (
                                                <SelectItem value='error' disabled>
                                                    Error loading data
                                                </SelectItem>
                                            ) : (
                                                academicYearData?.data?.map((item: any) => (
                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                        {item.asmaY_Year}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                        </div>

                        {/* Class */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='classCategory'>
                                Class <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='classCategory'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setClassId(Number(value));
                                        }}
                                        value={field.value}
                                        disabled={!academicYear}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Class' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterClassLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : classCategoryOptions.length === 0 ? (
                                                <SelectItem value='no-data' disabled>
                                                    No classes available
                                                </SelectItem>
                                            ) : (
                                                classCategoryOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.classCategory && <FormError>{errors.classCategory.message}</FormError>}
                        </div>

                        {/* Sub Merchant Id */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='subMerchantId'>
                                Sub Merchant Id <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='subMerchantId'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSubMerchantId(Number(value));
                                        }}
                                        value={field.value}
                                        disabled={!academicYear}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Sub Merchant Id' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterSubMerchantLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : subMerchantIdOptions.length === 0 ? (
                                                <SelectItem value='no-data' disabled>
                                                    No sub merchants available
                                                </SelectItem>
                                            ) : (
                                                subMerchantIdOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.subMerchantId && <FormError>{errors.subMerchantId.message}</FormError>}
                        </div>

                        {/* Group Name */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='groupName'>
                                Group Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='groupName'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setGroupId(Number(value));
                                            setSelectedHeads([]);
                                            setHeadSearchTerm('');
                                        }}
                                        value={field.value}
                                        disabled={!academicYear}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Group Name' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterGroupNameLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : groupNameOptions.length === 0 ? (
                                                <SelectItem value='no-data' disabled>
                                                    No groups available
                                                </SelectItem>
                                            ) : (
                                                groupNameOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.groupName && <FormError>{errors.groupName.message}</FormError>}
                        </div>

                        {/* Head Name (Multi-select) */}
                        <div className='group flex flex-col gap-1.5 md:col-span-2'>
                            <Label>
                                Head Name <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <div className='min-h-[40px] rounded-md border bg-white px-3 py-2'>
                                <input
                                    type='text'
                                    placeholder='Search Head Name'
                                    className='mb-2 w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={headSearchTerm}
                                    onChange={(e) => setHeadSearchTerm(e.target.value)}
                                    disabled={!academicYear || !groupId}
                                />
                                <div className='flex max-h-40 flex-col gap-2 overflow-y-auto'>
                                    {masterHeadNameLoading ? (
                                        <span className='text-gray-400 text-sm'>Loading heads...</span>
                                    ) : filteredHeadOptions.length > 0 ? (
                                        filteredHeadOptions.map((option) => {
                                            const optVal = Number(option.value);
                                            return (
                                                <label
                                                    key={option.value}
                                                    className='flex cursor-pointer items-center rounded p-1 hover:bg-gray-50'>
                                                    <input
                                                        type='checkbox'
                                                        value={option.value}
                                                        checked={selectedHeads.includes(optVal)}
                                                        onChange={async (e) => {
                                                            const checked = e.target.checked;
                                                            const newSelected = checked
                                                                ? [...selectedHeads, optVal]
                                                                : selectedHeads.filter((p) => p !== optVal);
                                                            setSelectedHeads(newSelected);

                                                            // Fetch installments immediately
                                                            if (academicYear && (groupId ?? classId)) {
                                                                try {
                                                                    const payload: any = {
                                                                        // mi_Id: Number(getValues('mI_Id') ?? 30),
                                                                        asmaY_Id: academicYear,
                                                                        fmg_Id: groupId ?? classId
                                                                    };
                                                                    if (newSelected.length > 0) {
                                                                        payload.selectedheadList = newSelected.map((h) => ({ fmH_Id: h }));
                                                                    }
                                                                    const res = await GetInstallmentMasterDropdown(payload);
                                                                    if (res?.data && Array.isArray(res.data)) {
                                                                        const opts = res.data.map((c: any) => ({
                                                                            value: String(c.ftI_Id ?? c.ftI_ID ?? c.fti_id),
                                                                            label: c.ftI_Name ?? c.ftI_NAME ?? c.fti_name ?? c.Name ?? ''
                                                                        }));
                                                                        const unique = opts.filter(
                                                                            (o, i, a) => a.findIndex((t) => t.value === o.value) === i
                                                                        );
                                                                        setInstallmentOptions(unique);
                                                                    } else {
                                                                        setInstallmentOptions([]);
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Error fetching installments on head toggle:', err);
                                                                }
                                                            }
                                                        }}
                                                        className='mr-2 h-4 w-4 accent-blue-600'
                                                    />
                                                    <span className='truncate'>{option.label}</span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <span className='text-gray-400 text-sm'>
                                            {!academicYear || !groupId ? 'Select Academic Year and Group Name first' : 'No Head Name found'}
                                        </span>
                                    )}
                                </div>
                                {selectedHeads.length > 0 && (
                                    <div className='mt-2 text-blue-600 text-sm'>{selectedHeads.length} head(s) selected</div>
                                )}
                            </div>
                        </div>

                        {/* Installment */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='installment'>
                                Installment <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='installmentName'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setInstallmentId(Number(value));
                                        }}
                                        value={field.value}
                                        disabled={!academicYear}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Installment' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterInstallmentLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : installmentOptions.length === 0 ? (
                                                <SelectItem value='no-data' disabled>
                                                    No installments available
                                                </SelectItem>
                                            ) : (
                                                installmentOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.installmentName && <FormError>{errors.installmentName.message}</FormError>}
                        </div>

                        {/* Terms */}
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='terms'>
                                Terms <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Controller
                                name='terms'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setTermId(Number(value));
                                        }}
                                        value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Terms' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterTermsLoading ? (
                                                <SelectItem value='loading' disabled>
                                                    Loading...
                                                </SelectItem>
                                            ) : termsOptions.length === 0 ? (
                                                <SelectItem value='no-data' disabled>
                                                    No terms available
                                                </SelectItem>
                                            ) : (
                                                termsOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.terms && <FormError>{errors.terms.message}</FormError>}
                        </div>
                    </div>

                    {errors.root && <FormError>{errors.root.message}</FormError>}
                </div>

                {/* Action Buttons */}
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
                        loadingText='Updating...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Online Payment Head Group
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
