
import { z } from 'zod';

export const invOpeningBalanceItemSchema = z.object({
    itrS_Id: z.string().optional(), // UI helper ID
    invmI_Id: z.coerce.number().min(1, 'Item is required'),
    invmI_ItemName: z.string().optional(), // For display
    invmuoM_Id: z.coerce.number().min(1, 'UOM is required'),
    invmuoM_UOMName: z.string().optional(),
    invoB_BatchNo: z.string().min(1, 'Batch No is required'),
    invoB_PurchaseDate: z.date({ required_error: 'Purchase Date is required' }),
    invoB_Qty: z.coerce.number().min(0.0001, 'Quantity must be greater than 0'),
    invstO_PurchaseRate: z.coerce.number().min(0, 'Purchase Rate must be non-negative'),
    invoB_TotalAmount: z.coerce.number().optional(), // This is calculated
    invstO_SalesRate: z.coerce.number().min(0, 'Sales Rate must be non-negative'),
    invoB_Naration: z.string().optional(),
    invoB_MfgDate: z.date().optional().nullable(),
    invoB_ExpDate: z.date().optional().nullable(),
});

export const invOpeningBalanceSchema = z.object({
    invoB_Id: z.number().optional(),
    invmsT_Id: z.coerce.number().min(1, 'Store is required'),
    transrows: z.array(invOpeningBalanceItemSchema).min(1, 'At least one item is required'),
});

export type TInvOpeningBalance = z.infer<typeof invOpeningBalanceSchema>;
export type TInvOpeningBalanceItem = z.infer<typeof invOpeningBalanceItemSchema>;
