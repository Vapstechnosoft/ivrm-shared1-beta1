
import { z } from 'zod';

export const invTItemConsumptionDetailSchema = z.object({
    invtiC_Id: z.number(),
    invmI_Id: z.number().min(1, 'Item is required'),
    invtiC_ICPrice: z.number().min(0),
    invmuoM_Id: z.number().min(1, 'UOM is required'), // Usually auto-fetched
    invmP_Id: z.number().nullable().optional(),
    invtiC_BatchNo: z.string().min(1, 'Batch No is required'),
    invtiC_ICQty: z.number().min(0.01, 'Quantity must be greater than 0'),
    invtiC_Naration: z.string().optional(),
});

export const invTItemConsumptionSchema = z.object({
    invmiC_Id: z.number(),
    invmsT_Id: z.number().min(1, 'Store is required'),
    invmiC_ICNo: z.string().optional(),
    invmiC_ICDate: z.date({ required_error: 'Date is required' }),
    invmiC_Remarks: z.string().optional(),
    invmiC_StuOtherFlg: z.enum(['Staff', 'Department', 'Student']),
    stu_Flag: z.enum(['I', 'C', 'CS']).optional(),
    asmcL_Id: z.number().optional(),
    asmS_Id: z.number().optional(),

    // Conditional validations handled in superRefine or UI logic, but broadly:
    hrmD_Id: z.number().optional(),
    amsT_Id: z.number().optional(),

    // For Staff, we need a list of selected Employee IDs
    // In legacy it was a checkbox list. In new UI, probably a MultiSelect or similar.
    staffIds: z.array(z.number()).optional(),

    arrayIC: z.array(invTItemConsumptionDetailSchema).min(1, 'At least one item is required'),
}).superRefine((data, ctx) => {
    if (data.invmiC_StuOtherFlg === 'Staff' && (!data.staffIds || data.staffIds.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one staff member must be selected",
            path: ["staffIds"]
        });
    }
    if (data.invmiC_StuOtherFlg === 'Department' && !data.hrmD_Id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Department is required",
            path: ["hrmD_Id"]
        });
    }
    if (data.invmiC_StuOtherFlg === 'Student') {
        if (!data.asmcL_Id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Class is required",
                path: ["asmcL_Id"]
            });
        }
        if (!data.asmS_Id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Section is required",
                path: ["asmS_Id"]
            });
        }
        if (!data.amsT_Id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Student is required",
                path: ["amsT_Id"]
            });
        }
    }
});

export type InvTItemConsumptionSchema = z.infer<typeof invTItemConsumptionSchema>;
export type InvTItemConsumptionDetailSchema = z.infer<typeof invTItemConsumptionDetailSchema>;
