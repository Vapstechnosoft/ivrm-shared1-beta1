'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';

import { saveMonthEndReportData } from '@/server/transport/transport-module/reports/month-end-report';
import type { IMonthEndReportData } from '@/types/transport/transport-module/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    ASMAY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    IVRM_Month_Id: z.coerce.number().min(1, 'Month is required'),
    ieName: z.string().optional()
});

export default function MonthEndReportPage() {
    //const { data: initialData, isLoading: isInitialLoading } = useMonthEndReport();
    const { data: academicYearData } = useAcademicYearDropdown();
    const [reportData, setReportData] = useState<IMonthEndReportData[]>([]);
    const [selectedParams, setSelectedParams] = useState<{
        monthName: string;
        yearName: string;
        ieName: string;
    } | null>(null);
    const [logoPath, setLogoPath] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const currentDate = new Date();

    // Get lists
    const academicYears = (academicYearData?.data || []) as any[];
    const months = [
        { ivrM_Month_Id: 1, ivrM_Month_Name: 'January', Selected: false },
        { ivrM_Month_Id: 2, ivrM_Month_Name: 'February', Selected: false },
        { ivrM_Month_Id: 3, ivrM_Month_Name: 'March', Selected: false },
        { ivrM_Month_Id: 4, ivrM_Month_Name: 'April', Selected: false },
        { ivrM_Month_Id: 5, ivrM_Month_Name: 'May', Selected: false },
        { ivrM_Month_Id: 6, ivrM_Month_Name: 'June', Selected: false },
        { ivrM_Month_Id: 7, ivrM_Month_Name: 'July', Selected: false },
        { ivrM_Month_Id: 8, ivrM_Month_Name: 'August', Selected: false },
        { ivrM_Month_Id: 9, ivrM_Month_Name: 'September', Selected: false },
        { ivrM_Month_Id: 10, ivrM_Month_Name: 'October', Selected: true },
        { ivrM_Month_Id: 11, ivrM_Month_Name: 'November', Selected: false },
        { ivrM_Month_Id: 12, ivrM_Month_Name: 'December', Selected: false }
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ASMAY_Id: 0,
            IVRM_Month_Id: 0,
            ieName: ''
        }
    });

    // Attempt to get logo from localStorage as per legacy code
    useEffect(() => {
        try {
            const admfigsettings = localStorage.getItem('admfigsettings');
            if (admfigsettings) {
                const settings = JSON.parse(admfigsettings);
                if (settings.length > 0 && settings[0].asC_Logo_Path) {
                    setLogoPath(settings[0].asC_Logo_Path);
                }
            }
        } catch (e) {
            console.error('Failed to load logo from settings', e);
        }
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsGenerating(true);
        setReportData([]);
        setSelectedParams(null);

        try {
            const payload = {
                ASMAY_Id: values.ASMAY_Id
            };
            console.log('payload', payload);
            const response = await saveMonthEndReportData(payload);
            console.log('response', response);

            let data: any[] = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                data = response.data;
            }

            if (data.length > 0) {
                setReportData(data);

                // Find names for display
                const yearName = Array.isArray(academicYears)
                    ? academicYears.find((y) => y.asmaY_Id === values.ASMAY_Id)?.asmaY_Year || ''
                    : '';
                const monthName = Array.isArray(months)
                    ? months.find((m) => m.ivrM_Month_Id === values.IVRM_Month_Id)?.ivrM_Month_Name || ''
                    : '';

                setSelectedParams({
                    yearName,
                    monthName,
                    ieName: values.ieName || ''
                });
            } else {
                toast.warning('No Records Found');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCancel = () => {
        form.reset({
            ASMAY_Id: 0,
            IVRM_Month_Id: 0,
            ieName: ''
        });
        setReportData([]);
        setSelectedParams(null);
    };

    const handlePrint = () => {
        if (!selectedParams || reportData.length === 0) return;

        const tableContent = document.getElementById('reportTable');
        const chartContent = document.getElementById('reportChart');
        const footerContent = document.getElementById('reportFooter');

        const printHeader = `
            <div class="header-container">
                <div class="logo-container">
                    ${logoPath ? `<img src="${logoPath}" alt="Logo" class="logo">` : ''}
                </div>
                <div class="school-details">
                    <h1 class="school-name">Tunbridge High School</h1>
                    <p class="address">86/2 Infantry Road, Bangalore, Karnataka, India 560001</p>
                    <p class="email">Mail Id: tunbridgehs@gmail.com</p>
                </div>
            </div>
            <div class="report-title">Transport Module</div>
            <div class="sub-title">${selectedParams.monthName} Month End Report</div>
        `;

        const infoBox = `
            <div class="info-box">
                <div class="info-row">
                    <div class="info-item"><span class="label">Designation:</span> <span class="value">Implementation Engineer</span></div>
                    <div class="info-item"><span class="label">Date:</span> <span class="value">${currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                </div>
                <div class="info-row">
                    <div class="info-item"><span class="label">Name:</span> <span class="value">${selectedParams.ieName || ''}</span></div>
                    <div class="info-item"><span class="label">Academic Year:</span> <span class="value">${selectedParams.yearName}</span></div>
                </div>
            </div>
        `;

        const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
        if (popupWindow) {
            popupWindow.document.open();
            popupWindow.document.write(`
                <html>
                    <head>
                        <title>Transport Month End Report</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; padding: 20px; }
                            .header-container { display: flex; align-items: center; justify-content: center; margin-bottom: 10px; border-bottom: 2px solid #ccc; padding-bottom: 15px; position: relative; }
                            .logo-container { position: absolute; left: 0; top: 0; }
                            .logo { height: 80px; width: auto; }
                            .school-details { text-align: center; width: 100%; }
                            .school-name { font-size: 24px; font-weight: bold; color: #2e57a0; margin: 0; text-transform: capitalize; font-family: sans-serif; }
                            .address, .email { margin: 5px 0; font-size: 12px; }
                            .report-title { text-align: center; font-weight: bold; font-size: 16px; margin-top: 10px; }
                            .sub-title { text-align: center; font-weight: bold; font-size: 14px; margin: 5px 0 20px 0; }
                            
                            .info-box { width: 100%; margin-bottom: 20px; font-size: 14px; border: 1px solid transparent; }
                            .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                            .info-item { width: 48%; display: flex; }
                            .label { font-weight: bold; width: 150px; }
                            .value { flex: 1; border-bottom: 1px dotted #000; }

                            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                            th { border: 1px solid black; padding: 8px; text-align: left; font-weight: bold; background-color: #fff; }
                            td { border: 1px solid black; padding: 8px; }
                            .text-center { text-align: center; }
                            .text-right { text-align: right; }
                            
                            .chart-section { margin-top: 30px; page-break-inside: avoid; }
                            .footer-section { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-size: 12px; }
                            .footer-item { margin-bottom: 30px; }
                            .footer-line { border-bottom: 1px solid black; margin-bottom: 5px; width: 80%; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${printHeader}
                        ${infoBox}
                        ${tableContent ? tableContent.outerHTML : ''}
                        <div class="chart-section">
                            <h3 style="text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase;">GRAPHICAL ANALYSIS OF TRANSPORT MONTH END REPORT</h3>
                            ${chartContent ? chartContent.innerHTML : ''}
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
    };

    // if (isInitialLoading) {
    //     return (
    //         <div className='flex h-screen items-center justify-center'>
    //             <Loader2 className='h-8 w-8 animate-spin text-primary' />
    //         </div>
    //     );
    // }

    const totalStudents = reportData.reduce((acc, curr) => acc + curr.stdCnt, 0);

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='font-bold text-primary text-xl'>Transport Month End Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {/* Academic Year */}
                                <FormField
                                    control={form.control}
                                    name='ASMAY_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Academic Year <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                value={field.value !== 0 ? field.value.toString() : undefined}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {academicYears.map((year) => (
                                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                            {year.asmaY_Year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Month */}
                                <FormField
                                    control={form.control}
                                    name='IVRM_Month_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Month <span className='text-destructive'>*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                value={field.value !== 0 ? field.value.toString() : undefined}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Month' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {months.map((month) => (
                                                        <SelectItem key={month.ivrM_Month_Id} value={month.ivrM_Month_Id.toString()}>
                                                            {month.ivrM_Month_Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Implementation Name */}
                                <FormField
                                    control={form.control}
                                    name='ieName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Implementation Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Enter Implementation Name' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='flex justify-center gap-4 border-t pt-4'>
                                <Button type='submit' disabled={isGenerating} className='min-w-32'>
                                    {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    {isGenerating ? 'Generating...' : 'Report'}
                                </Button>

                                <Button type='button' variant='outline' onClick={handleCancel} className='min-w-32'>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handlePrint}
                                    disabled={reportData.length === 0}
                                    className='w-32 border-primary text-primary hover:bg-primary/10'>
                                    <Printer className='mr-2 h-4 w-4' />
                                    Print
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {reportData.length > 0 && selectedParams && (
                <div id='printSectionId'>
                    <Card className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                        <CardHeader className='pb-2 text-center'>
                            <div className='mb-2 flex hidden w-full items-center justify-center print:flex'>
                                {logoPath && <img src={logoPath} alt='Institution Logo' className='h-24 w-auto object-contain' />}
                            </div>
                            <h3 className='font-bold text-xl uppercase tracking-wide'>Transport Module</h3>
                            <h4 className='font-semibold text-lg text-primary'>{selectedParams.monthName} Month End Report</h4>
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
                                            <span>{selectedParams.ieName || '-'}</span>
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
                                            <span>{selectedParams.yearName}</span>
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
                                            <TableHead className='font-bold'>Route Name</TableHead>
                                            <TableHead className='text-center font-bold'>Student Count</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item, index) => (
                                            <TableRow key={index} className='hover:bg-muted/50'>
                                                <TableCell className='text-center'>{index + 1}</TableCell>
                                                <TableCell className='font-medium'>{item.trmR_RouteName}</TableCell>
                                                <TableCell className='text-center font-semibold'>{item.stdCnt}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className='bg-muted font-bold'>
                                            <TableCell colSpan={2} className='text-right'>
                                                Total
                                            </TableCell>
                                            <TableCell className='text-center'>{totalStudents}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Chart */}
                            <div className='border-t pt-6' id='reportChart'>
                                <h3 className='mb-6 text-center font-semibold text-lg uppercase'>Graphical Analysis</h3>
                                <div className='h-[350px] w-full'>
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                            <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                            <XAxis
                                                dataKey='trmR_RouteName'
                                                angle={-45}
                                                textAnchor='end'
                                                height={80}
                                                interval={0}
                                                tick={{ fontSize: 12 }}
                                            />
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
                                            <Bar dataKey='stdCnt' name='Student Count' fill='#3b82f6' radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Footer Signatures for Preview */}
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
