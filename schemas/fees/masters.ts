import { z } from 'zod';
import {
    createEmailSchema,
    createNumberOnlyStringSchema,
    createStringOnlyOptionalSchema,
    createStringOnlySchema,
    createStringSchema,
    createStringSchemaNotAllowNumbersOnly,
    deleteIdSchema
} from '../validationSchemas';
export const loginSchema = z.object({
    email: z.string({ message: 'Email is required' }),
    password: createStringSchema('Password', 6, 50)
});
export const masterFeeheadSchema = {
    addOrUpdate: z.object({
        fmH_Id: z.number().optional(),
        fmH_FeeName: createStringSchema('Fee Head Name', 3, 100),
        fmH_Order: z.number().int({ message: 'fmH_Order is required' }),
        //fmH_Flag: createStringSchema('fmH_Flag', 1, 100),

        fmH_Flag: z.string().nonempty('Fee Head Type is required'),
        fmH_RefundFlag: z.boolean().optional(),
        fmH_PDAFlag: z.boolean().optional(),
        fmH_SpecialFeeFlag: z.boolean().optional()
    }),
    delete: z.object({
        fmH_Id: deleteIdSchema('fmH_Id')
    })
};

export const masterModeOfPaymentSchema = {
    addOrUpdate: z.object({
        ivrmmoD_Id: z.number().int({ message: 'ivrmmoD_Id is required' }).optional(),
        ivrmmoD_ModeOfPayment: createStringOnlySchema('Mode of Payment', 1, 100),
        //ivrmmoD_ModeOfPayment_Code: createStringSchema('Mode of Payment Code', 1, 100)
        ivrmmoD_ModeOfPayment_Code: z
            .string()
            .min(1, 'Mode of Payment Code is required')
            .max(1, 'Mode of Payment Code must be exactly 1 character')
            .refine((value) => ['C', 'B', 'R', 'S', 'U'].includes(value.toUpperCase()), { message: 'Allowed values: C, B, R, S, U only' })
    }),
    delete: z.object({
        ivrmmoD_Id: deleteIdSchema('ivrmmoD_Id')
    })
};
export const paymentgatewaydetailsSchema = {
    addOrUpdate: z.object({
        institution_Name: z.string().optional(),
        fpgD_MerchantId: z.string().min(1, 'Merchant ID is required'),
        fpgD_SaltKey: z.string().min(1, 'Salt Key is required'),
        //fpgD_Image: z.string().min(1, 'Image is required'),
        fpgD_Image: z
            .string()
            .nonempty('Image URL is required')
            .regex(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i, {
                message: 'Image URL must start with http:// or https:// and be a valid image (.jpg/.png/.gif/.webp)'
            }),
        // fpgD_URL: z.string().min(1, 'URL is required'),
        fpgD_URL: z
            .string()
            .min(1, { message: 'URL is required' })
            .max(80, 'URL must be at most 80 characters')
            .url({ message: 'Must be a valid URL (http:// or https://)' }),
        fpgD_AccNo: z.string().min(1, 'Account Number is required'),
        fpgD_MerchantKey: z.string().min(1, 'Merchant Key is required'),
        impG_Id: z.preprocess((val) => {
            if (typeof val === 'string' && val.trim().length > 0) return Number(val);
            return val;
        }, z.number().int()),
        fpgD_MobileActiveFlag: z.boolean().optional(),
        // submerchantIds: z
        //     .array(
        //         z.object({
        //             id: z.string().min(1, 'Sub Merchant Id is required')
        //         })
        //     )
        //     .optional()
        //     .default([])

        submerchantIds: z
            .array(
                z.object({
                    id: z.string().min(1, 'Sub Merchant Id is required')
                    // .regex(/^[0-9a-zA-Z]+$/, "Only letters and numbers allowed"),
                })
            )
            .min(1, 'At least one Sub Merchant Id is required')
    }),
    delete: z.object({
        FPGD_Id: deleteIdSchema('FPGD_Id')
    })
};
export const fineslabSchema = {
    addOrUpdate: z
        .object({
            fmfS_Id: z.number().optional(),
            fmfS_FineType: z.enum(['Between', 'GreaterThan', 'LessThan'], {
                message: 'Fine Type is required'
            }),
            fmfS_FromDay: z.number({ message: 'From Day is required' }).optional(),
            fmfS_ToDay: z.number({ message: 'To Day is required' }).optional(),
            fmfS_ECSFlag: z.string({ message: 'ECS Flag is required' }).optional(),
            fmfS_ActiveFlag: z.boolean().optional()
        })
        .superRefine((data, ctx) => {
            const { fmfS_FineType, fmfS_FromDay, fmfS_ToDay } = data;
            if (fmfS_FineType === 'Between') {
                if (typeof fmfS_FromDay !== 'number') {
                    ctx.addIssue({
                        path: ['fmfS_FromDay'],
                        code: z.ZodIssueCode.custom,
                        message: 'Enter From Day'
                    });
                }
                if (typeof fmfS_ToDay !== 'number') {
                    ctx.addIssue({
                        path: ['fmfS_ToDay'],
                        code: z.ZodIssueCode.custom,
                        message: 'Enter To Day'
                    });
                } else if (typeof fmfS_FromDay === 'number' && fmfS_ToDay < fmfS_FromDay) {
                    ctx.addIssue({
                        path: ['fmfS_ToDay'],
                        code: z.ZodIssueCode.custom,
                        message: 'To Day must be greater than or equal to From Day'
                    });
                }
            }
            if (fmfS_FineType === 'GreaterThan' || fmfS_FineType === 'LessThan') {
                if (typeof fmfS_FromDay !== 'number') {
                    ctx.addIssue({
                        path: ['fmfS_FromDay'],
                        code: z.ZodIssueCode.custom,
                        message: 'From Day is required'
                    });
                }
            }
        }),
    delete: z.object({
        fmfS_Id: deleteIdSchema('fmfS_Id')
    })
};
// export const fineslabSchema = {
// addOrUpdate: z.object({
// fmfS_Id: z.number().optional(),
// fmfS_ToDay: z.number().optional(),
// fmfS_FromDay: z.number().optional(),
// fmfS_FineType:z.string().optional(),
// fmfS_ECSFlag: z.string().optional()
// }),
// delete: z.object({
// fmfS_Id: deleteIdSchema('fmfS_Id')
// })
// };
export const masterClassCategorySchema = {
    addOrUpdate: z.object({
        fmcC_Id: z.number().optional(),

        fmcC_ClassCategoryName: createStringOnlySchema('Class Category Name', 3, 100),
        fmcC_ClassCategoryCode: createStringOnlySchema('Class Category Code', 3, 20),

        mI_Id: z.number().optional(),
        fmcC_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        fmcC_Id: deleteIdSchema('fmcC_Id')
    })

    // delete: z.object({
    //     fmcC_Id: z
    //         .number({
    //             required_error: 'Class Category ID (fmcC_Id) is required',
    //             invalid_type_error: 'Class Category ID must be a number'
    //         })
    //         .positive('Class Category ID must be positive')
    // })
};
export const masterClassSchema = {
    addOrUpdate: z.object({
        academicYear: z.string().min(1, { message: 'Academic Year is required' }),
        classCategory: z.string().min(1, { message: 'Class Category is required' }),
        headInstallments: z
            .array(
                z.object({
                    id: z.number(),
                    fmH_Id: z.string().min(1, { message: 'Fee Head is required' }),
                    fmI_Id: z.string().min(1, { message: 'Fee Installment is required' }),
                    fineApplicable: z.boolean(),
                    active: z.boolean(),
                    commonAmount: z.boolean()
                })
            )
            .min(1, { message: 'At least one head installment is required' })
    }),

    delete: z.object({
        fyghm_id: z.number().min(1, {
            message: 'Valid Class Yearly Category ID is required for deletion'
        })
    })
};

