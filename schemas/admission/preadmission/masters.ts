import {
    createAlphanumericSchema,
    createOptionalAlphaNumericSchemaNotOptional,
    createOptionalStringSchema,
    createRequiredAlphaNumericWithSpaceSchema,
    createStringOnlySchema,
    createStringSchema,
    createStringSchemaNotAllowNumbersOnly,
    deleteIdSchema
} from '@/schemas/validationSchemas';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ message: 'Username is required' })
        .nonempty({ message: 'Username is required' })
        .refine((value) => value.trim() === value, {
            message: 'Username cannot have leading or trailing spaces'
        }),
    password: z
        .string({ message: 'Password is required' })
        .min(8, { message: `Minimum ${8} characters required for Password` })
        .max(30, { message: `Maximum ${30} characters allowed for Password` })
        .regex(/^\S+$/, {
            message: 'Password cannot contain whitespace'
        })
        .refine((value) => value.trim() === value, {
            message: 'Password cannot have leading or trailing spaces'
        })
});

export const masterClassSchema = {
    addOrUpdate: z
        .object({
            asmcl_id: z.number().int({ message: 'ASMCL_Id is required' }).optional(),
            asmcl_classcode: createAlphanumericSchema('Code', 1, 10),
            asmcl_classname: createStringOnlySchema('Name', 1, 50),
            asmcl_maxcapacity: z
                .number()
                .int({ message: 'Max Capacity is required' })
                .min(1, 'Max Capacity must be at least 1')
                .max(500, 'Max Capacity must not exceed 500'),
            asmcl_order: z.number().int({ message: 'Class Order is required' }),
            asmcl_minageyear: z.number().int().min(0, 'Min Age Year must be at least 0').max(100, 'Min Age Year must not exceed 100'),
            asmcl_minagemonth: z.number().int().min(0, 'Min Age Month must be at least 0').max(11, 'Min Age Month must be between 0-11'),
            asmcl_minagedays: z.number().int().min(0, 'Min Age Days must be at least 0').max(31, 'Min Age Days must be between 0-31'),
            asmcl_maxageyear: z.number().int().min(0, 'Max Age Year must be at least 0').max(100, 'Max Age Year must not exceed 100'),
            asmcl_maxagemonth: z.number().int().min(0, 'Max Age Month must be at least 0').max(11, 'Max Age Month must be between 0-11'),
            asmcl_maxagedays: z.number().int().min(0, 'Max Age Days must be at least 0').max(31, 'Max Age Days must be between 0-31'),
            asmcl_preadmflag: z.number().int({ message: 'Preadm Flag is required' })
        })
        .refine(
            (data) => {
                // Compare year first
                if (data.asmcl_minageyear > data.asmcl_maxageyear) return false;
                if (data.asmcl_minageyear < data.asmcl_maxageyear) return true;

                // Years are equal, compare months
                if (data.asmcl_minagemonth > data.asmcl_maxagemonth) return false;
                if (data.asmcl_minagemonth < data.asmcl_maxagemonth) return true;

                // Years and months are equal, compare days
                if (data.asmcl_minagedays >= data.asmcl_maxagedays) return false;

                return true;
            },
            {
                message: 'Minimum age must be less than maximum age',
                path: ['asmcl_maxageyear']
            }
        ),
    delete: z.object({
        asmcL_Id: deleteIdSchema('asmcL_Id')
    })
};

export const masterCategorySchema = {
    addOrUpdate: z.object({
        amC_Id: z.number().int({ message: 'AMC_ID is required' }).optional(),
        amC_Name: createStringSchema('Category Name', 1, 100),
        amC_Address: createOptionalStringSchema('Address', 1, 200),
        amC_Type: z.string().nonempty({ message: 'Category Type is required' })
    }),
    delete: z.object({
        amC_Id: deleteIdSchema('amC_Id')
    })
};

export const masterSectionSchema = {
    addOrUpdate: z.object({
        asmS_Id: z.number().int({ message: 'AsmS_Id is required' }).optional(),
        asmc_sectioncode: createAlphanumericSchema('Code', 1, 5),
        asmc_sectionname: createStringOnlySchema('Name', 1, 20),
        asmc_maxcapacity: z
            .number()
            .min(1, { message: 'Minimum Capacity should be 1' })
            .max(100, { message: 'Maximum Capacity is 100' })
            .int({ message: 'Max Capacity is required' }),
        asmc_order: z.number().min(1, { message: 'Minimum Order should be 1' }).int({ message: 'Section Order is required' })
    }),
    delete: z.object({
        asmS_Id: deleteIdSchema('asmS_Id')
    })
};

