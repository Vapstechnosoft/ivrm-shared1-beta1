'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMasterPayrollStandard, useMonthDropdown } from '@/hooks/hrms/useMasters';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import type { IMasterPayrollStandardList, IMonthDropdown } from '@/types/hrms/hrms-config/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof hrmsMasterSchemas.payrollStandard.add>;
interface PayrollStandardFormProps {
    existingData?: IMasterPayrollStandardList;
    className?: string;
}
export default function PayrollStandardForm({ existingData, className = '' }: PayrollStandardFormProps) {
    const { saveMutation } = useMasterPayrollStandard();
    const { mutate: savePayrollStandard, isPending } = saveMutation;
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<FormFields>({
        resolver: zodResolver(hrmsMasterSchemas.payrollStandard.add),
        mode: 'onBlur' // Changed from 'onChange' to prevent validation before data loads
    });
    // Watch for Arrear Salary Report changes
    const arrearSalaryReport = watch('HRC_ArrearSalaryReport');
    // Month dropdown - API: /api/MasterDropDown/GetMonths
    const { data: monthDropdownResponse, isLoading: isLoadingMonths } = useMonthDropdown();
    const monthDropdown = useMemo(() => {
        const data = Array.isArray(monthDropdownResponse?.data) ? monthDropdownResponse.data : [];
        // Filter out invalid entries (null, undefined, or 0 keys) for numeric dropdown
        return data.filter((month: IMonthDropdown) => month.key != null && month.key !== undefined && month.key !== 0);
    }, [monthDropdownResponse?.data]);

    // Pre-populate form with existing data (only if hrC_Id > 0)
    useEffect(() => {
        if (existingData && existingData.hrC_Id > 0) {
            // Find matching month from dropdown to ensure exact value match
            const apiMonthValue = existingData.hrC_IncrementMonth?.trim() || '';
            const matchedMonth = monthDropdown.find((month) => month.value.trim().toLowerCase() === apiMonthValue.toLowerCase());
            const incrementMonthValue = matchedMonth ? matchedMonth.value : apiMonthValue;

            reset({
                HRC_Id: existingData.hrC_Id,
                // Provident Fund
                HRC_PFAccPrefix: existingData.hrC_PFAccNoPrefix,
                HRC_PFMaxAmt: existingData.hrC_PFMaxAmt,
                HRC_FPFPer: existingData.hrC_FPFPer,
                HRC_EPFPer: existingData.hrC_EPFPer,
                HRC_EPFPerAfterRetirement: existingData.hrC_ARTFPFPer,
                HRC_EPFPerAfterRetirement2: existingData.hrC_ARTEPFPer,
                HRC_AccNo2Per: existingData.hrC_AccNo2,
                HRC_AccNo21Per: existingData.hrC_AccNo21,
                HRC_AccNo22Per: existingData.hrC_AccNo22,
                HRC_AC2MinAmt: existingData.hrC_AC2MinAmount,
                HRC_AC21MinAmt: existingData.hrC_AC21MinAmount,
                HRC_AC22MinAmt: existingData.hrC_AC22MinAmount,
                HRC_EducationCess: existingData.hrC_EducationCess,
                HRC_PartAMaxLimit: existingData.hrC_partAmaxflag,
                HRC_PartBMaxLimit: existingData.hrC_partBmaxflag,
                HRC_AsPerEmployee: existingData.hrC_AsPerEmpFlag,
                HRC_RetirementYrs: existingData.hrC_RetirementYrs,
                // ESI
                HRC_ESIAccPrefix: existingData.hrC_ECodePrefix,
                HRC_ESIMax: existingData.hrC_ESIMax,
                HRC_ESIMaxAmount: existingData.hrC_ESIMaxAmount,
                HRC_ESIEmplrCont: existingData.hrC_ESIEmplrCont,
                // Arrear Details
                HRC_ArrearSalaryReport: existingData.hrC_ArrSalaryFlag ? 'Separate' : 'OnlyArrearHead',
                HRC_ArrearRequired: existingData.hrC_CummArrFlag ? 'Cumulative' : 'Monthwise',
                // Approval Process
                HRC_SalaryApproval: existingData.hrC_SalApprovalFlg,
                HRC_SalaryAdvance: existingData.hrC_SalAdvApprovalFlg,
                HRC_Loan: existingData.hrC_LoanApprovalFlg,
                HRC_Leave: existingData.hrC_LeaveApprovalFlg,
                HRC_Increment: existingData.hrC_IncrementApprovalFlg,
                HRC_Probation: existingData.hrC_ProbationApprovalFlg,
                // Payment Method
                HRC_PaymentMethod: existingData.hrC_PayMethodFlg
                    ? Number(existingData.hrC_PayMethodFlg.toString().replace(/\D/g, ''))
                    : 0,
                // Increment Process
                HRC_OptionalHolidays: existingData.hrC_NoOfOptionalHolidays,
                HRC_ApplicableFlag: existingData.hrC_FixedIncrmentFlg,
                HRC_MinimumPeriods: existingData.hrC_MinimumWorkingPeriod,
                HRC_IncrementMonth: incrementMonthValue,
                HRC_IncrementOnceInMonths: existingData.hrC_IncrementOnceInMonths,
                HRC_AlertDays: existingData.hrC_AlertDay,
                // Salary Days
                HRC_SalaryFromDay: existingData.hrC_SalaryFromDay,
                HRC_SalaryToDay: existingData.hrC_SalaryToDay,
                HRC_ActiveFlag: true
            } as any);
        }
    }, [existingData, reset, monthDropdownResponse?.data]);
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // Map form fields to API fields
        const payload = {
            HRC_Id: data.HRC_Id || 0,
            // Provident Fund
            HRC_PFAccNoPrefix: data.HRC_PFAccPrefix,
            HRC_PFMaxAmt: data.HRC_PFMaxAmt,
            HRC_FPFPer: data.HRC_FPFPer,
            HRC_EPFPer: data.HRC_EPFPer,
            HRC_ARTFPFPer: data.HRC_EPFPerAfterRetirement,
            HRC_ARTEPFPer: data.HRC_EPFPerAfterRetirement2,
            HRC_AccNo2: data.HRC_AccNo2Per,
            HRC_AccNo21: data.HRC_AccNo21Per,
            HRC_AccNo22: data.HRC_AccNo22Per,
            HRC_AC2MinAmount: data.HRC_AC2MinAmt,
            HRC_AC21MinAmount: data.HRC_AC21MinAmt,
            HRC_AC22MinAmount: data.HRC_AC22MinAmt,
            HRC_EducationCess: data.HRC_EducationCess,
            HRC_partAmaxflag: data.HRC_PartAMaxLimit,
            HRC_partBmaxflag: data.HRC_PartBMaxLimit,
            HRC_AsPerEmpFlag: data.HRC_AsPerEmployee,
            HRC_RetirementYrs: data.HRC_RetirementYrs,
            // ESI
            HRC_ECodePrefix: data.HRC_ESIAccPrefix,
            HRC_ESIMax: data.HRC_ESIMax,
            HRC_ESIMaxAmount: data.HRC_ESIMaxAmount,
            HRC_ESIEmplrCont: data.HRC_ESIEmplrCont,
            // Arrear Details
            HRC_ArrSalaryFlag: data.HRC_ArrearSalaryReport === 'Separate',
            HRC_CummArrFlag: data.HRC_ArrearRequired === 'Cumulative',
            // Approval Process
            HRC_SalApprovalFlg: data.HRC_SalaryApproval,
            HRC_SalAdvApprovalFlg: data.HRC_SalaryAdvance,
            HRC_LoanApprovalFlg: data.HRC_Loan,
            HRC_LeaveApprovalFlg: data.HRC_Leave,
            HRC_IncrementApprovalFlg: data.HRC_Increment,
            HRC_ProbationApprovalFlg: data.HRC_Probation,
            // Payment Method
            HRC_PayMethodFlg: String(data.HRC_PaymentMethod),
            // Increment Process
            HRC_NoOfOptionalHolidays: data.HRC_OptionalHolidays,
            HRC_FixedIncrmentFlg: data.HRC_ApplicableFlag,
            HRC_MinimumWorkingPeriod: data.HRC_MinimumPeriods,
            HRC_IncrementMonth: data.HRC_IncrementMonth,
            HRC_IncrementOnceInMonths: data.HRC_IncrementOnceInMonths,
            HRC_AlertDay: data.HRC_AlertDays,
            // Salary Days
            HRC_SalaryFromDay: data.HRC_SalaryFromDay,
            HRC_SalaryToDay: data.HRC_SalaryToDay,
            HRC_ActiveFlag: data.HRC_ActiveFlag ?? true
        };
        savePayrollStandard(payload, {
            onSuccess: (response) => {
                if (response?.success) {
                    toast.success(response.message || 'Payroll standard saved successfully');
                } else {
                    toast.error(response?.message || 'Failed to save payroll standard');
                }
            },
            onError: (error: any) => {
                toast.error(error.message || 'An error occurred');
            }
        });
    };
    const handleReset = () => {
        reset();
    };
    // Add debug logging for form state changes
    const _formValues = watch();
    // Error handling for HRC_SalaryFromDay and HRC_SalaryToDay done in form validation
    const handleFormSubmit = (e?: React.FormEvent) => {
        return handleSubmit(onSubmit)(e);
    };
    return (
        <div className={className}>
            <form onSubmit={handleFormSubmit} className='space-y-6'>
                {/* Provident Fund Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Provident Fund</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <InputText
                            label='PF Account Prefix'
                            id='HRC_PFAccPrefix'
                            {...register('HRC_PFAccPrefix')}
                            error={errors.HRC_PFAccPrefix?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <Controller
                            name='HRC_PFMaxAmt'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_PFMaxAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='PF Max Amount'
                                            required
                                            id='HRC_PFMaxAmt'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_PFMaxAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_PFMaxAmt?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_FPFPer'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_FPFPer', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='FPF %'
                                            required
                                            id='HRC_FPFPer'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_FPFPer', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_FPFPer?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_EPFPer'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_EPFPer', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='EPF %'
                                            required
                                            id='HRC_EPFPer'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_EPFPer', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_EPFPer?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_EPFPerAfterRetirement'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_EPFPerAfterRetirement', numValue, {
                                                        shouldDirty: true,
                                                        shouldValidate: true
                                                    });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='EPF % After Retirement'
                                            id='HRC_EPFPerAfterRetirement'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_EPFPerAfterRetirement', numValue, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_EPFPerAfterRetirement?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_EPFPerAfterRetirement2'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_EPFPerAfterRetirement2', numValue, {
                                                        shouldDirty: true,
                                                        shouldValidate: true
                                                    });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='EPF % After Retirement (2)'
                                            id='HRC_EPFPerAfterRetirement2'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_EPFPerAfterRetirement2', numValue, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_EPFPerAfterRetirement2?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AccNo2Per'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AccNo2Per', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Acc No. 2 %'
                                            id='HRC_AccNo2Per'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AccNo2Per', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AccNo2Per?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AC2MinAmt'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AC2MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='A/C2 Min Amount'
                                            id='HRC_AC2MinAmt'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AC2MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AC2MinAmt?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AccNo21Per'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AccNo21Per', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Acc No. 21 %'
                                            id='HRC_AccNo21Per'
                                            step={0.01}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AccNo21Per', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AccNo21Per?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AC21MinAmt'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AC21MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='A/C21 Min Amount'
                                            id='HRC_AC21MinAmt'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AC21MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AC21MinAmt?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AccNo22Per'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AccNo22Per', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Acc No. 22 %'
                                            id='HRC_AccNo22Per'
                                            step={0.01}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AccNo22Per', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AccNo22Per?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AC22MinAmt'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AC22MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='A/C22 Min Amount'
                                            id='HRC_AC22MinAmt'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AC22MinAmt', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AC22MinAmt?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_EducationCess'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_EducationCess', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Education Cess'
                                            id='HRC_EducationCess'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_EducationCess', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_EducationCess?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_PartAMaxLimit'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_PartAMaxLimit', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Part A Max Limit'
                                            id='HRC_PartAMaxLimit'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_PartAMaxLimit', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_PartAMaxLimit?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_PartBMaxLimit'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_PartBMaxLimit', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Part B Max Limit'
                                            id='HRC_PartBMaxLimit'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_PartBMaxLimit', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_PartBMaxLimit?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_AsPerEmployee'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_AsPerEmployee' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_AsPerEmployee' className='cursor-pointer font-normal'>
                                As Per Employee
                            </Label>
                        </div>
                        <Controller
                            name='HRC_RetirementYrs'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_RetirementYrs', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Retirement Years'
                                            required
                                            id='HRC_RetirementYrs'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_RetirementYrs', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_RetirementYrs?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
                {/* ESI Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>ESI</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <InputText
                            label='ESI Account Prefix'
                            id='HRC_ESIAccPrefix'
                            {...register('HRC_ESIAccPrefix')}
                            error={errors.HRC_ESIAccPrefix?.message}
                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                        />
                        <Controller
                            name='HRC_ESIMax'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_ESIMax', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='ESI Max (%)'
                                            required
                                            id='HRC_ESIMax'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_ESIMax', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_ESIMax?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_ESIMaxAmount'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_ESIMaxAmount', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='ESI Max Amount'
                                            id='HRC_ESIMaxAmount'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_ESIMaxAmount', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_ESIMaxAmount?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_ESIEmplrCont'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_ESIEmplrCont', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Employer Contribution (%)'
                                            required
                                            id='HRC_ESIEmplrCont'
                                            step={0.01}
                                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 2 }}
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_ESIEmplrCont', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_ESIEmplrCont?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
                {/* Arrear Details Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Arrear Details</h3>
                </div>
                <div className='space-y-4'>
                    <div className='group flex flex-col gap-1.5'>
                        <Label>Arrear Salary Report:</Label>
                        <div className='flex gap-6'>
                            <div className='flex items-center space-x-2'>
                                <Controller
                                    name='HRC_ArrearSalaryReport'
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type='radio'
                                            id='arrear-separate'
                                            value='Separate'
                                            checked={field.value === 'Separate'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className='h-4 w-4'
                                        />
                                    )}
                                />
                                <Label htmlFor='arrear-separate' className='cursor-pointer font-normal'>
                                    Separate Arrear Salary Report
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Controller
                                    name='HRC_ArrearSalaryReport'
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type='radio'
                                            id='arrear-only-head'
                                            value='OnlyArrearHead'
                                            checked={field.value === 'OnlyArrearHead'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className='h-4 w-4'
                                        />
                                    )}
                                />
                                <Label htmlFor='arrear-only-head' className='cursor-pointer font-normal'>
                                    Only Arrear Head
                                </Label>
                            </div>
                        </div>
                    </div>
                    {/* Conditional Arrear Required Section - Only shown when "Separate" is selected */}
                    {arrearSalaryReport === 'Separate' && (
                        <div className='group flex flex-col gap-1.5 rounded-md border border-purple-200 bg-purple-50 p-4'>
                            <Label>Arrear Required:</Label>
                            <div className='flex gap-6'>
                                <div className='flex items-center space-x-2'>
                                    <Controller
                                        name='HRC_ArrearRequired'
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type='radio'
                                                id='arrear-cumulative'
                                                value='Cumulative'
                                                checked={field.value === 'Cumulative'}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className='h-4 w-4'
                                            />
                                        )}
                                    />
                                    <Label htmlFor='arrear-cumulative' className='cursor-pointer font-normal'>
                                        Cumulative Arrear
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Controller
                                        name='HRC_ArrearRequired'
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type='radio'
                                                id='arrear-monthwise'
                                                value='Monthwise'
                                                checked={field.value === 'Monthwise'}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className='h-4 w-4'
                                            />
                                        )}
                                    />
                                    <Label htmlFor='arrear-monthwise' className='cursor-pointer font-normal'>
                                        Month wise Arrear
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Approval Process Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Approval Process</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_SalaryApproval'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_SalaryApproval' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_SalaryApproval' className='cursor-pointer font-normal'>
                                Salary Approval
                            </Label>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_SalaryAdvance'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_SalaryAdvance' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_SalaryAdvance' className='cursor-pointer font-normal'>
                                Salary Advance
                            </Label>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_Loan'
                                control={control}
                                render={({ field }) => <Checkbox id='HRC_Loan' checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label htmlFor='HRC_Loan' className='cursor-pointer font-normal'>
                                Loan
                            </Label>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_Leave'
                                control={control}
                                render={({ field }) => <Checkbox id='HRC_Leave' checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label htmlFor='HRC_Leave' className='cursor-pointer font-normal'>
                                Leave
                            </Label>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_Increment'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_Increment' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_Increment' className='cursor-pointer font-normal'>
                                Increment
                            </Label>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Controller
                                name='HRC_Probation'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_Probation' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_Probation' className='cursor-pointer font-normal'>
                                Probation
                            </Label>
                        </div>
                    </div>
                </div>
                {/* Payment Method Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Payment Method</h3>
                </div>
                <div className='space-y-4'>
                    <TooltipProvider>
                        <div className='flex flex-wrap gap-6'>
                            {[1, 2, 3, 4, 5, 6].map((method) => {
                                const methodTooltips: Record<number, string> = {
                                    1: '(Earning - Deduction) - Loss of Pay',
                                    2: '(Earning - Deduction) Here Basic and all heads related to basic will change.',
                                    3: '(Earning - Deduction) Here Basic and every other heads will change.',
                                    4: '(Earning - Deduction) Here Basic and all Percentage heads will change.',
                                    5: '(Only Earning Heads are revised When LOP Applies)',
                                    6: ''
                                };
                                const tooltipText = methodTooltips[method];

                                return (
                                    <div key={method} className='flex items-center space-x-2'>
                                        <Controller
                                            name='HRC_PaymentMethod'
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type='radio'
                                                    id={`method-${method}`}
                                                    value={method}
                                                    checked={field.value === method}
                                                    onChange={() => field.onChange(method)}
                                                    className='h-4 w-4'
                                                />
                                            )}
                                        />
                                        {tooltipText ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Label htmlFor={`method-${method}`} className='cursor-pointer font-normal'>
                                                        Method {method}
                                                    </Label>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{tooltipText}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Label htmlFor={`method-${method}`} className='cursor-pointer font-normal'>
                                                Method {method}
                                            </Label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </div>
                {/* Increment Process Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Increment Process</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <Controller
                            name='HRC_OptionalHolidays'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_OptionalHolidays', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Optional Holidays'
                                            id='HRC_OptionalHolidays'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_OptionalHolidays', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_OptionalHolidays?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <div className='flex items-center space-x-3 pt-6'>
                            <Controller
                                name='HRC_ApplicableFlag'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox id='HRC_ApplicableFlag' checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <Label htmlFor='HRC_ApplicableFlag' className='cursor-pointer font-normal'>
                                Applicable
                            </Label>
                        </div>
                        <Controller
                            name='HRC_MinimumPeriods'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_MinimumPeriods', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Minimum Periods'
                                            id='HRC_MinimumPeriods'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_MinimumPeriods', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_MinimumPeriods?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRC_IncrementMonth'>Increment Month</Label>
                            <Controller
                                name='HRC_IncrementMonth'
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger
                                            id='HRC_IncrementMonth'
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select Month' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthDropdown.map((month) => (
                                                <SelectItem key={month.key} value={month.value}>
                                                    {month.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRC_IncrementMonth && <FormError>{errors.HRC_IncrementMonth.message}</FormError>}
                        </div>
                        <Controller
                            name='HRC_IncrementOnceInMonths'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_IncrementOnceInMonths', numValue, {
                                                        shouldDirty: true,
                                                        shouldValidate: true
                                                    });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Increment Once In Months'
                                            id='HRC_IncrementOnceInMonths'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_IncrementOnceInMonths', numValue, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_IncrementOnceInMonths?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                        <Controller
                            name='HRC_AlertDays'
                            control={control}
                            render={({ field }) => {
                                const containerRefCallback = (containerElement: HTMLDivElement | null) => {
                                    if (!containerElement) return;
                                    const findInput = () =>
                                        containerElement.querySelector('input[type="text"], input[type="number"]') as HTMLInputElement;
                                    const attachListener = () => {
                                        const inputElement = findInput();
                                        if (!inputElement) {
                                            setTimeout(attachListener, 50);
                                            return;
                                        }
                                        if ((inputElement as any).__dirtyHandlerAttached) return;
                                        const handleInput = (e: Event) => {
                                            const target = e.target as HTMLInputElement;
                                            const inputValue = target.value.trim();
                                            if (inputValue !== '' && !Number.isNaN(Number(inputValue))) {
                                                const numValue = Number(inputValue);
                                                const currentValue = field.value || 0;
                                                if (Math.abs(numValue - currentValue) > 0.0001) {
                                                    field.onChange(numValue);
                                                    setValue('HRC_AlertDays', numValue, { shouldDirty: true, shouldValidate: true });
                                                }
                                            }
                                        };
                                        inputElement.addEventListener('input', handleInput, { passive: true });
                                        (inputElement as any).__dirtyHandlerAttached = true;
                                    };
                                    attachListener();
                                };
                                return (
                                    <div ref={containerRefCallback}>
                                        <InputNumber
                                            label='Alert Days'
                                            id='HRC_AlertDays'
                                            value={field.value}
                                            onChange={(value) => {
                                                const numValue = value !== null && value !== undefined ? Number(value) : 0;
                                                field.onChange(numValue);
                                                setValue('HRC_AlertDays', numValue, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.HRC_AlertDays?.message}
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
                {/* Salary Days Section */}
                <div className='rounded-lg bg-purple-600 p-4 text-white'>
                    <h3 className='font-semibold text-lg'>Salary Days</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRC_SalaryFromDay'>From Day</Label>
                            <Controller
                                name='HRC_SalaryFromDay'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}>
                                        <SelectTrigger
                                            id='HRC_SalaryFromDay'
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select day' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                <SelectItem key={day} value={String(day)}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRC_SalaryFromDay && <FormError>{errors.HRC_SalaryFromDay.message}</FormError>}
                        </div>
                        <div className='group flex flex-col gap-1.5'>
                            <Label htmlFor='HRC_SalaryToDay'>To Day</Label>
                            <Controller
                                name='HRC_SalaryToDay'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}>
                                        <SelectTrigger
                                            id='HRC_SalaryToDay'
                                            className='transition-colors focus:ring-2 focus:ring-primary/20'>
                                            <SelectValue placeholder='Select day' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                <SelectItem key={day} value={String(day)}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.HRC_SalaryToDay && <FormError>{errors.HRC_SalaryToDay.message}</FormError>}
                        </div>
                    </div>
                </div>
                {errors.root && <FormError>{errors.root.message}</FormError>}
                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='submit'
                        disabled={isSubmitting || isPending || !isDirty}
                        className='order-1 w-fit bg-purple-600 transition-all duration-200 hover:scale-105 hover:bg-purple-700'
                        isLoading={isSubmitting || isPending}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            SAVE
                        </div>
                    </Button>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting || isPending}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105'>
                        CANCEL
                    </Button>
                    {!isDirty && (
                        <span className='order-3 flex items-center text-muted-foreground text-sm sm:order-3'>No changes made</span>
                    )}
                </div>
            </form>
        </div>
    );
}