export const masterClassYearlyCategorySchema = {
    addOrUpdate: z.object({
        academicYear: z.string().min(1, { message: 'Academic Year is required' }),
        classCategory: z.string().min(1, { message: 'Class Category is required' }),
        classes: z.array(z.string()).min(1, { message: 'At least one class is required' })
    }),
    delete: z.object({
        fycC_Id: z
            .number()
            .min(1, {
                message: 'Valid Class Yearly Category ID is required for deletion'
            })
            .optional()
    })
};

export const masterGroupsGroupingSchema = {
    addOrUpdate: z.object({
        //fmgG_GroupName: z.string().min(1, { message: 'Group Name is required' }),
        fmgG_GroupName: createStringOnlySchema('Group Name', 1, 60),
        fmgG_GroupCode: createStringOnlySchema('Group Code', 1, 60),
        //fmgG_GroupCode: z.string().min(1, { message: 'Group Code is required' }),
        selectedFeeGroupIds: z.array(z.number()).min(1, { message: 'Please select at least one fee group' })
    }),
    delete: z.object({
        fmgG_Id: z.number({ message: 'ID is required for deletion' })
    })
};
export const masterInstallmentSchema = {
    addOrUpdate: z
        .object({
            fmI_Name: createStringOnlySchema('Master Installment Name', 1, 100),
            fmI_Installment_Type: createStringOnlyOptionalSchema('Installment Type', 1, 30),
            fmI_No_Of_Installments: z.number().optional(),
            installments: z
                .array(
                    z.object({
                        sno: z.number(),
                        ftI_Name: createStringSchema('Installment Name', 1, 100)
                    })
                )
                .optional()
        })
        .refine(
            (data) => {
                // Custom validation for Installment Type
                if (!data.fmI_Installment_Type || data.fmI_Installment_Type.trim().length === 0) {
                    return false;
                }
                return true;
            },
            {
                message: 'Installment Type is required',
                path: ['fmI_Installment_Type']
            }
        ),

    delete: z.object({
        fmI_Id: z.number().optional()
    })
};
export const masterGroupSchema = {
    addOrUpdate: z.object({
        fmG_Id: z.number().int().optional(),
        //fmG_GroupName: z.string().min(1, { message: 'Fee Group is required' }).max(200),
        //fmG_GroupName: z.string().min(1, { message: 'Fee Group is required' }).max(200),
        fmG_GroupName: createStringOnlySchema('Fee Group', 3, 200),
        fmG_Remarks: z.string().min(1, { message: 'Remarks is required' }).max(500),
        transportHostelType: z.preprocess((val) => {
            if (typeof val === 'string' && val.trim() === '') return undefined;
            return val;
        }, z.enum(['transport', 'hostel']).optional()),
        studentType: z.preprocess(
            (val) => {
                if (typeof val === 'string' && val.trim() === '') return undefined;
                return val;
            },
            z.enum(['regular', 'newstudent'], {
                required_error: 'Please select Regular or New Student',
                invalid_type_error: 'Please select Regular or New Student'
            })
        ),
        fmG_CompulsoryFlag: z.boolean().default(false)
    }),
    toggle: z.object({
        fmG_Id: z.number(),
        fmG_ActiceFlag: z.boolean()
    }),
    delete: z.object({
        fyG_Id: z
            .number({
                required_error: 'Yearly Group ID is required',
                invalid_type_error: 'Yearly Group ID must be a number'
            })
            .refine((val) => val > 0, {
                message: 'Yearly Group ID must be greater than 0'
            })
    })
};
// export const masterInstallmentDueDateSchema = z.object({
//     fmI_Name: z.string().min(1, { message: 'Academic Year is required' }),
//     fmI_Installment_Type: z.string().min(1, { message: 'Installment type is required' }),
//     fmI_No_Of_Installments: z.number().min(1, { message: 'Number of installments must be at least 1' }).optional(),
//     installments: z
//         .array(
//             z.object({
//                 sno: z.number(),
//                 ftI_Name: z.string().min(1, { message: 'Installment name is required' }),
//                 fdate: z.string().optional(),
//                 tdate: z.string().optional(),
//                 aplc: z.string().optional(),
//                 ddate: z.string().optional()
//             })
//         )
//         .min(1, { message: 'At least one installment is required' })
//         .optional()
// });

