import { z } from 'zod';

export const alumniSearchSchema = z.object({
    field: z.string().min(1, 'Select Field'),
    operator: z.string().min(1, 'Select Operator'),
    value: z.string().min(1, 'Enter Value')
});

export type AlumniSearchSchema = z.infer<typeof alumniSearchSchema>;
