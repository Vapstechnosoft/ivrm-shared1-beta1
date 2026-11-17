import { z } from 'zod';

export const invMasterStoreSchema = z.object({
    invmsT_Id: z.number().default(0),
    invmS_StoreName: z.string().min(1, 'Store Name is required'),
    invmS_StoreLocation: z.string().min(1, 'Store Location is required'),
    invmS_ContactPerson: z.string().optional(),
    invmS_ContactNo: z.coerce.string().min(1, 'Contact Number is required'),
    hrmE_Id: z.coerce.number().min(1, 'Store Incharge is required'),
    invmS_ActiveFlg: z.boolean().optional(),
});

export type TInvMasterStore = z.infer<typeof invMasterStoreSchema>;