export const masterInstallmentDueDateSchema = z.object({
    asmay_Id: z.string().min(1, { message: 'Academic Year is required' }),
    fmi_Id: z.string().min(1, { message: 'Installment type is required' }),
    fmI_No_Of_Installments: z.number().min(1, { message: 'Number of installments must be at least 1' }).optional(),
    installments: z
        .array(
            z.object({
                sno: z.number(),
                ftI_Name: z.string().min(1, { message: 'Installment name is required' }),
                fdate: z.string().optional(),
                tdate: z.string().optional(),
                aplc: z.string().optional(),
                ddate: z.string().optional()
            })
        )
        .min(1, { message: 'At least one installment is required' })
        .optional()
});

export const YearlyGroupSchema = {
    addOrUpdate: z
        .object({
            academicYear: z.string().min(1, { message: 'Academic Year is required' }),
            rebateApplicable: z.boolean().default(false),
            rebateType: z.enum(['Percentage', 'Amount']).nullable().optional(),
            rebateValue: z
                .union([
                    z
                        .string()
                        .transform((val) => {
                            const trimmed = val?.trim();
                            if (trimmed === '' || trimmed === null || trimmed === undefined) {
                                return undefined;
                            }
                            if (!/^\d*\.?\d*$/.test(trimmed)) {
                                throw new Error('Only numbers and a single decimal point are allowed');
                            }
                            return Number(trimmed);
                        })
                        .refine((val) => val === undefined || !Number.isNaN(val), {
                            message: 'Rebate Value must be a valid number'
                        }),
                    z.number(),
                    z.undefined()
                ])
                .optional(),
            feeGroupIds: z.array(z.number()).min(1, { message: 'Select at least one Fee Group' })
        })
        .superRefine((data, ctx) => {
            if (data.rebateApplicable) {
                if (!data.rebateType) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['rebateType'],
                        message: 'Rebate Type is required when rebate is applicable'
                    });
                }
                if (data.rebateValue === undefined || data.rebateValue === null || Number.isNaN(Number(data.rebateValue))) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['rebateValue'],
                        message: 'Rebate Value is required and must be a valid number when rebate is applicable'
                    });
                } else if (data.rebateType === 'Percentage') {
                    if (data.rebateValue < 0 || data.rebateValue > 100) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: ['rebateValue'],
                            message: 'Percentage must be between 0 and 100'
                        });
                    }
                } else if (data.rebateType === 'Amount') {
                    if (data.rebateValue < 0) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: ['rebateValue'],
                            message: 'Amount cannot be negative'
                        });
                    }
                }
            }
        }),
    delete: z.object({
        fyG_Id: deleteIdSchema('fyG_Id')
    })
};
//term,concession,ter fee head
export const masterConcessionSchema = {
    addOrUpdate: z.object({
        fmcC_Id: z.number().int().optional(),
        //fmcC_ConcessionName: z.string().min(1, { message: 'ConcessionName is required' }),
        fmcC_ConcessionName: createStringOnlySchema('Concession Name', 1, 100),
        fmcC_ConcessionApplLimit: z.number({
            message: 'Concession Limit is required'
        }),
        //   fmcC_ConcessionApplLimit: z.number().min(0, { message: 'ConcessionApplLimit must be at morethan 0' }).optional(),
        fmcC_ConcessionFlag: z.string().optional(),
        fmcC_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        fmcC_Id: deleteIdSchema('fmcC_Id')
    })
};
export const masterTermsSchema = {
    addOrUpdate: z.object({
        fmT_Id: z.number().int().optional(),
        // fmT_Name: z.string().min(1, {
        //     message: 'Term Name is required and Only letters and numbers allowed (no spaces and special characters)'
        // }),
        fmT_Name: createStringSchemaNotAllowNumbersOnly('Term Name', 1, 60),
        fmT_IncludeArrearFeeFlg: z.boolean().optional(),
        fmT_ActiveFlag: z.boolean().optional()
    }),
    delete: z.object({
        fmT_Id: deleteIdSchema('fmT_Id')
    })
};
export const masterTermFeeHeadSchema = {
    addOrUpdate: z.object({
        heads: z.array(z.string()).nonempty('Please select at least one Head'),
        //terms: z.array(z.string()).nonempty('Please select Term'),
        //installments: z.array(z.string()).nonempty('Please select at least one Term'),
        //  installments:z.string().nonempty('Please select at least one Installment'),
        installments: z.array(z.string()).nonempty('Please select at least one Installment'),

        fmT_Id: z.number({ message: 'Term is required' })
        // ftI_Id: z.number({ message: 'Installment is required' })
    }),
    delete: z.object({
        idforedt: deleteIdSchema('idforedt')
    })
};
export const masterConcessionDetailsSchema = {
    addOrUpdate: z
        .object({
            fmccD_Id: z.number().int().optional(),
            fmcC_Id: z.number({ message: 'Concession Category Type is required' }),
            fmccD_PerOrAmtFlag: z.string({
                message: 'Amount or Percentage is required'
            }),

            fmccD_FromNoSibblings: z.number().min(1, { message: 'From No of Sibblings is required' }),
            fmccD_ToNoSibblings: z.number().min(1, { message: 'To No of Sibblings is required' }),
            //fmcC_ActiveFlag: z.boolean().optional(),
            // fmccD_PerOrAmt: z.number().min(1, { message: 'Concession Limit must be at morethan 0' })
            fmccD_PerOrAmt: z
                .number({
                    required_error: 'Percent/Amount is required',
                    invalid_type_error: 'Percent/Amount is required'
                })
                .nullable()
                .refine((val) => val !== null, {
                    message: 'Percent/Amount 1 is required'
                })
        })
        .refine((data) => data.fmccD_FromNoSibblings < data.fmccD_ToNoSibblings, {
            message: 'From No of Sibling must be less than  to To No of Siblings',
            path: ['fmccD_FromNoSibblings']
        })
        .refine(
            (data) => {
                // If type is Percentage → value must NOT exceed 100
                if (data.fmccD_PerOrAmtFlag === 'P') {
                    return data.fmccD_PerOrAmt <= 100;
                }
                return true;
            },
            {
                message: 'Percentage should Not Be morethan 100',
                path: ['fmccD_PerOrAmt'] // <— Error attached to this field
            }
        ),
    delete: z.object({
        fmccD_Id: deleteIdSchema('fmccD_Id')
    })
};

