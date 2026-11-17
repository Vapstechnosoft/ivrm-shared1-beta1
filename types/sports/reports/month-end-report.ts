import { z } from 'zod';

export const MonthEndReportSchema = z.object({
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),
    month: z.number().min(0, { message: 'Month is required' }), // Assuming 0-indexed or 1-indexed, validating as number
    iename: z.string().optional(),
});

export type MonthEndReportFormSchema = z.infer<typeof MonthEndReportSchema>;

export interface IMonthEndReportData {
    total_count_student: number;
    not_patr_std: number;
    total_partic_student: number;
    total_winner_student: number;
}
