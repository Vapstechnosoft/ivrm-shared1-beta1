import { z } from 'zod';

export const gatepassReportSchema = z.object({
    allFlg: z.boolean().default(true),
    AMST_Id: z.string().optional(),
    fromDate: z.date({
        required_error: "From date is required",
    }),
    toDate: z.date({
        required_error: "To date is required",
    }),
});

export const inOutReportSchema = z.object({
    HLMH_Id: z.string({
        required_error: "Hostel is required",
    }),
    fromDate: z.date({
        required_error: "From date is required",
    }),
    toDate: z.date({
        required_error: "To date is required",
    }),
});

export type GatepassReportValues = z.infer<typeof gatepassReportSchema>;
export type InOutReportValues = z.infer<typeof inOutReportSchema>;
