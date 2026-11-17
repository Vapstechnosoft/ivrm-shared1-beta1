'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inOutReportSchema, InOutReportValues } from '@/schemas/hostel/reports/attendance-reports.schema';
import { FormError, Label } from '@/components/ui/extension/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Printer, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInOutReport, getInOutReportLoadData } from '@/server/hostel/hostel-management/reports/attendance-reports';

export default function InOutReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [hostels, setHostels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentDate] = useState(new Date());

    const form = useForm<InOutReportValues>({
        resolver: zodResolver(inOutReportSchema),
        defaultValues: {
            fromDate: new Date(),
            toDate: new Date(),
        },
    });

    useEffect(() => {
        async function load() {
            const data = await getInOutReportLoadData();
            if (data) {
                //setHostels(data.hostelist);
            }
        }
        load();
    }, []);

    async function onSubmit(values: InOutReportValues) {
        setLoading(true);
        try {
            const data = await getInOutReport(values);
            // if (data?.grid_list) {
            //     setReportData(data.grid_list);
            //     if (data.grid_list.length === 0) {
            //         toast.info("No data found");
            //     }
            // } else {
            //     setReportData([]);
            //     toast.info("No data found");
            // }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch report");
        } finally {
            setLoading(false);
        }
    }

    const handlePrint = () => {
        if (!reportData || reportData.length === 0) return;

        const tableContent = document.getElementById('reportTable');
        const fromDate = form.getValues('fromDate');
        const toDate = form.getValues('toDate');

        if (tableContent) {
            const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
            if (popupWindow) {
                popupWindow.document.open();
                popupWindow.document.write(`
                    <html>
                        <head>
                            <title>Student In/Out Report</title>
                            <style>
                                body { font-family: 'Times New Roman', serif; padding: 20px; }
                                .header { text-align: center; margin-bottom: 20px; }
                                .school-name { font-size: 24px; font-weight: bold; color: #2e57a0; margin: 0; }
                                .report-title { font-size: 18px; font-weight: bold; margin-top: 10px; }
                                .dates { font-size: 14px; margin-top: 5px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                th { background-color: #f2f2f2; font-weight: bold; }
                                .text-center { text-align: center; }
                            </style>
                        </head>
                        <body onload="window.print(); window.close();">
                            <div class="header">
                                <h1 class="school-name">Student In/Out Report</h1>
                                <div class="report-title">In/Out Details</div>
                                <div class="dates">
                                    From: ${format(fromDate, 'dd/MM/yyyy')} To: ${format(toDate, 'dd/MM/yyyy')}
                                </div>
                            </div>
                            ${tableContent.outerHTML}
                            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px;">
                                <div>Signature</div>
                                <div>Date: ${format(currentDate, 'dd/MM/yyyy')}</div>
                            </div>
                        </body>
                    </html>
                `);
                popupWindow.document.close();
            }
        }
    };

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Student In/Out Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Controller
                                        control={form.control}
                                        name="HLMH_Id"
                                        render={({ field, fieldState }) => (
                                            <div>
                                                <Label>Hostel</Label>
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Hostel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hostels.map(h => (
                                                            <SelectItem key={h.hlmH_Id} value={String(h.hlmH_Id)}>
                                                                {h.hlmH_Name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name="fromDate"
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col">
                                                <Label>From Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name="toDate"
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col">
                                                <Label>To Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {fieldState.error && <FormError>{fieldState.error.message}</FormError>}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="submit" disabled={loading} className="w-32">
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                        Generate
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handlePrint} disabled={!reportData.length} className="w-32">
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>

                {reportData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table id="reportTable">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">SL.No.</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Adm. No</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Hostel</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>In/Out</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.studentname}</TableCell>
                                                <TableCell>{item.AMST_AdmNo}</TableCell>
                                                <TableCell>{item.ASMCL_ClassName}</TableCell>
                                                <TableCell>{item.HLMH_Name}</TableCell>
                                                <TableCell>{format(new Date(item.HLSTIO_PunchDate), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>{item.HLSTIO_PunchTime}</TableCell>
                                                <TableCell>{item.HLSTIO_InOutFlg}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
