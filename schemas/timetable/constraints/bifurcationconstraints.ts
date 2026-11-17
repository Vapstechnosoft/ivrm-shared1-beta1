import { z } from 'zod';

export const bifurcationConstraintsSchema = z
    .object({
        TTB_ID: z.number().optional().default(0),
        ASMAY_Id: z.coerce.number().min(1, { message: 'Please Select Academic Year' }),
        TTMC_Id: z.coerce.number().min(1, { message: 'Please Select Category' }),
        TTB_BifurcationName: z.string().min(1, { message: 'Please Enter Bifurcation Name' }),
        TTB_NoOfPeriods: z.coerce.number().min(1, { message: 'Enter No of Periods' }),

        // Before/After Constraints
        TTB_BefAftApplFlag: z.boolean().default(false),
        TTB_BefAftFalg: z.string().optional(),
        TTMP_Id: z.coerce.number().optional(),

        // Consecutive Constraints
        TTB_ConsecutiveFlag: z.boolean().default(false),
        TTB_NoOfConPeriods: z.coerce.number().optional(),
        TTB_NoOfConDays: z.coerce.number().optional(),

        // Combination List
        combinationlist: z
            .array(
                z.object({
                    ASMCL_Id: z.number(),
                    ASMS_Id: z.number(),
                    HRME_Id: z.number(),
                    ISMS_Id: z.number(),
                    // UI only fields, optional for payload but good for UI display if needed
                    className: z.string().optional(),
                    sectioname: z.string().optional(),
                    staffname: z.string().optional(),
                    subjectname: z.string().optional()
                })
            )
            .min(1, { message: 'Please Add at least one Combination' })
    })
    .superRefine((data, ctx) => {
        // Validate Before/After Constraints
        if (data.TTB_BifurcationName && data.TTB_BefAftApplFlag) {
            if (!data.TTB_BefAftFalg) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please Select Before/After condition',
                    path: ['TTB_BefAftFalg']
                });
            }
            if (!data.TTMP_Id || data.TTMP_Id === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please Select Period',
                    path: ['TTMP_Id']
                });
            }
        }

        // Validate Consecutive Constraints
        if (data.TTB_ConsecutiveFlag) {
            if (!data.TTB_NoOfConPeriods || data.TTB_NoOfConPeriods === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please Enter No of Consecutive Period',
                    path: ['TTB_NoOfConPeriods']
                });
            }
            if (!data.TTB_NoOfConDays || data.TTB_NoOfConDays === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please Enter No of Consecutive Day',
                    path: ['TTB_NoOfConDays']
                });
            }
        }
    });

export type BifurcationConstraintsSchema = z.infer<typeof bifurcationConstraintsSchema>;

// Schema for adding a temp combination (frontend validation)
export const combinationTempSchema = z.object({
    ASMCL_Id: z.coerce.number().min(1, { message: 'Select Class' }),
    ASMS_Id: z.coerce.number().min(1, { message: 'Select Section' }),
    HRME_Id: z.coerce.number().min(1, { message: 'Select Staff' }),
    ISMS_Id: z.coerce.number().min(1, { message: 'Select Subject' })
});
