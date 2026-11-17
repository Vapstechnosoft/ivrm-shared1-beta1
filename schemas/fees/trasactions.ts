import { z } from 'zod';
import { createNumberOnlyStringSchema, createOptionalStringSchema, deleteIdSchema } from '../validationSchemas';

export const amountEntrySchema = {
    addOrUpdate: z.object({
        //asmaY_Id: z.number().int({ message: 'Academic Year is required' }),
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        feeGroupId: z.number({ message: 'Fee Group is required' }),
        categoryId: z.number({ message: 'Category is required' })
    }),
    delete: z.object({
        fmA_Id: deleteIdSchema('fmA_Id')
    })
};

export const thirdPartyTransactionSchema = {
    addOrUpdate: z
        .object({
            fyP_Receipt_No: z.string().optional(),
            studentType: z.enum(['student', 'other']),
            academicYearId: z.number().min(1, 'Academic Year is required'),

            // academicYearId: z.number({ message: 'Term is required' }),
            studentId: z.number().optional(),
            //studentName: createStringOnlySchema('Student Name', 1, 100).optional(),
            studentName: z.string().optional(),
            // groupId: z.number().min(1, 'Group Name is required'),
            // headId: z.number().min(1, 'Head Name is required'),
            // amount: z.number({ message: 'Amount is required' }),
            // amount: z.number().min(0.01, 'Amount is required'),
            groupId: z.number({ message: 'Group Name is required' }),
            headId: z.number({ message: ' Head Name is required' }),
            amount: z.number({ message: 'Amount is required' }),
            //  groupId: z.number().optional(),
            //             headId: z.number().optional(),
            //               amount: z.number().optional(),

            towards: z.string().optional(),
            //date: z.string().min(1, "Date is required"),
            date: z.string({ required_error: 'Date is required' }).min(1, ' Date is required'),

            // date: z
            //   .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({
            //     required_error: "Date is required",
            //     invalid_type_error: "Invalid date format",
            //   })),

            //paymentMode: z.enum(['bank', 'cash', 'rtgsneft', 'card']),
            paymentMode: z.enum(['B', 'C', 'R', 'S']),
            bankId: z.number().optional(),
            chequeDate: z.string().optional(),
            // chequeNo: z.string().optional(),
            //chequeNo: z.string().min(13, 'Minimum 13 characters for Cheque Number is required').max(19, 'Cheque Number is too long'),
            chequeNo: z.string().optional(),
            bankName: z.string().optional()
        })
        .superRefine((data, ctx) => {
            if (data.paymentMode === 'B') {
                if (!(typeof data.bankId === 'number' && data.bankId > 0)) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Bank Name is required',
                        path: ['bankId']
                    });
                }
                if (!data.chequeDate || data.chequeDate.trim() === '') {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Cheque Date is required',
                        path: ['chequeDate']
                    });
                }
                if (!data.chequeNo || data.chequeNo.trim() === '') {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Cheque Number is required',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length < 13) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Card Number must be at least 13 digits',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length > 19) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Card Number cannot exceed 19 digits',
                        path: ['chequeNo']
                    });
                }
            }
            if (data.paymentMode === 'R') {
                if (!data.chequeNo || data.chequeNo.trim() === '') {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Cheque Number is required',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length < 13) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Cheque Number must be at least 13 digits',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length > 19) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Cheque Number cannot exceed 19 digits',
                        path: ['chequeNo']
                    });
                }
            }
            if (data.paymentMode === 'S') {
                if (!data.chequeNo || data.chequeNo.trim() === '') {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Card Number is required',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length < 13) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Card Number must be at least 13 digits',
                        path: ['chequeNo']
                    });
                } else if (data.chequeNo.length > 19) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Card Number cannot exceed 19 digits',
                        path: ['chequeNo']
                    });
                }
            }
            // if (data.studentType === 'other') {
            //     const value = data.studentName ?? '';

            //     const result = createStringOnlySchema('Student Name', 1, 100)
            //         .safeParse(value);

            //     if (!result.success) {
            //         result.error.errors.forEach(err => {
            //             ctx.addIssue({
            //                 code: 'custom',
            //                 message: err.message,
            //                 path: ['studentName'],
            //             });
            //         });
            //     }
            // }
        }),

    delete: z.object({
        fyptP_Id: deleteIdSchema('fyptP_Id')
    })
};

