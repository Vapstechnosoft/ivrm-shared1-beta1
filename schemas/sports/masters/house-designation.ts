import { z } from 'zod';

export const masterHouseDesignationSchema = {
    addOrUpdate: z.object({
        spccmhD_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmhD_DesignationName: z.string().min(1, 'Designation Name is required'),
        spccmhD_DesignationDescription: z.string().min(1, 'Description is required'),
        spccmhD_ActiveFlag: z.boolean().optional().default(true)
    })
};
