import { z } from 'zod';

export const sportsYearEndReportSchema = z.object({
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),
    asmcL_Id: z.coerce.number().min(1, 'Select Class'),
    asmS_Id: z.coerce.number().min(1, 'Select Section'),
});

export type SportsYearEndReportFormData = z.infer<typeof sportsYearEndReportSchema>;
