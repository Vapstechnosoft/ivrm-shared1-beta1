
'use client';

import React, { useState } from 'react';
import { useSalarySlip } from '@/hooks/staff-portal/useSalarySlip';
import SalarySlipFilter from './_components/salary-slip-filter';
import SalarySlipView from './_components/salary-slip-view';
import { amountToWords } from '@/lib/utils/amountToWords';
import type { ISalarySlipMainItem, ISalarySlipDetail, ISalarySlipLineItem } from '@/types/staff-portal/salary-slip';
import { toast } from 'sonner';

export default function StaffSalarySlipPage() {
    const { initialData, isLoadingInitial, generateSlip } = useSalarySlip();
    const [slipData, setSlipData] = useState<ISalarySlipMainItem[] | null>(null);

    const handleGenerate = (month: string, year: string) => {
        generateSlip.mutate({ HRES_Month: month, HRES_Year: year }, {
            onSuccess: (res) => {
                if (res.data && res.data.main_list && res.data.main_list.length > 0) {
                    const processedData = processSalarySlipData(res.data.main_list, month, year);
                    setSlipData(processedData);
                } else {
                    toast.error(`Salary details not found for ${month} ${year}`);
                    setSlipData(null);
                }
            },
            onError: () => {
                toast.error("Failed to generate salary slip");
            }
        });
    };

    const processSalarySlipData = (list: any[], month: string, year: string): ISalarySlipMainItem[] => {
        return list.map(item => {
            const details: ISalarySlipDetail[] = item.employeeSalaryslipDetails || [];

            // Separate earnings and deductions
            const earnings = details.filter(d => d.HRMED_EarnDedFlag === 'Earning');
            const deductions = details.filter(d => d.HRMED_EarnDedFlag === 'Deduction');

            const totalEarnings = earnings.reduce((sum, d) => sum + d.Amount, 0);
            const totalDeductions = deductions.reduce((sum, d) => sum + d.Amount, 0);

            // Pair them up for side-by-side display
            const processedItems: ISalarySlipLineItem[] = [];
            const maxLen = Math.max(earnings.length, deductions.length);

            for (let i = 0; i < maxLen; i++) {
                const earn = earnings[i];
                const ded = deductions[i];

                processedItems.push({
                    HRMED_Name: earn ? earn.HRMED_Name : '',
                    Amount: earn ? earn.Amount : 0,
                    ds: ded ? {
                        HRMED_Name: ded.HRMED_Name,
                        Amount: ded.Amount
                    } : undefined
                });
            }

            const netSalary = Math.round(totalEarnings - totalDeductions);

            return {
                ...item,
                selectedMonth: month,
                selectedYear: year,
                items: processedItems,
                totals: [totalEarnings, totalDeductions],
                NetSalary: netSalary,
                NetAmountInwords: amountToWords(netSalary)
            };
        });
    };

    return (
        <div className="container mx-auto p-4 space-y-6 min-h-screen">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold tracking-tight">Staff Salary Slip</h1>
            </div>

            <div className="print:hidden">
                <SalarySlipFilter
                    initialData={initialData}
                    onGenerate={handleGenerate}
                    isLoading={generateSlip.isPending}
                />
            </div>

            {slipData && (
                <SalarySlipView
                    data={slipData}
                    onCancel={() => setSlipData(null)}
                />
            )}

            {!slipData && !generateSlip.isPending && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground print:hidden">
                    <p>Select Month and Year to generate your salary slip.</p>
                </div>
            )}
        </div>
    );
}
