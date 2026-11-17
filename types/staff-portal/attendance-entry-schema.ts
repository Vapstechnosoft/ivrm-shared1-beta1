
import { z } from 'zod';

export const attendanceEntrySchema = z.object({
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),
    asmcL_Id: z.coerce.number().min(1, 'Select Class'),
    entry: z.enum(['Dailyonce', 'Dailytwice', 'monthly', 'period', '']).optional(),

    // Daily Once / Twice / Period / Monthly shared fields but used differently
    asmC_Id: z.coerce.number().optional(),
    ASA_Entry_DateTime: z.date().optional(),

    // Monthly specific
    ivrM_Month_Id: z.coerce.number().optional(),
    ASA_FromDate: z.date().optional(),
    ASA_ToDate: z.date().optional(),

    // Period specific
    ismS_Id: z.coerce.number().optional(),
    ttmP_Id: z.coerce.number().optional(),
    asasB_Id: z.coerce.number().optional(),
    ASA_Regular_Extra: z.string().default('Regular'),
}).superRefine((data, ctx) => {
    if (!data.entry) return;

    if (data.entry === 'Dailyonce' || data.entry === 'Dailytwice' || data.entry === 'monthly' || data.entry === 'period') {
        if (!data.asmC_Id || data.asmC_Id <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Section',
                path: ['asmC_Id'],
            });
        }
    }

    if (data.entry === 'Dailyonce' || data.entry === 'Dailytwice' || data.entry === 'period') {
        if (!data.ASA_Entry_DateTime) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Date',
                path: ['ASA_Entry_DateTime'],
            });
        }
    }

    if (data.entry === 'monthly') {
        if (!data.ivrM_Month_Id || data.ivrM_Month_Id <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Month',
                path: ['ivrM_Month_Id'],
            });
        }
    }

    if (data.entry === 'period') {
        if (!data.ismS_Id || data.ismS_Id <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Subject',
                path: ['ismS_Id'],
            });
        }
        if (!data.ttmP_Id || data.ttmP_Id <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Period',
                path: ['ttmP_Id'],
            });
        }
    }
});

export type AttendanceEntryValues = z.infer<typeof attendanceEntrySchema>;
