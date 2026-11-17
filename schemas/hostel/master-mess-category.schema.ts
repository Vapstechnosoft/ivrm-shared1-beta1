import { z } from 'zod';

export const masterMessCategorySchema = z.object({
    hlmmC_Id: z.number().optional(),
    hlmmC_Name: z.string().min(1, 'Mess Category Name is required'),
    hlmmC_ActiveFlag: z.boolean().optional()
});

export type IMasterMessCategoryForm = z.infer<typeof masterMessCategorySchema>;
