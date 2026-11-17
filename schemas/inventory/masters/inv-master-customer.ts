import { z } from 'zod';

export const invMasterCustomerSchema = z.object({
    invmC_Id: z.number().default(0),
    invmC_CustomerName: z.string().min(1, 'Customer Name is required'),
    invmC_CustomerContactPerson: z.string().min(1, 'Contact Person is required'),
    invmC_CustomerContactNo: z.string()
        .min(10, 'Contact Number must be at least 10 digits')
        .regex(/^[0-9]+$/, 'Contact Number must be numeric'),
    invmC_CustomerAddress: z.string().min(1, 'Customer Address is required'),
    invmC_ActiveFlg: z.boolean().default(true),
});

export type InvMasterCustomerSchema = z.infer<typeof invMasterCustomerSchema>;
