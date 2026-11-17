import { z } from 'zod';

export const alumniNoticeBoardSchema = z
    .object({
        alntB_Id: z.number().optional(),
        alntB_Title: z.string().min(1, 'Notice Title is required'),
        alntB_Description: z.string().optional(),
        alntB_StartDate: z.coerce.date({ required_error: 'Start Date is required' }),
        alntB_EndDate: z.coerce.date({ required_error: 'End Date is required' }),
        alntB_DisplayDate: z.coerce.date().optional().nullable(),
        intB_DispalyDisableFlg: z.boolean().default(false),
        attachment_Array: z
            .array(
                z.object({
                    alntbfL_Id: z.number().optional(),
                    alntbfL_FilePath: z.string(),
                    alntbfL_FileName: z.string()
                })
            )
            .optional()
    })
    .superRefine((data, ctx) => {
        if (data.alntB_StartDate && data.alntB_EndDate) {
            if (data.alntB_StartDate > data.alntB_EndDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Start Date cannot be greater than End Date',
                    path: ['alntB_StartDate']
                });
            }
        }

        if (data.intB_DispalyDisableFlg) {
            if (!data.alntB_DisplayDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Display Date is required when checkbox is checked',
                    path: ['alntB_DisplayDate']
                });
            }
            if (data.alntB_DisplayDate && data.alntB_EndDate) {
                if (data.alntB_DisplayDate > data.alntB_EndDate) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Display Date cannot be greater than End Date',
                        path: ['alntB_DisplayDate']
                    });
                }
            }
        }
    });

export type AlumniNoticeBoardSchema = z.infer<typeof alumniNoticeBoardSchema>;
