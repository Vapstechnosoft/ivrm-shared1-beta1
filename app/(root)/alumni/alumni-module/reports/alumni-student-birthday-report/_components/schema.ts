import { z } from 'zod';

export const birthdayReportSchema = z
    .object({
        all1: z.enum(['1', '0']).default('1'), // 1: Between Days, 0: Month Wise
        flag: z.enum(['S', 'L']).default('S'), // S: Studying, L: Left
        month: z.string().optional(),
        fromdate: z.date().optional(),
        todate: z.date().optional()
    })
    .refine(
        (data) => {
            if (data.all1 === '1') {
                return !!data.fromdate && !!data.todate;
            }
            if (data.all1 === '0') {
                return !!data.month;
            }
            return true;
        },
        {
            message: 'Required fields are missing based on selection',
            path: ['all1']
        }
    );

export type IBirthdayReportFormValues = z.infer<typeof birthdayReportSchema>;
