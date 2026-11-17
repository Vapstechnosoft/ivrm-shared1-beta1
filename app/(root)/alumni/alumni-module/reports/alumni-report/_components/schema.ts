import { z } from 'zod';

export const alumniReportSchema = z.object({
    sall: z.coerce.number().default(1), // 1: Alumni Report, 0: Address Book
    batchIds: z.array(z.number()).min(1, 'Select at least one Batch'),
    countryIds: z.array(z.number()).optional(),
    stateIds: z.array(z.number()).optional(),
    districtIds: z.array(z.number()).optional(),
    classIds: z.array(z.number()).optional(),
    city: z.string().optional(),
    occupation: z.string().optional(),
    showEmail: z.boolean().default(true),
    showPhone: z.boolean().default(true)
});

export type AlumniReportFormValues = z.infer<typeof alumniReportSchema>;
