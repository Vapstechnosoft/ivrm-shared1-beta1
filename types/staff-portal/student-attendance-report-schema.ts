
import { z } from 'zod';

export const studentAttendanceReportSchema = z.object({
    asmaY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    amC_Id: z.coerce.number().optional(),
    radiotype: z.coerce.number().default(1), // 1: Monthly, 2: Between Date, 3: Daily
    type: z.coerce.number().default(1), // 1: All, 2: Individual
    type1: z.string().default('1'), // 1: Adm No, 2: Name (for individual)
    amM_Id: z.coerce.number().optional(),
    fromdate: z.date().optional(),
    todate: z.date().optional(),
    fromdaily: z.date().optional(),
    amst_Id: z.coerce.number().optional(),
    checkoruncheck: z.boolean().default(false), // Month Date Wise
});

export type StudentAttendanceReportValues = z.infer<typeof studentAttendanceReportSchema>;
