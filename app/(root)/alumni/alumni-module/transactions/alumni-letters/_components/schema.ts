import { z } from 'zod';

export const alumniLettersSchema = z.object({
    reporttype: z.enum(['Alumni', 'Regular']),
    letter_list: z.string().min(1, 'Select Letter Type'),
    display_DateandTime: z.string().optional(),
    asmaY_Id: z.string().min(1, 'Select Academic Year'),
    asmcL_Id: z.string().min(1, 'Select Class')
});

export type AlumniLettersSchema = z.infer<typeof alumniLettersSchema>;
