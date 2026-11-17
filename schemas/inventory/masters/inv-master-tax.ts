import { deleteIdSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';



export const invMasterTaxSchema = {
    addOrUpdate: z.object({
        INVMT_Id: z.number().optional(),
        INVMT_TaxName: z.string().min(1, { message: 'Tax Name is required' }),
        INVMT_TaxAliasName: z.string().optional(),
        INVMT_ActiveFlg: z.boolean().optional()
    }),
    delete: z.object({
        INVMT_Id: deleteIdSchema('INVMT_Id')
    })
};

export const invMasterTaxLedgerSchema = z.object({
    invmtleD_Id: z.number().optional(),
    INVMT_Id: z.number().optional(),
    invmtleD_TaxName: z.string().min(1, { message: 'Ledger Tax Name is required' }),
    famcomP_Id: z.coerce.number().min(1, { message: 'Company Name is required' }),
    famleD_Id: z.coerce.number().min(1, { message: 'Ledger Name is required' }),
    ledgerunderids: z.array(z.number()).min(1, { message: 'Select at least one Ledger Under Name' })
});

//export type InvMasterTaxSchema = z.infer<typeof invMasterTaxSchema>;
export type InvMasterTaxLedgerSchema = z.infer<typeof invMasterTaxLedgerSchema>;
