import { z } from 'zod';

export const houseInchargeReportSchema = z.object({
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),
    selectedhouselist: z.array(z.coerce.number()).min(1, 'Select House'),
});

export type HouseInchargeReportFormData = z.infer<typeof houseInchargeReportSchema>;
