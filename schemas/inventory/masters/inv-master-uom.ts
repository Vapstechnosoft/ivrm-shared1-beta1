import { z } from 'zod';

export const invMasterUOMSchema = z.object({
    invmuoM_Id: z.number().default(0),
    invmuoM_UOMName: z.string().min(1, 'Please Enter UOM Name'),
    invmuoM_UOMAliasName: z.string().optional().nullable(),
    invmuoM_Qty: z.string().min(1, 'Please Enter UOM Quantity').max(10, 'Max 10 characters allowed'),
    invmuoM_ActiveFlg: z.boolean().default(true)
});

export type InvMasterUOMType = z.infer<typeof invMasterUOMSchema>;
