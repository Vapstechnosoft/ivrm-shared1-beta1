'use client';
import { HRMSInputText } from '@/app/(root)/hrms/_components/hrms-input-text';
import { Button } from '@/components/ui/button';
import { FormError, Label } from '@/components/ui/extension/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useAmountOrPercentageDropdown,
    useEarningsDeductionsTypeDropdown,
    useMasterEarningsDeductions,
    useRoundingTypeDropdown,
    useSalaryComponentTypeDropdown
} from '@/hooks/hrms/useMasters';
import { EARNING_DEDUCTION_VALIDATION } from '@/lib/validation/hrms-master-validation';
import { saveMasterEarningsDeductions } from '@/server/hrms/hrmsConfig/master/earnings-deductions';
import type { IMasterEarningsDeductionsList } from '@/types/hrms/hrms-config/master';
import type {
    IAmountOrPercentageDropdown,
    IEarningsDeductionsTypeDropdown,
    IRoundingTypeDropdown,
    ISalaryComponentTypeDropdown
} from '@/types/hrms/hrms-config/master';
import type { MasterEarningsDeductionsInput } from '@/types/hrms/master-earnings-deductions';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

// SafeSelectItem component to filter out invalid/empty dropdown items
const SafeSelectItem = ({
    children,
    value,
    ...props
}: {
    children: React.ReactNode;
    value: string;
    [key: string]: any;
}) => {
    if (!value || value.trim() === '') return null;
    return (
        <SelectItem value={value} {...props}>
            {children}
        </SelectItem>
    );
};

interface DropdownItem {
    key: string;
    value: string;
}

