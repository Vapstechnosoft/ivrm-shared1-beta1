import { z } from 'zod';
import { createStringSchema, deleteIdSchema } from '../validationSchemas';

export const loginSchema = z.object({
    email: z.string({ message: 'Email is required' }),
    password: createStringSchema('Password', 6, 50)
});

export const masterLibrarySchema = {
    addOrUpdate: z.object({
        lmaL_Id: z.number().nonnegative().optional(), // optional when creating new record
        lmaL_LibraryName: z.string({ message: 'Library Name is required' }).min(2).max(100)
    }),
    delete: z.object({
        lmaL_Id: deleteIdSchema('lmaL_Id')
    })
};

// export const masterVendorSchema = {
//     addOrUpdate: z.object({
//         lmV_Id: z.number().nonnegative().optional(), // optional when creating new record
//         lmV_VendorName: z.string({ message: 'Vendor Name is required' }).min(2).max(100),
//         lmV_MobileNo: z.string({ message: 'Mobile No is required' }).min(10).max(15),
//         lmV_Address: z.string({ message: 'Address is required' }).min(2).max(200),
//         lmV_EMailId: z.string({ message: 'Email is required' }).email(),
//         lmV_PhoneNo: z.string({ message: 'Phone No is required' }).min(10).max(15)
//     }),
//     delete: z.object({
//         lmaL_Id: deleteIdSchema('lmV_Id')
//     })
// };

export const masterVendorSchema = {
    addOrUpdate: z.object({
        lmV_Id: z.number().nonnegative().optional(),

        lmV_VendorName: z
            .string({ required_error: 'Vendor Name is required' })
            .trim()
            .min(3, 'Vendor Name must be at least 3 characters')
            .max(100, 'Vendor Name cannot exceed 100 characters')
            .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed'),

        lmV_MobileNo: z
            .string({ required_error: 'Mobile Number is required' })
            .trim()
            .regex(/^\d{10}$/, 'Mobile Number must be exactly 10 digits'),

        lmV_Address: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine(
                (val) => !val || (val.length >= 3 && val.length <= 200 && /^[A-Za-z0-9\s,.-]+$/.test(val)),
                'Address must be at least 3 characters, max 200 characters, and can only contain letters, numbers, spaces, and basic punctuation'
            ),

        lmV_EMailId: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine((val) => !val || z.string().email().safeParse(val).success, 'Invalid email address'),

        lmV_PhoneNo: z.string().trim().optional().nullable().or(z.literal(''))
    }),

    delete: z.object({
        lmV_Id: deleteIdSchema('lmV_Id')
    })
};

export const masterCategorySchema = {
    addOrUpdate: z.object({
        lmC_Id: z.number().nonnegative().optional(), // optional when creating new record
        lmC_CategoryName: z.string({ message: 'Category Name is required' }).min(2).max(100),
        lmC_CategoryCode: z.string({ message: 'Category Code is required' }).min(2).max(100),
        lmC_BNBFlg: z.string({ message: 'Category Type is required' }).min(2).max(100)
    }),
    delete: z.object({
        lmC_Id: deleteIdSchema('lmC_Id')
    })
};

export const masterPublisherSchema = {
    addOrUpdate: z.object({
        lmP_Id: z.number().nonnegative().optional(),
        lmP_PublisherName: z
            .string({ required_error: 'Publisher Name is required' })
            .trim()
            .min(3, 'Publisher Name must be at least 3 characters')
            .max(100, 'Publisher Name cannot exceed 100 characters')
            .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed'),

        lmP_MobileNo: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine((val) => !val || /^\d{10}$/.test(val), 'Mobile Number must be exactly 10 digits'),

        lmP_Address: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine(
                (val) => !val || (val.length >= 3 && val.length <= 200 && /^[A-Za-z0-9\s,.-]+$/.test(val)),
                'Address must be at least 3 characters, max 200 characters, and can only contain letters, numbers, spaces, and basic punctuation'
            ),

        lmP_EMailId: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine((val) => !val || z.string().email().safeParse(val).success, 'Invalid email address'),

        lmP_PhoneNo: z.string().trim().optional().or(z.literal(''))
    }),
    delete: z.object({
        lmP_Id: deleteIdSchema('lmP_Id')
    })
};

export const masterAuthorSchema = {
    addOrUpdate: z.object({
        lmaU_Id: z.number().nonnegative().optional(),

        lmaU_AuthorFirstName: z
            .string({ required_error: 'Author Name is required' })
            .trim()
            .min(2, 'Author Name must be at least 2 characters')
            .max(100),

        lmaU_AuthorMiddleName: z.string().trim().optional().nullable().or(z.literal('')),
        lmaU_AuthorLastName: z.string().trim().optional().nullable().or(z.literal('')),

        lmaU_MobileNo: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine((val) => !val || /^\d{10}$/.test(val), 'Mobile Number must be exactly 10 digits'),

        lmaU_Address: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine(
                (val) => !val || (val.length >= 3 && val.length <= 200 && /^[A-Za-z0-9\s,.-]+$/.test(val)),
                'Address must be 3–200 characters and can contain letters, numbers, spaces, and basic punctuation'
            ),

        lmaU_EmailId: z
            .string()
            .trim()
            .optional()
            .nullable()
            .or(z.literal(''))
            .refine((val) => !val || z.string().email().safeParse(val).success, 'Invalid email address'),

        lmaU_PhoneNo: z.string().trim().optional().nullable().or(z.literal('')),

        lmaU_ActiveFlg: z.boolean().optional()
    }),

    delete: z.object({
        lmaU_Id: deleteIdSchema('lmaU_Id')
    })
};

