import { z } from 'zod';

export const masterMenuPageMappingSchema = z.object({
    ivrmM_Id: z.coerce.number({ required_error: 'Module Name is required' }).min(1, 'Select Module Name'),
    ivrmmM_Id: z.coerce.number({ required_error: 'Main Menu Name is required' }).min(1, 'Select Main Menu Name'),
    ivrmmS_Id: z.coerce.number({ required_error: 'Sub Menu Name is required' }).min(1, 'Select Sub Menu Name'),
});

export type MasterMenuPageMappingSchema = z.infer<typeof masterMenuPageMappingSchema>;
