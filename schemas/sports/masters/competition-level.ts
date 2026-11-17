import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema } from '../../validationSchemas';

export const masterCompetitionLevelSchema = {
    addOrUpdate: z.object({
        spccmcL_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmcL_CompitionLevel: createCustomStringSchema('Competition Level Name', 1, 60),
        spccmcL_CLDesc: createCustomStringSchema('Competition Description', 1, 60),
        spccmcL_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccmcL_Id: deleteIdSchema('spccmcL_Id')
    })
};
