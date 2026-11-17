import { z } from "zod";

export const invRMonthEndReportSchema = z.object({
    ASMAY_Id: z.coerce.number().min(1, { message: "Academic Year is required" }),
    IVRM_Month_Id: z.coerce.number().min(1, { message: "Month is required" }),
    year: z.string().min(1, { message: "Year is required" }),
    IE_Name: z.string().optional(),
});

export type InvRMonthEndReportSchema = z.infer<typeof invRMonthEndReportSchema>;
