'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { deputationReportSchema } from '@/schemas/timetable/reports';
import { getDeputationReportDetails, getDeputationReportLoadData } from '@/server/timetable/reports/deputationreport';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, FileDown, Printer, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import * as XLSX from 'xlsx';
import CountReportTable from './count-report-table';
import DetailsReportTable from './details-report-table';

type FormValues = z.infer<typeof deputationReportSchema.search>;

export default function DeputationReportForm() {
    const [academicList, setAcademicList] = useState<any[]>([]);
    const [reportData, setReportData] = useState<any[]>([]);
    const [reportType, setReportType] = useState<'D' | 'C' | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(deputationReportSchema.search),
        defaultValues: {
            flag: 'D'
        }
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = form;

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await getDeputationReportLoadData();
                if (res.acdlist && Array.isArray(res.acdlist)) {
                    setAcademicList(res.acdlist);
                    if (res.acdlist.length > 0) {
                        setValue('asmaY_Id', res.acdlist[0].asmaY_Id);
                    }
                } else {
                    setAcademicList([]);
                }
            } catch (error) {
                //console.error("Error fetching initial data", error);
                //toast.error("Failed to load initial data");
            }
        };
        fetchInitialData();
    }, [setValue]);

    const onSubmit = async (data: FormValues) => {
        try {
            const payload = {
                ASMAY_ID: data.asmaY_Id,
                fromdate: format(data.fromdate, 'yyyy-MM-dd'),
                todate: format(data.todate, 'yyyy-MM-dd'),
                flag: data.flag
            };
            const res = await getDeputationReportDetails(payload);
            if (res.reportdatelist && Array.isArray(res.reportdatelist) && res.reportdatelist.length > 0) {
                setReportData(res.reportdatelist);
                setReportType(data.flag as 'D' | 'C');
            } else {
                setReportData([]);
                setReportType(null);
                toast.warning('No records found');
            }
        } catch (error) {
            //console.error("Error fetching report", error);
            //toast.error("Failed to fetch report");
        }
    };

    const clearData = () => {
        reset({
            flag: 'D',
            asmaY_Id: academicList.length > 0 ? academicList[0].asmaY_Id : undefined
        });
        setReportData([]);
        setReportType(null);
    };

    const exportToExcel = () => {
        if (reportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Deputation Report');
        XLSX.writeFile(workbook, `Deputation_Report_${reportType === 'D' ? 'Details' : 'Count'}.xlsx`);
    };

    const printReport = () => {
        if (reportData.length === 0) return;
        window.print();
    };

    return (
        <div className='container space-y-4 p-1'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label>
                            Academic Year <span className='text-red-500'>*</span>
                        </Label>
                        <Controller
                            control={control}
                            name='asmaY_Id'
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicList.map((item) => (
                                            <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.asmaY_Id && <span className='text-red-500 text-sm'>{errors.asmaY_Id.message}</span>}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col space-y-2'>
                            <Label>
                                From Date <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='fromdate'
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.fromdate && <span className='text-red-500 text-sm'>{errors.fromdate.message}</span>}
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <Label>
                                To Date <span className='text-red-500'>*</span>
                            </Label>
                            <Controller
                                control={control}
                                name='todate'
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.todate && <span className='text-red-500 text-sm'>{errors.todate.message}</span>}
                        </div>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className='space-y-3'>
                        <Controller
                            control={control}
                            name='flag'
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className='flex flex-row space-x-6 rounded-md border bg-muted/20 p-4'>
                                    <div className='flex items-center space-x-3 space-y-0'>
                                        <RadioGroupItem value='D' id='r1' />
                                        <Label htmlFor='r1' className='cursor-pointer font-normal'>
                                            DETAILS
                                        </Label>
                                    </div>
                                    <div className='flex items-center space-x-3 space-y-0'>
                                        <RadioGroupItem value='C' id='r2' />
                                        <Label htmlFor='r2' className='cursor-pointer font-normal'>
                                            COUNT
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.flag && <span className='text-red-500 text-sm'>{errors.flag.message}</span>}
                    </div>
                </div>

                <div className='flex justify-center gap-4'>
                    <Button type='submit' disabled={isSubmitting}>
                        <Search className='mr-2 h-4 w-4' />
                        Report
                    </Button>
                    <Button type='button' variant='destructive' onClick={clearData}>
                        <X className='mr-2 h-4 w-4' />
                        Clear
                    </Button>
                    {reportData.length > 0 && (
                        <>
                            <Button
                                type='button'
                                variant='outline'
                                className='bg-green-600 text-white hover:bg-green-700 hover:text-white'
                                onClick={exportToExcel}>
                                <FileDown className='mr-2 h-4 w-4' />
                                Export to Excel
                            </Button>
                            <Button type='button' variant='secondary' onClick={printReport}>
                                <Printer className='mr-2 h-4 w-4' />
                                Print
                            </Button>
                        </>
                    )}
                </div>
            </form>

            {reportData.length > 0 && (
                <div className='mt-8 rounded-md border bg-background p-4'>
                    {/* Print Header - Hidden by default, shown in print media */}
                    <div className='mb-4 hidden text-center print:block'>
                        <h3 className='font-bold text-xl'>Deputation {reportType === 'D' ? 'Details' : 'Count'} Report</h3>
                    </div>

                    {reportType === 'D' && <DetailsReportTable data={reportData} />}
                    {reportType === 'C' && <CountReportTable data={reportData} />}
                </div>
            )}
        </div>
    );
}
