import { z } from 'zod';

export const sportsCCNameSchema = {
    addOrUpdate: z.object({
        spccmscC_Id: z.number().optional().default(0),
        spccmsccG_Id: z.number().min(1, 'Group Name is required'),
        spccmscC_SportsCCName: z.string().min(1, 'Sports Name is required').max(100),
        spccmscC_SportsCCDesc: z.string().min(1, 'Description is required').max(250),
        spccmscC_SGFlag: z.enum(['Single', 'Group']),
        spccmscC_NoOfMembers: z.number().min(1, 'Number of members must be at least 1'),
        spccmscC_RecHighLowFlag: z.enum(['High', 'Low']),
        spccmscC_RecInfo: z.string().optional(),
        spccmscC_MultiAttemptFlg: z.boolean().default(false),
        spccmscC_NoOfAttempts: z.number().nullable().optional(),
        spccmscC_ActiveFlag: z.boolean().optional(),
        tempDatas: z.array(z.object({
            spccmsccG_UnderEvent: z.string().optional(),
            // Optional fields for existing records
            spccmsccG_Id: z.number().optional(),
        })).optional(),
    }).superRefine((data, ctx) => {
        if (data.spccmscC_MultiAttemptFlg) {
            if (!data.spccmscC_NoOfAttempts || data.spccmscC_NoOfAttempts <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Number of attempts is required when Multi Attempt is checked",
                    path: ["spccmscC_NoOfAttempts"],
                });
            }
        }
    }),
};