interface UpdateEarningsDeductionsFormProps {
    onSuccess?: () => void;
    className?: string;
    selectedRow: IMasterEarningsDeductionsList;
}
export default function UpdateEarningsDeductionsForm({ onSuccess, className = '', selectedRow: row }: UpdateEarningsDeductionsFormProps) {
    const { refetchAll } = useMasterEarningsDeductions();

    // Helper function to map API response to dropdown items
    const mapToDropdownItems = (response: any): DropdownItem[] => {
        // Handle different response structures
        let rawData: any[] = [];
        if (Array.isArray(response)) {
            rawData = response;
        } else if (response?.data) {
            if (Array.isArray(response.data)) {
                rawData = response.data;
            } else if (response.data?.$values && Array.isArray(response.data.$values)) {
                rawData = response.data.$values;
            } else if (typeof response.data === 'object') {
                // If it's a single object that isn't a wrapper, wrap it
                rawData = [response.data];
            }
        } else if (response?.$values && Array.isArray(response.$values)) {
            rawData = response.$values;
        }

        return rawData.map((item: any) => {
            if (!item || typeof item !== 'object') return { key: String(item || ''), value: String(item || '') };

            // Case 1: Already has key/value or id/name
            const keyVal = item.key ?? item.id ?? item.idField ?? item.hrmedT_Id ?? item.HRMEDT_Id;
            const displayVal = item.hrmedT_EarnDedType ?? item.HRMEDT_EarnDedType ?? item.name ?? item.text ?? item.label ?? item.value;

            if (keyVal !== undefined && displayVal !== undefined) {
                return { key: String(keyVal).trim(), value: String(displayVal).trim() };
            }

            // Case 2: Infer from object keys
            const keys = Object.keys(item);
            const idField = keys.find((k) => k.toLowerCase().endsWith('id'));
            const nameField = keys.find(
                (k) =>
                    (k.toLowerCase().includes('type') ||
                        k.toLowerCase().includes('name') ||
                        k.toLowerCase().includes('flag') ||
                        k.toLowerCase().includes('desc') ||
                        k.toLowerCase().includes('text') ||
                        k.toLowerCase().includes('label')) &&
                    !k.toLowerCase().endsWith('id')
            );

            const finalKey = idField ? item[idField] : keyVal ?? (keys[0] ? item[keys[0]] : '');
            const finalValue = nameField ? item[nameField] : displayVal ?? finalKey;

            return {
                key: String(finalKey ?? '').trim(),
                value: String(finalValue ?? '').trim()
            };
        });
    };

    // dropdown data
    const { data: earningsDeductionsTypeDropdownResponse, isLoading: isLoadingEarningsDeductionsTypes } =
        useEarningsDeductionsTypeDropdown();
    const earningsDeductionsTypeDropdown = useMemo(() => mapToDropdownItems(earningsDeductionsTypeDropdownResponse), [earningsDeductionsTypeDropdownResponse]);

    const { data: roundingTypeDropdownResponse, isLoading: isLoadingRoundingTypes } = useRoundingTypeDropdown();
    const roundingTypeDropdown = useMemo(() => mapToDropdownItems(roundingTypeDropdownResponse), [roundingTypeDropdownResponse]);

    const { data: amountOrPercentageDropdownResponse, isLoading: isLoadingAmountOrPercentage } = useAmountOrPercentageDropdown();
    const amountOrPercentageDropdown = useMemo(() => mapToDropdownItems(amountOrPercentageDropdownResponse), [amountOrPercentageDropdownResponse]);

    const { data: salaryComponentTypeDropdownResponse, isLoading: isLoadingSalaryComponentType } = useSalaryComponentTypeDropdown();
    const salaryComponentTypeDropdown = useMemo(() => mapToDropdownItems(salaryComponentTypeDropdownResponse), [salaryComponentTypeDropdownResponse]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        trigger,
        setValue,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<MasterEarningsDeductionsInput>({
        mode: 'onChange'
    });

    const calculationType = useWatch({
        control,
        name: 'HRMED_AmountPercentFlag',
        defaultValue: 'Amount'
    });

    const findKey = (list: DropdownItem[], val: any) => {
        if (val === undefined || val === null) return undefined;
        const stringVal = String(val).trim();
        if (stringVal === '') return undefined;

        // 1. Try exact key match (Internal ID)
        const exactKeyMatch = list.find((item: DropdownItem) => String(item.key).trim() === stringVal);
        if (exactKeyMatch) return String(exactKeyMatch.key).trim();

        // 2. Try exact value/name match (Display Label) - Case Insensitive
        const exactValueMatch = list.find((item: DropdownItem) => String(item.value).trim().toLowerCase() === stringVal.toLowerCase());
        if (exactValueMatch) return String(exactValueMatch.key).trim();

        // 3. Try partial matches for common variations (e.g., "Earning" vs "Earnings")
        const partialMatch = list.find((item: DropdownItem) => {
            const v = String(item.value).trim().toLowerCase();
            const s = stringVal.toLowerCase();
            return v.startsWith(s) || s.startsWith(v) || v.includes(s) || s.includes(v);
        });
        if (partialMatch) return String(partialMatch.key).trim();

        return undefined; // Return undefined if no mapping found to prevent showing invalid data
    };

    const findValue = (list: DropdownItem[], val: any) => {
        if (val === undefined || val === null) return undefined;
        const stringVal = String(val).trim();
        if (stringVal === '') return undefined;

        // 1. Try exact value match (Display Label) - Case Insensitive
        const exactValueMatch = list.find((item: DropdownItem) => String(item.value).trim().toLowerCase() === stringVal.toLowerCase());
        if (exactValueMatch) return String(exactValueMatch.value).trim();

        // 2. Try exact key match (Internal ID)
        const exactKeyMatch = list.find((item: DropdownItem) => String(item.key).trim() === stringVal);
        if (exactKeyMatch) return String(exactKeyMatch.value).trim();

        // 3. Try partial matches
        const partialMatch = list.find((item: DropdownItem) => {
            const v = String(item.value).trim().toLowerCase();
            const s = stringVal.toLowerCase();
            return v.startsWith(s) || s.startsWith(v) || v.includes(s) || s.includes(v);
        });
        if (partialMatch) return String(partialMatch.value).trim();

        return undefined;
    };

    // Consolidated row data binding
    useEffect(() => {
        if (row && reset) {
            reset({
                HRMED_Id: row.hrmeD_Id,
                MI_Id: row.mI_Id || 0,
                HRMED_Name: row.hrmeD_Name || '',
                HRMED_EDTypeFlag: findValue(earningsDeductionsTypeDropdown, row.hrmeD_EDTypeFlag),
                HRMED_EarnDedFlag: findKey(salaryComponentTypeDropdown, row.hrmeD_EarnDedFlag),
                HRMED_AmountPercentFlag: findKey(amountOrPercentageDropdown, row.hrmeD_AmountPercentFlag),
                HRMED_AmountPercent: String(row.hrmeD_AmountPercent ?? ''),
                HRMED_ActiveFlag: row.hrmeD_ActiveFlag,
                HRMED_RoundOffFlag: findKey(roundingTypeDropdown, row.hrmeD_RoundOffFlag),
                HRMED_Order: row.hrmeD_Order,
                HRMED_ReviseFlg: row.hrmeD_ReviseFlg
            }, { keepDefaultValues: false });
        }
    }, [row, reset]); // Trigger when row changes

    // Robust synchronization as dropdown data arrives
    useEffect(() => {
        if (row && earningsDeductionsTypeDropdown.length > 0) {
            const target = findValue(earningsDeductionsTypeDropdown, row.hrmeD_EDTypeFlag);
            const current = getValues('HRMED_EDTypeFlag');
            if (target !== undefined && target !== current) {
                setValue('HRMED_EDTypeFlag', target, { shouldDirty: false, shouldValidate: true });
            }
        }
    }, [earningsDeductionsTypeDropdown, row, setValue, getValues]);

    useEffect(() => {
        if (row && salaryComponentTypeDropdown.length > 0) {
            const target = findKey(salaryComponentTypeDropdown, row.hrmeD_EarnDedFlag);
            const current = getValues('HRMED_EarnDedFlag');
            if (target !== undefined && target !== current) {
                setValue('HRMED_EarnDedFlag', target, { shouldDirty: false, shouldValidate: true });
            }
        }
    }, [salaryComponentTypeDropdown, row, setValue, getValues]);

    useEffect(() => {
        if (row && amountOrPercentageDropdown.length > 0) {
            const target = findKey(amountOrPercentageDropdown, row.hrmeD_AmountPercentFlag);
            const current = getValues('HRMED_AmountPercentFlag');
            if (target !== undefined && target !== current) {
                setValue('HRMED_AmountPercentFlag', target, { shouldDirty: false, shouldValidate: true });
            }
        }
    }, [amountOrPercentageDropdown, row, setValue, getValues]);

    useEffect(() => {
        if (row && roundingTypeDropdown.length > 0) {
            const target = findKey(roundingTypeDropdown, row.hrmeD_RoundOffFlag);
            const current = getValues('HRMED_RoundOffFlag');
            if (target !== undefined && target !== current) {
                setValue('HRMED_RoundOffFlag', target, { shouldDirty: false, shouldValidate: true });
            }
        }
    }, [roundingTypeDropdown, row, setValue, getValues]);
    const onSubmit = async (data: MasterEarningsDeductionsInput) => {
        try {
            // Build the request body - map to lowercase field names as per API
            const payload = {
                hrmeD_Id: data.HRMED_Id || 0,
                hrmeD_Name: data.HRMED_Name?.trim() || '',
                hrmeD_EDTypeFlag: data.HRMED_EDTypeFlag,
                hrmeD_EarnDedFlag: data.HRMED_EarnDedFlag,
                hrmeD_AmountPercentFlag: data.HRMED_AmountPercentFlag,
                hrmeD_AmountPercent: data.HRMED_AmountPercent,
                hrmeD_RoundOffFlag: data.HRMED_RoundOffFlag,
                hrmeD_ReviseFlg: data.HRMED_ReviseFlg ?? true,
                hrmeD_Order: data.HRMED_Order || 0
            };
            const response = await saveMasterEarningsDeductions(payload);
            if (response?.success) {
                toast.success(response?.message || 'Earning/Deduction updated successfully');
                refetchAll();
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.error(response?.message || 'Failed to update earning/deduction');
            }
        } catch (error: any) {
            const errorMsg =
                error?.response?.data?.message || error?.message || error?.data?.message || 'Failed to update earning/deduction';
            toast.error(errorMsg);
        }
    };
    const handleReset = () => {
        reset();
    };
    return (
        <div className={className}>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <input type='hidden' {...register('HRMED_Id', { valueAsNumber: true })} />
                    <input type='hidden' {...register('MI_Id', { valueAsNumber: true })} />
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_Name'>
                            Name <span className='text-destructive'>*</span>
                        </Label>
                        <HRMSInputText
                            id='HRMED_Name'
                            placeholder='Enter earning/deduction name'
                            maxLength={EARNING_DEDUCTION_VALIDATION.HRMED_Name.maxLength?.value}
                            error={errors.HRMED_Name?.message}
                            {...register('HRMED_Name', EARNING_DEDUCTION_VALIDATION.HRMED_Name)}
                        />
                    </div>
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_EDTypeFlag'>
                            Type <span className='text-destructive'>*</span>
                        </Label>
                        <Controller
                            name='HRMED_EDTypeFlag'
                            control={control}
                            rules={{ required: 'Type is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingEarningsDeductionsTypes ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (earningsDeductionsTypeDropdown || []).length === 0 ? (
                                            <SelectItem value='no-options' disabled>
                                                No options available
                                            </SelectItem>
                                        ) : (
                                            (earningsDeductionsTypeDropdown || [])
                                                .filter((item: DropdownItem) => {
                                                    const val = item.value || item.key;
                                                    return val != null && val !== '' && String(val).trim() !== '';
                                                })
                                                .map((item: DropdownItem) => {
                                                    const key = (item.value || item.key)?.toString().trim();
                                                    const label = item.value || String(key);
                                                    if (!key || key === '') return null;
                                                    return (
                                                        <SafeSelectItem key={key} value={key}>
                                                            {label}
                                                        </SafeSelectItem>
                                                    );
                                                })
                                                .filter(Boolean)
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.HRMED_EDTypeFlag && <FormError>{errors.HRMED_EDTypeFlag.message}</FormError>}
                    </div>
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_RoundOffFlag'>
                            Rounding To <span className='text-destructive'>*</span>
                        </Label>
                        <Controller
                            name='HRMED_RoundOffFlag'
                            control={control}
                            rules={{ required: 'Rounding option is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Rounding' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingRoundingTypes ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (roundingTypeDropdown || []).length === 0 ? (
                                            <SelectItem value='no-options' disabled>
                                                No options available
                                            </SelectItem>
                                        ) : (
                                            (roundingTypeDropdown || [])
                                                .filter((item: DropdownItem) => {
                                                    const key = item.key || item.value;
                                                    return key != null && key !== '' && String(key).trim() !== '';
                                                })
                                                .map((item: DropdownItem) => {
                                                    const key = (item.key || item.value)?.toString().trim();
                                                    const value = item.value || String(key);
                                                    if (!key || key === '') return null;
                                                    return (
                                                        <SafeSelectItem key={key} value={key}>
                                                            {value}
                                                        </SafeSelectItem>
                                                    );
                                                })
                                                .filter(Boolean)
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.HRMED_RoundOffFlag && <FormError>{errors.HRMED_RoundOffFlag.message}</FormError>}
                    </div>
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_EarnDedFlag'>
                            Earning/Deduction <span className='text-destructive'>*</span>
                        </Label>
                        <Controller
                            name='HRMED_EarnDedFlag'
                            control={control}
                            rules={{ required: 'Earning/Deduction is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Earning/Deduction' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingSalaryComponentType ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (salaryComponentTypeDropdown || []).length === 0 ? (
                                            <SelectItem value='no-options' disabled>
                                                No options available
                                            </SelectItem>
                                        ) : (
                                            (salaryComponentTypeDropdown || [])
                                                .filter((item: DropdownItem) => {
                                                    const key = item.key || item.value;
                                                    return key != null && key !== '' && String(key).trim() !== '';
                                                })
                                                .map((item: DropdownItem) => {
                                                    const key = (item.key || item.value)?.toString().trim();
                                                    const value = item.value || String(key);
                                                    if (!key || key === '') return null;
                                                    return (
                                                        <SafeSelectItem key={key} value={key}>
                                                            {value}
                                                        </SafeSelectItem>
                                                    );
                                                })
                                                .filter(Boolean)
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.HRMED_EarnDedFlag && <FormError>{errors.HRMED_EarnDedFlag.message}</FormError>}
                    </div>
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_AmountPercentFlag'>
                            Calculation Type <span className='text-destructive'>*</span>
                        </Label>
                        <Controller
                            name='HRMED_AmountPercentFlag'
                            control={control}
                            rules={{ required: 'Calculation Type is required' }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        trigger('HRMED_AmountPercent');
                                    }}
                                    value={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Calculation Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingAmountOrPercentage ? (
                                            <SelectItem value='loading' disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (amountOrPercentageDropdown || []).length === 0 ? (
                                            <SelectItem value='no-options' disabled>
                                                No options available
                                            </SelectItem>
                                        ) : (
                                            (amountOrPercentageDropdown || [])
                                                .filter((item: DropdownItem) => {
                                                    const key = item.key || item.value;
                                                    return key != null && key !== '' && String(key).trim() !== '';
                                                })
                                                .map((item: DropdownItem) => {
                                                    const key = (item.key || item.value)?.toString().trim();
                                                    const value = item.value || String(key);
                                                    if (!key || key === '') return null;
                                                    return (
                                                        <SafeSelectItem key={key} value={key}>
                                                            {value}
                                                        </SafeSelectItem>
                                                    );
                                                })
                                                .filter(Boolean)
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.HRMED_AmountPercentFlag && <FormError>{errors.HRMED_AmountPercentFlag.message}</FormError>}
                    </div>
                    <div className='group flex flex-col gap-1.5'>
                        <Label htmlFor='HRMED_AmountPercent'>
                            {calculationType === 'Percentage' ? 'Percentage' : 'Amount'} <span className='text-destructive'>*</span>
                        </Label>
                        <HRMSInputText
                            id='HRMED_AmountPercent'
                            placeholder={`Enter ${calculationType === 'Percentage' ? 'percentage' : 'amount'}`}
                            maxLength={calculationType === 'Percentage' ? 5 : undefined}
                            error={errors.HRMED_AmountPercent?.message}
                            {...register('HRMED_AmountPercent', {
                                required: EARNING_DEDUCTION_VALIDATION.HRMED_AmountPercent.required,
                                validate: (value) => {
                                    if (!value || value.trim() === '') return 'Amount/Percentage is required';
                                    const numValue = Number.parseFloat(value);
                                    if (Number.isNaN(numValue)) {
                                        return 'Amount/Percentage must be a valid number';
                                    }
                                    if (numValue < 0) {
                                        return 'Amount/Percentage cannot be negative';
                                    }
                                    const currentCalculationType = getValues('HRMED_AmountPercentFlag') || calculationType;
                                    if (currentCalculationType === 'Amount') {
                                        if (numValue > 9999999999) {
                                            return 'Amount must not exceed 10 digits';
                                        }
                                    } else if (currentCalculationType === 'Percentage') {
                                        if (numValue > 100) {
                                            return 'Percentage must not exceed 100';
                                        }
                                        if (value.length > 5) {
                                            return 'Percentage must not exceed 5 characters (e.g., 99.99)';
                                        }
                                    }
                                    return true;
                                }
                            })}
                        />
                    </div>
                    <div className='group flex items-center gap-2'>
                        <Input
                            type='checkbox'
                            id='HRMED_ReviseFlg'
                            className='h-4 w-4'
                            {...register('HRMED_ReviseFlg')}
                        />
                        <Label htmlFor='HRMED_ReviseFlg' className='cursor-pointer'>
                            Revise
                        </Label>
                    </div>
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
                        disabled={isSubmitting || !isDirty}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save Earning/Deduction
                        </div>
                    </Button>
                    {!isDirty && <span className='flex items-center text-muted-foreground text-sm'>No changes made</span>}
                </div>
            </form>
        </div>
    );
}