export const feeConfigSchema = {
    addOrUpdate: z.object({
        fmC_Id: z.number().int().optional(),
        FMC_GroupOrTermFlg: createStringSchema('FMC_GroupOrTermFlg', 1, 1), // “T” or “G”
        FMC_ArrearAfterFlag: z.boolean().optional(),
        FMC_Areawise_FeeFlg: z.number().int().optional(),
        FMC_TransportFeeAreaFlag: z.boolean().optional(),
        FMC_TransportFeeZoneFlag: z.boolean().optional(),
        FMC_DOACheckFlag: z.boolean().optional(),
        FMC_GroupRemarksFlag: z.boolean().optional(),
        FMC_AutoReceiptFeeGroupFlag: z.boolean().optional(),
        FMC_Receipt_Format: z.boolean().optional(),
        FMC_EableStaffTrans: z.boolean().optional(),
        FMC_EableOtherStudentTrans: z.boolean().optional(),
        FMC_FineEnableDisable: z.boolean().optional(),
        FMC_FineMapping: z.boolean().optional(),
        FMC_USER_PREVILEDGE: z.boolean().optional(),
        FMC_StaffConcessionCheck: z.boolean().optional(),
        FMC_ShowPreviousFeeFisrtFlg: z.boolean().optional(),
        FMC_MakerCheckerReqdFlg: z.boolean().optional(),
        FMC_RebateAplicableFlg: z.boolean().optional(),
        FMC_RebateAgainstFullPaymentFlg: z.boolean().optional(),
        FMC_RebateAgainstPartialPaymentFlg: z.boolean().optional(),
        // Receipt Settings
        FMC_RInstallmentsFlag: z.boolean().optional(),
        FMC_RInstallmentsMergeFlag: z.boolean().optional(),
        FMC_RFineFlag: z.boolean().optional(),
        FMC_RConcessionFlag: z.boolean().optional(),
        FMC_RWaivedFlag: z.boolean().optional(),
        FMC_RBalanceFlag: z.boolean().optional(),
        FMC_RAmountFlag: z.boolean().optional(),
        FMC_RBankFlag: z.boolean().optional(),
        FMC_ChallanOptionFlag: z.boolean().optional(),
        FMC_RDueDateFlag: z.boolean().optional(),
        FMC_RAddressFlag: z.boolean().optional(),
        // Fee Receipt Heads
        FMC_RFeeHeaderFlag: z.boolean().optional(),
        FMC_RClassFlag: z.boolean().optional(),
        FMC_RSectionFlag: z.boolean().optional(),
        FMC_RUserNameFlag: z.boolean().optional(),
        FMC_RFatherNameFlag: z.boolean().optional(),
        FMC_MotherNameFlag: z.boolean().optional(),
        FMC_RHeaderTitleFlag: z.boolean().optional(),
        FMC_RPaymentDetailsFlag: z.boolean().optional(),
        FMC_RAmountReceivedFlag: z.boolean().optional(),
        FMC_RRemarksFlag: z.boolean().optional(),
        FMC_RCurrentDateFlag: z.boolean().optional(),
        // Daily Collection
        FMC_Fine_Column: z.boolean().optional(),
        FMC_ArrearColumn: z.boolean().optional(),
        // Account Setting
        FMC_StudentwiseJVFlag: createStringSchema('FMC_StudentwiseJVFlag', 1, 1), // “S” or “H”
        // Fee Print Option
        FMC_RFeeGroupFeeHeadFlag: z.boolean().optional(),
        FMC_RSplFeeHeadFlag: z.boolean().optional(),
        FMC_fmC_AutoRecieptPrintFlag: z.boolean().optional(),
        PartialPayment: z.string().optional(),
        FinancialAccount: z.string().optional(),
        Rebate: z.string().optional()
    }),
    delete: z.object({
        fmC_Id: deleteIdSchema('fmC_Id')
    })
};
export const masterClassYearlyGroupMappingSchema = {
    addOrUpdate: z.object({
        academicYear: z.string().min(1, { message: 'Academic Year is required' }),
        usePrefix: z.boolean(),
        useSuffix: z.boolean(),
        prefixValue: z.string().optional(),
        suffixValue: z.string().optional(),
        // startingNumber: z
        //.string()
        //.min(1, { message: 'Starting Number is required' })
        //.refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
        //message: 'Starting Number must be a valid non-negative number'
        //}),
        groups: z.array(z.string()).min(1, { message: 'At least one group must be selected' }),
        autoGroupName: z.string().min(1, { message: 'Auto Group Name is required' }),
        address: z.string().optional(),
        receiptTemplateFormat: z.string().optional()
    })
};

