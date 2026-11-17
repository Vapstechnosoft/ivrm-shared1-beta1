import { z } from 'zod';

export const requestReportSchema = z.object({
    type: z.enum(['student', 'staff']),
    fromDate: z.date({
        required_error: "From date is required",
    }),
    toDate: z.date({
        required_error: "To date is required",
    }),
});

export type RequestReportValues = z.infer<typeof requestReportSchema>;
