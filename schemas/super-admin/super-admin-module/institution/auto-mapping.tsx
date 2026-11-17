import { createCustomStringSchema, deleteIdSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const autoMappingSchema = {
    addOrUpdate: z.object({
        am_Id: z.number().optional(),
        Pervious_MI_Id: z.coerce.number().min(1, 'Select Reference Institute'),
        Current_MI_Id: z.coerce.number().min(1, 'Select Current Institute'),
        User_Name: z.string({ required_error: 'User Name is required' })
            .min(3, 'Minimum 3 characters required for User Name')
            .max(100, 'Maximum 100 characters allowed for User Name')
            .regex(/^[\d a-zA-Z@&]+$/, 'User Name contains invalid characters')
    })
};
