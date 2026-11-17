
import { z } from 'zod';

export const invRSalesSchema = z.object({
    typeflag: z.enum(['All', 'Overall', 'Detailed']),
    optionflag: z.string().optional(),
    individualflag: z.string().optional(), // "C", "CS"
    bw_dates: z.boolean().default(false),
    startdate: z.date().optional(),
    enddate: z.date().optional(),

    // Filters
    searchSingleStudent: z.string().optional(), // For single student select
    singleStudentId: z.number().optional(),
    singleStaffId: z.number().optional(),
    singleCustomerId: z.number().optional(),

    // Arrays
    salesArray: z.array(z.any()).optional(),
    itemArray: z.array(z.any()).optional(),
    classId: z.string().optional(), // Selected Class ID
    sectionId: z.string().optional(), // Selected Section ID (for CS mode)
    studentArray: z.array(z.any()).optional(), // Multi-select students (from class/section)

    // Column Toggles
    showTax: z.boolean().default(false),
    showDiscount: z.boolean().default(false),

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
    if (data.typeflag === 'Overall' || data.typeflag === 'Detailed') {
        if (!data.optionflag) return; // Should ideally limit this, but let's assume UI handles it

        if (data.optionflag === 'Saleno') {
            if (!data.salesArray || data.salesArray.length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one Sale No", path: ["optionflag"] });
            }
        }
        if (data.optionflag === 'Item') {
            if (!data.itemArray || data.itemArray.length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one Item", path: ["optionflag"] });
            }
        }
        if (data.optionflag === 'Staff') {
            if (!data.singleStaffId) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Staff member", path: ["singleStaffId"] });
            }
        }
        if (data.optionflag === 'Customer') {
            if (!data.singleCustomerId) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Customer", path: ["singleCustomerId"] });
            }
        }
        if (data.optionflag === 'Student') {
            // Complex Student Validation
            if (!data.individualflag) {
                // Default Single Student Search
                if (!data.singleStudentId) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Student", path: ["singleStudentId"] });
                }
            } else {
                // Class or Class/Section Mode
                if (!data.classId) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Class", path: ["classId"] });
                } else {
                    if (data.individualflag === 'CS' && !data.sectionId) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a Section", path: ["sectionId"] });
                    }
                    if (!data.studentArray || data.studentArray.length === 0) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one Student", path: ["studentArray"] });
                    }
                }
            }
        }
    }
});

export type InvRSalesSchema = z.infer<typeof invRSalesSchema>;