export const masterReligionSchema = {
    addOrUpdate: z.object({
        ivrmmR_Id: z.number().int({ message: 'IVRMMR_ID is required' }).optional(),
        ivrmmR_Name: createOptionalAlphaNumericSchemaNotOptional('Religion Name', 1, 50)
    }),
    delete: z.object({
        ivrmmR_Id: deleteIdSchema('ivrmmR_Id')
    })
};

export const masterClassCategorySchema = {
    add: z.object({
        asmcC_Id: z.number().int({ message: 'ASMCC_ID is required' }).optional(),
        asmaY_Id: z.number().int({ message: 'Academic Year is required' }),
        amC_Id: z.number().int({ message: 'Category is required' }),
        category_classes: z.array(z.string()).min(1, 'Please select at least one class'),
        category_class_sections: z.array(z.string()).min(1, 'Please select at least one class')
    }),
    delete: z.object({
        asmcC_Id: deleteIdSchema('asmcC_Id')
    })
};

export const masterClassHeldSchema = {
    add: z.object({
        asmaY_Id: z.number().int().min(1, { message: 'Academic Year is required' }),
        classCategory: z.string().min(1, { message: 'Class is required' }),
        section: z.string().min(1, { message: 'Section is required' }),
        classHeldData: z
            .array(
                z.object({
                    ivrM_Month_Id: z.number().int(),
                    ivrM_Month_Name: z.string().min(1, { message: 'Month name is required' }),
                    is_Active: z.boolean(),
                    ivrM_Month_Max_Days: z.number().int(),
                    ascH_ClassHeld: z.number().int().min(0, { message: 'Class held must be 0 or greater' })
                })
            )
            .nonempty({ message: 'Please select at least one month' })
    })
};

export const masterCasteCategorySchema = {
    addOrUpdate: z.object({
        imcC_Id: z.number().int({ message: 'IMCC_ID is required' }).optional(),
        imcC_CategoryCode: z.string().nonempty({ message: 'Caste Category Code is required' }),
        imcC_CategoryName: createStringSchemaNotAllowNumbersOnly('Caste Category Code', 1, 50),
        imcC_CategoryDesc: createStringSchemaNotAllowNumbersOnly('Caste Category Description', 1, 500)
    }),
    delete: z.object({
        imcC_Id: deleteIdSchema('imcC_Id')
    })
};

export const masterCasteSchema = {
    addOrUpdate: z.object({
        imC_Id: z.number().int({ message: 'IMC_ID is required' }).optional(),
        imcC_Id: z.number().int({ message: 'Caste Category is required' }),
        imC_CasteName: createStringSchemaNotAllowNumbersOnly('Caste Caste Code', 1, 100),
        imC_CasteDesc: createStringSchemaNotAllowNumbersOnly('Caste Caste Description', 1, 500)
    }),
    delete: z.object({
        imC_Id: deleteIdSchema('imC_Id')
    })
};

export const masterClassTeacherSchema = {
    addOrUpdate: z.object({
        imcT_Id: z.number().int().nonnegative().optional(), // optional when creating new record
        asmaY_Id: z.number().int().nonnegative({
            message: 'Academic year id must be a non-negative integer'
        }),
        asmcL_Id: z.number().int().nonnegative({ message: 'Class id must be a non-negative integer' }),
        asmS_Id: z.number().int().nonnegative({ message: 'Section id must be a non-negative integer' }),
        hrmE_Id: z.number().int().nonnegative({ message: 'Employee id must be a non-negative integer' })
    }),
    delete: z.object({
        imcT_Id: deleteIdSchema('imcT_Id')
    })
};
export const masterExchangeClassTeacherSchema = {
    addOrUpdate: z.object({
        imcT_Id_1: z.number().int().nonnegative({
            message: 'Class Teacher id must be a non-negative integer'
        }),
        hrmE_Id_1: z.number().int().nonnegative({
            message: 'Employe year id must be a non-negative integer'
        }),
        imcT_Id_2: z.number().int().nonnegative({
            message: 'Class Teacher id must be a non-negative integer'
        }),
        hrmE_Id_2: z.number().int().nonnegative({ message: 'Employe id must be a non-negative integer' })
    })
};

export const masterDocumentSchema = {
    addOrUpdate: z.object({
        amsmD_Id: z.number().int({ message: 'AMSMD_ID is required' }).optional(),
        amsmD_DocumentName: createStringOnlySchema('Document Name', 1, 100),
        amsmD_Description: createRequiredAlphaNumericWithSpaceSchema('Description', 1, 1000),
        amsmD_FLAG: z.number().int({ message: 'Mandatory Flag is required' })
    }),
    delete: z.object({
        amsmD_Id: deleteIdSchema('amsmD_Id')
    })
};

