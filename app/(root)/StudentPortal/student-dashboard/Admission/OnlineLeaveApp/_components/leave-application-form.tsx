'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StudentDetails, LeaveApplication } from '../types';
import { useEffect } from 'react';

const leaveSchema = z.object({
    aslA_Id: z.number().default(0),
    aslA_LeaveId: z.string().optional(), // Input is text, but mapped to number if needed
    aslA_Flag: z.enum(['OnStudy', 'Leave'], {
        required_error: "Select the Mode Of Leave",
    }),
    aslA_Reason: z.string().min(1, "Reason is required"),
    aslA_FromDate: z.date({
        required_error: "Select From Date",
    }),
    aslA_ToDate: z.date({
        required_error: "Select To Date",
    }),
}).refine((data) => data.aslA_ToDate >= data.aslA_FromDate, {
    message: "To Date must be after or equal to From Date",
    path: ["aslA_ToDate"],
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveApplicationFormProps {
    student: StudentDetails | null;
    isSubmitting: boolean;
    onSubmit: (data: LeaveFormValues) => void;
    onCancel: () => void;
    initialData?: LeaveApplication | null;
}

export default function LeaveApplicationForm({
    student,
    isSubmitting,
    onSubmit,
    onCancel,
    initialData
}: LeaveApplicationFormProps) {
    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            aslA_Id: 0,
            aslA_LeaveId: '',
            aslA_Reason: '',
            aslA_FromDate: new Date(),
            aslA_ToDate: new Date(),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                aslA_Id: initialData.aslA_Id,
                aslA_LeaveId: initialData.aslA_LeaveId?.toString() || '',
                aslA_Flag: initialData.aslA_Flag as 'OnStudy' | 'Leave',
                aslA_Reason: initialData.aslA_Reason,
                aslA_FromDate: new Date(initialData.aslA_FromDate),
                aslA_ToDate: new Date(initialData.aslA_ToDate),
            });
        }
    }, [initialData, form]);

    // if (!student) {
    //     return null;
    // }

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                        Online Leave Application
                    </h3>
                    <div className="text-sm text-muted-foreground">
                        Date: {format(new Date(), 'dd/MM/yyyy')}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    {/* Left Column - Read Only Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Student Name :
                            </label>
                            <div className="col-span-2 text-sm font-semibold">
                                {student?.amsT_FirstName || <span className="text-muted-foreground italic">Loading...</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none">
                                Class :
                            </label>
                            <div className="col-span-2 text-sm">
                                {student?.asmcL_ClassName || "-"}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none">
                                Section :
                            </label>
                            <div className="col-span-2 text-sm">
                                {student?.asmC_SectionName || "-"}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Read Only Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none">
                                Reg No. :
                            </label>
                            <div className="col-span-2 text-sm">
                                {student?.amsT_RegistrationNo || "-"}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none">
                                Email :
                            </label>
                            <div className="col-span-2 text-sm">
                                {student?.amsT_emailId || "-"}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-medium leading-none">
                                Phone :
                            </label>
                            <div className="col-span-2 text-sm">
                                {student?.amsT_MobileNo || "-"}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-6" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="aslA_LeaveId"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                                            <FormLabel className="text-right">Leave Id</FormLabel>
                                            <FormControl className="col-span-3">
                                                <Input
                                                    {...field}
                                                    placeholder="Enter Leave ID (Optional)"
                                                    // Allow only numbers
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="aslA_Flag"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                                            <FormLabel className="text-right">
                                                Mode Of Leave <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <div className="col-span-3">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Select Mode--" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="OnStudy">On Study</SelectItem>
                                                        <SelectItem value="Leave">Leave</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="aslA_Reason"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-start gap-4 space-y-0">
                                            <FormLabel className="text-right pt-2">
                                                Reason <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl className="col-span-3">
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter reason for leave"
                                                    className="resize-none"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="aslA_FromDate"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                                            <FormLabel className="text-right">
                                                From Date <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl className="col-span-3">
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd/MM/yyyy")
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
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="aslA_ToDate"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                                            <FormLabel className="text-right">
                                                To Date <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl className="col-span-3">
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd/MM/yyyy")
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
                                                        disabled={(date) =>
                                                            date < form.getValues('aslA_FromDate')
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Apply
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Apply
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    form.reset();
                                    onCancel();
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
