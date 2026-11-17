'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invRMonthEndReportSchema, type InvRMonthEndReportSchema } from '@/schemas/inventory/reports/inv-r-month-end-report';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FileText, RefreshCcw } from 'lucide-react';
import { FormError } from '@/components/ui/extension/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { getInvRMonthEndReportLoadData } from '@/server/inventory/reports/inv-r-month-end-report';
import { useQuery } from '@tanstack/react-query';

interface ReportFormProps {
    onReportGenerated: (data: any, payload: any) => void;
    isLoading: boolean;
}

export default function ReportForm({ onReportGenerated, isLoading }: ReportFormProps) {
    const [years, setYears] = useState<{ id: string, year: string }[]>([]);

    const form = useForm<InvRMonthEndReportSchema>({
        resolver: zodResolver(invRMonthEndReportSchema),
        defaultValues: {
            ASMAY_Id: undefined,
            IVRM_Month_Id: undefined,
            year: '',
            IE_Name: ''
        }
    });

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    const { data: loadData } = useQuery({
        queryKey: ['invRMonthEndReportLoadDataV3'],
        queryFn: getInvRMonthEndReportLoadData
    });

    const ASMAY_Id = watch('ASMAY_Id');

    useEffect(() => {
        if (ASMAY_Id && loadData?.acayear) {
            const selectedYear = loadData.acayear.find((y: any) => y.asmaY_Id === Number(ASMAY_Id));
            if (selectedYear) {
                const yearStr = selectedYear.asmaY_Year;
                // Assuming format "YYYY-YYYY" e.g. "2023-2024"
                const parts = yearStr.split('-');
                if (parts.length >= 2) {
                    setYears([
                        { id: parts[0], year: parts[0] },
                        { id: parts[1], year: parts[1] }
                    ]);
                } else {
                    setYears([{ id: yearStr, year: yearStr }]);
                }
            }
        } else {
            setYears([]);
        }
    }, [ASMAY_Id, loadData]);


    const onSubmit = (data: InvRMonthEndReportSchema) => {
        // Find academic year object and month object to pass names if needed for display
        const acaYearObj = loadData?.acayear.find((y: any) => y.asmaY_Id === Number(data.ASMAY_Id));
        const monthObj = loadData?.month_array.find((m: any) => m.ivrM_Month_Id === Number(data.IVRM_Month_Id));

        const apiPayload = {
            ASMAY_Id: Number(data.ASMAY_Id),
            month: data.IVRM_Month_Id,
            year: data.year,
            IE_Name: data.IE_Name
        };

        const displayPayload = {
            ...apiPayload,
            ASMAY_Year: acaYearObj?.asmaY_Year,
            Month_Name: monthObj?.ivrM_Month_Name
        };
        onReportGenerated(apiPayload, displayPayload);
    };

    const handleCancel = () => {
        reset();
        onReportGenerated(null, null);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CollapsibleSection title="Report Configuration" defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">

                    <div className="space-y-2">
                        <Label>Academic Year <span className="text-destructive">*</span></Label>
                        <Controller
                            control={control}
                            name="ASMAY_Id"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Academic Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData?.acayear?.map((year: any) => (
                                            <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                {year.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ASMAY_Id && <FormError>{errors.ASMAY_Id.message}</FormError>}
                    </div>

                    <div className="space-y-2">
                        <Label>Month <span className="text-destructive">*</span></Label>
                        <Controller
                            control={control}
                            name="IVRM_Month_Id"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData?.month_array?.map((month: any) => (
                                            <SelectItem key={month.ivrM_Month_Id} value={month.ivrM_Month_Id.toString()}>
                                                {month.ivrM_Month_Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.IVRM_Month_Id && <FormError>{errors.IVRM_Month_Id.message}</FormError>}
                    </div>

                    <div className="space-y-2">
                        <Label>Year <span className="text-destructive">*</span></Label>
                        <Controller
                            control={control}
                            name="year"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y.id} value={y.id}>
                                                {y.year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.year && <FormError>{errors.year.message}</FormError>}
                    </div>

                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Controller
                            control={control}
                            name="IE_Name"
                            render={({ field }) => (
                                <Input {...field} placeholder="IE Name" maxLength={30} />
                            )}
                        />
                    </div>

                </div>

                <div className="flex justify-center gap-4 p-4 border-t bg-muted/10">
                    <Button type="submit" size="lg" className="w-32" isLoading={isLoading}><FileText className="mr-2 h-4 w-4" /> Report</Button>
                    <Button type="button" variant="destructive" size="lg" className="w-32" onClick={handleCancel}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
            </CollapsibleSection>
        </form>
    );
}
