'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    useFeeBusRouteDefaulterreport,
    useFeeClassListDefaulterreport,
    useFeeDefaulterReport,
    useFeeGroupDefaulterreport,
    useFeeSectionListDefaulterreport
} from '@/hooks/fees/useReports';
import { useSessionDropDown } from '@/hooks/transport/transportmodule/usetransaction';
import { StudentRouteMappingReportData } from '@/server/transport/transport-module/reports/fee-student-route-mapping-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileSpreadsheet, Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { z } from 'zod';

const formSchema = z.object({
    asmaY_Id: z.string().min(1, 'Academic Year is required'),
    asmcL_Id: z.string().min(1, 'Class is required'),
    asmS_Id: z.string().min(1, 'Section is required'),
    trmR_Id: z.string().min(1, 'Route is required'),
    TRMS_Id: z.string().min(1, 'Session is required'),
    feeGroupWise: z.boolean().default(false),
    FMG_Id: z.string().optional(),
    routeType: z.enum(['0', '1', '2', '3']).default('0') // 0: ALL, 1: TWO WAY, 2: ONE WAY - PICK UP, 3: ONE WAY - DROP
});

export default function StudentRouteMappingReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [installments, setInstallments] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [feeGroupWise, setFeeGroupWise] = useState(false);

    // Hooks for dropdown data
    const { data: yearsResponse } = useFeeDefaulterReport();
    const { data: classesResponse } = useFeeClassListDefaulterreport();
    const { data: sectionsResponse } = useFeeSectionListDefaulterreport();
    const { data: routesResponse } = useFeeBusRouteDefaulterreport();
    const { data: sessionsResponse } = useSessionDropDown();
    const { data: feeGroupsResponse } = useFeeGroupDefaulterreport();

    const years = yearsResponse?.data || [];
    const classes = classesResponse?.data || [];
    const sections = sectionsResponse?.data || [];
    const routes = routesResponse?.data || [];
    const sessions = sessionsResponse?.data || [];
    const feeGroups = feeGroupsResponse?.data || [];

    const { mutate: generateReport, isPending: isGenerating } = useMutation({
        mutationFn: StudentRouteMappingReportData,
        onSuccess: (response: any) => {
            console.log('Report Response:', response); // Keep for debugging data structure
            if (response.success) {
                if (response.data && response.data.length > 0) {
                    setReportData(response.data);
                    setInstallments(response.data.countlist || []);
                    setSelectedRows([]);
                    toast.success(response.message || 'Report generated successfully');
                } else {
                    setReportData([]);
                    setInstallments([]);
                    toast.error(response.message || 'No records found');
                }
            } else {
                setReportData([]);
                setInstallments([]);
                toast.error(response.message || 'Failed to generate report');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to generate report');
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: '',
            trmR_Id: '',
            TRMS_Id: '',
            feeGroupWise: false,
            FMG_Id: '0',
            routeType: '0'
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.feeGroupWise && (!values.FMG_Id || values.FMG_Id === '0')) {
            toast.error('Please select Fee Group');
            return;
        }

        const payload = {
            asmaY_Id: Number(values.asmaY_Id),
            trmR_Id: Number(values.trmR_Id),
            ASMCL_Id: Number(values.asmcL_Id),
            ASMS_Id: Number(values.asmS_Id),
            TRMS_Id: Number(values.TRMS_Id),
            ASTA_ApplStatus: values.routeType,
            feeflag: values.feeGroupWise,
            FMG_Id: values.feeGroupWise ? Number(values.FMG_Id) : 0
        };

        console.log('Report Payload:', payload);
        generateReport(payload);
    };

    const handleReset = () => {
        form.reset({
            asmaY_Id: '',
            asmcL_Id: '',
            asmS_Id: '',
            trmR_Id: '',
            TRMS_Id: '',
            feeGroupWise: false,
            FMG_Id: '0',
            routeType: '0'
        });
        setFeeGroupWise(false);
        setReportData([]);
        setInstallments([]);
        setSelectedRows([]);
    };

    const toggleRow = (index: number) => {
        setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === reportData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(reportData.map((_, i) => i));
        }
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one record to print');
            return;
        }

        const tableHeaderRow = document.querySelector('#report-table thead tr');
        let headerHtml = '';
        if (tableHeaderRow) {
            const clonedHeaderRow = tableHeaderRow.cloneNode(true) as HTMLElement;
            if (clonedHeaderRow.firstElementChild) clonedHeaderRow.removeChild(clonedHeaderRow.firstElementChild); // Remove checkbox
            headerHtml = clonedHeaderRow.outerHTML;
        }

        const selectedRowsHtml = selectedRows
            .sort((a, b) => a - b)
            .map((index) => {
                const row = document.querySelectorAll('#report-table tbody tr')[index];
                const clonedRow = row.cloneNode(true) as HTMLElement;
                if (clonedRow.firstElementChild) clonedRow.removeChild(clonedRow.firstElementChild); // Remove checkbox
                return clonedRow.outerHTML;
            })
            .join('');

        const popupWin = window.open('', '_blank', 'width=1000,height=1000');
        if (popupWin) {
            popupWin.document.open();
            popupWin.document.write(`
                <html>
                    <head>
                        <title>Student Route Mapping Report</title>
                        <style>
                            body { font-family: 'Arial', sans-serif; padding: 20px; }
                            h2 { text-align: center; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                            th, td { border: 1px solid black; padding: 6px; text-align: center; }
                            th { background-color: #f2f2f2; font-weight: bold; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        <h2>Student Route Mapping Report</h2>
                        <table>
                            <thead>${headerHtml}</thead>
                            <tbody>${selectedRowsHtml}</tbody>
                        </table>
                    </body>
                </html>
            `);
            popupWin.document.close();
        }
    };

    const handleExportExcel = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one record to export');
            return;
        }

        // We construct a specific data array for export to ensure we get exactly what we want,
        // including dynamic columns.
        const exportData = selectedRows
            .sort((a, b) => a - b)
            .map((index) => {
                const item = reportData[index];
                const row: any = {
                    'SL. No.': index + 1,
                    Name: item.studentName,
                    'Adm No': item.amsT_AdmNo,
                    Class: item.asmcL_ClassName,
                    Section: item.asmC_SectionName,
                    'Mobile Number': item.amsT_FatherMobile_No,
                    'Pick Up Location': item.pickUp_Location || '--',
                    'Drop Location': item.drop_Location || '--',
                    'Pick Up Route': item.pickUp_RouteName || '--',
                    'Drop Route': item.drop_RouteName || '--',
                    'Pick Up Session': item.pickUp_Session || '--',
                    'Drop Session': item.drop_Session || '--',
                    'Roll No': item.amaY_RollNo,
                    'App No': item.trsR_ApplicationNo,
                    Address: item.address
                };

                if (feeGroupWise) {
                    row['Fee Group'] = item.fmG_GroupName;
                }

                // Dynamic Installment Columns
                installments.forEach((inst) => {
                    row[inst.ftI_Name] = item[inst.ftI_Name] || 0;
                });

                return row;
            });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Student Route Mapping');
        XLSX.writeFile(wb, `Student_Route_Mapping_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='font-bold text-primary text-xl'>Student Route Mapping Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                {/* Academic Year */}
                                <FormField
                                    control={form.control}
                                    name='asmaY_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Academic Year <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Academic Year' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {years.map((year: any) => (
                                                        <SelectItem key={year.asmaY_Id} value={String(year.asmaY_Id)}>
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
                                                Class <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Class' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {classes.map((cls: any) => (
                                                        <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
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
                                                Section <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Section' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {sections.map((sec: any) => (
                                                        <SelectItem key={sec.asmS_Id} value={String(sec.asmS_Id)}>
                                                            {sec.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Route */}
                                <FormField
                                    control={form.control}
                                    name='trmR_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Route Name <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Route' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {routes.map((route: any) => (
                                                        <SelectItem key={route.trmR_Id} value={String(route.trmR_Id)}>
                                                            {route.trmR_RouteNo}::{route.trmR_RouteName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Session */}
                                <FormField
                                    control={form.control}
                                    name='TRMS_Id'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Session Name <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Session' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='0'>ALL</SelectItem>
                                                    {sessions.map((session: any) => (
                                                        <SelectItem key={session.trmS_Id} value={String(session.trmS_Id)}>
                                                            {session.trmS_SessionName}-({session.trmS_Flag})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Fee Group Checkbox and Dropdown */}
                            <div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
                                <div className='flex items-center space-x-2 pt-8'>
                                    <FormField
                                        control={form.control}
                                        name='feeGroupWise'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked: boolean) => {
                                                            field.onChange(checked);
                                                            setFeeGroupWise(checked);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className='cursor-pointer font-normal text-base'>
                                                    Fee Group Wise Report
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {feeGroupWise && (
                                    <FormField
                                        control={form.control}
                                        name='FMG_Id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Fee Group <span className='text-red-500'>*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Fee Group' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value='0'>ALL</SelectItem>
                                                        {(feeGroups as any[]).map((group: any) => (
                                                            <SelectItem key={group.fmG_Id} value={String(group.fmG_Id)}>
                                                                {group.fmG_GroupName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* Route Type Radio Buttons */}
                            <div className='flex justify-center pt-4'>
                                <FormField
                                    control={form.control}
                                    name='routeType'
                                    render={({ field }) => (
                                        <FormItem className='space-y-3'>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className='flex flex-wrap justify-center gap-6'>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='0' id='r-all' />
                                                        <FormLabel htmlFor='r-all' className='cursor-pointer'>
                                                            ALL
                                                        </FormLabel>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='1' id='r-two-way' />
                                                        <FormLabel htmlFor='r-two-way' className='cursor-pointer'>
                                                            TWO WAY
                                                        </FormLabel>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='2' id='r-pickup' />
                                                        <FormLabel htmlFor='r-pickup' className='cursor-pointer'>
                                                            ONE WAY - PICK UP
                                                        </FormLabel>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='3' id='r-drop' />
                                                        <FormLabel htmlFor='r-drop' className='cursor-pointer'>
                                                            ONE WAY - DROP
                                                        </FormLabel>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='flex justify-center gap-4 border-t pt-6'>
                                <Button type='submit' disabled={isGenerating} className='min-w-32'>
                                    {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    {isGenerating ? 'Generating...' : 'Report'}
                                </Button>

                                <Button type='button' variant='outline' onClick={handleReset} className='min-w-32'>
                                    Cancel
                                </Button>
                                {reportData.length > 0 && (
                                    <>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handlePrint}
                                            className='min-w-32 border-primary text-primary hover:bg-primary/10'>
                                            <Printer className='mr-2 h-4 w-4' />
                                            Print
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleExportExcel}
                                            className='min-w-32 border-green-600 text-green-600 hover:bg-green-50'>
                                            <FileSpreadsheet className='mr-2 h-4 w-4' />
                                            Export Excel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Results Grid */}
            {reportData.length > 0 && (
                <Card className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                    <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                            <CardTitle className='font-semibold text-lg uppercase'>Report Result ({reportData.length} records)</CardTitle>
                            <div className='text-muted-foreground text-sm'>Selected: {selectedRows.length}</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='max-h-[600px] overflow-auto rounded-md border'>
                            <Table id='report-table'>
                                <TableHeader className='sticky top-0 z-10 bg-primary/5'>
                                    <TableRow>
                                        <TableHead className='w-[50px] text-center'>
                                            <Checkbox
                                                checked={reportData.length > 0 && selectedRows.length === reportData.length}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label='Select all'
                                            />
                                        </TableHead>
                                        <TableHead className='text-center font-bold'>SL.No.</TableHead>
                                        <TableHead className='text-center font-bold'>Photo</TableHead>
                                        <TableHead className='min-w-[150px] text-center font-bold'>NAME</TableHead>
                                        <TableHead className='text-center font-bold'>ADM NO.</TableHead>
                                        <TableHead className='text-center font-bold'>CLASS</TableHead>
                                        <TableHead className='text-center font-bold'>SECTION</TableHead>
                                        <TableHead className='text-center font-bold'>MOBILE</TableHead>
                                        <TableHead className='min-w-[120px] text-center font-bold'>PICK UP LOCATION</TableHead>
                                        <TableHead className='min-w-[120px] text-center font-bold'>DROP LOCATION</TableHead>
                                        <TableHead className='min-w-[120px] text-center font-bold'>PICK UP ROUTE</TableHead>
                                        <TableHead className='min-w-[120px] text-center font-bold'>DROP ROUTE</TableHead>
                                        <TableHead className='text-center font-bold'>PICK UP SESSION</TableHead>
                                        <TableHead className='text-center font-bold'>DROP SESSION</TableHead>
                                        <TableHead className='text-center font-bold'>ROLL NO.</TableHead>
                                        <TableHead className='text-center font-bold'>APP NO.</TableHead>
                                        <TableHead className='min-w-[150px] text-center font-bold'>ADDRESS</TableHead>
                                        {feeGroupWise && <TableHead className='text-center font-bold'>FEE GROUP</TableHead>}
                                        {installments.map((inst: any, idx: number) => (
                                            <TableHead key={idx} className='text-center font-bold'>
                                                {inst.ftI_Name}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((item, index) => (
                                        <TableRow key={index} className='hover:bg-muted/50'>
                                            <TableCell className='text-center'>
                                                <Checkbox checked={selectedRows.includes(index)} onCheckedChange={() => toggleRow(index)} />
                                            </TableCell>
                                            <TableCell className='text-center'>{index + 1}</TableCell>
                                            <TableCell className='text-center'>
                                                <img
                                                    src={item.amsT_Photoname}
                                                    alt='Student'
                                                    className='mx-auto h-10 w-10 rounded-full object-cover'
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{item.studentName}</TableCell>
                                            <TableCell className='text-center'>{item.amsT_AdmNo}</TableCell>
                                            <TableCell className='text-center'>{item.asmcL_ClassName}</TableCell>
                                            <TableCell className='text-center'>{item.asmC_SectionName}</TableCell>
                                            <TableCell className='text-center'>{item.amsT_FatherMobile_No}</TableCell>
                                            <TableCell>{item.pickUp_Location || '--'}</TableCell>
                                            <TableCell>{item.drop_Location || '--'}</TableCell>
                                            <TableCell>{item.pickUp_RouteName || '--'}</TableCell>
                                            <TableCell>{item.drop_RouteName || '--'}</TableCell>
                                            <TableCell className='text-center'>{item.pickUp_Session || '--'}</TableCell>
                                            <TableCell className='text-center'>{item.drop_Session || '--'}</TableCell>
                                            <TableCell className='text-center'>{item.amaY_RollNo}</TableCell>
                                            <TableCell className='text-center'>{item.trsR_ApplicationNo}</TableCell>
                                            <TableCell>{item.address}</TableCell>
                                            {feeGroupWise && <TableCell className='text-center'>{item.fmG_GroupName}</TableCell>}
                                            {installments.map((inst: any, idx: number) => (
                                                <TableCell key={idx} className='text-center'>
                                                    {item[inst.ftI_Name] || 0}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
