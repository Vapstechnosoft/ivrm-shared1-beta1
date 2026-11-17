import { z } from 'zod';
import { deleteIdSchema } from '../validationSchemas';

export const masterEventCoeSchema = {
    addOrUpdate: z.object({
        masterevent: z.string().min(1, 'Master Event Name is required'),
        masterDescription: z.string().min(1, 'Master Description is required'),
        smsContent: z.string().optional(),
        smsparameter: z.string().optional(),
        emailSubject: z.string().min(1, 'Email Subject is required'),
        emailHeader: z.string().min(1, 'Email Header is required'),
        emailMessage: z.string().optional(),
        eemailParamter: z.string().optional(),
        emailFooter: z.string().min(1, 'Email Footer is required'),
        type: z.enum(['mc', 'dc']).default('mc'),
    }).superRefine((data, ctx) => {
        if (data.type === 'mc') {
            if (!data.smsContent) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "SMS Content is required",
                    path: ["smsContent"]
                });
            }
            if (!data.emailMessage) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Email Message is required",
                    path: ["emailMessage"]
                });
            }
        }
    }),
    delete: z.object({
        coemE_Id: deleteIdSchema('coemE_Id')
    })
};

export const mappingEventCoeSchema = {
    addOrUpdate: z.object({
        coee_Id: z.number().optional(),
        asmaY_Id: z.number().optional(),
        coemE_Id: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        reminderDate: z.date().optional(),
        reminderDays: z.string().optional(),
        smsActiveFlag: z.boolean().optional(),
        mailActiveFlag: z.boolean().optional(),
        repeatFlag: z.boolean().optional(),
        reminderSchedule: z.string().optional(),
        studentFlag: z.boolean().optional(),
        alumniFlag: z.boolean().optional(),
        employeeFlag: z.boolean().optional(),
        otherFlag: z.boolean().optional(),
        classes: z.array(z.number()).optional(),
        staffTypes: z.array(z.number()).optional(),
        alumniYear: z.number().optional(),
        others: z.array(z.object({
            name: z.string().optional(),
            mobile: z.string().optional(),
            email: z.string().optional()
        })).optional(),
        uploads: z.array(z.object({
            name: z.string().optional(),
            fileKey: z.string().optional(), // For storing the file path/url after upload
            // We might need to handle the actual File object separately in the form component state if not directly in z.infer
        })).optional(),
        videos: z.array(z.object({
            name: z.string().optional(),
            url: z.string().optional(), // Or fileKey if it's an uploaded video
        })).optional(),
        smsMessage: z.string().optional(), // Read-only from master event usually, but payload includes it
        mailSubject: z.string().optional(),
        mailHeader: z.string().optional(),
        mailFooter: z.string().optional(),
        mailMessage: z.string().optional(),
        mailTemplate: z.string().optional(),
    })
};

export const coeReportSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' }),
        asmcl_Id: z.number().optional(),
        month: z.number().optional()
    })
};

export const coeMonthEndReportSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' }),
        ieName: z.string().optional(),
        month: z.string().optional()
    })
};
