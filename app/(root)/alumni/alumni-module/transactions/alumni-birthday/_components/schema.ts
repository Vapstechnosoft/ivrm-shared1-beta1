import { z } from 'zod';

export const birthdayFormSchema = z.object({
    radioption: z.enum(['student', 'Staff', 'Alumni']).default('student'),
    sms: z.boolean().default(false),
    email: z.boolean().default(false),
    Whatsapp: z.boolean().default(false),
    selectedParticipants: z.array(z.any()).min(1, 'Please select at least one participant')
});

export const feedbackSchema = z.object({
    FMQE_Id: z.number(),
    FMTY_Id: z.number(),
    fmoP_Id: z.number({ required_error: 'Please select an option' }),
    fsttR_FeedBack: z.string().min(1, 'Please enter remarks')
});

export type IBirthdayFormValues = z.infer<typeof birthdayFormSchema>;
export type IFeedbackFormValues = z.infer<typeof feedbackSchema>;
