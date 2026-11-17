'use client';

import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { IMonthEndReportData, MonthEndReportFormSchema, MonthEndReportSchema } from '@/types/sports/reports/month-end-report';
import { useMonthEndReport } from '@/hooks/sports/useMonthEndReport';

interface ReportFormProps {
    setReportData: (data: IMonthEndReportData | null) => void;
    setFormData: (data: MonthEndReportFormSchema | null) => void;
}

export default function ReportForm({ setReportData, setFormData }: ReportFormProps) {
    const { loadData, generateReport } = useMonthEndReport();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<MonthEndReportFormSchema>({
        resolver: zodResolver(MonthEndReportSchema),
        defaultValues: {
            ASMAY_Id: 0,
            month: 0,
            iename: '',
        },
    });

    const onSubmit = (data: MonthEndReportFormSchema) => {
        setFormData(data);
        generateReport.mutate(data, {
            onSuccess: (result) => {
                setReportData(result || null);
                if (result) {
                    toast.success('Report generated successfully!');
                } else {
                    toast.info('No records found.');
                }
            },
            onError: (error) => {
                toast.error('Failed to generate report.');
            },
        });
    };

    const handleClear = () => {
        setValue('ASMAY_Id', 0);
        setValue('month', 0);
        setValue('iename', '');
        setReportData(null);
        setFormData(null);
    };

    return (
        <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold">Sports Month End Report</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Academic Year */}
                    <div className="space-y-2">
                        <Label>Academic Year <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="ASMAY_Id"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? field.value.toString() : ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData.data?.academicYear.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ASMAY_Id && <p className="text-sm font-medium text-destructive">{errors.ASMAY_Id.message}</p>}
                    </div>

                    {/* Month */}
                    <div className="space-y-2">
                        <Label>Month <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="month"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value ? field.value.toString() : ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadData.data?.monthList.map((item) => (
                                            <SelectItem key={item.month} value={item.month.toString()}>
                                                {item.monthname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.month && <p className="text-sm font-medium text-destructive">{errors.month.message}</p>}
                    </div>

                    {/* Implementation Name */}
                    <div className="space-y-2">
                        <Label>Implementation Name</Label>
                        <Controller
                            control={control}
                            name="iename"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Name"
                                />
                            )}
                        />
                        {errors.iename && <p className="text-sm font-medium text-destructive">{errors.iename.message}</p>}
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4 border-t">
                    <Button type="submit" disabled={generateReport.isPending}>
                        {generateReport.isPending ? 'Generating...' : 'Report'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast.info('Excel Export functionality mock')}>
                        Export to Excel
                    </Button>
                    <Button type="button" variant="outline" onClick={() => toast.info('Print functionality mock')}>
                        Print
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleClear}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