//transactions
export const feeOpeningBalanceSchema = {
    addOrUpdate: z
        .object({
            mi_id: z.number().int().nonnegative(),
            selectionType: z.enum(['T', 'G', 'C'], {
                required_error: 'Selection type is required'
            }),
            academicYear: z.string().min(1, 'Academic year is required'),

            category: z.string().nullable().optional(),
            class: z.string().nullable().optional(),
            section: z.string().nullable().optional(),
            student: z.string().nullable().optional(),

            feeHead: z.string().nullable().optional(),
            feeGroup: z.string().nullable().optional(),

            feeInstallments: z.array(z.string()).optional(),

            date: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (yyyy-MM-dd)')
                .optional(),

            refundableType: z.enum(['Refundable', 'NonRefundable']),
            activeType: z.enum(['Active', 'Left']),
            pdaorfeeType: z.enum(['Fees']),
            nameFormat: z.enum(['NameReg.No', 'Reg.NoName'])
        })
        .passthrough()
        .refine(
            (data) => {
                if (data.selectionType === 'C' && !data.category) return false;
                if (data.selectionType !== 'C' && !data.class) return false;
                if (data.selectionType === 'G' && !data.student) return false;
                return true;
            },
            {
                message: 'Invalid data: required fields missing based on selectionType value.',
                path: ['selectionType']
            }
        ),

    delete: z.object({
        fmC_Id: deleteIdSchema('fmC_Id')
    })
};

// export const feeTransactionWaivedOffSchema = {
//     addOrUpdate: z
//         .object({
//             mi_id: z.number().int().nonnegative(),

//             academicYear: z.number().min(1, 'Academic year is required'),
//             class: z.number().min(1, 'Class is required'),
//             section: z.number().min(1, 'Section is required'),

//              class: z.string().nullable().optional(),
//              section: z.string().nullable().optional(),
//             student: z.number().min(1, 'student is required'),

//             feeHead: z.string().nullable().optional(),
//             feeGroup: z.string().nullable().optional(),

//             feeInstallments: z.array(z.string()).optional(),

//             date: z
//                 .string()
//                 .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (yyyy-MM-dd)')
//                 .optional(),

//             refundableType: z.enum(['Refundable', 'NonRefundable']),
//             activeType: z.enum(['FineWaiveOff', 'CompleteFineWaiveOff']),
//             mremarks: z.string().nullable().optional(),
//             nameFormat: z.enum(['NameReg.No', 'Reg.NoName'])
//         })
//         .passthrough(),
//     delete: z.object({
//         fmC_Id: deleteIdSchema('fmC_Id')
//     })
// };

// export const feeTransactionWaivedOffSchema = {
//     addOrUpdate: z.object({
//         academicYear: z.number({ message: 'Academic year is required' }),
//         class: z.number({ message: 'Class is required.' }),
//         section: z.number({ message: 'Section is required.' }),
//         student: z.number({ message: 'Student Name is required.' }),
//         remarks: z.string().min(1, 'Remarks are required.'),
//         date: z.date({ required_error: 'Date is required' }),
//         uploadedPhotoPath: z.string().optional(),
//         feeGroupIds: z
//             .array(
//                 z.object({
//                     ismS_Id: z.number({ required_error: 'Group is required' })
//                 })
//             )
//             .min(1, { message: 'At least one Group must be selected' })
//     }),

//     delete: z.object({
//         fmC_Id: deleteIdSchema('fmC_Id')
//     })
// };

