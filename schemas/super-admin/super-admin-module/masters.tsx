import { createCustomStringSchema, deleteIdSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const superAdminMasterSchema = {
    addOrUpdate: z.object({
        emsA_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        emsA_SuperAdminName: createCustomStringSchema('Super Admin Name', 3, 100),
        emsA_SuperAdminCode: createCustomStringSchema('Super Admin Code', 1, 20),
        emsA_SuperAdminDescription: createCustomStringSchema('Description', 1, 250),
        emsA_ActiveFlag: z.boolean().optional()
    }),
    toggle: z.object({
        emsA_Id: deleteIdSchema('emsA_Id'),
        emsA_ActiveFlag: z.boolean()
    }),
    delete: z.object({
        emsA_Id: deleteIdSchema('emsA_Id')
    }),
    order: z.object({
        emsA_Id: z.number(),
        emsA_SuperAdminOrder: z.number()
    })
};
