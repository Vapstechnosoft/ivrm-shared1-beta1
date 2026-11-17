
import { z } from 'zod';

export const invStockRowSchema = z.object({
    invstO_Id: z.number().default(0),
    invmsT_Id: z.coerce.number().min(1, 'Store is required'),
    invmI_Id: z.coerce.number().min(1, 'Item is required'),
    invstO_BatchNo: z.string().min(1, 'Batch No. is required'),
    invstO_PurchaseDate: z.date({ required_error: 'Purchase Date is required' }),
    invstO_PurchaseRate: z.coerce.number().min(0),
    invstO_SalesRate: z.coerce.number().min(0),
    invstO_ItemConQty: z.coerce.number().default(0),
    invstO_PurOBQty: z.coerce.number().default(0),
    invstO_PurRetQty: z.coerce.number().default(0),
    invstO_SalesQty: z.coerce.number().default(0),
    invstO_SalesRetQty: z.coerce.number().default(0),
    invstO_MatIssPlusQty: z.coerce.number().default(0),
    invstO_MatIssMinusQty: z.coerce.number().default(0),
    invstO_PhyPlusQty: z.coerce.number().default(0),
    invstO_PhyMinQty: z.coerce.number().default(0),
    invstO_AvaiableStock: z.coerce.number().default(0),

    // Virtual fields for UI
    invmI_ItemName: z.string().optional(),
    invmS_StoreName: z.string().optional(),
});

export const invStockSchema = z.object({
    stocklist: z.array(invStockRowSchema).min(1, 'At least one stock record is required'),
});

export type TInvStock = z.infer<typeof invStockSchema>;
export type TInvStockRow = z.infer<typeof invStockRowSchema>;
