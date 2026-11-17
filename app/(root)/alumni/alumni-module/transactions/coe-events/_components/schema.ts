import { z } from 'zod';

export const masterEventsSchema = z.object({
    COEME_Id: z.number().default(0),
    radiotype: z.enum(['Manual', 'Default']).default('Manual'),
    COEME_EventName: z.string().min(1, 'Event Name is required'),
    COEME_EventDesc: z.string().min(1, 'Event Description is required'),
    COEME_SMSMessage: z.string().optional(),
    COEME_MailSubject: z.string().min(1, 'Email Subject is required'),
    COEME_MailHeader: z.string().min(1, 'Email Header is required'),
    COEME_Mail_Message: z.string().optional(),
    COEME_MailFooter: z.string().min(1, 'Email Footer is required'),
    ISES_Parameter_sms: z.array(z.string()).optional(),
    ISES_Parameter_email: z.array(z.string()).optional(),
    COEME_ActiveFlag: z.boolean().default(true)
});

export const eventOtherSchema = z.object({
    COEEO_Id: z.number().default(0),
    COEEO_Name: z.string().min(1, 'Name is required'),
    COEEO_MobileNo: z.string().length(10, 'Mobile No must be 10 digits'),
    COEEO_Emailid: z.string().email('Invalid email address')
});

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

export type IMasterEventsFormValues = z.infer<typeof masterEventsSchema>;
export type IEventsMapFormValues = z.infer<typeof eventsMapSchema>;
