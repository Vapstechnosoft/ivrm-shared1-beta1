import { z } from 'zod';

export const masterMainMenuSchema = z.object({
    ivrmmM_Id: z.number().optional(),
    ivrmM_Id: z.coerce.number({ required_error: 'Module Name is required' }).min(1, 'Select Module Name'),
    ivrmmM_MenuName: z
        .string({ required_error: 'Main Menu Name is required' })
        .min(1, 'Enter the field Main Menu Name')
        .max(20, 'The field should not exceed more than 20 Characters')
        .regex(/^[a-zA-Z\s]+$/, 'The field contains only alphabets'),
});

export type MasterMainMenuSchema = z.infer<typeof masterMainMenuSchema>;
