'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useMasterFeeInstallment } from '@/hooks/fees/useMasters';
import { masterInstallmentSchema } from '@/schemas/fees/masters';
import { addOrUpdateInstallment, getfeeInstallmentsByFmiId } from '@/server/fees/masters/feeinstallment';
import type { IMasterFeesInstallmentList } from '@/types/fees/masters/masters';

type FormFields = z.infer<typeof masterInstallmentSchema.addOrUpdate> & {
    fmI_Id?: number;
    installments?: { sno: number; ftI_Name: string; ftI_Id?: number }[];
};

interface UpdateMasterFeeInstallmentFormProps {
    onSuccess?: () => void;
    selectedRow: IMasterFeesInstallmentList;
}

export default function UpdateMasterFeeInstallmentForm({ onSuccess, selectedRow: row }: UpdateMasterFeeInstallmentFormProps) {
    const { refetchAll } = useMasterFeeInstallment();

    const sanitizedRef = useRef<{
        fmI_Id?: number | string;
        fmI_ActiveFlag?: any;
    }>({});

    const sanitizeSnapshot = (vals: any): FormFields | null => {
        if (!vals) return null;
        const copy: any = { ...vals };

        copy.fmI_Id = sanitizeId(copy.fmI_Id);

        if (Array.isArray(copy.installments)) {
            copy.installments = copy.installments.map((inst: any) => ({
                sno: inst?.sno,
                ftI_Name: inst?.ftI_Name ?? '',
                ftI_Id: sanitizeId(inst?.ftI_Id ?? inst?.id)
            }));
        }

        copy.fmI_No_Of_Installments = Number(copy.fmI_No_Of_Installments) || 1;
        copy.fmI_Installment_Type = copy.fmI_Installment_Type ?? '';
        copy.fmI_Name = copy.fmI_Name ?? '';

        return copy as FormFields;
    };

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(masterInstallmentSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            installments: [],
            fmI_Installment_Type: '',
            fmI_Name: '',
            fmI_No_Of_Installments: 1
        }
    });

    const initialValuesRef = useRef<FormFields | null>(null);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'installments'
    });

    const watchNoOfInstallments = useWatch({
        control,
        name: 'fmI_No_Of_Installments'
    });

    const installmentType = watch('fmI_Installment_Type');
    console.log('installmentType', installmentType);
    // === 1. DEFINE INSTALLMENT_TYPES HERE ===
    const INSTALLMENT_TYPES = [
        { value: 'general', label: 'General', count: 0 },
        { value: 'monthly', label: 'Monthly', count: 12 },
        { value: 'quarterly', label: 'Quarterly', count: 4 },
        { value: 'halfyearly', label: 'Half Yearly', count: 2 },
        { value: 'yearly', label: 'Yearly', count: 1 },
        { value: 'bimonthly', label: 'Bi-Monthly', count: 24 },
        { value: 'anytime', label: 'Anytime', count: 1 }
    ] as const;
    const initialLoadComplete = useRef(false);

    // === 2. ADD THIS useEffect: React to Installment Type change ===
    //     useEffect(() => {
    //         if (!initialLoadComplete.current) return;

    //         if (!installmentType || installmentType === 'general') {
    //             return; // User manually controls count
    //         }

    //         const selected = INSTALLMENT_TYPES.find((t) => t.value === installmentType);
    //         if (!selected || selected.count === 0) return;

    //         const newCount = selected.count;

    //         setValue('fmI_No_Of_Installments', newCount, { shouldValidate: true });

    //     //     const installments =  getfeeInstallmentsByFmiId(row.fmI_Id);
    //     //   console.log('installmentsnames', installments);

    //     //     // Reset to fresh defaults when type changes
    //     //     const newInstallments = Array.from({ length: newCount }, (_, i) => ({
    //     //         sno: i + 1,
    //     //         ftI_Name: `Installment ${i + 1}`,
    //     //         ftI_Id: undefined // New installments → no old ID
    //     //     }));

    //  const installments = await getfeeInstallmentsByFmiId(row.fmI_Id);
    // console.log('installmentsnames', installments);

    // // Use API data if available, otherwise fallback to defaults
    // const newInstallments = Array.isArray(installments) && installments.length > 0
    //     ? installments.map((inst: any, index: number) => ({
    //         sno: index + 1,
    //         ftI_Name: inst.ftI_Name || `Installment ${index + 1}`,
    //         ftI_Id: sanitizeId(inst.ftI_Id ?? inst.id)
    //       }))
    //     : Array.from({ length: newCount }, (_, i) => ({
    //         sno: i + 1,
    //         ftI_Name: `Installment ${i + 1}`,
    //         ftI_Id: undefined
    //       }));

    //         setValue('installments', newInstallments, { shouldValidate: true });
    //     }, [installmentType, setValue]);
    const sanitizeId = (id: any): number | undefined => {
        if (id === null || id === undefined) return undefined;
        if (typeof id === 'string') {
            const trimmed = id.trim();
            const lower = trimmed.toLowerCase();
            if (lower === '$undefined' || lower === 'undefined' || trimmed === '') {
                return undefined;
            }
            const n = Number(trimmed);
            if (!Number.isNaN(n) && n > 0 && Number.isInteger(n)) {
                return n;
            }
            return undefined; // 🔴 NEVER return string
        }
        if (typeof id === 'number') {
            return id > 0 && Number.isInteger(id) ? id : undefined;
        }
        return undefined;
    };

    // Make the useEffect async
    // Add this ref at the top with your other refs
    const hasSetInitialInstallments = useRef(false);

    // Replace your entire installment type useEffect with this:
    useEffect(() => {
        // Only run once on initial load
        if (!initialLoadComplete.current) return;

        // Prevent multiple executions
        if (hasSetInitialInstallments.current) return;

        const setInitialInstallments = async () => {
            if (!installmentType || installmentType === 'general') {
                hasSetInitialInstallments.current = true;
                return;
            }

            const selected = INSTALLMENT_TYPES.find((t) => t.value === installmentType);
            if (!selected || selected.count === 0) {
                hasSetInitialInstallments.current = true;
                return;
            }

            const newCount = selected.count;
            setValue('fmI_No_Of_Installments', newCount, { shouldValidate: true });

            // Only fetch if we have a valid ID
            if (row?.fmI_Id) {
                // Get installments from API
                const installments = await getfeeInstallmentsByFmiId(row.fmI_Id);
                console.log('installmentsnames', installments);

                // Use API data if available, otherwise fallback to defaults
                const newInstallments =
                    Array.isArray(installments) && installments.length > 0
                        ? installments.map((inst: any, index: number) => ({
                              sno: index + 1,
                              ftI_Name: inst.ftI_Name || `Installment ${index + 1}`,
                              ftI_Id: sanitizeId(inst.ftI_Id ?? inst.id)
                          }))
                        : Array.from({ length: newCount }, (_, i) => ({
                              sno: i + 1,
                              ftI_Name: `Installment ${i + 1}`,
                              ftI_Id: undefined
                          }));

                setValue('installments', newInstallments, { shouldValidate: true });
            } else {
                // No ID, use defaults
                const defaultInstallments = Array.from({ length: newCount }, (_, i) => ({
                    sno: i + 1,
                    ftI_Name: `Installment ${i + 1}`,
                    ftI_Id: undefined
                }));
                setValue('installments', defaultInstallments, { shouldValidate: true });
            }

            // Mark as completed
            hasSetInitialInstallments.current = true;
        };

        setInitialInstallments();

        // Remove dependency on installmentType - only run when row changes
    }, [row, setValue]); // ✅ Removed installmentType from dependencies

    // Keep your manual count change effect for General type
    useEffect(() => {
        if (watchNoOfInstallments === undefined) return;
        if (installmentType !== 'general') return; // Only run for General type

        const targetLength = Number(watchNoOfInstallments);
        const currentLength = fields.length;

        if (targetLength > currentLength) {
            for (let i = currentLength; i < targetLength; i++) {
                append({ sno: i + 1, ftI_Name: `Installment ${i + 1}` });
            }
        } else if (targetLength < currentLength) {
            for (let i = currentLength - 1; i >= targetLength; i--) {
                remove(i);
            }
        }
    }, [watchNoOfInstallments, fields.length, append, remove, installmentType]);

    // Reset the flag when row changes
    useEffect(() => {
        hasSetInitialInstallments.current = false;
    }, [row]);

    // === 3. Initial load effect (must come AFTER type change effect) ===
    useEffect(() => {
        if (!row) return;

        let normalizedType = '';
        if (row.fmI_Installment_Type) {
            normalizedType = String(row.fmI_Installment_Type).toLowerCase().trim();
        }

        const fmIId = sanitizeId(row.fmI_Id ?? (row as any).id);
        sanitizedRef.current = {
            fmI_Id: fmIId,
            fmI_ActiveFlag: row.fmI_ActiceFlag || row.fmI_ActiceFlag
        };

        let targetCount = row.fmI_No_Of_Installments || 1;
        const preset = INSTALLMENT_TYPES.find((t) => t.value === normalizedType);
        if (preset && preset.count > 0 && normalizedType !== 'general') {
            targetCount = preset.count;
        }

        let installments: { sno: number; ftI_Name: string; ftI_Id?: number }[] = [];

        if (Array.isArray((row as any).fydto) && (row as any).fydto.length > 0) {
            installments = (row as any).fydto.map((inst: any, index: number) => ({
                sno: index + 1,
                ftI_Name: inst.ftI_Name || `Installment ${index + 1}`,
                ftI_Id: sanitizeId(inst.ftI_Id ?? inst.id)
            }));

            while (installments.length < targetCount) {
                installments.push({
                    sno: installments.length + 1,
                    ftI_Name: `Installment ${installments.length + 1}`
                });
            }
        } else {
            installments = Array.from({ length: targetCount }, (_, i) => ({
                sno: i + 1,
                ftI_Name: `Installment ${i + 1}`
            }));
        }

        setValue('fmI_Installment_Type', normalizedType, { shouldValidate: true });
        setValue('fmI_Name', row.fmI_Name || '', { shouldValidate: true });
        setValue('fmI_No_Of_Installments', targetCount, { shouldValidate: true });
        setValue('installments', installments, { shouldValidate: true });
        setValue('fmI_Id', typeof fmIId === 'number' ? fmIId : undefined);

        initialValuesRef.current = {
            fmI_Id: typeof fmIId === 'number' ? fmIId : undefined,
            fmI_Installment_Type: normalizedType,
            fmI_Name: row.fmI_Name || '',
            fmI_No_Of_Installments: targetCount,
            installments
        };

        initialLoadComplete.current = true;

        // Force a re-render to update the UI
        setTimeout(() => {
            setValue('fmI_Installment_Type', normalizedType, { shouldValidate: true });
        }, 10);
    }, [row, setValue]);
    useEffect(() => {
        return () => {
            initialLoadComplete.current = false;
        };
    }, [row]);

    // === 4. Handle manual count change for General ===
    useEffect(() => {
        if (watchNoOfInstallments === undefined) return;

        const targetLength = Number(watchNoOfInstallments);
        const currentLength = fields.length;

        if (targetLength > currentLength) {
            for (let i = currentLength; i < targetLength; i++) {
                append({ sno: i + 1, ftI_Name: `Installment ${i + 1}` });
            }
        } else if (targetLength < currentLength) {
            for (let i = currentLength - 1; i >= targetLength; i--) {
                remove(i);
            }
        }
    }, [watchNoOfInstallments, fields.length, append, remove]);

    // === Rest of your code (onSubmit, handleReset, JSX) remains the same ===

    const onSubmit = async (data: FormFields) => {
        try {
            // Always get the most reliable fmI_Id
            const idFromForm = sanitizeId((data as any)?.fmI_Id ?? data.fmI_Id);
            const idFromRef = sanitizeId(sanitizedRef.current?.fmI_Id);
            const idFromRow = sanitizeId(row.fmI_Id ?? (row as any).id);
            // Prefer form, then ref, then row
            const fmI_Id = idFromForm || idFromRef || idFromRow;

            const payload = {
                // Always pass fmI_Id, even if undefined
                fmI_Id,
                mI_Id: row.mI_Id,
                fmI_Name: data.fmI_Name,
                fmI_Installment_Type: data.fmI_Installment_Type,
                fmI_No_Of_Installments: data.fmI_No_Of_Installments,
                fydto: (data.installments || []).map((inst: any, idx: number) => {
                    const originalInst = (row as any).fydto?.[idx] ?? {};
                    const originalId = sanitizeId(originalInst.ftI_Id ?? originalInst.id);
                    const idFromForm = sanitizeId(inst.ftI_Id);
                    const ftI_Id = idFromForm || originalId;
                    return {
                        ftI_Id,
                        ftI_Name: inst.ftI_Name
                    };
                })
            };

            const sanitizeOutgoing = (obj: any): any => {
                if (obj === null || obj === undefined) return undefined;
                if (typeof obj === 'string') {
                    const t = obj.trim();
                    if (t.toLowerCase() === '$undefined' || t.toLowerCase() === 'undefined' || t === '') return undefined;
                    const n = Number(t);
                    if (!Number.isNaN(n) && Number.isInteger(n) && n > 0) return n;
                    return obj;
                }
                if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
                if (Array.isArray(obj)) return obj.map(sanitizeOutgoing);
                if (typeof obj === 'object') {
                    const out: any = Array.isArray(obj) ? [] : {};
                    for (const k of Object.keys(obj)) {
                        const v = sanitizeOutgoing(obj[k]);
                        if (v !== undefined) out[k] = v;
                    }
                    return out;
                }
                return undefined;
            };

            const clean = sanitizeOutgoing(payload);

            const response = await addOrUpdateInstallment(clean);

            if (response?.success) {
                toast.success(response?.message ?? 'Master Installment updated successfully!');
                refetchAll();
                reset(sanitizeSnapshot(initialValuesRef.current) ?? undefined);
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to update installment');
            }
        } catch (error: any) {
            console.error('Error in onSubmit:', error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        if (initialValuesRef.current) {
            reset(sanitizeSnapshot(initialValuesRef.current) ?? undefined);
        } else {
            reset();
        }
    };

    return (
        <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Use Controller for hidden fmI_Id so DOM value stays in sync with form state when setValue is used */}
                <Controller
                    name='fmI_Id'
                    control={control}
                    render={({ field }) => <input type='hidden' {...field} value={field.value ?? ''} />}
                />

                <div className='flex flex-col gap-1.5'>
                    <Label htmlFor='fmI_Name'>
                        Master Installment Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='fmI_Name'
                        control={control}
                        render={({ field }) => <InputText id='fmI_Name' placeholder='Enter master installment name' {...field} disabled />}
                    />
                    {/* <Controller
                        name='fmI_Name'
                        control={control}
                        render={({ field }) => (
                            <InputText
                                id='fmI_Name'
                                placeholder='Enter master installment name'
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(/[^A-Za-z ]/g, '');
                                    field.onChange(sanitized);
                                }}
                                disabled
                            />
                        )}
                    /> */}

                    {errors.fmI_Name && <FormError>{errors.fmI_Name.message}</FormError>}
                </div>

                <div className='flex flex-col gap-1.5'>
                    <Label htmlFor='fmI_Installment_Type'>
                        Installment Type <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                        name='fmI_Installment_Type'
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select Installment Type' />
                                </SelectTrigger>
                                <SelectContent>
                                    {INSTALLMENT_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.fmI_Installment_Type && <FormError>{errors.fmI_Installment_Type.message}</FormError>}
                </div>

                {installmentType?.toLowerCase() === 'general' && (
                    <div className='flex flex-col gap-1.5'>
                        <Label htmlFor='fmI_No_Of_Installments'>No. of Installments</Label>
                        <Controller
                            name='fmI_No_Of_Installments'
                            control={control}
                            render={({ field }) => (
                                <input
                                    id='fmI_No_Of_Installments'
                                    type='number'
                                    min='1'
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val === '' ? undefined : Number(val));
                                    }}
                                    placeholder='Enter number of installments'
                                    className='w-full rounded-md border border-gray-300 px-2 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'
                                />
                            )}
                        />
                        {errors.fmI_No_Of_Installments && <FormError>{errors.fmI_No_Of_Installments.message}</FormError>}
                    </div>
                )}

                {fields.length > 0 && (
                    <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
                        <table className='min-w-full border-collapse bg-white'>
                            <thead>
                                <tr className='bg-gray-100 text-left font-semibold text-gray-700 text-sm'>
                                    <th className='w-16 border border-gray-200 px-4 py-2 text-center'>S.No</th>
                                    <th className='border border-gray-200 px-4 py-2'>Installment Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => (
                                    <tr key={field.id} className='text-gray-800 text-sm transition-colors duration-150 hover:bg-gray-50'>
                                        <td className='border border-gray-200 px-4 py-2 text-center font-medium'>{index + 1}</td>
                                        <td className='border border-gray-200 px-4 py-2'>
                                            <Controller
                                                name={`installments.${index}.ftI_Name`}
                                                control={control}
                                                render={({ field: nameField }) => (
                                                    <input
                                                        type='text'
                                                        {...nameField}
                                                        placeholder={`Installment ${index + 1}`}
                                                        className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`installments.${index}.ftI_Id`}
                                                control={control}
                                                render={({ field: idField }) => (
                                                    <input type='hidden' {...idField} value={idField.value ?? ''} />
                                                )}
                                            />
                                            {errors.installments?.[index]?.ftI_Name && (
                                                <FormError>{errors.installments?.[index]?.ftI_Name?.message}</FormError>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'
                        disabled={isSubmitting}>
                        Reset
                    </Button>

                    <Button
                        type='submit'
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Update Installment
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
