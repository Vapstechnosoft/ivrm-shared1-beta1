import { z } from 'zod';

export const eventSponsorSchema = {
    addOrUpdate: z.object({
        spccesP_Id: z.number().default(0),
        mI_Id: z.number().default(1),
        spccE_Id: z.number({ required_error: 'Program Name is required' }).min(1, 'Program Name is required'),
        spccpM_Name: z.string().optional(),
        spccmsP_Id: z.number({ required_error: 'Sponsor Name is required' }).min(1, 'Sponsor Name is required'),
        spccesP_ActiveFlag: z.boolean().default(true)
    })
};
