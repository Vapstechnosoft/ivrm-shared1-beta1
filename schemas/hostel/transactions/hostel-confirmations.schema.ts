import { z } from 'zod';

export const studentRequestConfirmSchema = z.object({
    HLHSREQ_Id: z.number(),
    HLHSREQC_Id: z.number().default(0),
    HLHSREQC_Remarks: z.string({
        required_error: "Remarks are required",
    }),
    HRMRM_Id: z.string({
        required_error: "Room assignment is required for approval",
    }).optional(),
});

export const staffApprovalSchema = z.object({
    HLHSTREQ_Id: z.number(),
    HLHSTREQC_Id: z.number().default(0),
    HLHSTREQC_Remarks: z.string({
        required_error: "Remarks are required",
    }),
    HRMRM_Id: z.string({
        required_error: "Room assignment is required for approval",
    }).optional(),
});

export type StudentRequestConfirmValues = z.infer<typeof studentRequestConfirmSchema>;
export type StaffApprovalValues = z.infer<typeof staffApprovalSchema>;
