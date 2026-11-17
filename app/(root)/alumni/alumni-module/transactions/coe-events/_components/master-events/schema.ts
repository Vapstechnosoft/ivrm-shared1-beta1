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

export type MasterEventsFormValues = z.infer<typeof masterEventsSchema>;
