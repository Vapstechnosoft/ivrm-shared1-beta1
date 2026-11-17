'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { invVendorPaymentReportSchema, InvVendorPaymentReportFormValues } from "@/schemas/inventory/reports/inv-r-vendor-payment";
import { IInvVendorPaymentReportPayload } from "@/types/inventory/reports/inv-r-vendor-payment";

interface VendorPaymentReportFormProps {
    onReportGenerated: (payload: IInvVendorPaymentReportPayload | null) => void;
    isLoading?: boolean;
}

export default function VendorPaymentReportForm({ onReportGenerated, isLoading = false }: VendorPaymentReportFormProps) {

    const form = useForm<InvVendorPaymentReportFormValues>({
        resolver: zodResolver(invVendorPaymentReportSchema),
        defaultValues: {
            report_type: "Overall",
        },
    });

    function onSubmit(data: InvVendorPaymentReportFormValues) {
        const payload: IInvVendorPaymentReportPayload = {
            Fromdate: format(data.from_date, "yyyy-MM-dd"),
            Todate: format(data.to_date, "yyyy-MM-dd"),
            reporttype: data.report_type,
        };

        onReportGenerated(payload);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FormField
                        control={form.control}
                        name="from_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>From Date <span className="text-destructive">*</span></FormLabel>
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
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Select date</span>
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
                        name="to_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>To Date <span className="text-destructive">*</span></FormLabel>
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
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Select date</span>
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
                </div>

                <div className="flex justify-center">
                    <FormField
                        control={form.control}
                        name="report_type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="sr-only">Report Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4 bg-muted/50 p-2 rounded-md"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Overall" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Overall
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Vendor" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Vendor
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-center gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Report
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            form.reset({
                                report_type: "Overall",
                                from_date: undefined,
                                to_date: undefined,
                            });
                            onReportGenerated(null);
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
