import { z } from 'zod';

export const userPasswordCreationSchema = z
    .object({
        filterdata: z.enum(['reg', 'new', 'Alumni']).default('reg'),
        asmaY_Id: z.string({ required_error: 'Please Select Academic Year' }).min(1, 'Please Select Academic Year'),
        asmcL_Id: z.string({ required_error: 'Please Select Class' }).min(1, 'Please Select Class'),
        asmS_Id: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.filterdata !== 'Alumni' && (!data.asmS_Id || data.asmS_Id === '')) {
                return false;
            }
            return true;
        },
        {
            message: 'Please Select Section',
            path: ['asmS_Id']
        }
    );

export type UserPasswordCreationSchema = z.infer<typeof userPasswordCreationSchema>;