export const feeTransactionWaivedOffSchema = {
    addOrUpdate: z.object({
        academicYear: z.number({ message: 'Academic year is required' }),
        class: z.number({ message: 'Class is required.' }),
        section: z.number({ message: 'Section is required.' }),
        student: z.number({ message: 'Student Name is required.' }),
        remarks: z.string().min(1, 'Remarks are required.'),
        date: z.date({ required_error: 'Date is required' }),
        uploadedPhotoPath: z.string().optional(),
        feeGroupIds: z.array(z.number()).min(1, { message: 'At least one Group must be selected' })
    }),

    delete: z.object({
        fmC_Id: deleteIdSchema('fmC_Id')
    })
};

export const feePreadmissionTransactionSchema = {
    addOrUpdate: z.object({
        //asmaY_Id: z.number().int({ message: 'Academic Year is required' }),
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        // feeGroupId: z.number({ message: 'Fee Group is required' }),
        // categoryId: z.number({ message: 'Category is required' })

        feeGroupId: z.number().optional(),
        categoryId: z.number().optional()
    }),
    delete: z.object({
        fmA_Id: deleteIdSchema('fmA_Id')
    })
};

// export const feesStudentTransactionSchema = {
//     addOrUpdate: z
//         .object({
//             // Academic Year
//             asmaY_Id: z.number().int().positive('Academic Year is required'),

//             // Optional when class-wise / section-wise is not checked
//             asmcl_Id: z.number().int().optional(),
//             asms_Id: z.number().int().optional(),

//             // Student selection
//             amst_Id: z.number().int().positive('Student is required'),

//             // Fee groups (array of selected FMG_Id)
//             feeGroupIds: z.array(z.number().int()).min(1, 'Select at least one Fee Group'),

//             // Receipt No. (required only when `showReceiptNo` is true)
//             receiptNo: z.string().optional(),

//             // Amount checkbox → paying amount (required when checked)
//             payingAmount: z.number().positive().optional(),

//             // Payment mode (Single / Multiple)
//             payModeType: z.enum(['Single', 'Multiple']),
//             date: z.date({ required_error: 'Date is required' }),
//             bankName: z.string().optional(),

//             // Payment rows (at least one must be filled)
//             paymentRows: z
//                 .array(
//                     z.object({
//                         modeId: z.number().int(),
//                         modeFlag: z.enum(['C', 'B']), // C = Cash, B = Bank/Cheque/Card
//                         chequeDate: z.string().optional(),
//                         chequeNo: z.string().optional(),
//                         bankName: z.string().optional(),
//                         amount: z.number().positive('Amount required'),
//                         selected: z.boolean()
//                     })
//                 )
//                 .refine((rows) => rows.some((r) => r.selected), {
//                     message: 'Select at least one payment mode'
//                 }),

//             // Narration
//             narrationId: z.number().int().optional(),
//             narrationText: z.string().optional(),

//             // Grid rows (selected + edited values)
//             gridRows: z
//                 .array(
//                     z.object({
//                         fmA_Id: z.number().int(),
//                         fmH_Id: z.number().int(),
//                         ftI_Id: z.number().int(),
//                         fmG_Id: z.number().int(),
//                         totalamount: z.number(),
//                         fsS_TotalToBePaid: z.number(),
//                         fsS_ConcessionAmount: z.number(),
//                         fsS_FineAmount: z.number(),
//                         fsS_ToBePaid: z.number().positive('Payable amount required'),
//                         fsS_TotalToBePaidaddfine: z.number(),
//                         fsS_RebateAmount: z.number(),
//                         isSelected: z.boolean()
//                     })
//                 )
//                 .min(1, 'Select at least one fee row'),

//             // Flags
//             amountCheck: z.boolean(),
//             showReceiptNo: z.boolean(),
//             rebateFlag: z.boolean()
//         })

//         // ------------------------------------------------------------------ //
//         // 2. Conditional Validations (refine)
//         // ------------------------------------------------------------------ //

