// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import { useStudentClassDropDown } from '@/hooks/fees/useMasters';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { coeMonthEndReportSchema } from '@/schemas/coe/master';
import { getCoeMonthEndReport } from '@/server/coe/masters/report';
import { zodResolver } from '@hookform/resolvers/zod';
import xlsx, { IJsonSheet } from 'json-as-xlsx';
import { Loader2, Printer, FileSpreadsheet } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof coeMonthEndReportSchema.addOrUpdate>;

export default function CoeMonthEndReport() {
    const componentRef = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');

    const {
        handleSubmit,
        reset,
        control,
        register,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(coeMonthEndReportSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined,
            month: undefined
        }
    });

    const ieName = watch('ieName');

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    // const { data: feeclassData, isLoading: feeclassDataLoading } = useStudentClassDropDown(true);

    const handleReset = () => {
        reset();
        setReportData(null);
        setSelectedYear('');
        setSelectedMonth('');
    };

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'COE_Month_End_Report',
    // });

    const handleExport = () => {
        if (!reportData) return;

        const data = [
            {
                sheet: 'COE Report',
                columns: [
                    { label: 'SL.NO', value: 'slNo' },
                    { label: 'COE', value: 'coe' },
                    { label: 'Count', value: 'count' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Email', value: 'email' },
                ],
                content: [
                    {
                        slNo: 1,
                        coe: 'Student & Staff',
                        count: reportData.totalCount || 0,
                        sms: reportData.smsCount || 0,
                        email: reportData.emailCount || 0,
                    },
                ],
            },
        ] as IJsonSheet[];

        const settings = {
            fileName: 'COE_Month_End_Report',
            extraLength: 3,
            writeMode: 'writeFile',
            writeOptions: {},
            RTL: false,
        };

        xlsx(data, settings);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setReportData(null);
        try {
            if (!data.month) {
                toast.error('Month is required');
                return;
            }
            const payload = {
                month: data.month ?? '',
                year: data.asmaY_Id ?? 0
            };

            const selectedYearObj = academicYearData?.data?.find((y: any) => y.asmaY_Id === data.asmaY_Id);
            setSelectedYear(selectedYearObj?.asmaY_Year || '');

            const selectedMonthObj = months.find((m) => m.value === data.month);
            setSelectedMonth(selectedMonthObj?.label || '');

            const response = await getCoeMonthEndReport(payload);

            if (response.data && response.data.length > 0) {

                setReportData(response.data[0] || response.data);
                toast.success('Report fetched successfully');
            } else {
                setReportData(null);
                toast.error('No data found');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const today = new Date();

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='flex flex-col items-center justify-center space-y-6 p-6'>
                            {/* Academic Year */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label htmlFor='asmaY_Id' className='whitespace-nowrap font-semibold'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmaY_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='--Select Academic Year--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingYears ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
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
                            </div>
                            {errors.asmaY_Id && (
                                <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                    <div className='w-[145px]'> </div>
                                    <FormError>{errors.asmaY_Id.message}</FormError>
                                </div>
                            )}

                            {/* Month Selection */}
                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label htmlFor='month' className='whitespace-nowrap font-semibold'>
                                    Month <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='month'
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value || 'empty'} onValueChange={field.onChange} value={field.value || ''}>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='Select Month' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months?.map((item) => (
                                                    <SelectItem key={item.value} value={String(item.value)}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className='flex w-full max-w-md items-center justify-between gap-4'>
                                <Label htmlFor='ieName' className='whitespace-nowrap font-semibold'>
                                    IE Name
                                </Label>
                                <InputText
                                    id='ieName'
                                    placeholder='Enter Name'
                                    {...register('ieName')}
                                    error={errors.ieName?.message}
                                    className='transition-colors focus:ring-2 focus:ring-primary/20 w-64'
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='flex w-full max-w-md justify-center gap-4 pt-4'>
                                <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Report'}
                                </Button>
                                <Button type='button' variant='destructive' onClick={handleReset} className='min-w-[120px]'>
                                    Clear
                                </Button>
                                {/* {reportData && (
                                    <>
                                        <Button type='button' onClick={handleExport} className='min-w-[120px] bg-green-600 hover:bg-green-700'>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export
                                        </Button>
                                        <Button type='button' onClick={handlePrint} className='min-w-[120px] bg-blue-600 hover:bg-blue-700'>
                                            <Printer className="mr-2 h-4 w-4" /> Print
                                        </Button>
                                    </>
                                )} */}
                            </div>
                        </div>
                    </Card>

                    {/* Report Content */}
                    {reportData && (
                        <Card className='mt-8 border-0 shadow-xl p-8' ref={componentRef}>
                            <div className="flex flex-col gap-6">
                                {/* Header */}
                                <div className="text-center space-y-2">
                                    <div className="flex justify-center mb-4">
                                        {/* Placeholder for Logo - replace with actual logo path if known, or generic */}
                                        <div className="h-20 w-20 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src="/assets/images/baldwin-logo.png"
                                                alt="Baldwin Logo"
                                                className="object-contain h-full w-full"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase underline decoration-2 underline-offset-4">COE Report</h2>
                                    <div className="border border-black p-2 mt-2 inline-block min-w-[300px]">
                                        <h3 className="font-semibold uppercase">COE {selectedMonth} MONTH REPORT</h3>
                                    </div>
                                </div>

                                {/* Info Table */}
                                <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto w-full">
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-semibold">Name:</span>
                                        <span>{ieName || reportData.ieName || '_________________'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-semibold">Date:</span>
                                        <span>{today.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-semibold">Designation:</span>
                                        <span>{reportData.designation || '_________________'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1">
                                        <span className="font-semibold">Academic Year:</span>
                                        <span>{selectedYear}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-1 col-span-2">
                                        <span className="font-semibold">Module:</span>
                                        <span>COE</span>
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="mt-6">
                                    <table className="w-full border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-black p-2 text-center">SL.NO</th>
                                                <th className="border border-black p-2 text-center">COE</th>
                                                <th className="border border-black p-2 text-center">Count</th>
                                                <th className="border border-black p-2 text-center">SMS</th>
                                                <th className="border border-black p-2 text-center">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-black p-2 text-center">1</td>
                                                <td className="border border-black p-2 text-center">{reportData.coemE_EventName}</td>
                                                <td className="border border-black p-2 text-center">{reportData.totalCount || 0}</td>
                                                <td className="border border-black p-2 text-center">{reportData.smsCount || 0}</td>
                                                <td className="border border-black p-2 text-center">{reportData.emailCount || 0}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Signatures */}
                                <div className="mt-16 space-y-12">
                                    <div className="flex justify-between px-12">
                                        <div className="text-left">Implementation Engineer: ________________</div>
                                        <div className="text-right">Nodal Officer: ________________</div>
                                    </div>
                                    <div className="flex justify-between px-12">
                                        <div className="text-left">End User: ________________</div>
                                        <div className="text-right">Seal: ________________</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </form>
        </div>
    );
}