export const masterReferenceSchema = {
    addOrUpdate: z.object({
        pamR_Id: z.number().int({ message: 'PAMR_Id is required' }).optional(),
        pamR_ReferenceName: createStringOnlySchema('Reference Name', 1, 50),
        pamR_ReferenceDesc: createRequiredAlphaNumericWithSpaceSchema('Description', 1, 500)
    }),
    delete: z.object({
        pamR_Id: deleteIdSchema('pamR_Id')
    })
};

export const masterSourceSchema = {
    addOrUpdate: z.object({
        pamS_Id: z.number().int({ message: 'PAMS_ID is required' }).optional(),
        pamS_SourceName: createStringOnlySchema('Source Name', 1, 50),
        pamS_SourceDesc: createRequiredAlphaNumericWithSpaceSchema('Description', 1, 500)
    }),
    delete: z.object({
        pamS_Id: deleteIdSchema('pamS_Id')
    })
};

export const masterReligionCasteCategorySchema = {
    add: z.object({
        ircC_Id: z.number().int({ message: 'IRCC_ID is required' }).optional(),
        ivrmmR_Id: z.number().int({ message: 'Religion is required' }),
        caste_category_ids: z.array(z.string()).nonempty('Please select at least one caste category')
    }),
    delete: z.object({
        ircC_Id: deleteIdSchema('ircC_Id')
    })
};

//

// Master Configuration Schema (Add / Update)
export const masterConfigurationSchema = {
    add: z
        .object({
            asmaY_Id: z.number().int().positive('Academic Year is required'),
            amC_Id: z.number().int().positive('Category is required'),

            ispaC_EnquiryApplFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplIssueFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnqSMSFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnqMailFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnqMailBackground: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplFeeFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplnDownladFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplSMSFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplMailFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplMailBackground: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_DOBMaxAgeFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_DOBMinAgeFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplCutOffDateFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ApplNoGenFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_DefaultStatusFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnquiryNoGenFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_RgNoGenFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_RegSMSFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_RegMailFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_RegMailBackground: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_AdmCategoryFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_WrittenTestApplFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_OralTestApplFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_SeatBlockFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_FatherAliveFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_MotherAliveFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_MaritalStatusFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_FeePaymentFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_AdmissionTransfer: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnableSiblingsLink: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_SibblingConcessionFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ParentConcessionFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ECSFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_HostelFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_TransaportFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_GymFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_EnquiryNo_ApplNo_RegNo: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ProspectusFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_Transfer_Settings_Flag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_Transfer_Settings_after_payment_Flag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_ProsptFeeApp: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_OralTestSchApplFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_OralMarksFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_RegFeeFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_WrittenTestSchApplFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_CommonScheduleFlag: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_Healthapp: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_FullPaymentCompFlg: z.union([z.literal(0), z.literal(1)]).default(0),
            ispaC_OfflineFee_Flag: z.union([z.literal(0), z.literal(1)]).default(0),

            ispaC_ApplNoIncrementFlg: z.boolean().default(false),

            ispaC_MarksEntry: z.number().int().min(0).default(0),
            ispaC_OralTestBy: z.number().int().min(0).max(4).optional(),
            ispaC_OralByMax_Marks: z.number().int().min(0).optional(),
            ispaC_OralByMin_Marks: z.number().int().min(0).optional(),
            ispaC_NoofApplications: z.number().int().min(0).default(0),
            ispaC_ApplNoIncrementBy: z.number().int().min(0).default(0)
        })
        .superRefine((data, ctx) => {
            if (data.ispaC_OralTestApplFlag === 1 && (data.ispaC_OralTestBy === undefined || data.ispaC_OralTestBy === null)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Oral test by is required when Oral Test is applicable',
                    path: ['ispaC_OralTestBy']
                });
            }
        })
};
export const masterActiveDeactiveStudentSchema = z.object({
    amsT_SOL: z.enum(['S', 'D'], { required_error: 'Status is required' }),
    asmaY_Id: z.number().int().min(1, { message: 'Academic Year is required' }),
    asmcL_Id: z.number().int().min(1, { message: 'Class is required' }),
    asmS_Id: z.number().int().min(1, { message: 'Section is required' }),
    students: z
        .array(
            z.object({
                amsT_Id: z.number(),
                reason: z.string(),
                remarks: z.string()
            })
        )
        .min(1, { message: 'Please select at least one student' })
        .optional()
        .default([])
});
