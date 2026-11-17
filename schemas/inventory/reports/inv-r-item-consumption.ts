
import { z } from 'zod';

export const invRItemConsumptionSchema = z.object({
    typeflag: z.enum(['All', 'Overall', 'Detailed']),
    optionflag: z.string().optional(), // 'Item', 'Staff', 'Department', 'Student'
    bw_dates: z.boolean().default(false),
    startdate: z.date().optional(),
    enddate: z.date().optional(),

    // Selections
    invmI_Id: z.number().optional(), // Single Item
    hrmD_Id: z.number().optional(), // Single Dept
    amsT_Id: z.number().optional(), // Single Student

    // Staff allows multi-select in Code ("staffarray.push(stf)"), but HTML shows "multiselect" with checkboxes for Staff.
    // Wait, the HTML for Staff shows: <input name="stor" ng-model="st.stck" type="checkbox"...>
    // So it is Multi Select for Staff.
    staffArray: z.array(z.any()).optional(),

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
    if (data.typeflag !== 'All') {
        if (!data.optionflag) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Filter option", path: ["optionflag"] });
            return;
        }

        if (data.optionflag === 'Item' && !data.invmI_Id) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select an Item", path: ["invmI_Id"] });
        }
        if (data.optionflag === 'Department' && !data.hrmD_Id) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Department", path: ["hrmD_Id"] });
        }
        if (data.optionflag === 'Student' && !data.amsT_Id) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Student", path: ["amsT_Id"] });
        }
        if (data.optionflag === 'Staff' && (!data.staffArray || data.staffArray.length === 0)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one Staff member", path: ["staffArray"] });
        }
    }
});

export type InvRItemConsumptionSchema = z.infer<typeof invRItemConsumptionSchema>;