export const masterLanguageSchema = {
    addOrUpdate: z.object({
        lmL_Id: z.number().nonnegative().optional(), // optional when creating new record
        lmL_LanguageName: z
            .string({ required_error: 'Language Name is required' })
            .trim()
            .min(2, 'Language Name must be at least 2 characters')
            .max(100, 'Language Name cannot exceed 100 characters')
            .regex(/^[a-zA-Z0-9\s]+$/, 'Special characters are not allowed')
    }),
    delete: z.object({
        lmL_Id: deleteIdSchema('lmL_Id')
    })
};

export const masterDepartmentSchema = {
    addOrUpdate: z.object({
        lmD_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        lmD_DepartmentName: z.string().min(1, 'Department Name is required'),
        lmD_DepartmentCode: z.string().optional().or(z.literal('')),
        lmD_ActiveFlg: z.boolean().optional()
    }),
    delete: z.object({
        lmD_Id: z.coerce.number()
    })
};

export const masterAccessoriesSchema = {
    addOrUpdate: z.object({
        lmaC_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        lmaC_AccessoriesName: z.string().min(1, 'Accessories Name is required'),
        lmaC_AccessoriesDesc: z.string().min(1, 'Accessories Description is required'),
        lmaC_ActiveFlg: z.boolean().optional()
    }),
    delete: z.object({
        lmaC_Id: z.coerce.number()
    })
};

export const masterTimeSlabSchema = {
    addOrUpdate: z
        .object({
            lfsE_Id: z.number().optional(),
            mI_Id: z.number().optional(),
            lfsE_UserType: z.string().min(1, 'User Type is required'),
            lfsE_SlabTypeFlg: z.string().min(1, 'Slab Type is required'),
            lfsE_PerDayFlg: z.coerce.number().optional().default(0),
            lfsE_FromDay: z.coerce.number().min(0, 'From Day must be at least 0'),
            lfsE_ToDay: z.coerce.number().optional(),
            lfsE_Amount: z.coerce.number().min(0, 'Amount must be at least 0'),
            lfsE_ActiveFlg: z.boolean().optional()
        })
        .refine(
            (data) => {
                if (data.lfsE_SlabTypeFlg === 'BETWEEN') {
                    return data.lfsE_ToDay !== undefined && data.lfsE_ToDay > data.lfsE_FromDay;
                }
                return true;
            },
            {
                message: 'To Day must be greater than From Day',
                path: ['lfsE_ToDay']
            }
        ),
    delete: z.object({
        lfsE_Id: z.coerce.number()
    })
};

export const masterRackDetailsSchema = {
    addOrUpdate: z.object({
        lmrA_Id: z.number().optional(),
        lmraS_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        lmrA_BuildingName: z.string().min(1, 'Building Name is required'),
        lmrA_RackName: z.string().min(1, 'Rack Name is required'),
        lmS_Id: z.coerce.number().min(1, 'Subject Name is required'),
        lmrA_FloorName: z.string().min(1, 'Floor Name is required'),
        lmrA_DisplayColour: z.string().optional(),
        lmrA_Location: z.string().min(1, 'Location is required'),
        lmrA_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        lmrA_Id: z.coerce.number()
    })
};

export const masterClassCategorySchema = {
    addOrUpdate: z.object({
        lmcC_Id: z.number().optional(),
        ivrmuL_Id: z.coerce.number().min(1, 'Staff Name is required'),
        lmcC_CategoryName: z.string().min(1, 'Class Category Name is required').max(50, 'Class Category Name cannot exceed 50 characters'),
        lmcC_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        lmcC_Id: z.coerce.number()
    })
};

export const masterSubjectSchema = {
    addOrUpdate: z.object({
        lmS_SubjectName: z.string().optional(),
        lmS_ParentId: z.preprocess(
            (val) => (val === undefined || val === '' ? undefined : Number(val)),
            z
                .number({ required_error: 'Please Select Parent Subject', invalid_type_error: 'Please Select Parent Subject' })
                .min(1, 'Please Select Parent Subject')
        ),
        lmS_Level: z
            .string()
            .regex(/^\d{0,25}$/, 'Enter only numeric value')
            .optional()
            .or(z.literal('')),
        lmS_ClassNo: z
            .string()
            .max(27, 'Maximum 27 characters')
            .regex(/^[a-zA-Z0-9\s-]*$/, 'Invalid Class No')
            .optional()
            .or(z.literal('')),
        ismS_SubjectName: z
            .string()
            .min(1, 'Enter the Subject Name')
            .max(50)
            .regex(/^[a-zA-Z0-9\s\-&(),\.\/\+\*#_\[\]:]*$/, 'Only letters, numbers, spaces and standard characters allowed'),
        lmS_SubjectNo: z
            .string()
            .max(50)
            .regex(/^[a-zA-Z0-9\s-]*$/, 'Invalid Subject No')
            .optional()
            .or(z.literal('')),
        lmS_Id: z.number().nonnegative().optional(), // optional when creating new record
        lmS_ActiveFlg: z.boolean().optional()
    }),
    delete: z.object({
        lmS_Id: deleteIdSchema('lmS_Id')
    })
};
