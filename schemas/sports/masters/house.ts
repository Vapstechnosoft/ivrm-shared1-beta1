import { z } from 'zod';

export const masterHouseSchema = {
    addOrUpdate: z.object({
        spccmH_Id: z.number().optional(),
        spccmH_HouseName: z.string().min(1, { message: 'House Name is required' }),
        spccmH_HouseDescription: z.string().min(1, { message: 'House Description is required' }),
        spccmH_Flag: z.string().min(1, { message: 'House/Committee selection is required' }),
        spccmH_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        spccmH_Id: z.string().min(1, { message: 'House ID is required' })
    })
};
