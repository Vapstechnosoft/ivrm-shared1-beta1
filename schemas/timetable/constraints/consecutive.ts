import { z } from 'zod';

export const consecutiveConstraintsSchema = z
    .object({
        TTC_Id: z.number().optional(),
        ASMAY_Id: z.number().min(1, 'Academic Year is required'),
        TTMC_Id: z.number().min(1, 'Category is required'),
        ASMCL_Id: z.number().min(1, 'Class is required'),
        ASMS_Id: z.number().min(1, 'Section is required'),
        HRME_Id: z.number().min(1, 'Staff is required'),
        ISMS_Id: z.number().min(1, 'Subject is required'),
        TTC_NoOfConDays: z.coerce.number().min(1, 'No of Consecutive Days must be greater than 0'),
        TTC_NoOfConPeriods: z.coerce.number().min(1, 'No of Consecutive Periods must be greater than 0'),
        TTC_NoOfPeriods: z.coerce.number().optional(), // Calculated: ConDays * ConPeriods

        TTC_BefAftApplFlag: z.boolean().default(false),
        TTC_BefAftFalg: z.union([z.string(), z.number()]).optional(), // "1" (Before) or "2" (After) or 0
        TTC_BefAftPeriod: z.coerce.number().optional()
    })
    .superRefine((data, ctx) => {
        if (data.TTC_BefAftApplFlag) {
            if (!data.TTC_BefAftFalg || data.TTC_BefAftFalg === 0 || data.TTC_BefAftFalg === '' || data.TTC_BefAftFalg === '0') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Before/After Condition is required',
                    path: ['TTC_BefAftFalg']
                });
            }
            if (!data.TTC_BefAftPeriod || data.TTC_BefAftPeriod <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Period is required',
                    path: ['TTC_BefAftPeriod']
                });
            }
        }
    });

export type ConsecutiveConstraintsSchema = z.infer<typeof consecutiveConstraintsSchema>;
