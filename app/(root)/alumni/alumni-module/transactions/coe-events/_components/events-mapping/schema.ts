import { z } from 'zod';

export const eventsMapSchema = z.object({
    COEE_Id: z.number().default(0),
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    COEME_Id: z.string().min(1, 'Event Name is required'),
    COEE_EStartDate: z.date({ required_error: 'Start Date is required' }),
    COEE_EEndDate: z.date({ required_error: 'End Date is required' }),
    COEE_EStartTime: z.string().min(1, 'Start Time is required'),
    COEE_EEndTime: z.string().min(1, 'End Time is required'),
    COEE_StudentFlag: z.boolean().default(false),
    COEE_EmployeeFlag: z.boolean().default(false),
    COEE_OtherFlag: z.boolean().default(false),
    COEE_AlumniFlag: z.boolean().default(false),
    COEE_ManagementFlag: z.boolean().default(false),
    stu_class_list: z
        .array(
            z.object({
                ASMCL_Id: z.number()
            })
        )
        .default([]),
    emp_type_list: z
        .array(
            z.object({
                HRMD_Id: z.number()
            })
        )
        .default([]),
    images_listCoe: z
        .array(
            z.object({
                COEEI_Images: z.string()
            })
        )
        .default([]),
    videos_list: z
        .array(
            z.object({
                COEEV_VideoURL: z.string()
            })
        )
        .default([])
});

export type EventsMapFormValues = z.infer<typeof eventsMapSchema>;
