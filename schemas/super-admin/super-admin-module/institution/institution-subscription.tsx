import { createCustomStringSchema, deleteIdSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const institutionSubscriptionSchema = {
    addOrUpdate: z.object({
        misV_Id: z.number().optional(),
        mI_Id: z.coerce.number().min(1, 'Select Institution'),
        misV_SubscriptionType: createCustomStringSchema('Subscription Type', 3, 100),
        misV_FromDate: z.date({ required_error: 'Start Date is required' }),
        misV_ToDate: z.date({ required_error: 'End Date is required' }),
        misV_ActiveFlag: z.boolean().optional(),
        misV_SubscriptionNo: z.string().optional()
    }),
    toggle: z.object({
        misV_Id: deleteIdSchema('misV_Id'),
        misV_ActiveFlag: z.boolean()
    }),
    delete: z.object({
        misV_Id: deleteIdSchema('misV_Id')
    })
};
