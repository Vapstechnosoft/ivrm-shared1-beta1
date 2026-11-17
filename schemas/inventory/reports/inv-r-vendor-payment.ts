import { z } from "zod";

export const invVendorPaymentReportSchema = z.object({
    from_date: z.date({
        required_error: "From Date is required",
    }),
    to_date: z.date({
        required_error: "To Date is required",
    }),
    report_type: z.enum(["Overall", "Vendor"], {
        required_error: "Report Type is required",
    })
});

export type InvVendorPaymentReportFormValues = z.infer<typeof invVendorPaymentReportSchema>;
