import { z } from 'zod';

export const invTSalesItemSchema = z.object({
    invtsL_Id: z.number().optional(),
    invmsL_Id: z.number().optional(),
    invmI_Id: z.number().min(1, 'Item is required'),
    invmuoM_Id: z.number().optional(),
    invtsL_BatchNo: z.string().optional(),
    invtsL_SalesQty: z.number().min(0.01, 'Quantity must be greater than 0'),
    invtsL_SalesPrice: z.number().min(0, 'Price must be non-negative'),
    invtsL_DiscountAmt: z.number().min(0, 'Discount must be non-negative').optional(),
    invtsL_TaxAmt: z.number().min(0, 'Tax must be non-negative').optional(),
    invtsL_Amount: z.number().min(0, 'Amount must be non-negative'),
    invtsL_Naration: z.string().optional(),
    invtsL_ActiveFlg: z.boolean().optional(),
    availableStock: z.number().optional(),
    // Tax list for item
    SalesItemTax: z.array(z.object({
        invmT_Id: z.number(),
        invmT_TaxName: z.string().optional(),
        invtslT_TaxPer: z.number(),
        invtslT_TaxAmt: z.number()
    })).optional()
});

export const invTSalesSchema = z.object({
    invmsL_Id: z.number().optional(),
    invmsL_SalesNo: z.string().optional(),
    invmsL_SalesDate: z.date({
        required_error: "Sale Date is required",
    }),
    invmsL_SalesValue: z.number().optional(),
    invmsL_TotDiscount: z.number().optional(),
    invmsL_TotTaxAmt: z.number().optional(),
    invmsL_TotalAmount: z.number().optional(),
    invmsL_Remarks: z.string().optional(),
    invmsL_StuOtherFlg: z.enum(['Student', 'Staff', 'Customer']),
    invmsT_Id: z.number().min(1, 'Store is required'),
    // Conditionally specific fields
    amsT_Id: z.number().optional(), // Student
    asmcL_Id: z.number().optional(), // Class
    asmS_Id: z.number().optional(), // Section
    hrmE_Id: z.number().optional(), // Staff
    invmC_Id: z.number().optional(), // Customer

    // Sub items
    SaleItem: z.array(invTSalesItemSchema).min(1, "At least one item is required"),

    // UI Helpers
    stu_Flag: z.enum(['I', 'C', 'CS']).optional() // Individual, Class, Class/Section
});

export type InvTSalesSchema = z.infer<typeof invTSalesSchema>;
export type InvTSalesItemSchema = z.infer<typeof invTSalesItemSchema>;
