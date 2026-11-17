import { z } from 'zod';

export const invMasterItemSchema = z.object({
    invmG_Id: z.coerce.number().min(1, 'Please Select Group'),
    mainGroupId: z.coerce.number().optional(), // Main Group for filtering, optional as it's not saved directly
    invmI_ItemName: z.string().min(1, 'Please Enter Item Name'),
    invmI_MaxStock: z.coerce.number().optional().nullable(),
    invmI_TaxAplFlg: z.boolean().default(false),
    invmuoM_Id: z.coerce.number().min(1, 'Please Select UOM'),
    invmI_ItemCode: z.string().optional().nullable(),
    invmI_ReorderStock: z.coerce.number().optional().nullable(),
    invmI_HSNCode: z.string().optional().nullable(),
    invmI_RawMatFlg: z.boolean().default(false),
    invmI_ForSaleFlg: z.boolean().default(false),
    invmI_MaintenanceAplFlg: z.boolean().default(false),
    invmI_Id: z.number().default(0),
    famcomP_Id: z.coerce.number().optional().nullable(),
    famleD_Id: z.coerce.number().optional().nullable(),
    tax_Applicable: z.array(z.object({
        invmiT_Id: z.number().default(0),
        invmT_Id: z.number(),
        invmiT_TaxValue: z.coerce.number()
    })).optional().default([]),
});

export type TInvMasterItem = z.infer<typeof invMasterItemSchema>;
