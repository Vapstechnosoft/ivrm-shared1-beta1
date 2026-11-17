import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema } from '../../validationSchemas';

export const masterProgramSchema = {
    addOrUpdate: z.object({
        spccpM_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccpM_Name: createCustomStringSchema('Program Name', 1, 100),
        spccpM_Description: createCustomStringSchema('Program Description', 1, 250),
        spccpM_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccpM_Id: deleteIdSchema('spccpM_Id')
    })
};
