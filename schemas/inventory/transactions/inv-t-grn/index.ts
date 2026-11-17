import { z } from 'zod';

export const invTGRNItemTaxSchema = z.object({
    invtgrnT_Id: z.number().default(0),
    invtgrN_Id: z.number().default(0),
    invmT_Id: z.number().min(1, 'Select Tax'),
    invtgrnT_TaxPer: z.number().default(0),
    invtgrnT_TaxAmt: z.number().default(0),
});

export const invTGRNItemSchema = z.object({
    invtgrN_Id: z.number().default(0),
    invmgrN_Id: z.number().default(0),
    invmI_Id: z.number().min(1, 'Select Item'),
    invmuoM_Id: z.number().min(1, 'UOM is required'),
    invmuoM_UOMName: z.string().optional(),
    invtgrN_BatchNo: z.string().min(1, 'Enter Batch No'),
    invtgrN_Qty: z.number().min(1, 'Enter Quantity'),
    invtgrN_MfgDate: z.union([z.date(), z.string()]).optional().nullable(),
    invtgrN_ExpDate: z.union([z.date(), z.string()]).optional().nullable(),
    invtgrN_PurchaseRate: z.number().min(0, 'Enter Purchase Rate'),
    invtgrN_MRP: z.number().min(0, 'Enter MRP'),
    invtgrN_DiscountAmt: z.number().default(0),
    invtgrN_SalesPrice: z.number().min(0, 'Enter Sales Price'),
    invtgrN_Amount: z.number().default(0),
    invtgrN_Naration: z.string().optional(),
    invtgrN_TaxAmt: z.number().default(0),
    GRNItemTax: z.array(invTGRNItemTaxSchema).optional(),
});

export const invTGRNSchema = z.object({
    invmgrN_Id: z.number().default(0),
    invmgrN_GRNNo: z.string().optional(),
    invmgrN_InvoiceNo: z.string().optional(),
    invmgrN_PurchaseDate: z.union([z.date(), z.string()]),
    invmgrN_PurchaseValue: z.number().default(0),
    invmgrN_TotDiscount: z.number().default(0),
    invmgrN_TotTaxAmt: z.number().default(0),
    invmgrN_TotalAmount: z.number().default(0),
    invmgrN_Remarks: z.string().optional(),
    invmgrN_ReturnFlg: z.boolean().default(false),
    invmgrN_PaidFlg: z.boolean().default(false),
    invmgrN_CreditFlg: z.boolean().default(false),
    invmsT_Id: z.number().min(1, 'Select Store'),
    invmS_Id: z.number().min(1, 'Select Supplier'),
    invmgrN_POReference: z.string().optional(),
    invmgrN_EWayBillRef: z.string().optional(),
    invmgrN_TowardsProjects: z.string().optional(),
    invmgrN_PODate: z.union([z.date(), z.string(), z.null()]).optional(),
    invmgrN_Prepared: z.string().optional(),
    invmgrN_SignedBy: z.string().optional(),
    invmgrN_ChallanNo: z.string().optional(),
    invmgrN_Challandate: z.union([z.date(), z.string(), z.null()]).optional(),
    invmgrN_Challanverfied: z.string().optional(),
    invmgrN_KitNo: z.string().optional(),
    GRNItem: z.array(invTGRNItemSchema).min(1, 'Add at least one item'),
});

export type InvTGRNSchema = z.infer<typeof invTGRNSchema>;
export type InvTGRNItemSchema = z.infer<typeof invTGRNItemSchema>;
