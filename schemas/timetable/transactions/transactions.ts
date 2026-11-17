import { z } from 'zod';

export const uniformDistributionSchema = z.object({
    ttmC_Id: z.number({
        required_error: 'Category is required'
    }),

    calssids: z.array(z.string()).min(1, 'Select at least one class')
});

export type UniformDistributionForm = z.infer<typeof uniformDistributionSchema>;
