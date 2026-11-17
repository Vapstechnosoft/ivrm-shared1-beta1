import { z } from 'zod';

export const masterSchoolTypeSchema = z.object({
    ivrmmtyP_Id: z.number().optional(),
    ivrmmtyP_Type: z
        .string({ required_error: 'School Type is required' })
        .min(1, 'Enter the field School Type')
        .regex(/^[a-zA-Z ]+$/, 'School Type must contain only alphabets and spaces'),
    ivrmmtyP_Description: z
        .string({ required_error: 'School Description is required' })
        .min(1, 'Enter the field School Description'),
});

export type MasterSchoolTypeSchema = z.infer<typeof masterSchoolTypeSchema>;
