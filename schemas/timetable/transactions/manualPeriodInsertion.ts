import * as z from 'zod';

export const ManualPeriodInsertionSchema = z.object({
    asmaY_Id: z.string().min(1, 'Academic Year is required'),
    ttmC_Id: z.string().min(1, 'Category is required'),
    asmcL_Id: z.string().min(1, 'Class is required'),
    asms_Id: z.string().optional()
});

export type ManualPeriodInsertionValues = z.infer<typeof ManualPeriodInsertionSchema>;
