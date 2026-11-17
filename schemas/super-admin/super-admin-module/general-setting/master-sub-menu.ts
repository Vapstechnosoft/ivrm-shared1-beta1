import { z } from 'zod';

export const masterSubMenuSchema = z.object({
    ivrmmS_Id: z.number().optional(),
    ivrmM_Id: z.coerce.number({ required_error: 'Module Name is required' }).min(1, 'Select Module Name'),
    ivrmmM_Id: z.coerce.number({ required_error: 'Main Menu Name is required' }).min(1, 'Select Main Menu Name'),
    ivrmmS_SubMenuName: z
        .string({ required_error: 'Sub Menu Name is required' })
        .min(1, 'Enter the field Sub Menu Name')
        .max(20, 'The field should not exceed more than 20 Characters')
        .regex(/^[a-zA-Z\s]+$/, 'The field contains only alphabets'),
    ivrmmS_Order: z.coerce
        .number({ required_error: 'Sub Menu Order is required' })
        .min(1, 'Enter the field Sub Menu Order')
        .max(999, 'The field should not exceed more than 3 digits')
});

export type MasterSubMenuSchema = z.infer<typeof masterSubMenuSchema>;
