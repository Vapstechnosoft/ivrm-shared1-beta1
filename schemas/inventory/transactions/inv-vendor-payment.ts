import { z } from 'zod';

export const invVendorPaymentSchema = z.object({
    invspT_Id: z.number().optional(),
    invmS_Id: z.number().min(1, 'Supplier is required'),
    invspT_PaymentDate: z.date({ required_error: 'Payment Date is required' }),
    invspT_ModeOfPayment: z.string().min(1, 'Mode of Payment is required'),
    invspT_BankName: z.string().optional(),
    invspT_ChequeDDNo: z.string().optional(),
    invspT_ChequeDDDate: z.date().optional(),
    invspT_PaymentReference: z.string().optional(),
    invspT_Amount: z.number(),
    invspT_Remarks: z.string().optional(),
    paymentArray: z.array(z.object({
        invsptgrN_Id: z.number().optional(),
        invmgrN_Id: z.number(),
        invmgrN_PurchaseValue: z.number(),
        invsptgrN_Amount: z.number(), // The amount being paid now
        invmgrN_TotalPaid: z.number(), // Previously paid
        invmgrN_TotalBalance: z.number(),
        invsptgrN_Remarks: z.string().optional(),
        checkedvalue: z.boolean().optional(),
        invmgrN_GRNNo: z.string().optional(),
        // Helpers for UI calculation
        INVSPTGRN_Amount_New: z.number().optional(),
        INVMGRN_TotalBalance_New: z.number().optional(),
        paystatus: z.string().optional()
    })).optional() // It might be optional in the schema but validated manually or always required on save
}).superRefine((data, ctx) => {
    const isBankMode = (mode: string) => {
        if (!mode) return false;
        const m = mode.toUpperCase();
        return m === 'BANK' || m === 'RTGS/NEFT' || m === 'SWIPE/CARD' || m === 'RTGS';
    };

    if (isBankMode(data.invspT_ModeOfPayment)) {
        // Validation removed as per user request
    }
});

export type InvVendorPaymentSchema = z.infer<typeof invVendorPaymentSchema>;
