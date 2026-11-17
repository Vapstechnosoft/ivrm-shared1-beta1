import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema } from '../../validationSchemas';

export const masterDivisionSchema = {
    addOrUpdate: z.object({
        spccmD_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmD_DivisionName: createCustomStringSchema('Division Name', 1, 100),
        spccmD_DivisionDescription: createCustomStringSchema('Division Description', 1, 250),
        spccmD_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccmD_Id: deleteIdSchema('spccmD_Id')
    })
};
