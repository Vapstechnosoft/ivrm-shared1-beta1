import { z } from 'zod';

export const timeTableGenerationSchema = z.object({
    asmaY_Id: z.string().min(1, 'Academic Year is required'),
    ttmC_Id: z.string().min(1, 'Category Name is required')
});
// const schema = z.object({
//     hrmE_Id: z.string().min(1, "Please select a staff member"),
// });

export type TimeTableGenerationValues = z.infer<typeof timeTableGenerationSchema>;
