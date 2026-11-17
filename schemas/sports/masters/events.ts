import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema } from '../../validationSchemas';

export const masterEventSchema = {
    addOrUpdate: z.object({
        spccmE_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmE_EventName: createCustomStringSchema('Event Name', 1, 100),
        spccmE_EventNameDesc: createCustomStringSchema('Event Description', 1, 250),
        spccmE_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccmE_Id: deleteIdSchema('spccmE_Id')
    })
};
