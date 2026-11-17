import { createStringOnlySchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const alumninoticeboardSchema = {
    addOrUpdate: z.object({
        alntb_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        alntb_Title: createStringOnlySchema('Notice Title ', 3, 100),
        alntb_Description: createStringOnlySchema('Description ', 3, 100),
        alntb_StartDate: z.string().min(1, 'Select Start Date'),
        alntb_EndDate: z.string().min(1, 'Select End Date'),
        intb_DispalyDisableFlg: z.boolean().default(true)
    }),

    delete: z.object({
        alntb_Id: z.number({ required_error: 'alntb_Id is required' })
    })
};
