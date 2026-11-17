'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import {
    useEmployeeById,
    useGetEmployeeSalaryDetailsByHead,
    useUpdateEmployeeSalaryDetailsByHead,
    useEmployeeEarningsDeductions,
    useSaveEmployeeSalaryDetails
} from '@/hooks/hrms/useEmployeeRegister';
import type {
    EmployeeSalaryDetailItem,
    SaveArrearDetailsRequest,
    SaveDeductionDetailsRequest,
    SaveEarningDetailsRequest
} from '@/types/hrms/employee-register';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
interface PayrollTabProps {
    employeeId: number | null;
    employeeCode: string;
    // grossList, earningList, detectionList, arrearList removed as per refactor to use API only
    MI_Id?: number;
    onSuccess?: () => void;
}
type EditablePayrollItem = EmployeeSalaryDetailItem & {
    localAmount?: number;
    localPercentage?: string; // Actual %
    localApplicablePercentage?: string; // % Applicable
    localMaxAmount?: number;
};
const DEFAULT_EMPTY_ARRAY: any[] = [];

export function PayrollTab({
    employeeId,
    employeeCode,
    MI_Id: propMI_Id,
    onSuccess
}: PayrollTabProps) {
    const { data: response, isLoading: isLoadingEmployee, refetch } = useEmployeeById(employeeId);
    const { data: salaryDetailsData, isLoading: isLoadingED } = useEmployeeEarningsDeductions(employeeId);
    const employeeData = response?.data;

    // Prioritize the specific API response as requested by user
    // Prioritize the specific API response as requested by user
    const salaryDetails = salaryDetailsData || DEFAULT_EMPTY_ARRAY;
    console.log('🔍 [PayrollTab] Loaded salaryDetails from API:', salaryDetails);

    const queryClient = useQueryClient();
    const MI_Id = propMI_Id || employeeData?.mI_Id || employeeData?.MI_Id || HRMS_MI_ID;
    const isLoading = isLoadingEmployee || isLoadingED;

    const updateSalaryByHeadMutation = useUpdateEmployeeSalaryDetailsByHead();
    // Local state for editable items
    const [earnings, setEarnings] = useState<EditablePayrollItem[]>([]);
    const [deductions, setDeductions] = useState<EditablePayrollItem[]>([]);
    const [arrears, setArrears] = useState<EditablePayrollItem[]>([]);
    const [grossDetails, setGrossDetails] = useState<EditablePayrollItem | null>(null);

    const getEmployeeSalaryDetailsByHeadMutation = useGetEmployeeSalaryDetailsByHead();

    // Initialize local state when data loads
    useEffect(() => {
        // Show only items returned by the API as requested by user
        const initializeList = (flag: string) => {
            return (salaryDetails || [])
                .filter((sd: any) => (sd.HRMED_EarnDedFlag || sd.hrmeD_EarnDedFlag) === flag)
                .map((existingItem: any) => {
                    const hrmedId = existingItem.HRMED_Id || existingItem.hrmeD_Id;
                    const amount = existingItem.HREED_Amount ?? existingItem.hreeD_Amount ?? 0;
                    const percentage = existingItem.HREED_Percentage ?? existingItem.hreeD_Percentage ?? '0';
                    const maxVal = existingItem.HREED_ApplicableMaxValue ?? existingItem.hreeD_ApplicableMaxValue ?? 0;
                    const active = Boolean(existingItem.HREED_ActiveFlag ?? existingItem.hreeD_ActiveFlag);

                    return {
                        ...existingItem,
                        HREED_Id: existingItem.HREED_Id ?? existingItem.hreeD_Id ?? 0,
                        HRMED_Id: hrmedId,
                        HRMED_Name: existingItem.HRMED_Name ?? existingItem.hrmeD_Name ?? '',
                        HRMED_EarnDedFlag: flag,
                        HRMED_AmountPercentFlag: existingItem.HRMED_AmountPercentFlag ?? existingItem.hrmeD_AmountPercentFlag ?? 'Amount',
                        HREED_ActiveFlag: active,
                        HREED_Amount: amount,
                        HREED_Percentage: percentage,
                        HREED_ApplicablePercentage: existingItem.HREED_ApplicablePercentage ?? existingItem.hreeD_ApplicablePercentage ?? percentage,
                        HREED_ApplicableMaxValue: maxVal,
                        // Local state for editing
                        localAmount: amount,
                        localPercentage: percentage,
                        localApplicablePercentage: existingItem.HREED_ApplicablePercentage ?? existingItem.hreeD_ApplicablePercentage ?? percentage,
                        localMaxAmount: maxVal,
                        HREED_MaxApplicableFlg: Boolean(existingItem.HREED_MaxApplicableFlg ?? existingItem.hreeD_MaxApplicableFlg ?? true)
                    } as EditablePayrollItem;
                });
        };

        const earningsList = initializeList('Earning');
        const deductionsList = initializeList('Deduction');
        const arrearsList = initializeList('Arrear');

        setEarnings(earningsList);
        setDeductions(deductionsList);
        setArrears(arrearsList);

        // Handle Gross separately
        const existingGross = (salaryDetails || []).find(
            (sd: any) => (sd.HRMED_EarnDedFlag || sd.hrmeD_EarnDedFlag) === 'Gross'
        );
        if (existingGross) {
            const hrmedId = existingGross.HRMED_Id || existingGross.hrmeD_Id;
            setGrossDetails({
                ...existingGross,
                HREED_Id: existingGross.HREED_Id ?? existingGross.hreeD_Id ?? 0,
                HRMED_Id: hrmedId,
                HRMED_Name: existingGross.HRMED_Name ?? existingGross.hrmeD_Name ?? 'GROSS',
                HRMED_EarnDedFlag: 'Gross',
                HRMED_AmountPercentFlag: existingGross.HRMED_AmountPercentFlag ?? existingGross.hrmeD_AmountPercentFlag ?? 'Amount',
                HREED_ActiveFlag: Boolean(existingGross.HREED_ActiveFlag ?? existingGross.hreeD_ActiveFlag ?? true),
                HREED_Amount: existingGross.HREED_Amount ?? existingGross.hreeD_Amount ?? 0,
                HREED_Percentage: existingGross.HREED_Percentage ?? existingGross.hreeD_Percentage ?? '0',
                HREED_ApplicablePercentage: existingGross.HREED_ApplicablePercentage ?? existingGross.hreeD_ApplicablePercentage ?? '0',
                HREED_ApplicableMaxValue: existingGross.HREED_ApplicableMaxValue ?? existingGross.hreeD_ApplicableMaxValue ?? 0,
                localAmount: existingGross.HREED_Amount ?? existingGross.hreeD_Amount ?? 0,
                localPercentage: existingGross.HREED_Percentage ?? existingGross.hreeD_Percentage ?? '0',
                localApplicablePercentage: existingGross.HREED_ApplicablePercentage ?? existingGross.hreeD_ApplicablePercentage ?? '0',
                localMaxAmount: existingGross.HREED_ApplicableMaxValue ?? existingGross.hreeD_ApplicableMaxValue ?? 0,
                HREED_MaxApplicableFlg: Boolean(existingGross.HREED_MaxApplicableFlg ?? existingGross.hreeD_MaxApplicableFlg ?? true)
            } as EditablePayrollItem);
        } else {
            setGrossDetails(null);
        }
    }, [salaryDetails]);
    // Helper function to calculate totals with specific arrays (client-side calculation)
    const calculateTotalsWithArrays = (
        earningsArray: EditablePayrollItem[],
        deductionsArray: EditablePayrollItem[],
        arrearsArray: EditablePayrollItem[]
    ) => {
        // Client-side calculation: Calculate totals from active items
        // Use max amount if > 0, otherwise use amount
        const totalEarning = earningsArray
            .filter((item) => item.HREED_ActiveFlag)
            .reduce((sum, item) => {
                const maxAmount = item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0;
                const amount = item.localAmount ?? item.HREED_Amount ?? 0;
                return sum + (maxAmount > 0 ? maxAmount : amount);
            }, 0);
        const totalDeduction = deductionsArray
            .filter((item) => item.HREED_ActiveFlag)
            .reduce((sum, item) => {
                const maxAmount = item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0;
                const amount = item.localAmount ?? item.HREED_Amount ?? 0;
                return sum + (maxAmount > 0 ? maxAmount : amount);
            }, 0);
        const totalArrear = arrearsArray
            .filter((item) => item.HREED_ActiveFlag)
            .reduce((sum, item) => {
                const maxAmount = item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0;
                const amount = item.localAmount ?? item.HREED_Amount ?? 0;
                return sum + (maxAmount > 0 ? maxAmount : amount);
            }, 0);
        setCalculatedTotals({
            totalEarning,
            totalDeduction,
            totalArrear,
            netSalary: totalEarning + totalArrear - totalDeduction
        });
    };
    // Validation helper functions
    const validatePercentage = (value: string): string => {
        if (value === '' || value === '-') return '0';
        const numValue = Number.parseFloat(value);
        if (Number.isNaN(numValue)) return '0';
        if (numValue < 0) return '0';
        if (numValue > 100) return '100';
        return value;
    };
    const validateAmount = (value: string): number => {
        if (value === '' || value === '-') return 0;
        // Remove any non-digit characters except decimal point
        let cleanValue = value.replace(/[^\d.]/g, '');
        // Remove negative sign if present (we don't allow negatives)
        cleanValue = cleanValue.replace(/-/g, '');
        // Check for max 15 digits (excluding decimal point)
        const digitsOnly = cleanValue.replace(/\./g, '');
        if (digitsOnly.length > 15) {
            // Truncate to 15 digits - keep integer part and allow some decimal places
            const truncatedDigits = digitsOnly.substring(0, 15);
            // If there was a decimal, try to preserve it
            if (cleanValue.includes('.')) {
                const parts = cleanValue.split('.');
                const intDigits = parts[0].replace(/\./g, '').length;
                const maxDecimals = Math.min(parts[1]?.length || 0, 15 - intDigits);
                const intPart = truncatedDigits.substring(0, intDigits);
                const decPart = maxDecimals > 0 ? truncatedDigits.substring(intDigits, intDigits + maxDecimals) : '';
                const result = decPart ? `${intPart}.${decPart}` : intPart;
                const numValue = Number.parseFloat(result);
                return Number.isNaN(numValue) ? 0 : Math.max(0, numValue);
            }
            const numValue = Number.parseFloat(truncatedDigits);
            return Number.isNaN(numValue) ? 0 : Math.max(0, numValue);
        }
        const numValue = Number.parseFloat(cleanValue);
        if (Number.isNaN(numValue)) return 0;
        return Math.max(0, numValue); // Ensure no negative values
    };
    // State for calculation trigger
    const handleCalculateServerSide = async (currentEarnings = earnings, currentDeductions = deductions, currentArrears = arrears, currentGross = grossDetails) => {
        if (!employeeData) return;

        // Construct standard payload for calculation
        const allItems = [
            ...currentEarnings,
            ...currentDeductions,
            ...currentArrears,
            ...(currentGross ? [currentGross] : [])
        ].map(item => ({
            ...item,
            HREED_Amount: item.localAmount ?? item.HREED_Amount ?? 0,
            HREED_Percentage: item.localPercentage || item.HREED_Percentage || '0',
            HREED_ActiveFlag: Boolean(item.HREED_ActiveFlag)
        }));

        const payload = {
            ...employeeData,
            employeeEarningsDeductionsDetails: allItems
        };

        try {
            const toastId = toast.loading('Calculating salary details...');
            const result = await getEmployeeSalaryDetailsByHeadMutation.mutateAsync(payload);
            toast.dismiss(toastId);

            const calcResult = result as any;
            if (calcResult?.success && calcResult?.data?.employeeEarningsDeductionsDetails) {
                // Merge calculated results back into state
                const newDetails = calcResult.data.employeeEarningsDeductionsDetails as EditablePayrollItem[];

                const newEarnings: EditablePayrollItem[] = [];
                const newDeductions: EditablePayrollItem[] = [];
                const newArrears: EditablePayrollItem[] = [];
                let newGross: EditablePayrollItem | null = null;

                newDetails.forEach(item => {
                    // Get name from salary details only (API driven)
                    const name = item.HRMED_Name || item.hrmeD_Name || '';
                    const rawFlag = item.HRMED_AmountPercentFlag;
                    const amountPercentFlag = rawFlag?.toString().trim()
                        ? rawFlag.toString().trim()
                        : (item.hrmeD_AmountPercentFlag || 'Amount');

                    const editableItem: EditablePayrollItem = {
                        ...item,
                        HRMED_Name: name,
                        HRMED_AmountPercentFlag: amountPercentFlag,
                        HREED_ActiveFlag: item.HREED_ActiveFlag !== undefined ? Boolean(item.HREED_ActiveFlag) : false,
                        localAmount: item.HREED_Amount || 0,
                        localPercentage: item.HREED_Percentage || '0',
                        localApplicablePercentage: item.HREED_ApplicablePercentage || item.HREED_Percentage || '0',
                        localMaxAmount: item.HREED_ApplicableMaxValue || 0
                    };

                    if (item.HRMED_EarnDedFlag === 'Earning') {
                        newEarnings.push(editableItem);
                    } else if (item.HRMED_EarnDedFlag === 'Deduction') {
                        newDeductions.push(editableItem);
                    } else if (item.HRMED_EarnDedFlag === 'Arrear') {
                        newArrears.push(editableItem);
                    } else if (item.HRMED_EarnDedFlag === 'Gross') {
                        newGross = editableItem;
                    }
                });

                setEarnings(newEarnings);
                setDeductions(newDeductions);
                setArrears(newArrears);
                if (newGross) setGrossDetails(newGross);

                // Also update totals
                calculateTotalsWithArrays(newEarnings, newDeductions, newArrears);
            }
        } catch (error) {
            console.error("Calculation error", error);
        }
    };

    const handleAutoSave = async (item: EditablePayrollItem) => {
        if (!employeeId) return;

        // Construct payload matching the user's requested structure
        const payload = {
            hreeD_Id: Number(item.HREED_Id || 0),
            mI_Id: Number(employeeData?.mI_Id || employeeData?.MI_Id || MI_Id || 0),
            hrmE_Id: Number(employeeId),
            hrmeD_Id: Number(item.HRMED_Id || 0),
            hrmeD_Name: item.HRMED_Name || '',
            hreeD_Amount: Number(item.localAmount ?? item.HREED_Amount ?? 0),
            hreeD_Percentage: String(item.localApplicablePercentage ?? item.HREED_ApplicablePercentage ?? item.HREED_Percentage ?? '0'),
            hreeD_ActiveFlag: Boolean(item.HREED_ActiveFlag),
            hreeD_MaxApplicableFlg: Boolean(item.HREED_MaxApplicableFlg ?? true),
            hreeD_ApplicableMaxValue: Number(item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0),
            updatedDate: new Date().toISOString(),
            hreeD_UpdatedBy: 0 // Logged in user ID from backend session
        };

        try {
            console.log(`[PAYROLL AUTO-SAVE] Payload for head ${item.HRMED_Id}:`, payload);
            await updateSalaryByHeadMutation.mutateAsync(payload);
        } catch (error) {
            console.error(`❌ [AUTO-SAVE ERROR] Failed for head ${item.HRMED_Id}:`, error);
        }
    };

    // Update handlers for earnings
    const updateEarning = (index: number, field: keyof EditablePayrollItem, value: any) => {
        const updated = [...earnings];
        let validatedValue = value;
        // Apply validation based on field type
        if (field === 'localPercentage' || field === 'localApplicablePercentage') {
            validatedValue = validatePercentage(String(value));
        } else if (field === 'localAmount' || field === 'localMaxAmount') {
            validatedValue = validateAmount(String(value));
        }
        updated[index] = { ...updated[index], [field]: validatedValue };
        setEarnings(updated);
        // If checkbox (HREED_ActiveFlag) is toggled, recalculate totals immediately with updated array
        if (field === 'HREED_ActiveFlag') {
            calculateTotalsWithArrays(updated, deductions, arrears);
            // Trigger server calc on toggle
            handleCalculateServerSide(updated, deductions, arrears);
            // Auto-save toggle status
            handleAutoSave(updated[index]);
        }
        return updated;
    };

    // Update handlers for deductions
    const updateDeduction = (index: number, field: keyof EditablePayrollItem, value: any) => {
        const updated = [...deductions];
        let validatedValue = value;
        // Apply validation based on field type
        if (field === 'localPercentage' || field === 'localApplicablePercentage') {
            validatedValue = validatePercentage(String(value));
        } else if (field === 'localAmount' || field === 'localMaxAmount') {
            validatedValue = validateAmount(String(value));
        }
        updated[index] = { ...updated[index], [field]: validatedValue };
        setDeductions(updated);
        // If checkbox (HREED_ActiveFlag) is toggled, recalculate totals immediately with updated array
        if (field === 'HREED_ActiveFlag') {
            calculateTotalsWithArrays(earnings, updated, arrears);
            // Trigger server calc on toggle
            handleCalculateServerSide(earnings, updated, arrears);
            // Auto-save toggle status
            handleAutoSave(updated[index]);
        }
        return updated;
    };

    // Update handlers for arrears
    const updateArrear = (index: number, field: keyof EditablePayrollItem, value: any) => {
        const updated = [...arrears];
        let validatedValue = value;
        // Apply validation based on field type
        if (field === 'localPercentage' || field === 'localApplicablePercentage') {
            validatedValue = validatePercentage(String(value));
        } else if (field === 'localAmount' || field === 'localMaxAmount') {
            validatedValue = validateAmount(String(value));
        }
        updated[index] = { ...updated[index], [field]: validatedValue };
        setArrears(updated);
        // If checkbox (HREED_ActiveFlag) is toggled, recalculate totals immediately with updated array
        if (field === 'HREED_ActiveFlag') {
            calculateTotalsWithArrays(earnings, deductions, updated);
            // Trigger server calc on toggle
            handleCalculateServerSide(earnings, deductions, updated);
            // Auto-save toggle status
            handleAutoSave(updated[index]);
        }
        return updated;
    };

    // Update handlers for gross
    const updateGross = (field: keyof EditablePayrollItem, value: any) => {
        if (!grossDetails) return null;

        let validatedValue = value;
        if (field === 'localAmount') {
            validatedValue = validateAmount(String(value));
        }

        const updatedGross = { ...grossDetails, [field]: validatedValue };
        setGrossDetails(updatedGross);
        return updatedGross;
    };

    const onBlurGross = (updated = grossDetails) => {
        handleCalculateServerSide(earnings, deductions, arrears, updated);
    };
    // State for calculated totals from API
    const [calculatedTotals, setCalculatedTotals] = useState<{
        totalEarning: number;
        totalDeduction: number;
        totalArrear: number;
        netSalary: number;
    }>({
        totalEarning: 0,
        totalDeduction: 0,
        totalArrear: 0,
        netSalary: 0
    });
    // Calculate totals using client-side calculation
    const calculateTotals = () => {
        calculateTotalsWithArrays(earnings, deductions, arrears);
    };
    // Calculate totals when earnings, deductions, or arrears change (but not on checkbox toggle - handled separately)
    useEffect(() => {
        // Only calculate on initial load or when arrays change (not on checkbox toggle)
        // Checkbox toggles are handled in updateEarning/updateDeduction/updateArrear functions
        if (earnings.length > 0 || deductions.length > 0 || arrears.length > 0) {
            // Debounce to avoid multiple calls
            const timeoutId = setTimeout(() => {
                calculateTotals();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [earnings, deductions, arrears]);
    // Use calculated totals from API, fallback to 0 if not calculated yet
    const totalEarning = calculatedTotals.totalEarning;
    const totalDeduction = calculatedTotals.totalDeduction;
    const totalArrear = calculatedTotals.totalArrear;
    const netSalary = calculatedTotals.netSalary;

    const saveEmployeeSalaryDetailsMutation = useSaveEmployeeSalaryDetails();

    const handleSave = async () => {
        if (!employeeId) {
            toast.error('Employee ID is required');
            return;
        }

        try {
            console.log(`🔍 [PayrollTab] Submitting Final Save for Employee ID: ${employeeId}, MI_Id: ${MI_Id}`);
            const result = await saveEmployeeSalaryDetailsMutation.mutateAsync({
                hrme_id: employeeId,
                MI_Id: MI_Id || 0
            });

            if (result?.success) {
                await refetch();
                // Call onSuccess if provided
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: any) {
            console.error('Save error:', error);
            // Error handling is already in the hook but we catch here to prevent crash
        }
    };
    const isSaving = saveEmployeeSalaryDetailsMutation.isPending;
    if (isLoading) {
        return <div className='rounded-md border p-6 text-center text-muted-foreground'>Loading payroll details...</div>;
    }
    return (
        <div className='space-y-6'>
            {/* Gross Salary Details */}
            {grossDetails && (
                <div className='rounded-md border p-4 bg-white'>
                    <div className='flex items-center gap-4'>
                        <h3 className='font-semibold text-base text-gray-900 uppercase min-w-[150px]'>GROSS SALARY:</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Amount:</span>
                            <Input
                                type='number'
                                className='h-9 w-40 text-right'
                                value={grossDetails.localAmount ?? grossDetails.HREED_Amount ?? 0}
                                onChange={(e) => updateGross('localAmount', e.target.value)}
                                onBlur={(e) => {
                                    const validated = validateAmount(e.target.value);
                                    const updated = updateGross('localAmount', validated);
                                    if (updated) onBlurGross(updated);
                                }}
                                min={0}
                                max={999999999999999}
                                step={0.01}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Earning Details */}
            <div className='rounded-md border'>
                <div className='border-b bg-muted px-4 py-2'>
                    <h3 className='font-semibold text-base text-gray-900 uppercase'>EARNING DETAILS</h3>
                </div>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-16'>Action</TableHead>
                                <TableHead className='w-16'>Serial NO.</TableHead>
                                <TableHead>Earnings</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>Actual %</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>%&nbsp;Applicable</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Amount</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Max&nbsp;Amount</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {earnings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center text-muted-foreground'>
                                        No earning details available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                earnings.map((item, index) => {
                                    // Normalize the AmountPercentFlag value - handle null, undefined, empty string, and case variations
                                    const rawFlag = item.HRMED_AmountPercentFlag;
                                    const normalizedFlag = rawFlag ? String(rawFlag).trim().toLowerCase() : 'amount';
                                    const isAmountType = normalizedFlag === 'amount';
                                    const isPercentageType = normalizedFlag === 'percentage';
                                    return (
                                        <TableRow key={item.HREED_Id || index}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={item.HREED_ActiveFlag || false}
                                                    onCheckedChange={(checked) => updateEarning(index, 'HREED_ActiveFlag', checked)}
                                                />
                                            </TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.HRMED_Name || ''}</TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-20 text-right'
                                                    value={item.localPercentage || item.HREED_Percentage || '0'}
                                                    onChange={(e) => updateEarning(index, 'localPercentage', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validatePercentage(e.target.value);
                                                        const updated = updateEarning(index, 'localPercentage', validated);
                                                        handleCalculateServerSide(updated, deductions, arrears);
                                                    }}
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isAmountType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-20 text-right'
                                                    value={
                                                        item.localApplicablePercentage ??
                                                        item.HREED_ApplicablePercentage ??
                                                        item.HREED_Percentage ??
                                                        '0'
                                                    }
                                                    onChange={(e) => updateEarning(index, 'localApplicablePercentage', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validatePercentage(e.target.value);
                                                        const updated = updateEarning(index, 'localApplicablePercentage', validated);
                                                        handleCalculateServerSide(updated, deductions, arrears);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isAmountType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-24 text-right'
                                                    value={item.localAmount ?? item.HREED_Amount ?? 0}
                                                    onChange={(e) => updateEarning(index, 'localAmount', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validateAmount(e.target.value);
                                                        const updated = updateEarning(index, 'localAmount', validated);
                                                        handleCalculateServerSide(updated, deductions, arrears);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={999999999999999}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isPercentageType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-24 text-right'
                                                    value={item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0}
                                                    onChange={(e) => updateEarning(index, 'localMaxAmount', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validateAmount(e.target.value);
                                                        const updated = updateEarning(index, 'localMaxAmount', validated);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={999999999999999}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag}
                                                />
                                            </TableCell>
                                            <TableCell>{item.HREED_MaxApplicableFlg ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className='border-t bg-muted px-4 py-2'>
                    <div className='flex justify-end'>
                        <span className='font-semibold'>Total Earning: ₹{totalEarning.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* Deduction Details */}
            <div className='rounded-md border'>
                <div className='border-b bg-muted px-4 py-2'>
                    <h3 className='font-semibold text-base text-gray-900 uppercase'>DEDUCTION DETAILS</h3>
                </div>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-16'>Action</TableHead>
                                <TableHead className='w-16'>Serial NO.</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>Actual %</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>%&nbsp;Applicable</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Amount</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Max&nbsp;Amount</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deductions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center text-muted-foreground'>
                                        No deduction details available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                deductions.map((item, index) => {
                                    // Normalize the AmountPercentFlag value - handle null, undefined, empty string, and case variations
                                    const rawFlag = item.HRMED_AmountPercentFlag;
                                    const normalizedFlag = rawFlag ? String(rawFlag).trim().toLowerCase() : 'amount';
                                    const isAmountType = normalizedFlag === 'amount';
                                    const isPercentageType = normalizedFlag === 'percentage';
                                    return (
                                        <TableRow key={item.HREED_Id || index}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={item.HREED_ActiveFlag || false}
                                                    onCheckedChange={(checked) => updateDeduction(index, 'HREED_ActiveFlag', checked)}
                                                />
                                            </TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.HRMED_Name || ''}</TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-20 text-right'
                                                    value={item.localPercentage || item.HREED_Percentage || '0'}
                                                    onChange={(e) => updateDeduction(index, 'localPercentage', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validatePercentage(e.target.value);
                                                        const updated = updateDeduction(index, 'localPercentage', validated);
                                                        handleCalculateServerSide(earnings, updated, arrears);
                                                    }}
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isAmountType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-20 text-right'
                                                    value={
                                                        item.localApplicablePercentage ??
                                                        item.HREED_ApplicablePercentage ??
                                                        item.HREED_Percentage ??
                                                        '0'
                                                    }
                                                    onChange={(e) => updateDeduction(index, 'localApplicablePercentage', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validatePercentage(e.target.value);
                                                        const updated = updateDeduction(index, 'localApplicablePercentage', validated);
                                                        handleCalculateServerSide(earnings, updated, arrears);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isAmountType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-24 text-right'
                                                    value={item.localAmount ?? item.HREED_Amount ?? 0}
                                                    onChange={(e) => updateDeduction(index, 'localAmount', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validateAmount(e.target.value);
                                                        const updated = updateDeduction(index, 'localAmount', validated);
                                                        handleCalculateServerSide(earnings, updated, arrears);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={999999999999999}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag || isPercentageType}
                                                />
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <Input
                                                    type='number'
                                                    className='h-8 w-24 text-right'
                                                    value={item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0}
                                                    onChange={(e) => updateDeduction(index, 'localMaxAmount', e.target.value)}
                                                    onBlur={(e) => {
                                                        const validated = validateAmount(e.target.value);
                                                        const updated = updateDeduction(index, 'localMaxAmount', validated);
                                                        handleAutoSave(updated[index]);
                                                    }}
                                                    min={0}
                                                    max={999999999999999}
                                                    step={0.01}
                                                    disabled={!item.HREED_ActiveFlag}
                                                />
                                            </TableCell>
                                            <TableCell>{item.HREED_MaxApplicableFlg ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className='border-t bg-muted px-4 py-2'>
                    <div className='flex justify-end'>
                        <span className='font-semibold'>Total Deduction: ₹{totalDeduction.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* Arrear Details */}
            <div className='rounded-md border'>
                <div className='border-b bg-muted px-4 py-2'>
                    <h3 className='font-semibold text-base text-gray-900 uppercase'>ARREAR DETAILS</h3>
                </div>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-16'>Action</TableHead>
                                <TableHead className='w-16'>Serial NO.</TableHead>
                                <TableHead>Arrear Head</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>Actual %</TableHead>
                                <TableHead className='w-24 whitespace-nowrap text-right'>%&nbsp;Applicable</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Amount</TableHead>
                                <TableHead className='w-32 whitespace-nowrap text-center'>Max&nbsp;Amount</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {arrears.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className='text-center text-muted-foreground'>
                                        No arrear details available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                arrears.map((item, index) => (
                                    <TableRow key={item.HREED_Id || index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={item.HREED_ActiveFlag || false}
                                                onCheckedChange={(checked) => updateArrear(index, 'HREED_ActiveFlag', checked)}
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.HRMED_Name || ''}</TableCell>
                                        <TableCell className='text-right'>
                                            <Input
                                                type='number'
                                                className='h-8 w-20 text-right'
                                                value={item.localPercentage || item.HREED_Percentage || '0'}
                                                onChange={(e) => updateArrear(index, 'localPercentage', e.target.value)}
                                                onBlur={(e) => {
                                                    const validated = validatePercentage(e.target.value);
                                                    const updated = updateArrear(index, 'localPercentage', validated);
                                                    handleCalculateServerSide(earnings, deductions, updated);
                                                }}
                                                min={0}
                                                max={100}
                                                step={0.01}
                                                disabled={!item.HREED_ActiveFlag}
                                            />
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Input
                                                type='number'
                                                className='h-8 w-20 text-right'
                                                value={
                                                    item.localApplicablePercentage ??
                                                    item.HREED_ApplicablePercentage ??
                                                    item.HREED_Percentage ??
                                                    '0'
                                                }
                                                onChange={(e) => updateArrear(index, 'localApplicablePercentage', e.target.value)}
                                                onBlur={(e) => {
                                                    const validated = validatePercentage(e.target.value);
                                                    const updated = updateArrear(index, 'localApplicablePercentage', validated);
                                                    handleCalculateServerSide(earnings, deductions, updated);
                                                    handleAutoSave(updated[index]);
                                                }}
                                                min={0}
                                                max={100}
                                                step={0.01}
                                                disabled={!item.HREED_ActiveFlag}
                                            />
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Input
                                                type='number'
                                                className='h-8 w-24 text-right'
                                                value={item.localAmount ?? item.HREED_Amount ?? 0}
                                                onChange={(e) => updateArrear(index, 'localAmount', e.target.value)}
                                                onBlur={(e) => {
                                                    const validated = validateAmount(e.target.value);
                                                    const updated = updateArrear(index, 'localAmount', validated);
                                                    handleCalculateServerSide(earnings, deductions, updated);
                                                    handleAutoSave(updated[index]);
                                                }}
                                                min={0}
                                                max={999999999999999}
                                                step={0.01}
                                                disabled={!item.HREED_ActiveFlag}
                                            />
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Input
                                                type='number'
                                                className='h-8 w-24 text-right'
                                                value={item.localMaxAmount ?? item.HREED_ApplicableMaxValue ?? 0}
                                                onChange={(e) => updateArrear(index, 'localMaxAmount', e.target.value)}
                                                onBlur={(e) => {
                                                    const validated = validateAmount(e.target.value);
                                                    const updated = updateArrear(index, 'localMaxAmount', validated);
                                                    handleCalculateServerSide(earnings, deductions, arrears);
                                                    handleAutoSave(updated[index]);
                                                }}
                                                min={0}
                                                max={999999999999999}
                                                step={0.01}
                                                disabled={!item.HREED_ActiveFlag}
                                            />
                                        </TableCell>
                                        <TableCell>{item.HREED_MaxApplicableFlg ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className='border-t bg-muted px-4 py-2'>
                    <div className='flex justify-end'>
                        <span className='font-semibold'>Total Arrear: ₹{totalArrear.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* Net Salary */}
            <div className='rounded-md border-2 border-muted bg-muted/50 p-4'>
                <div className='flex justify-center'>
                    <span className='font-bold text-xl'>Net Salary: ₹{netSalary.toFixed(2)}</span>
                </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-3 pt-4'>
                <Button variant='outline' type='button'>
                    PREVIOUS
                </Button>
                <Button type='button' variant='default' onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'SAVING...' : 'SUBMIT'}
                </Button>
                <Button variant='outline' type='button'>
                    CLEAR
                </Button>
            </div>
        </div>
    );
}