export const YearlyRebateSettingsSchema = {
    addOrUpdate: z
        .object({
            asmaY_Id: z.string({ required_error: 'Academic Year is required' }).min(1, 'Academic Year is required'),
            fyrebseT_RebateTypeFlg: z
                .string()
                .optional()
                .refine((val) => !val || ['A', 'P'].includes(val), 'Invalid Rebate Type'),
            //   fyrebseT_RebateTypeFlg: z
            // .string()
            // .optional()
            // .refine((val) => !val || ['Amount', 'Percentage'].includes(val), 'Invalid Rebate Type'),
            fyrebseT_Id: z
                .string()
                .optional()
                .refine((val) => !val || ['0', '1'].includes(val), 'Invalid Rebate Type'),
            fyrebseT_RebateAmtOrPercentValue: z
                .union([z.string(), z.number()])
                .transform((val) => Number(val))
                .refine((val) => !Number.isNaN(val) && val >= 0, 'Rebate Value must be a valid number')
                .optional()
                .default(0),
            fyrebseT_RebateDate: z.string({ required_error: 'Rebate Date is required' }).min(1, 'Rebate Date is required')
        })
        .superRefine((data, ctx) => {
            // 🔥 Percentage validation
            if (data.fyrebseT_Id === '1') {
                if (data.fyrebseT_RebateAmtOrPercentValue > 100) {
                    ctx.addIssue({
                        path: ['fyrebseT_RebateAmtOrPercentValue'],
                        message: 'Percentage should not be more than 100',
                        code: z.ZodIssueCode.custom
                    });
                }
            }
        }),

    delete: z.object({
        fyG_Id: z
            .string({ required_error: 'ID is required' })
            .min(1, 'Invalid ID')
            .refine((val) => !Number.isNaN(Number(val)), 'ID must be a number')
    })
};

