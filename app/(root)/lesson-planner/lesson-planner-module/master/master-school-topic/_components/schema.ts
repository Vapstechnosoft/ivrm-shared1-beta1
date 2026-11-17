import { z } from 'zod';

export const masterSchoolTopicSchema = z.object({
    lpmmT_Id: z.number().optional(),
    lpmmT_TopicName: z.string().min(1, 'Topic Name is required'),
    lpmmT_TopicDescription: z.string().optional(),
    lpmmT_TotalHrs: z.coerce.number().optional().nullable(),
    lpmmT_TotalPeriods: z.coerce.number().optional().nullable(),
    asmaY_Id: z.coerce.number({ required_error: 'Year is required' }).min(1, 'Year is required'),
    asmcL_Id: z.coerce.number({ required_error: 'Class is required' }).min(1, 'Class is required'),
    ismS_Id: z.coerce.number({ required_error: 'Subject is required' }).min(1, 'Subject is required'),
    lpmU_Id: z.coerce.number({ required_error: 'Unit is required' }).min(1, 'Unit is required')
});

export type MasterSchoolTopicSchema = z.infer<typeof masterSchoolTopicSchema>;
