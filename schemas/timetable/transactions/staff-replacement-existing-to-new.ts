import * as z from 'zod';

export const StaffRepacementExistingToNewSchema = z.object({
    ttmC_Id: z.string().min(1, 'Please Provide Category'), //category
    asmcL_Id: z.string().optional(), //Class
    asms_Id: z.string().optional(), //Section
    hrmE_Id_From: z.string().min(1, 'Replace Staff From is required'), //staff from
    hrmE_Id_To: z.string().min(1, 'Replace Staff To is required'), //staff to
    ismS_Id: z.string().optional() //Subject
});

export type StaffReplacementExistingToNewValues = z.infer<typeof StaffRepacementExistingToNewSchema>;