export const feePrivilegeSchema = {
    addOrUpdate: z.object({
        academicYear: z.string({ required_error: 'Academic Year is required' }).min(1, 'Please select an Academic Year'),
        group: z.string({ required_error: 'Group is required' }).min(1, 'Please select a Group'),
        heads: z.array(z.string()).min(1, 'Please select at least one Head'),
        roles: z.string({ required_error: 'Role is required' }).min(1, 'Please select a Role'),
        users: z.array(z.string()).min(1, 'Please select at least one User')
    }),
    delete: z.object({
        fgL_Id: deleteIdSchema('flg_Id')
    })
};

// export const masterTermFeeHeadDueDateSchema = {
//     addOrUpdate: z.object({
//         asmaY_Id: z.number().int({ message: 'Academic Year is required' }).optional(),
//         fmT_Id: z.number().int({ message: 'Term is required' }),
//         fmH_Id: z.number().int({ message: 'Category is required' })
//     }),
//     delete: z.object({
//         fmA_Id: deleteIdSchema('fmA_Id')
//     })
// };

export const masterOnlinePaymentHeadGroupSchema = {
    addOrUpdate: z.object({
        mI_Id: z.string().min(1, { message: 'Institution is required' }).optional(),
        institutionName: z.string().min(1, { message: 'Institution Name is required' }).optional(),
        asmaY_Id: z.number().int({ message: 'Academic Year is required' }).optional(),
        classCategory: z.string().min(1, { message: 'Class is required' }),
        subMerchantId: z.string().min(1, { message: 'Sub Merchant Id is required' }),
        groupName: z.string().min(1, { message: 'Group Name is required' }),
        headSearchTerm: z.string().optional(),
        installmentName: z.string().min(1, { message: 'Installment is required' }),
        terms: z.string().min(1, { message: 'Terms is required' }),
        academicYear: z.string().optional()
    }),
    delete: z.object({
        fopM_Id: deleteIdSchema('fopM_Id')
    })
};