//         // Receipt No. required only when showReceiptNo = true
//         .refine((data) => !data.showReceiptNo || (data.receiptNo && data.receiptNo.trim() !== ''), {
//             message: 'Receipt No. is required',
//             path: ['receiptNo']
//         })

//         // payingAmount required only when amountCheck = true
//         .refine((data) => !data.amountCheck || (data.payingAmount !== undefined && data.payingAmount > 0), {
//             message: 'Enter paying amount',
//             path: ['payingAmount']
//         })

//         // At least one grid row must be selected (isSelected = true)
//         .refine((data) => data.gridRows.some((row) => row.isSelected), {
//             message: 'Select at least one fee row',
//             path: ['gridRows']
//         })

//         // Total of selected gridRows.fsS_ToBePaid must equal payingAmount (if amountCheck) OR sum of paymentRows.amount
//         .refine(
//             (data) => {
//                 const totalPayable = data.gridRows.filter((r) => r.isSelected).reduce((sum, r) => sum + r.fsS_ToBePaid, 0);

//                 const totalPaid = data.paymentRows.filter((r) => r.selected).reduce((sum, r) => sum + r.amount, 0);

//                 const expected = data.amountCheck ? data.payingAmount || 0 : totalPayable;

//                 return Math.abs(totalPaid - expected) < 0.01; // floating point tolerance
//             },
//             {
//                 message: 'Total payment must match payable amount',
//                 path: ['paymentRows']
//             }
//         )

//         // For Bank modes (B), require date, no, bank when selected
//         .refine(
//             (data) => {
//                 return data.paymentRows.every((row) => {
//                     if (!row.selected || row.modeFlag !== 'B') return true;
//                     return (
//                         row.chequeDate &&
//                         row.chequeDate.trim() !== '' &&
//                         row.chequeNo &&
//                         row.chequeNo.trim() !== '' &&
//                         row.bankName &&
//                         row.bankName.trim() !== ''
//                     );
//                 });
//             },
//             {
//                 message: 'Cheque/DD Date, No., and Bank Name are required for bank payment',
//                 path: ['paymentRows']
//             }
//         )
// };

export const feesStudentTransactionSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' }),
        asmcl_Id: z.number().optional(),
        asms_Id: z.number().optional(),
        modeofPayment: z.string().optional(),
        narrationId: z.number().optional()
    })
};

export const feesStudentTransactionUpdateSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' }),
        asmcl_Id: z.number().optional(),
        asms_Id: z.number().optional(),
        modeofPayment: z.string().optional(),
        narrationId: z.number().optional(),
        studentSearchName: z.string().optional()
    })
};

export const feesRefundableSchema = {
    addOrUpdate: z.object({
        refundableflag: z.string().optional(),
        academicYearId: z.number().int({ message: 'Academic Year is required' }),
        sectionId: z.number().int({ message: 'Section is required' }),
        fR_BankName: createOptionalStringSchema('Bank Name', 1, 100).optional(),
        fR_CheqNo: createNumberOnlyStringSchema('Cheque No.', 13, 100).optional(),

        fR_Date: z.string().min(1, 'Refund date is required').optional(),

        // headId: z.number().int({ message: 'Head is required' }),
        //  groupId: z.number().int({ message: 'Group is required' }).optional(),
        classId: z.number().int({ message: 'Class is required' }),
        studentWise: z.string().min(1, 'Select at least one student'),
        REF_REC_No: z.string().min(13, 'Voucher is required(13 digits)').max(19, 'Voucher Number is too long'),
        groups: z.array(z.string()).min(1, 'Select at least one group')
    }),
    delete: z.object({
        fR_ID: deleteIdSchema('fR_ID')
    })
};

