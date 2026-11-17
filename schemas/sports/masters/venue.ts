import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema } from '../../validationSchemas';

export const masterVenueSchema = {
    addOrUpdate: z.object({
        spccmeV_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmeV_EventVenue: createCustomStringSchema('Event Venue', 1, 100),
        spccmeV_EventVenueDesc: createCustomStringSchema('Event Venue Description', 1, 250),
        spccmeV_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccmeV_Id: deleteIdSchema('spccmeV_Id')
    })
};
