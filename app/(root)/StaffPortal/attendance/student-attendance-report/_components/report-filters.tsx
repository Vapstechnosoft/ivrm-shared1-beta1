
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, FileSpreadsheet, Printer, Bell, Search, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudentAttendanceReport } from '@/hooks/staff-portal/useStudentAttendanceReport';
import {
    studentAttendanceReportSchema,
    StudentAttendanceReportValues
} from '@/types/staff-portal/student-attendance-report-schema';
import { MultiSelect } from './multi-select';
import { IReportResponse, IReportRow } from '@/types/staff-portal/student-attendance-report';
import { toast } from 'sonner';
import ReportGrid from './report-grid';

const ReportFilters = () => {
    const {
        initialData,
        fetchClasses,
        fetchSections,
        fetchStudents,
        fetchReport,
        noticeMutation
    } = useStudentAttendanceReport();

    const [classes, setClasses] = useState<{ label: string; value: number }[]>([]);
    const [sections, setSections] = useState<{ label: string; value: number }[]>([]);
    const [students, setStudents] = useState<{ label: string; value: number }[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [reportData, setReportData] = useState<IReportResponse | null>(null);

    const form = useForm<StudentAttendanceReportValues>({
        resolver: zodResolver(studentAttendanceReportSchema),
        defaultValues: {
            asmaY_Id: 0,
            amC_Id: 0,
            radiotype: 1,
            type: 1,
            type1: '1',
            checkoruncheck: false,
        }
    });

    const { watch, setValue, control } = form;
    const watchYear = watch('asmaY_Id');
    const watchCategory = watch('amC_Id');
    const watchType = watch('type');
    const watchReportType = watch('radiotype');
    const watchType1 = watch('type1');
    const watchMonthDateWise = watch('checkoruncheck');

    // Fetch Classes when Year or Category changes
    useEffect(() => {
        if (watchYear > 0) {
            fetchClasses.mutate({ asmaY_Id: watchYear, amC_Id: watchCategory || 0 }, {
                onSuccess: (data) => {
                    setClasses(data.map(c => ({ label: c.asmcL_ClassName, value: c.asmcL_Id })));
                    setSelectedClasses([]);
                    setSelectedSections([]);
                    setSections([]);
                }
            });
        }
    }, [watchYear, watchCategory]);

    // Fetch Sections when Classes change
    useEffect(() => {
        if (watchYear > 0 && selectedClasses.length > 0) {
            const classList = selectedClasses.map(id => ({ ASMCL_Id: id }));
            fetchSections.mutate({ asmaY_Id: watchYear, classList }, {
                onSuccess: (data) => {
                    setSections(data.map(s => ({ label: s.asmC_SectionName, value: s.asmS_Id })));
                    setSelectedSections([]);
                }
            });
        } else {
            setSections([]);
            setSelectedSections([]);
        }
    }, [selectedClasses]);

    // Fetch Students for Individual Type
    useEffect(() => {
        if (watchType === 2 && watchYear > 0 && selectedClasses.length > 0 && selectedSections.length > 0) {
            const data = {
                ASMAY_Id: watchYear,
                radiotype: watchReportType,
                type1: watchType1 === '1' ? 'admno' : 'name',
                classdetailsdata: selectedClasses.map(id => ({ ASMCL_Id: id })),
                sectionsdetailsdata: selectedSections.map(id => ({ ASMS_Id: id }))
            };
            fetchStudents.mutate(data, {
                onSuccess: (data) => {
                    setStudents(data.map(s => ({
                        label: watchType1 === '1' ? `${s.AMST_AdmNo} : ${s.name}` : `${s.name} : ${s.AMST_AdmNo}`,
                        value: s.AMST_Id
                    })));
                }
            });
        }
    }, [watchType, watchYear, selectedClasses, selectedSections, watchType1]);

    const onSubmit = (values: StudentAttendanceReportValues) => {
        if (selectedClasses.length === 0) {
            toast.error("Please select at least one class");
            return;
        }
        if (selectedSections.length === 0) {
            toast.error("Please select at least one section");
            return;
        }

        const payload: any = {
            ASMAY_Id: values.asmaY_Id,
            radiotype: values.radiotype,
            fromdate: values.fromdate ? format(values.fromdate, 'yyyy-MM-dd') : undefined,
            todate: values.todate ? format(values.todate, 'yyyy-MM-dd') : undefined,
            AMM_ID: values.amM_Id,
            AMST_Id: values.amst_Id || 0,
            type: values.type,
            datewise: values.checkoruncheck ? 1 : 0,
            AMC_Id: values.amC_Id || 0,
            classdetailsdata: selectedClasses.map(id => ({ ASMCL_Id: id })),
            sectionsdetailsdata: selectedSections.map(id => ({ ASMS_Id: id }))
        };

        if (values.radiotype === 3 && values.fromdaily) {
            payload.fromdate = format(values.fromdaily, 'yyyy-MM-dd');
            payload.todate = format(new Date(), 'yyyy-MM-dd');
        }

        fetchReport.mutate(payload, {
            onSuccess: (data) => {
                if (data.studentAttendanceList && data.studentAttendanceList.length > 0) {
                    setReportData(data);
                } else {
                    toast.error("No records found for the selected criteria");
                    setReportData(null);
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Type Selection */}
                                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                                    <Label>Selection Type</Label>
                                    <RadioGroup
                                        defaultValue="1"
                                        className="flex gap-4"
                                        onValueChange={(val) => setValue('type', Number(val))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1" id="type-all" />
                                            <Label htmlFor="type-all">All</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="2" id="type-ind" />
                                            <Label htmlFor="type-ind">Individual</Label>
                                        </div>
                                    </RadioGroup>

                                    {watchType === 2 && (
                                        <div className="pt-4 border-t space-y-2">
                                            <Label>Filter By</Label>
                                            <RadioGroup
                                                defaultValue="1"
                                                className="flex gap-4"
                                                onValueChange={(val) => setValue('type1', val)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="f-adm" />
                                                    <Label htmlFor="f-adm">Adm. No</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="f-name" />
                                                    <Label htmlFor="f-name">Name</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                </div>

                                {/* Report Type */}
                                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                                    <Label>Report Mode</Label>
                                    <RadioGroup
                                        defaultValue="1"
                                        className="flex flex-col gap-2"
                                        onValueChange={(val) => setValue('radiotype', Number(val))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="1" id="r-month" />
                                            <Label htmlFor="r-month">Monthly</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="2" id="r-between" />
                                            <Label htmlFor="r-between">Between Date</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="3" id="r-daily" />
                                            <Label htmlFor="r-daily">Daily</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Dropdowns */}
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="asmaY_Id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Academic Year *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Year" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {initialData.data?.academicList.map((year) => (
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

                                    {initialData.data?.categoryflag && (
                                        <FormField
                                            control={form.control}
                                            name="amC_Id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="0">All</SelectItem>
                                                            {initialData.data?.category_list.map((cat) => (
                                                                <SelectItem key={cat.amC_Id} value={String(cat.amC_Id)}>
                                                                    {cat.amC_Name}
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem>
                                    <FormLabel>Classes *</FormLabel>
                                    <MultiSelect
                                        options={classes}
                                        selected={selectedClasses}
                                        onChange={(vals) => setSelectedClasses(vals as number[])}
                                        placeholder="Select Classes"
                                    />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Sections *</FormLabel>
                                    <MultiSelect
                                        options={sections}
                                        selected={selectedSections}
                                        onChange={(vals) => setSelectedSections(vals as number[])}
                                        placeholder="Select Sections"
                                    />
                                </FormItem>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {watchType === 2 && (
                                    <FormField
                                        control={form.control}
                                        name="amst_Id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student Name *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Student" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {students.map((stu) => (
                                                            <SelectItem key={stu.value} value={String(stu.value)}>
                                                                {stu.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {watchReportType === 1 && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="amM_Id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Month *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Month" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {initialData.data?.monthList.map((month) => (
                                                                <SelectItem key={month.amM_ID} value={String(month.amM_ID)}>
                                                                    {month.amM_NAME}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex items-center space-x-2 pt-8">
                                            <RadioGroup
                                                onValueChange={(val) => setValue('checkoruncheck', val === 'true')}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="true" id="dw-yes" />
                                                    <Label htmlFor="dw-yes">Date Wise</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="false" id="dw-no" />
                                                    <Label htmlFor="dw-no">Summary</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}

                                {watchReportType === 2 && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="fromdate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>From Date *</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date > new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="todate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>To Date *</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => {
                                                                    const fromDate = form.getValues('fromdate');
                                                                    return date > new Date() || (!!fromDate && date < fromDate);
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {watchReportType === 3 && (
                                    <FormField
                                        control={form.control}
                                        name="fromdaily"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Daily Date *</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date > new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 border-t pt-6">
                                <Button
                                    type="submit"
                                    disabled={fetchReport.isPending}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Search className="mr-2 h-4 w-4" /> Report
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.reset();
                                        setSelectedClasses([]);
                                        setSelectedSections([]);
                                        setReportData(null);
                                    }}
                                >
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!reportData}
                                    onClick={() => toast.info("Exporting to Excel...")}
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Excel
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!reportData}
                                    onClick={() => toast.info("Opening print view...")}
                                >
                                    <Printer className="mr-2 h-4 w-4 text-blue-600" /> Print
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!reportData}
                                    onClick={() => {
                                        // Logic to filter selected rows and send notice
                                        toast.info("Sending notifications...");
                                    }}
                                >
                                    <Bell className="mr-2 h-4 w-4 text-amber-600" /> Send Notice
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {reportData && (
                <div className="animate-in fade-in slide-in-from-top-4">
                    <ReportGrid
                        data={reportData}
                        isDateWise={watchReportType === 1 && watchMonthDateWise}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportFilters;
