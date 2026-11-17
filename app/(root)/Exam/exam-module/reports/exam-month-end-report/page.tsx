'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMasterOrderedExamDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { type ExamMonthEndReportFormValues, examMonthEndReportSchema } from '@/schemas/exam/exam-module/reports';
import { getInitialData, getReportData } from '@/server/exam/exam-module/reports/exam-month-end-report';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import type { IMasterInstitution, Institution } from '@/types/exam/exam-module/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Printer, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

export default function ExamMonthEndReportPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [monthList, setMonthList] = useState<any[]>([]);
    const [reportData, setReportData] = useState<any[] | null>(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [institution, setInstitution] = useState<IMasterInstitution | Institution | null>(null);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const { data: examData, isLoading: examDataLoading, error: examDataError } = useMasterOrderedExamDropdownList();
    const printRef = useRef<HTMLDivElement>(null);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ExamMonthEndReportFormValues>({
        resolver: zodResolver(examMonthEndReportSchema),
        defaultValues: {
            radiodata: 'All',
            iename: '',
            ASMAY_Id: undefined,
            IVRM_Month_Id: '',
            EME_Id: ''
        }
    });
    useEffect(() => {
        if (reportData && printRef.current) {
            printRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [reportData]);
    // Check for empty data and show toast
    useEffect(() => {
        if (!academicYearLoading && academicYear?.data && academicYear.data.length === 0) {
            toast.info('No Academic Years found');
        }
    }, [academicYear, academicYearLoading]);

    useEffect(() => {
        if (!examDataLoading && examData?.data && examData.data.length === 0) {
            toast.info('No Exams found');
        }
    }, [examData, examDataLoading]);

    const ienameValue = watch('iename');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [data, institutionRes] = await Promise.all([
                    getInitialData(),
                    getMasterInstitution()
                ]);

                setMonthList(data.monthlist);
                if (data.monthlist && data.monthlist.length === 0) {
                    toast.info('No Months found');
                }

                if (institutionRes?.success) {
                    setInstitution(institutionRes.data);
                }
            } catch (error) {
                console.error('Error fetching initial data', error);
                toast.error('Failed to load initial data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [reset]);

    const onSubmit = async (data: ExamMonthEndReportFormValues) => {
        try {
            console.log('Month End Report payload:', data);
            const response = await getReportData(data);
            const safeReportData = Array.isArray(response.data) ? response.data : [];
            // Set report table data
            setReportData(safeReportData);

            if (safeReportData.length === 0) {
                toast.info('No data found for the selected criteria');
                return;
            }

            // Resolve Academic Year name
            const year = academicYear?.data?.find((i: any) => String(i.asmaY_Id) === String(data.ASMAY_Id))?.asmaY_Year ?? '';

            // Resolve Month name
            const month = monthList?.find((i: any) => String(i.ivrM_Month_Id) === String(data.IVRM_Month_Id))?.ivrM_Month_Name ?? '';

            // Resolve Exam name
            const exam = examData?.data?.find((i: any) => String(i.emE_Id) === String(data.EME_Id))?.emE_ExamName ?? '';

            // Set display values
            setSelectedYear(year);
            setSelectedMonth(month);
            setSelectedExam(exam);
        } catch (error) {
            console.error('Error fetching report', error);
            toast.error('Failed to generate report');
            setReportData([]);
        }
    };

    const handlePrint = () => {
        const tableContent = document.getElementById('reportTable');
        const chartContent = document.getElementById('reportChart');
        const footerContent = document.getElementById('reportFooter');

        // Construct Header
        const printHeader = `
            <div class="header-container">
                <div class="logo-container">
                    <img src="${institution?.mI_Logo || '/assets/tunbridge_logo.png'}" alt="${institution?.mI_Name || 'Logo'}" class="logo">
                </div>
                <div class="school-details">
                    <h1 class="school-name">${institution?.mI_Name || 'Tunbridge High School'}</h1>
                    <p class="address">${(institution as Institution)?.mI_Address1 || '86/2 Infantry Road, Bangalore, Karnataka, India 560001'}</p>
                    <p class="email">Mail Id: ${(institution as Institution)?.mI_SMSAlertToemailids || 'tunbridgehs@gmail.com'}</p>
                </div>
            </div>
            <div class="report-title">Exam Module</div>
            <div class="sub-title">Unit Test 1 February Month End Report</div>
        `;

        // Construct Info Box
        const infoBox = `
            <div class="info-box">
                <div class="info-row">
                    <div class="info-item"><span class="label">Designation:</span> <span class="value">Implementation Engineer</span></div>
                    <div class="info-item"><span class="label">Date:</span> <span class="value">${currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                </div>
                <div class="info-row">
                    <div class="info-item"><span class="label">Name:</span> <span class="value">${ienameValue || ''}</span></div>
                    <div class="info-item"><span class="label">Academic Year:</span> <span class="value">${selectedYear}</span></div>
                </div>
            </div>
        `;

        if (tableContent) {
            const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
            if (popupWindow) {
                popupWindow.document.open();
                popupWindow.document.write(`
                    <html>
                        <head>
                            <title>Exam Month End Report</title>
                            <style>
                                @page { size: A4; margin: 10mm; }
                                body { font-family: 'Times New Roman', serif; padding: 0; margin: 0; transform: scale(0.85); transform-origin: top center; width: 117%; } /* Scaled to 0.85 + width compensation (100/0.85 ≈ 117%) */
                                .header-container { display: flex; align-items: center; justify-content: center; margin-bottom: 5px; border-bottom: 2px solid #ccc; padding-bottom: 5px; position: relative; }
                                .logo-container { position: absolute; left: 0; top: 0; }
                                .logo { height: 80px; width: auto; }
                                .school-details { text-align: center; width: 100%; }
                                .school-name { font-size: 24px; font-weight: bold; color: #2e57a0; margin: 0; text-transform: capitalize; font-family: sans-serif; }
                                .address, .email { margin: 2px 0; font-size: 12px; }
                                .report-title { text-align: center; font-weight: bold; font-size: 14px; margin-top: 5px; }
                                .sub-title { text-align: center; font-weight: bold; font-size: 12px; margin: 2px 0 10px 0; }
                                
                                .info-box { width: 100%; margin-bottom: 10px; font-size: 12px; border: 1px solid transparent; }
                                .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
                                .info-item { width: 48%; display: flex; }
                                .label { font-weight: bold; width: 120px; }
                                .value { flex: 1; border-bottom: 1px dotted #000; }

                                table { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px; }
                                th { border: 1px solid black; padding: 4px; text-align: left; font-weight: bold; background-color: #fff; }
                                td { border: 1px solid black; padding: 4px; }
                                .text-center { text-align: center; }
                                .text-green-600 { color: #16a34a !important; -webkit-print-color-adjust: exact; }
                                .text-destructive { color: #dc2626 !important; -webkit-print-color-adjust: exact; }
                                
                                .chart-section { margin-top: 10px; page-break-inside: avoid; height: 300px; overflow: hidden; }
                                .chart-section h3 { margin-bottom: 5px !important; font-size: 12px !important; }
                                .footer-section { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 10px; page-break-inside: avoid; }
                                .footer-item { margin-bottom: 10px; }
                                .footer-line { border-bottom: 1px solid black; margin-bottom: 2px; width: 80%; }
                            </style>
                        </head>
                        <body onload="window.print(); window.close();">
                            ${printHeader}
                            ${infoBox}
                            ${tableContent.outerHTML}
                            <div class="chart-section">
                                <h3 style="text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase;">GRAPHICAL ANALYSIS OF EXAM MONTH END REPORT</h3>
                                ${chartContent ? chartContent.innerHTML : ''} 
                                <!-- Note: Recharts SVG structure usually transfers well via innerHTML if styles are inline -->
                            </div>
                            <div class="footer-section">
                                <div class="footer-item">
                                    <div class="footer-line"></div>
                                    <div>Implementation Engineer:</div>
                                </div>
                                <div class="footer-item" style="text-align: right;">
                                    <div style="display: flex; justify-content: flex-end;">
                                         <div style="border-bottom: 1px solid black; width: 80%; text-align: left;">${currentDate.toLocaleDateString('en-GB')}</div>
                                    </div>
                                    <div style="margin-top: 5px;">Date</div>
                                </div>
                                <div class="footer-item">
                                    <div class="footer-line"></div>
                                    <div>End User:</div>
                                </div>
                                <div class="footer-item">
                                    <div class="footer-line"></div>
                                    <div>Nodal Officer:<br>Seal</div>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
                popupWindow.document.close();
            }
        }
    };

    const handleCancel = () => {
        reset({
            radiodata: 'All',
            iename: '',
            ASMAY_Id: '',
            IVRM_Month_Id: '',
            EME_Id: ''
        });
        setReportData(null);
    };

    const currentDate = new Date();

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        );
    }


    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='font-bold text-primary text-xl'>Exam Month End Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Radio Group */}
                        <div className='mb-6 flex justify-center'>
                            <div className='rounded-lg bg-muted/50 p-4'>
                                <Controller
                                    name='radiodata'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            className='flex space-x-6'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='All' id='r1' />
                                                <Label htmlFor='r1' className='cursor-pointer font-medium'>
                                                    ALL
                                                </Label>
                                            </div>
                                            {/* 
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="MALE" id="r2" />
                                                <Label htmlFor="r2">MALE</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FEMALE" id="r3" />
                                                <Label htmlFor="r3">FEMALE</Label>
                                            </div> 
                                            */}
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {/* Academic Year */}
                            <div className='space-y-2'>
                                <Label htmlFor='ASMAY_Id'>
                                    Academic Year <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='ASMAY_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} onValueChange={field.onChange} value={field.value ?? undefined}>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={academicYearLoading ? 'Loading Academic Year...' : 'Select Academic Year'}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYearLoading ? (
                                                    <SelectItem value='0' disabled>
                                                        Academic Years are loading...
                                                    </SelectItem>
                                                ) : academicYear?.data?.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Academic Years found
                                                    </SelectItem>
                                                ) : (
                                                    academicYear?.data?.map((item) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.ASMAY_Id && <p className='text-destructive text-sm'>{errors.ASMAY_Id.message}</p>}
                            </div>

                            {/* Month */}
                            <div className='space-y-2'>
                                <Label htmlFor='IVRM_Month_Id'>
                                    Month <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='IVRM_Month_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.IVRM_Month_Id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder='Select Month' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {monthList.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Months found
                                                    </SelectItem>
                                                ) : (
                                                    monthList.map((item: any) => (
                                                        <SelectItem key={item.ivrM_Month_Id} value={String(item.ivrM_Month_Id)}>
                                                            {item.ivrM_Month_Name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.IVRM_Month_Id && <p className='text-destructive text-sm'>{errors.IVRM_Month_Id.message}</p>}
                            </div>

                            {/* Exam */}
                            <div className='space-y-2'>
                                <Label htmlFor='EME_Id'>
                                    Exam <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='EME_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.EME_Id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder='Select Exam' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {examDataLoading ? (
                                                    <SelectItem value='0' disabled>
                                                        Exams are loading...
                                                    </SelectItem>
                                                ) : examData?.data?.length === 0 ? (
                                                    <SelectItem value='0' disabled>
                                                        No Exams found
                                                    </SelectItem>
                                                ) : (
                                                    examData?.data?.map((item: { emE_Id: number; emE_ExamName: string }) => (
                                                        <SelectItem key={item.emE_Id} value={String(item.emE_Id)}>
                                                            {item.emE_ExamName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.EME_Id && <p className='text-destructive text-sm'>{errors.EME_Id.message}</p>}
                            </div>

                            {/* Implementation Name */}
                            <div className='space-y-2'>
                                <Label htmlFor='iename'>Implementation Name</Label>
                                <Input
                                    {...register('iename')}
                                    className={errors.iename ? 'border-destructive' : ''}
                                    placeholder='Enter Name'
                                />
                                {errors.iename && <p className='text-destructive text-sm'>{errors.iename.message}</p>}
                            </div>
                        </div>

                        <div className='flex justify-center gap-4 border-t pt-4'>
                            <Button type='submit' disabled={isSubmitting} className='w-32 bg-primary hover:bg-primary/90'>
                                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Check className='mr-2 h-4 w-4' />}
                                Report
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleCancel} className='w-32'>
                                <X className='mr-2 h-4 w-4' />
                                Cancel
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handlePrint}
                                className='w-32 border-primary text-primary hover:bg-primary/10'>
                                <Printer className='mr-2 h-4 w-4' />
                                Print
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {reportData && reportData.length > 0 && (
                <div id='printSectionId' ref={printRef}>
                    <Card className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                        <CardHeader className='pb-2 text-center'>
                            <div className='mb-2 flex w-full items-center justify-center print:flex'>
                                <img
                                    src={institution?.mI_Logo || '/assets/tunbridge_logo.png'}
                                    alt={institution?.mI_Name || 'Institution Logo'}
                                    className='h-24 w-auto object-contain'
                                />
                            </div>
                            <h3 className='font-bold text-xl uppercase tracking-wide'>Exam Module</h3>
                            <h4 className='font-semibold text-lg text-primary'>
                                {selectedExam} {selectedMonth} Month End Report
                            </h4>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Report Header Details */}
                            <div className='rounded-md border bg-muted/30 p-4 text-sm'>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <div className='flex'>
                                            <span className='w-32 font-semibold'>Designation:</span>
                                            <span>Implementation Engineer</span>
                                        </div>
                                        <div className='flex'>
                                            <span className='w-32 font-semibold'>Name:</span>
                                            <span>{ienameValue || '-'}</span>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='flex'>
                                            <span className='w-32 font-semibold'>Date:</span>
                                            <span>
                                                {currentDate.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className='flex'>
                                            <span className='w-32 font-semibold'>Academic Year:</span>
                                            <span>{selectedYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className='overflow-hidden rounded-md border'>
                                <Table id='reportTable'>
                                    <TableHeader className='bg-primary/10'>
                                        <TableRow>
                                            <TableHead className='w-[80px] text-center font-bold'>Sl No.</TableHead>
                                            <TableHead className='font-bold'>Class Name</TableHead>
                                            <TableHead className='text-center font-bold'>Pass</TableHead>
                                            <TableHead className='text-center font-bold'>Scored Below Minimum Marks</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item: any, index: number) => (
                                            <TableRow key={index} className='hover:bg-muted/50'>
                                                <TableCell className='text-center'>{index + 1}</TableCell>
                                                <TableCell className='font-medium'>{item.class}</TableCell>
                                                <TableCell className='text-center font-semibold text-green-600'>{item.pass}</TableCell>
                                                <TableCell className='text-center font-semibold text-destructive'>{item.fail}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Chart */}
                            <div className='border-t pt-6' id='reportChart'>
                                <h3 className='mb-6 text-center font-semibold text-lg uppercase'>Graphical Analysis</h3>
                                <div className='h-[350px] w-full'>
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                            <XAxis dataKey='class' />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                cursor={{ fill: 'transparent' }}
                                            />
                                            <Legend />
                                            <Bar dataKey='pass' name='PASS' fill='#16a34a' radius={[4, 4, 0, 0]} barSize={40} />
                                            <Bar dataKey='fail' name='FAIL' fill='#dc2626' radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Footer Signatures */}
                            <div className='mt-8 grid grid-cols-2 gap-8 pt-12' id='reportFooter'>
                                <div className='space-y-8'>
                                    <div className='w-2/3 border-black/50 border-b' />
                                    <div className='font-medium text-sm'>Implementation Engineer</div>
                                </div>
                                <div className='space-y-8'>
                                    <div className='ml-auto w-2/3 border-black/50 border-b' />
                                    <div className='text-right font-medium text-sm'>Nodal Officer</div>
                                </div>
                                <div className='space-y-8'>
                                    <div className='w-2/3 border-black/50 border-b' />
                                    <div className='font-medium text-sm'>End User</div>
                                </div>
                                <div className='space-y-8'>
                                    <div className='ml-auto w-2/3 border-black/50 border-b' />
                                    <div className='text-right font-medium text-sm'>Seal</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
