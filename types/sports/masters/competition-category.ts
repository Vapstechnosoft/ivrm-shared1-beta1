import { z } from 'zod';

// Number schema for numeric fields that could be strings from inputs or null from defaults
const numericSchema = z.union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
    .pipe(z.number().nullable());

export const masterCompetitionCategorySchema = z.object({
    spccmcC_Id: z.number().optional().nullable(),
    spccmcC_CompitionCategory: z.string().min(5, "Competition Category must be at least 5 characters").max(100, "Competition Category must be at most 100 characters"),
    spccmcC_CCDesc: z.string().min(1, "Description is required").max(250, "Description must be at most 250 characters"),
    spccmcC_CCAgeFlag: z.boolean().default(false),
    spccmcC_CCWeightFlag: z.boolean().default(false),

    // Age details
    spccmcC_FromCCAgeYear: numericSchema.optional(),
    spccmcC_ToCCAgeYear: numericSchema.optional(),
    spccmcC_FromCCAgeMonth: numericSchema.pipe(z.number().max(12, "Month must be between 0 and 12").nullable()).optional(),
    spccmcC_ToCCAgeMonth: numericSchema.pipe(z.number().max(12, "Month must be between 0 and 12").nullable()).optional(),
    spccmcC_FromCCAgeDays: numericSchema.pipe(z.number().max(31, "Days must be between 0 and 31").nullable()).optional(),
    spccmcC_ToCCAgeDays: numericSchema.pipe(z.number().max(31, "Days must be between 0 and 31").nullable()).optional(),

    // Weight details
    spccmcC_CCWeight: numericSchema.optional(),

    spccmcC_ActiveFlag: z.boolean().default(true).optional(),

    // Audit fields (optional)
    createdDate: z.string().optional(),
    updatedDate: z.string().optional(),
}).superRefine((data, ctx) => {
    // If Age flag is enabled, validate age ranges
    if (data.spccmcC_CCAgeFlag) {
        const fromYear = data.spccmcC_FromCCAgeYear ?? 0;
        const toYear = data.spccmcC_ToCCAgeYear ?? 0;
        const fromMonth = data.spccmcC_FromCCAgeMonth ?? 0;
        const toMonth = data.spccmcC_ToCCAgeMonth ?? 0;
        const fromDays = data.spccmcC_FromCCAgeDays ?? 0;
        const toDays = data.spccmcC_ToCCAgeDays ?? 0;

        // Validation for "From Age" cannot be greater than "To Age"
        if (fromYear > toYear) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "From Age Year cannot be greater than To Age Year",
                path: ["spccmcC_FromCCAgeYear"],
            });
        } else if (fromYear === toYear) {
            if (fromMonth > toMonth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "From Age Month cannot be greater than To Age Month when years are equal",
                    path: ["spccmcC_FromCCAgeMonth"],
                });
            } else if (fromMonth === toMonth) {
                if (fromDays > toDays) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "From Age Days cannot be greater than To Age Days when years and months are equal",
                        path: ["spccmcC_FromCCAgeDays"],
                    });
                }
            }
        }
    }

    // If Weight flag is enabled, validate weight
    if (data.spccmcC_CCWeightFlag) {
        if (data.spccmcC_CCWeight === null || data.spccmcC_CCWeight === undefined || data.spccmcC_CCWeight <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Weight is required and must be greater than 0 when weight flag is enabled",
                path: ["spccmcC_CCWeight"],
            });
        }
    }

    // Ensure at least one flag is selected
    if (!data.spccmcC_CCAgeFlag && !data.spccmcC_CCWeightFlag) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either Age Flag or Weight Flag must be enabled",
            path: ["spccmcC_CCAgeFlag"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either Age Flag or Weight Flag must be enabled",
            path: ["spccmcC_CCWeightFlag"],
        });
    }
});

export type IMasterCompetitionCategory = z.infer<typeof masterCompetitionCategorySchema>;

export interface IMasterCompetitionCategoryResponse {
    success: boolean;
    message: string;
    data: {
        competitionCategoryList: IMasterCompetitionCategory[];
        count: number;
    };
}
