import { z } from 'zod';
import { createOptionalStringSchema, createStringSchema, deleteIdSchema } from '../validationSchemas';

export const bookRegisterSchema = {
    addOrUpdate: z.object({
        lmB_Id: z.number().nonnegative().optional(),
        mI_Id: z.number().optional(),
        lmB_BookTitle: createStringSchema('Book Title', 1, 200),
        mB_Subtitle: z.string().max(200).optional(),
        lmC_Id: z.number({ required_error: 'Category is required' }).min(1),
        lmB_BookType: z.string({ required_error: 'Book Type is required' }).min(1),
        lmS_Id: z.number({ required_error: 'Subject is required' }).min(1),
        lmD_Id: z.number({ required_error: 'Department is required' }).min(1),
        binding_Type: z.string().optional(),
        lmB_Edition: z.string().optional(),
        lmB_PublishedYear: z.union([z.string(), z.number()]).refine((val) => !!val, 'Published Year is required'),
        lmB_EntryDate: z.union([z.date(), z.string()]),
        mB_Call_No: z.string().optional(),
        lmB_ISBNNo: createOptionalStringSchema('ISBN No', 1, 50),
        lmB_ClassNo: z.string().optional(),
        lmB_VolNo: z.string().optional(),
        mB_Pages: z.coerce.number().optional(),
        invoice_No: z.string().optional(),
        lmBkf_KeyFactor: z.string().optional(),
        lmBkf_PageNo: z.coerce.number().optional(),
        lmB_BookNo: z.string().optional(),
        lmAL_Id: z.number({ required_error: 'Library is required' }).min(1),

        purchase_Date: z.union([z.date(), z.string()]),
        lmL_Id: z.number({ required_error: 'Language is required' }).min(1),
        lmB_BillNo: z.string().optional(),
        voucher_No: z.string().optional(),
        lmB_PurOrDonated: z.string({ required_error: 'Purchase Type is required' }).min(1),
        donor_Id: z.string().optional(),
        lmB_DonorAddress: z.string().optional(),
        currencyType: z.string().optional(),
        source_Type: z.string().optional(),
        lmV_Id: z.number().optional(),
        mB_Keywords: z.string().optional(),
        lmP_Id: z.number().optional(),
        mB_Remarks: z.string().optional(),
        bibliography_Page: z.union([z.boolean(), z.string()]).optional(),
        index_Page: z.union([z.boolean(), z.string()]).optional(),

        lmAU_Id: z.number().optional(),
        lmB_AuthorFirstName: z.string().optional(),
        lmB_AuthorMiddleName: z.string().optional(),
        lmB_AuthorLastName: z.string().optional(),

        lmbanO_AvialableStatus: z.string().min(1, 'Status is required'),
        lRM_Id: z.number().optional(),
        lSM_Id: z.number().optional(),
        lRAM_Id: z.number().optional(),
        lmrA_Id: z.number({ required_error: 'Rack is required' }).min(1),

        lmB_Price: z.coerce.number().optional(),
        mB_Disc_Type: z.string().optional(),
        mB_Discountper: z.coerce.number().optional(),
        mB_Discount: z.coerce.number().optional(),
        lmB_NetPrice: z.coerce.number().optional(),

        with_Accessories: z.boolean().optional(),
        lmaC_Id: z.number().optional(),

        accessionList: z
            .array(
                z.object({
                    lmbanO_Id: z.number().optional(),
                    lmbanO_No: z.string().min(1, 'Accession No is required'),
                    lmbanO_AvialableStatus: z.string().optional()
                })
            )
            .min(1, 'At least one accession number is required'),

        attachementList: z
            .array(
                z.object({
                    lmbA_Id: z.number().optional(),
                    lmbA_FileName: z.string().optional(),
                    lmbA_FilePath: z.string().optional()
                })
            )
            .optional(),

        mB_ActiveFlag: z.boolean().optional(),
        lmB_StudentPhoto: z.string().optional()
    }),
    delete: z.object({
        lmB_Id: deleteIdSchema('lmB_Id')
    })
};
