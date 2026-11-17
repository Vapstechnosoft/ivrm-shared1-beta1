
import { z } from 'zod';

export const invRStockSchema = z.object({
    optionflag: z.enum(['All', 'Item', 'Store', 'Group']),
    overallflag: z.boolean().default(false),
    bw_dates: z.boolean().default(false),
    startdate: z.date().optional(),
    enddate: z.date().optional(),

    // Selections
    invmI_Id: z.number().optional(), // Item
    invmsT_Id: z.number().optional(), // Store
    invmG_Id: z.number().optional(), // Group

}).superRefine((data, ctx) => {
    // Date Validation
    if (data.bw_dates) {
        if (!data.startdate) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start Date is required", path: ["startdate"] });
        }
        if (!data.enddate) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End Date is required", path: ["enddate"] });
        }
        if (data.startdate && data.enddate && data.startdate > data.enddate) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start Date cannot be greater than End Date", path: ["enddate"] });
        }
    }

    // Option Validation
    if (data.optionflag === 'Item' && !data.invmI_Id) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select an Item", path: ["invmI_Id"] });
    }
    if (data.optionflag === 'Store' && !data.invmsT_Id) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Store", path: ["invmsT_Id"] });
    }
    if (data.optionflag === 'Group' && !data.invmG_Id) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Group", path: ["invmG_Id"] });
    }
});

export type InvRStockSchema = z.infer<typeof invRStockSchema>;
