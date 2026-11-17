import { z } from 'zod';

export const invMasterSupplierSchema = z.object({
    invmS_Id: z.number().default(0),
    invmS_SupplierName: z.string().min(1, 'Please Enter Supplier Name'),
    invmS_SupplierCode: z.string().optional(),
    invmS_SupplierConatctPerson: z.string().optional(),
    invmS_SupplierConatctNo: z.coerce.string().min(1, 'Enter Contact number'),
    invmS_EmailId: z
        .string()
        .min(1, 'Enter Supplier Email')
        .email('Enter valid Email_Id'),
    invmS_GSTNo: z.string().optional(),
    invmS_SupplierAddress: z.string().optional(),
    invmS_ActiveFlg: z.boolean().optional(),
});

export type InvMasterSupplierSchema = z.infer<typeof invMasterSupplierSchema>;
