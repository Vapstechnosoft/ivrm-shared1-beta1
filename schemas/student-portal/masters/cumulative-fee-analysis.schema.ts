import { z } from 'zod';

export const cumulativeFeeAnalysisSchema = z.object({
    asmaY_Id: z.string().min(1, 'Please Select Academic Year')
});

export type CumulativeFeeAnalysisSchema = z.infer<typeof cumulativeFeeAnalysisSchema>;
