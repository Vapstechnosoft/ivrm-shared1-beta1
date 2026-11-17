import { z } from 'zod';

export const masterUOMSchema = {
    addOrUpdate: z.object({
        spccmuoM_Id: z.coerce.number().optional(),
        spccmuoM_UOMName: z.string().min(1, { message: 'UOM Name is required' }),
        spccmuoM_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        spccmuoM_Id: z.string().min(1, { message: 'UOM ID is required' })
    })
};