export const masterTermFeeHeadDuedateSchema = {
    addOrUpdate: z.object({
        asmay_Id: z.number({ message: 'Academic Year is required' }),
        fmt_id: z.number({ message: 'Term is required' }),
        fmh_id: z.number({ message: 'Head is required' })
    }),
    delete: z.object({
        fmtfhdD_Id: deleteIdSchema('fmtfhdD_Id')
    })
};

export const masterClassFeeMasterGroupwiseAutoReceipt = {
    addOrUpdate: z
        .object({
            academicYear: z.string().min(1, { message: 'Academic Year is required' }),
            usePrefix: z.boolean().optional(),
            useSuffix: z.boolean().optional(),
            prefixValue: z.string().optional(),
            suffixValue: z.string().optional(),
            //startingNumber: z.string().min(1, { message: 'Starting Number is required' }),
            startingNumber: createNumberOnlyStringSchema('Starting Number', 1, 100),
            groups: z.array(z.string().min(1)).min(1, { message: 'At least one group must be selected' }),
            //autoGroupName: z.string().min(1, { message: 'Auto Group Name is required' }),

            autoGroupName: createStringOnlySchema('Auto Group Name', 1, 100),
            address: z.string().min(1, { message: 'Address is required' }),
            //receiptTemplateFormat: z.string().min(1, { message: 'Receipt Template Format is required' })
            // receiptTemplateFormat: z
            //     .string()
            //     .min(1, { message: 'Receipt Template Format is required' })
            //     .regex(/<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s*\/>)/i, {
            //         message: 'Please enter valid HTML format'
            //     })

            receiptTemplateFormat: z
                .string()
                .min(1, { message: 'Receipt Template Format is required' })
                .regex(/<[^>]+>/, { message: 'Please enter valid HTML content' })
        })
        .refine(
            (data) => {
                if (data.usePrefix && (!data.prefixValue || data.prefixValue.trim() === '')) {
                    return false;
                }
                return true;
            },
            {
                message: 'Prefix value is required when prefix is selected',
                path: ['prefixValue']
            }
        )
        .refine(
            (data) => {
                if (data.useSuffix && (!data.suffixValue || data.suffixValue.trim() === '')) {
                    return false;
                }
                return true;
            },
            {
                message: 'Suffix value is required when suffix is selected',
                path: ['suffixValue']
            }
        ),

    delete: z.object({
        fycC_Id: z.number().min(1, {
            message: 'Valid Class Yearly Category ID is required for deletion'
        })
    })
};

export const masterConcessionCategorygroupHeadMappingSchema = {
    addOrUpdate: z.object({
        // fmcC_Id: z.number().int().optional(),
        fmcC_Id: z.number({ message: 'Concession Category Type is required' }),
        FMG_Id: z.number({ message: 'Group is required' }),
        fmH_Ids: z.array(z.string()).nonempty('Please select at least one Head')

        // installments: z.array(z.string()).nonempty('Please select at least one Installment'),
    }),
    delete: z.object({
        fmaccG_Id: deleteIdSchema('fmaccG_Id')
    })
};

