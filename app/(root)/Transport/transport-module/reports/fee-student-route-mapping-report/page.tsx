'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    useFeeBusRouteDefaulterreport,
    useFeeClassListDefaulterreport,
    useFeeDefaulterReport,
    useFeeSectionListDefaulterreport
} from '@/hooks/fees/useReports';
import { getStudentRouteMappingReportData } from '@/server/transport/transport-module/reports/fee-student-route-mapping-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileSpreadsheet, Loader2, Printer, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { z } from 'zod';

// Types derived from Angular usage
interface Year {
    asmaY_Id: number;
    asmaY_Year: string;
}

interface ClassItem {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

interface SectionItem {
    asmS_Id: number;
    asmC_SectionName: string;
}

interface RouteItem {
    trmR_Id: number;
    trmR_RouteNo: string;
    trmR_RouteName: string;
}

interface ReportItem {
    studentName: string;
    className: string;
    route_Fee: number;
    pickupLocation: string;
    transportation_Fee: number;
    balance_Amount: number;
    trmR_RouteName: string;
    dropLocation: string;
}

const formSchema = z.object({
    asmaY_Id: z.string().min(1, 'Please Select the Academic Year'),
    asmcL_Id: z.string().min(1, 'Please Select the Class'),
    asmS_Id: z.string().min(1, 'Please Select the Section'),
    trmR_Id: z.string().min(1, 'Please Select Route')
});

export default function FeeStudentRouteMappingReportPage() {
    // Hooks for Dropdowns - Load all data on load
    const { data: academicYearData } = useFeeDefaulterReport();
    const { data: classListResponse } = useFeeClassListDefaulterreport();
    const { data: sectionListResponse } = useFeeSectionListDefaulterreport();
    const { data: routeListResponse } = useFeeBusRouteDefaulterreport();

    const [isGenerating, setIsGenerating] = useState(false);

    // State for Report
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [routeName, setRouteName] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: '',
            trmR_Id: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsGenerating(true);
        setReportData([]);
        setSelectedRows([]);

        const payload = {
            asmaY_Id: Number(values.asmaY_Id),
            ASMCL_Id: Number(values.asmcL_Id),
            ASMS_Id: Number(values.asmS_Id),
            trmR_Id: Number(values.trmR_Id)
        };
        console.log('payload', payload);
        try {
            const res = await getStudentRouteMappingReportData(payload);
            console.log('res', res);
            if (res && res.data && res.data.length > 0) {
                setReportData(res.data);
            } else {
                setReportData([]);
                toast.warning('Record Not Found !!');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch report');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCancel = () => {
        form.reset({
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: '',
            trmR_Id: ''
        });
        setReportData([]);
        setSelectedRows([]);
        setRouteName('');
    };

    // Filter Logic
    const filteredData = reportData.filter(
        (item) =>
            (item.studentName && item.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.className && item.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.pickupLocation && item.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Totals
    const totalRouteFee = filteredData.reduce((sum, item) => sum + (item.route_Fee || 0), 0);
    const totalTransportFee = filteredData.reduce((sum, item) => sum + (item.transportation_Fee || 0), 0);

    // Selection Logic
    const toggleRow = (index: number) => {
        setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === filteredData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredData.map((_, i) => i));
        }
    };

    // Print Logic
    const handlePrint = () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one record to print');
            return;
        }

        const selectedItems = filteredData.filter((_, i) => selectedRows.includes(i));
        const totalRoute = selectedItems.reduce((s, i) => s + (i.route_Fee || 0), 0);
        const totalTrans = selectedItems.reduce((s, i) => s + (i.transportation_Fee || 0), 0);

        const popupWin = window.open('', '_blank', 'width=1000,height=1000');
        if (popupWin) {
            popupWin.document.open();
            popupWin.document.write(`
                <html>
                    <head>
                        <title>Student Route Status Report</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
                            th, td { border: 1px solid black; padding: 8px; text-align: center; }
                            th { background-color: #f2f2f2; font-weight: bold; }
                            h3 { text-align: center; margin-bottom: 20px; }
                            .footer-row { font-weight: bold; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        <center><h3>STUDENT ROUTE MAPPING REPORT</h3></center>
                        <table>
                            <thead>
                                <tr>
                                    <th>SL.NO</th>
                                    <th>Student Name</th>
                                    <th>Class/Section</th>
                                    <th>Route Fee</th>
                                    <th>Route</th>
                                    <th>Transportation Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${selectedItems
                                    .map(
                                        (item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.studentName}</td>
                                        <td>${item.className}</td>
                                        <td>${item.route_Fee}</td>
                                        <td>${item.pickupLocation}</td>
                                        <td>${item.transportation_Fee}</td>
                                    </tr>
                                `
                                    )
                                    .join('')}
                                <tr class="footer-row">
                                    <td colspan="3">Total</td>
                                    <td>${totalRoute}</td>
                                    <td></td>
                                    <td>${totalTrans}</td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
            popupWin.document.close();
        }
    };

    // Export Excel Logic
    const handleExportExcel = () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one record to export');
            return;
        }

        const selectedItems = filteredData.filter((_, i) => selectedRows.includes(i));

        // Prepare data for Excel
        const dataToExport = selectedItems.map((item, index) => ({
            'SL.NO': index + 1,
            'Student Name': item.studentName,
            'Class/Section': item.className,
            'Route Fee': item.route_Fee,
            Route: item.pickupLocation,
            'Transportation Fee': item.transportation_Fee
        }));

        // Add total row
        dataToExport.push({
            'SL.NO': 'Total',
            'Student Name': '',
            'Class/Section': '',
            'Route Fee': selectedItems.reduce((s, i) => s + (i.route_Fee || 0), 0),
            Route: '',
            'Transportation Fee': selectedItems.reduce((s, i) => s + (i.transportation_Fee || 0), 0)
        } as any);

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'RouteReport');
        XLSX.writeFile(wb, `StudentRouteMappingReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // Derived lists from hooks
    const yearList: Year[] = (academicYearData?.data as any) || [];
    const classList: ClassItem[] = (classListResponse?.data as any) || [];
    const sectionList: SectionItem[] = (sectionListResponse?.data as any) || [];
    const routeList: RouteItem[] = (routeListResponse?.data as any) || [];

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <CardTitle className='font-bold text-primary text-xl'>Student Route Status Report</CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {/* Academic Year */}
                                <FormField
                                    control={form.control}
                                    name='asmaY_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Academic Year <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {yearList.map((year) => (
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

                                {/* Class */}
                                <FormField
                                    control={form.control}
                                    name='asmcL_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Class Name <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {classList.map((cls) => (
                                                        <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                            {cls.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Section */}
                                <FormField
                                    control={form.control}
                                    name='asmS_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Section Name <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {sectionList.map((sec) => (
                                                        <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                            {sec.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Bus Name (Route) */}
                                <FormField
                                    control={form.control}
                                    name='trmR_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Bus Name <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='--Select--' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* <SelectItem value="0">ALL</SelectItem> */}
                                                    {routeList.map((route) => (
                                                        <SelectItem key={route.trmR_Id} value={route.trmR_Id.toString()}>
                                                            {route.trmR_RouteNo ? `${route.trmR_RouteNo}::` : ''}
                                                            {route.trmR_RouteName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                {reportData.length > 0 && (
                                    <>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleExportExcel}
                                            className='w-40 border-green-600 text-green-600 hover:bg-green-50'>
                                            <FileSpreadsheet className='mr-2 h-4 w-4' />
                                            Export Excel
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handlePrint}
                                            className='w-32 border-primary text-primary hover:bg-primary/10'>
                                            <Printer className='mr-2 h-4 w-4' />
                                            Print
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Report Grid */}
            {reportData.length > 0 && (
                <Card className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                    <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                            <CardTitle className='font-semibold text-lg uppercase'>Student Route Status Report</CardTitle>
                            <div className='relative w-72'>
                                <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='Search...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-8'
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='mb-4 flex gap-4 font-medium text-sm'>
                            <div className='rounded-md border bg-muted/20 p-2'>Total Records: {filteredData.length}</div>
                        </div>

                        <div className='max-h-[600px] overflow-auto rounded-md border'>
                            <Table>
                                <TableHeader className='sticky top-0 bg-primary/10'>
                                    <TableRow>
                                        <TableHead className='w-[50px] text-center'>
                                            <Checkbox
                                                checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className='text-center font-bold'>SL.NO</TableHead>
                                        {/* <TableHead className='font-bold'>{routeName || 'Student Name'}</TableHead> */}
                                        <TableHead className='font-bold'>Student Name</TableHead>
                                        <TableHead className='font-bold'>Class/Section</TableHead>
                                        <TableHead className='font-bold'>Route Fee</TableHead>
                                        <TableHead className='font-bold'>Route</TableHead>
                                        <TableHead className='font-bold'>Transportation Fee</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((item, index) => (
                                        <TableRow key={index} className='hover:bg-muted/50'>
                                            <TableCell className='text-center'>
                                                <Checkbox checked={selectedRows.includes(index)} onCheckedChange={() => toggleRow(index)} />
                                            </TableCell>
                                            <TableCell className='text-center'>{index + 1}</TableCell>
                                            <TableCell>{item.studentName}</TableCell>
                                            <TableCell>{item.className}</TableCell>
                                            <TableCell>{item.route_Fee}</TableCell>
                                            <TableCell>{item.pickupLocation}</TableCell>
                                            <TableCell>{item.transportation_Fee}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredData.length > 0 && (
                                        <TableRow className='bg-muted/20 font-bold'>
                                            <TableCell colSpan={2}></TableCell>
                                            <TableCell colSpan={2} className='text-right'>
                                                Total
                                            </TableCell>
                                            <TableCell>{totalRouteFee}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{totalTransportFee}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
