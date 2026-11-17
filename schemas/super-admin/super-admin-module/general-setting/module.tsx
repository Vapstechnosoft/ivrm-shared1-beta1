import { z } from 'zod';

export const masterModuleSchema = z.object({
    ivrmM_Id: z.number().optional(),
    ivrmM_ModuleName: z
        .string({ required_error: 'Module Name is required' })
        .min(1, 'Module Name is required')
        .max(20, 'Module Name should not exceed 20 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Module Name contains only alphabets'),
    ivrmM_ModuleDesc: z
        .string({ required_error: 'Module Description is required' })
        .min(1, 'Module Description is required')
        .max(200, 'Module Description should not exceed 200 characters'),
    module_ActiveFlag: z.number().optional().default(1),
});

export type MasterModuleSchema = z.infer<typeof masterModuleSchema>;