export const masterFeePrivilege = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        userId: z.number({ message: 'User is required' }),
        fmG_Id: z.number().int().optional(),
        fmG_GroupName: z.string().min(1, { message: 'Fee Group is required' }).max(200)
    }),
    toggle: z.object({
        fmG_Id: z.number(),
        fmG_ActiceFlag: z.boolean()
    }),
    delete: z.object({
        fyG_Id: z
            .number({
                required_error: 'Yearly Group ID is required',
                invalid_type_error: 'Yearly Group ID must be a number'
            })
            .refine((val) => val > 0, {
                message: 'Yearly Group ID must be greater than 0'
            })
    })
};

export const masterTermPeriodSchema = {
    addOrUpdate: z
        .object({
            asmay_Id: z.number({ message: 'Academic Year is required' }),
            fmt_id: z.number({ message: 'Term is required' }),
            // fmh_id: z.number({ message: 'Head is required' }),
            fmtP_Year: z.string().min(1, 'Please select year'),
            filterType: z.string().min(1, 'Please select a fee type'),
            from_Month: z.string().min(1, 'Please select from month'),
            to_Month: z.string().min(1, 'Please select to month')
        })
        .refine((data) => data.from_Month !== data.to_Month, {
            message: 'From Month and To Month cannot be the same',
            path: ['to_Month'] // error will show under To Month
        }),
    //  .refine(
    //     (data) =>
    //         monthOrder[data.from_Month] <
    //         monthOrder[data.to_Month],
    //     {
    //         message: 'From Month must be earlier than To Month',
    //         path: ['to_Month']
    //     }
    // ),
    delete: z.object({
        fmtP_Id: deleteIdSchema('fmtP_Id')
    })
};

export const masterStudentFeeGroupMappingSchema = {
    addOrUpdate: z.object({
        mI_Id: z.string().optional(),
        institutionName: z.string().optional(),
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        feeClassCategory: z.string().optional(),
        classCategory: z.string().optional(),
        busRouting: z.string().optional(),
        casteCategory: z.string().optional(),
        class: z.number().optional(),
        section: z.number().optional(),
        area: z.string().optional()
    }),
    delete: z.object({
        fopM_Id: deleteIdSchema('fopM_Id')
    })
};

export const masterFeeOtherStudentSchema = {
    addOrUpdate: z.object({
        // mI_Id: z.string().min(1, { message: 'Institution is required' }),
        // institutionName: z.string().min(1, { message: 'Institution Name is required' }),
        // studentName: z.string().min(1, { message: 'Student Name is required' }).max(60, {
        //     message: 'Name should not exceed 60 characters'
        // }),
        studentName: createStringOnlySchema('Student Name', 1, 60),
        //mobileno:createStringOnlySchema('Mobile Number', 1, 15),
        // mobileno: z.string().min(1, { message: 'Mobile Number is required' }),
        //emailno: z.string().min(1, { message: 'Email Number is required' })
        //emailno:createEmailSchema('Email Number', 1, 50),

        emailno: createEmailSchema('Email Id', 1, 50),
        mobileno: z
            .string()
            .refine((val) => val.length === 10, {
                message: 'Mobile number must be exactly 10 digits'
            })
            .refine((val) => !val.startsWith('0'), {
                message: 'Mobile number cannot start with 0'
            })
    }),
    delete: z.object({
        fopM_Id: deleteIdSchema('fopM_Id')
    })
};

export const specialFeeHeadSchema = {
    addOrUpdate: z.object({
        heads: z.array(z.string()).nonempty('Please select at least one Head'),
        //fmsfH_Name: z.string().min(4, { message: 'Special Fee Head Name is required' })
        fmsfH_Name: createStringOnlySchema('Special Fee Head Name', 4, 50)
    }),
    delete: z.object({
        fmsfhfH_Id: deleteIdSchema('fmsfhfH_Id')
    })
};

export const feeCompanyGroupMappingSchema = {
    addOrUpdate: z.object({
        ftmcoM_Id: z.number().int({ message: 'Company is required' }),
        groupids: z.array(z.string()).nonempty('Please select at least one Head')
        //fmsfH_Name: z.string().min(4, { message: 'Special Fee Head Name is required' })
        //fmsfH_Name: createStringOnlySchema('Special Fee Head Name', 4, 50)
    }),
    delete: z.object({
        ffgcmA_Id: deleteIdSchema('ffgcmA_Id')
    })
};
