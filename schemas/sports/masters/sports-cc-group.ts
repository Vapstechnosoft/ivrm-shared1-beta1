import { z } from 'zod';

export const masterSportsCCGroupSchema = z.object({
    spccmsccG_Id: z.any(),
    spccmsccG_SportsCCGroupName: z
        .string()
        .min(1, { message: 'Group Name is required' })
        .max(100, { message: 'Group Name cannot exceed 100 characters' })
        .regex(/^[a-zA-Z\s]+$/, { message: 'Sports Group Name will accept only alphabets' }),
    spccmsccG_SportsCCGroupDesc: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(250, { message: 'Description cannot exceed 250 characters' }),
    spccmsccG_SCCFlag: z.string().min(1, { message: 'SCC Flag is required' })
});
