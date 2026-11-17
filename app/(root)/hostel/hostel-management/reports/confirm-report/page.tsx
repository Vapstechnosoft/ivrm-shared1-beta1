'use client';

import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { confirmReportSchema, ConfirmReportValues } from '@/schemas/hostel/reports/confirm-report.schema';
import { FormError, Label } from '@/components/ui/extension/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Printer, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getConfirmReport } from '@/server/hostel/hostel-management/reports/confirm-report';

export default function ConfirmReportPage() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<'student' | 'staff'>('student');
    const [currentDate] = useState(new Date());

    const form = useForm<ConfirmReportValues>({
        resolver: zodResolver(confirmReportSchema),
        defaultValues: {
            type: 'student',
            fromDate: new Date(),
            toDate: new Date(),
        },
    });

    async function onSubmit(values: ConfirmReportValues) {
        setLoading(true);
        setType(values.type);
        try {
            const data = await getConfirmReport(values);
            if (data?.grid_list) {
                setReportData(data.grid_list);
                if (data.grid_list.length === 0) {
                    toast.info("No data found for selected criteria");
                }
            } else {
                setReportData([]);
                toast.info("No data found for selected criteria");
            }
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
                            <title>Hostel Confirm Report</title>
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
                                <h1 class="school-name">Hostel Confirm Report</h1>
                                <div class="report-title">Confirmation Details</div>
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
                        <CardTitle>Hostel Confirm Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Controller
                                        control={form.control}
                                        name="type"
                                        render={({ field, fieldState }) => (
                                            <div className="space-y-3">
                                                <Label>Occupant Type</Label>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2 space-y-0">
                                                        <RadioGroupItem value="student" />
                                                        <Label className="font-normal">Student</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2 space-y-0">
                                                        <RadioGroupItem value="staff" />
                                                        <Label className="font-normal">Staff</Label>
                                                    </div>
                                                </RadioGroup>
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
                                            <TableHead>{type === 'student' ? 'Student Name' : 'Staff Name'}</TableHead>
                                            <TableHead>{type === 'student' ? 'Class' : 'Department'}</TableHead>
                                            <TableHead>Hostel</TableHead>
                                            <TableHead>Room No</TableHead>
                                            <TableHead>Confirm Date</TableHead>
                                            <TableHead>Remarks</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{type === 'student' ? item.studentname : item.empname}</TableCell>
                                                <TableCell>{type === 'student' ? item.ASMCL_ClassName : item.HRMD_DepartmentName}</TableCell>
                                                <TableCell>{item.HLMH_Name}</TableCell>
                                                <TableCell>{item.HRMRM_RoomNo}</TableCell>
                                                <TableCell>{format(new Date(item.HLHSREQC_ConfirmDate || item.HLHSTREQC_ConfirmDate), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>{item.HLHSREQC_Remarks}</TableCell>
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
