import { z } from 'zod';

export const MessMenuSchema = z.object({
  hlmmN_Id: z.number().optional(),
  hlmM_Id: z.number().min(1, { message: 'Select Mess Name' }),
  hlmmC_Id: z.number().min(1, { message: 'Select Mess Category' }),
  hlmmN_MenuName: z
    .string()
    .min(1, { message: 'Enter Mess Menu Name' })
    .max(50, { message: 'Mess Menu Name must be less than 50 characters' }),
  hlmmN_MenuDesc: z.string().optional(),
});

export type MessMenuSchemaType = z.infer<typeof MessMenuSchema>;