export const feeAdjustmentSchema = {
    addOrUpdate: z.object({
        //asmaY_Id: z.number().int({ message: 'Academic Year is required' }),
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        // feeGroupId: z.number({ message: 'Fee Group is required' }),
        // categoryId: z.number({ message: 'Category is required' })

        feeGroupId: z.number().optional(),
        categoryId: z.number().optional()
    }),
    delete: z.object({
        fsA_Id: deleteIdSchema('fsA_Id')
    })
};

// src/types/fees/receipt.ts
export interface IReceiptResponse {
    htmldata?: string;
    fillstudentviewdetails?: IStudentViewDetail[];
    currpaymentdetails?: IPaymentDetail[];
    showdetailsreceipt?: IReceiptRow[]; // <-- NEW
    groupwiseBalance?: { FSS_ToBePaid: number }[];
    srkvsdetails?: any[];
    getfeeheaddetails?: any[];
    streamdetails?: { asmsT_StreamName: string }[];
    duration?: string;
    year?: string;
    dueamount?: number;
    date?: string;
    month?: string;
    termremarks?: { termname: string }[];
    filltotaldetails?: any[];
    portalusername?: string;
    fillacclst?: { SPCCMH_HouseName: string; TRMR_RouteNo: string }[];
    pendingamount?: number;
    asmaY_Year?: string;
    masterinstitution?: {
        mI_Address1: string;
        mI_Address2?: string;
        mI_Address3?: string;
        mI_Pincode?: string;
    }[];
}

export interface IStudentViewDetail {
    amsT_FirstName?: string;
    amsT_MiddleName?: string;
    amsT_LastName?: string;
    classname?: string;
    sectionname?: string;
    rollno?: string;
    admno?: string;
    fathername?: string;
    mothername?: string;
    fyP_Receipt_No?: string;
    fmcC_ConcessionName?: string;
    fyP_Remarks?: string;
    amst_mobile?: string;
    fyP_ChallanNo?: string;
    fyP_PaymentReference_Id?: string;
    fyp_transaction_Id?: string;
    fyP_Date?: string;
    fyP_Bank_Or_Cash?: 'C' | 'O' | 'E' | 'B' | 'R' | 'S';
    fyP_DD_Cheque_No?: string;
    fyP_DD_Cheque_Date?: string;
    fyP_Bank_Name?: string;
    totalcharges?: number;
    ftP_Paid_Amt?: number;
    ftP_Concession_Amt?: number;
    ftP_Fine_Amt?: number;
    fsS_AdjustedAmount?: number;
    fsS_RefundAmount?: number;
    fsS_OBArrearAmount?: number; // <-- NEW
    fmH_FeeName?: string;
    fmH_Id?: number;
    ftI_Id?: number;
}

export interface IPaymentDetail {
    ftP_Paid_Amt?: number;
    ftP_Concession_Amt?: number;
    fyP_Remarks?: string;
    fyP_Bank_Or_Cash?: string;
    fyppM_TransactionId?: string;
    fyppM_PaymentReferenceId?: string;
}

export interface IReceiptRow {
    fmH_FeeName?: string;
    fmH_FeeNameex?: string;
    totalcharges?: number;
    feetotcharges?: number;
    ftP_Paid_Amt?: number;
    totalamount?: number;
    ftP_Concession_Amt?: number;
    concessionamt?: number;
    ftP_Fine_Amt?: number;
    fineamt?: number;
    fsS_AdjustedAmount?: number;
}

export const feesStaffOtherTransactionSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' }),
        amst_Id: z.number().optional(),
        modeofPayment: z.string().optional(),
        narrationId: z.number().optional()
    })
};

export const amountEntrySchemastThomas = {
    addOrUpdate: z.object({
        //asmaY_Id: z.number().int({ message: 'Academic Year is required' }),
        asmaY_Id: z.number({ message: 'Academic Year is required' }),
        feeGroupId: z.number({ message: 'Fee Group is required' }),
        categoryId: z.number({ message: 'Category is required' })
    }),
    delete: z.object({
        fmA_Id: deleteIdSchema('fmA_Id')
    })
};
