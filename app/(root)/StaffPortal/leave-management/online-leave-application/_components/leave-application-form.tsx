
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, differenceInDays } from 'date-fns';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload, Check, X, FileText, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { IOnlineLeaveInitialData, ILeaveBalance } from '@/types/staff-portal/online-leave';
import { onlineLeaveSchema, OnlineLeaveValues } from '@/types/staff-portal/online-leave-schema';
import { useOnlineLeave } from '@/hooks/staff-portal/useOnlineLeave';

interface Props {
    initialData: IOnlineLeaveInitialData | null | undefined;
}

const LeaveApplicationForm = ({ initialData }: Props) => {
    const {
        applyMutation,
        selectedLeaves,
        updateLeaveRow,
        setSelectedLeaves
    } = useOnlineLeave();

    const employee = initialData?.online_leave?.[0];
    const leaveBalances = initialData?.leave_name || [];

    const form = useForm<OnlineLeaveValues>({
        resolver: zodResolver(onlineLeaveSchema),
        defaultValues: {
            reason: '',
            contact: employee?.hrmE_MobileNo || '',
            supportingDocument: '',
        },
    });

    // Handle form submission
    const onSubmit = (values: OnlineLeaveValues) => {
        const rows = Object.values(selectedLeaves).filter(l => l.fromDate && l.toDate);

        if (rows.length === 0) {
            alert('Please select at least one leave type and dates');
            return;
        }

        const payload = {
            HRELAP_ApplicationDate: new Date().toISOString(),
            HRELAP_LeaveReason: values.reason,
            HRELAP_ContactNoOnLeave: Number(values.contact),
            HRELAP_ReportingDate: values.reportingDate.toISOString(),
            HRELT_SupportingDocument: values.supportingDocument,
            temp_table_data: rows.map(r => ({
                ...r,
                fromDate: r.fromDate?.toISOString(),
                toDate: r.toDate?.toISOString(),
            })) as any,
            frmToDates: rows.map(r => ({
                HRELAP_FromDate: r.fromDate?.toISOString() || '',
                HRELAP_ToDate: r.toDate?.toISOString() || '',
                HRELAP_TotalDays: r.hrelaP_TotalDays || 0,
            })),
        };

        applyMutation.mutate(payload);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* 1. Employee Info Section */}
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader className="bg-primary/10 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            Online Leave Application
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Employee Name" value={employee?.hrmE_EmployeeFirstName} />
                            <InfoField label="Designation" value={employee?.hrmdeS_DesignationName} />
                            <InfoField label="DOJ" value={employee?.hrmE_DOJ ? format(new Date(employee.hrmE_DOJ), 'dd-MM-yyyy') : ''} />
                            <InfoField label="Email" value={employee?.hrmE_EmailId} />
                            <InfoField label="Phone" value={employee?.hrmE_MobileNo} />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Leave Details Grid Section */}
                <Card className="shadow-md">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-lg">Employee Leave Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">SlNo</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead className="text-center">Total</TableHead>
                                        <TableHead className="text-center">Balance</TableHead>
                                        <TableHead className="w-[180px]">From Date</TableHead>
                                        <TableHead className="w-[180px]">To Date</TableHead>
                                        <TableHead className="w-[200px]">No. of Days</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaveBalances.map((leave, index) => {
                                        const state = selectedLeaves[leave.hrelS_Id] || {};
                                        return (
                                            <TableRow key={leave.hrelS_Id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-medium">{leave.hrmL_LeaveName}</TableCell>
                                                <TableCell className="text-center">{leave.hrelS_TotalLeaves}</TableCell>
                                                <TableCell className="text-center">{leave.hrelS_CBLeaves}</TableCell>
                                                <TableCell>
                                                    <DateCell
                                                        value={state.fromDate}
                                                        onChange={(d) => updateLeaveRow(leave.hrelS_Id, 'fromDate', d)}
                                                        disabled={leave.hrelS_CBLeaves === 0}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DateCell
                                                        value={state.toDate}
                                                        onChange={(d) => updateLeaveRow(leave.hrelS_Id, 'toDate', d)}
                                                        disabled={leave.hrelS_CBLeaves === 0}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Input
                                                            className="w-16 h-8 text-center"
                                                            readOnly
                                                            value={state.hrelaP_TotalDays || ''}
                                                        />
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`halfday-${leave.hrelS_Id}`}
                                                                checked={state.cklop}
                                                                onCheckedChange={(checked) => updateLeaveRow(leave.hrelS_Id, 'cklop', !!checked)}
                                                            />
                                                            <label
                                                                htmlFor={`halfday-${leave.hrelS_Id}`}
                                                                className="text-xs font-medium cursor-pointer"
                                                            >
                                                                Half Day
                                                            </label>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reasons for Leave <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Enter reason for leave..." className="h-20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number While on Leave <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="10 digit mobile number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reportingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date Reporting Back <span className="text-destructive">*</span></FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
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
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
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
                                name="supportingDocument"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supporting Document <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-1">
                                                    <Input
                                                        readOnly
                                                        value={field.value ? 'Document Uploaded' : ''}
                                                        placeholder="Click to upload document"
                                                        className="cursor-pointer"
                                                        onClick={() => document.getElementById('leave-doc-upload')?.click()}
                                                    />
                                                    <input
                                                        type="file"
                                                        id="leave-doc-upload"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            // Mock upload for now, usually calls a server action or storage service
                                                            const file = e.target.files?.[0];
                                                            if (file) field.onChange(URL.createObjectURL(file));
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => document.getElementById('leave-doc-upload')?.click()}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" /> Upload
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-center gap-4 mt-10">
                            <Button
                                type="submit"
                                size="lg"
                                className="px-8 gap-2"
                                disabled={applyMutation.isPending}
                            >
                                <Send className="h-4 w-4" /> Apply Leave Now
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="px-8"
                                onClick={() => {
                                    form.reset();
                                    setSelectedLeaves({});
                                }}
                            >
                                <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
};

// Helper Components
const InfoField = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="space-y-1">
        <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium border-b pb-1">{value || '--'}</p>
    </div>
);

const DateCell = ({ value, onChange, disabled }: { value?: Date, onChange: (d: Date | undefined) => void, disabled: boolean }) => (
    <Popover>
        <PopoverTrigger asChild disabled={disabled}>
            <Button
                variant="outline"
                className={cn(
                    "w-full h-8 justify-start text-left font-normal text-xs",
                    !value && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {value ? format(value, "dd-MM-yyyy") : "Select date"}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={value}
                onSelect={onChange}
                initialFocus
            />
        </PopoverContent>
    </Popover>
);

export default LeaveApplicationForm;
