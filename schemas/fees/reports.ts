import { z } from 'zod';
import { createStringOnlyOptionalSchema, deleteIdSchema } from '../validationSchemas';

export const feeAuditSchema = z.object({
    academicYearId: z.string().min(1, 'Academic Year is required'),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
    breakdown: z.string().optional()
});

export const dailyFeeCollectionSchema = z.object({
    report: z.enum(['All', 'students', 'staff', 'others']).default('students'),

    rpttyp: z.enum(['All', 'Individual']).default('Individual'),
    reportdate: z.enum(['transdate', 'settdate', 'SettledOnline']).default('transdate'),

    asmaY_Id: z.number().min(1, { message: 'Academic Year is required' }),

    groupIds: z.array(z.number()).min(1, { message: 'Select at least one Group' }),

    chequeDate: z.boolean().default(false),
    acdmyr: z.boolean().default(false),
    headwise: z.boolean().default(false),
    paymentwise: z.boolean().default(false),

    fromDate: z.string().min(1, { message: 'From Date is required' }),
    toDate: z.string().min(1, { message: 'To Date is required' }),

    enableAllClasses: z.boolean().default(false),
    asmcL_Id: z.number().optional(),

    Fmc_allorsudentorother: z.enum(['all', 'stud', 'preadm', 'other', 'Trpt', 'thirdparty', 'multiplepaymentmode']).default('all'),

    Fmc_allorcorddorop: z.enum(['All', 'C', 'B', 'O', 'Ecs', 'S', 'R', 'BT', 'U']).default('All'),

    storedTrans: z.boolean().default(false),
    thirdPartyTrans: z.boolean().default(false),
    pdaTrans: z.boolean().default(false)
});

export const yearlyFeeCollectionSchema = z.object({
    fromDate: z.string().optional(),

    toDate: z.string().optional()
});

export const headWiseReportSchema = z.object({
    asmaY_Id: z.number({ message: 'Academic Year is required' }),
    classcategoryid: z.number({ message: 'Class Category is required' })
});

export const feeMonthEndReportsSchema = z.object({
    fmtP_Year: z.string().min(1, 'Please select year'),
    asmay_Id: z.number({ message: 'Academic Year is required' }),
    iename: createStringOnlyOptionalSchema('IE Name', 1, 50),
    from_Month: z.number().min(1, 'Please select from month'),
    userentry: z.number().optional(),
    settlement: z.number().optional()
});

export const feeDefaulterReportSchema = z
    .object({
        userType: z.enum(['Students', 'Staff', 'Others']).default('Students'),

        viewMode: z.enum(['Yearly Wise', 'Date Wise']).default('Yearly Wise'),

        breakdown: z
            .enum([
                'FGW', // Fee Group Wise
                'FHW', // Fee Head Wise
                'FCW', // Class Wise
                'FIW', // Installment Wise
                'FSW', // Student/Staff Wise
                'FPW' // Parent Wise
            ])
            .default('FGW'),

        academicYearId: z.number({ message: 'Academic Year is required' }),

        includeClassSection: z.boolean().optional(),

        classId: z.number().optional(),

        sectionId: z.number().optional(),

        customGroupIds: z.array(z.number()).min(1, 'Please select at least one Custom Group'),

        //feeGroupIds: z.array(z.number()).min(1, 'Please select at least one Fee Group'),
        feeGroupIds: z.array(z.number()).min(1, 'Please select at least one Fee Group'),
        termIds: z.array(z.number()).min(1, 'Please select at least one Term'),

        busRouteIds: z.array(z.number()).optional(),

        status: z.object({
            active: z.boolean(),
            deactive: z.boolean(),
            left: z.boolean(),
            balance: z.boolean()
        }),

        formatI: z.boolean(),

        dueDate: z.date().optional(),

        dueDateType: z.enum(['Due Date', 'Till Due Date']).optional(),

        bulkDownload: z.boolean().optional()
    })
    .superRefine((data, ctx) => {
        // If class-section is enabled, class & section are required
        if (data.includeClassSection) {
            if (!data.classId || data.classId === 0) {
                ctx.addIssue({
                    path: ['classId'],
                    message: 'Class is required',
                    code: z.ZodIssueCode.custom
                });
            }

            if (!data.sectionId || data.sectionId === 0) {
                ctx.addIssue({
                    path: ['sectionId'],
                    message: 'Section is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        // Date validation when Date Wise is selected
        if (data.viewMode === 'Date Wise' && !data.dueDate) {
            ctx.addIssue({
                path: ['dueDate'],
                message: 'Due date is required for Date Wise report',
                code: z.ZodIssueCode.custom
            });
        }
    });

export const feesClassCategoryReportSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic year is required' })
    })
};

export const feeConsolidatedReportsSchema = z.object({
    academicYearId: z.number({ message: 'Academic Year is required' }),
    classId: z
        .number({ invalid_type_error: 'Class is required' })
        .refine((v) => v !== undefined && v !== 0, { message: 'Class is required' }),
    sectionId: z
        .number({ invalid_type_error: 'Section is required' })
        .refine((v) => v !== undefined && v !== 0, { message: 'Section is required' }),
    userType: z.enum(['All', 'indi']).default('All')
});

export const feesInstallmentReportSchema = z
    .object({
        catg: z.enum(['Category', 'Class', 'transport', 'Consolidate', 'GroupWise']).default('Category'),

        academicYearId: z.number().optional(),

        fmcc_id: z.number().optional(),
        fmg_id: z.number().optional(),

        classId: z.number().optional(),
        sectionId: z.number().optional(),

        termswise: z.number().optional(),
        con: z.enum(['Datewise', 'Classwise']).default('Datewise'),

        installmentIds: z.array(z.number()).optional(),
        termIds: z.array(z.number()).optional(),
        groupIds: z.array(z.number()).optional(),
        busrouteid: z.number().optional(),
        headIds: z.array(z.number()).optional(),
        groupIdsNew: z.array(z.number()).optional(),
        Active: z.number().optional(),
        Deactive: z.number().optional(),
        left: z.number().optional()
    })
    .superRefine((data, ctx) => {
        /* Academic Year */
        if (!data.academicYearId) {
            ctx.addIssue({
                path: ['academicYearId'],
                message: 'Academic Year is required',
                code: z.ZodIssueCode.custom
            });
        }

        /* Class + Section */
        if (data.catg === 'Class') {
            if (!data.classId || data.classId === 0) {
                ctx.addIssue({
                    path: ['classId'],
                    message: 'Class is required',
                    code: z.ZodIssueCode.custom
                });
            }

            if (!data.sectionId || data.sectionId === 0) {
                ctx.addIssue({
                    path: ['sectionId'],
                    message: 'Section is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        /* Category */
        if (data.catg === 'Category' && !data.fmcc_id) {
            ctx.addIssue({
                path: ['fmcc_id'],
                message: 'Category is required',
                code: z.ZodIssueCode.custom
            });
        }

        /* Fee Group */
        // if (data.catg === 'transport' && !data.fmg_id) {
        //     ctx.addIssue({
        //         path: ['fmg_id'],
        //         message: 'Fee Group is required',
        //         code: z.ZodIssueCode.custom
        //     });
        // }

        if (data.catg === 'GroupWise') {
            if (!data.groupIdsNew || data.groupIdsNew.length === 0) {
                ctx.addIssue({
                    path: ['groupIdsNew'],
                    message: 'Fee Groups are required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        if (data.catg === 'transport') {
            if (!data.fmg_id) {
                ctx.addIssue({
                    path: ['fmg_id'],
                    message: 'Fee Group is required',
                    code: z.ZodIssueCode.custom
                });
            }
            if (!data.busrouteid) {
                ctx.addIssue({
                    path: ['busrouteid'],
                    message: 'Bus Route is required',
                    code: z.ZodIssueCode.custom
                });
            }
            if (!data.headIds || data.headIds.length === 0) {
                ctx.addIssue({
                    path: ['headIds'],
                    message: 'Fee Heads are required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        /* 🔥 Installment validation (THIS WAS YOUR ISSUE) */
        if ((data.catg === 'Class' || data.catg === 'Category') && data.termswise !== 1) {
            if (!data.installmentIds || data.installmentIds.length === 0) {
                ctx.addIssue({
                    path: ['installmentIds'],
                    message: 'Installment Name is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        if ((data.catg === 'Class' || data.catg === 'Category') && data.termswise === 1) {
            if (!data.termIds || data.termIds.length === 0) {
                ctx.addIssue({
                    path: ['termIds'],
                    message: 'At least one Term is required',
                    code: z.ZodIssueCode.custom
                });
            }

            if (!data.groupIds || data.groupIds.length === 0) {
                ctx.addIssue({
                    path: ['groupIds'],
                    message: 'At least one Group is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }
    });

export const feeReceiptReportsSchema = z
    .object({
        academicYearId: z.number({ message: 'Academic Year is required' }),
        classId: z
            .number({ invalid_type_error: 'Class is required' })
            .refine((v) => v !== undefined && v !== 0, { message: 'Class is required' }),
        sectionId: z
            .number({ invalid_type_error: 'Section is required' })
            .refine((v) => v !== undefined && v !== 0, { message: 'Section is required' }),
        userType: z.enum(['All', 'indi']).default('All'),
        studentid: z.number({ message: 'Select Student' }),
        heads: z.array(z.string()).optional(),
        receipts: z.array(z.string()).optional()
    })
    .superRefine((data, ctx) => {
        // 🔹 If userType === 'All' → receipts required
        if (data.userType === 'All') {
            if (!data.receipts || data.receipts.length === 0) {
                ctx.addIssue({
                    path: ['receipts'],
                    message: 'Please select at least one Receipt',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        // 🔹 If userType === 'indi' → heads required
        if (data.userType === 'indi') {
            if (!data.heads || data.heads.length === 0) {
                ctx.addIssue({
                    path: ['heads'],
                    message: 'Please select at least one Head',
                    code: z.ZodIssueCode.custom
                });
            }
        }
    });

export const feeAccountsPositionReport = z
    .object({
        filter: z.enum(['individual', 'headwise', 'All', 'route']).default('individual'),
        academicYearId: z.number({ message: 'Academic Year is required' }),
        includeClassSection: z.boolean().optional(),
        asmcl_Id: z.number().optional(),
        asms_Id: z.number().optional(),
        classId: z.number().optional(),
        sectionId: z.number().optional(),
        customGroupIds: z.array(z.number()).min(1, 'Please select at least one Custom Group'),
        feeGroupIds: z.array(z.number()).min(1, 'Please select at least one Fee Group'),
        termIds: z.array(z.number()).min(1, 'Please select at least one Term')
    })
    .superRefine((data, ctx) => {
        // If class-section is enabled, class & section are required
        if (data.includeClassSection) {
            if (!data.classId || data.classId === 0) {
                ctx.addIssue({
                    path: ['classId'],
                    message: 'Class is required',
                    code: z.ZodIssueCode.custom
                });
            }

            if (!data.sectionId || data.sectionId === 0) {
                ctx.addIssue({
                    path: ['sectionId'],
                    message: 'Section is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }
        //Date validation when Date Wise is selected
        // if ( filter.=="individual") {
        //     ctx.addIssue({
        //         path: ['dueDate'],
        //         message: 'Due date is required for Date Wise report',
        //         code: z.ZodIssueCode.custom
        //     });
        // }
    });

export const feeStudentTermWisePaidReportSchema = z.object({
    academicYearId: z.number({ message: 'Academic Year is required' }),
    asmcl_Id: z.number({ message: 'Class is required' }),
    asms_Id: z.number({ message: 'Section Year is required' }),
    termIds: z.array(z.number()).min(1, 'Please select at least one Term')
});

export const excelImportNotDoneReportSchema = {
    addOrUpdate: z.object({
        academicYearId: z.string().min(1, 'Academic Year is required'),
        fromDate: z.date().optional(),
        toDate: z.date().optional()
    }),
    delete: z.object({
        feipsT_Id: deleteIdSchema('feipsT_Id')
    })
};

export const feesGroupwiseStudentReportSchema = z
    .object({
        radio_val: z.enum(['all', 'individual', 'student_wise', 'admCat', 'unmapped', 'Termwise']).default('all'),
        stud_sel: z.enum(['S', 'L', 'D', 'N']).default('S'),
        academicYearId: z.number().optional(),
        fmcC_Id: z.number().optional(),
        fmg_id: z.number().optional(),
        classId: z.number().optional(),
        sectionId: z.number().optional(),
        studentids: z.number().optional(),
        groupIds: z.array(z.number()).optional(),
        groupIdsNew: z.array(z.number()).optional(),
        group_wise: z.boolean().optional(),
        amntchecked: z.boolean().optional(),
        bulkdownload: z.boolean().optional(),
        admno: z.string().optional()
    })
    .superRefine((data, ctx) => {
        if (!data.academicYearId) {
            ctx.addIssue({
                path: ['academicYearId'],
                message: 'Academic Year is required',
                code: z.ZodIssueCode.custom
            });
        }

        // if (data.radio_val === 'Termwise') {
        //     ctx.addIssue({
        //         path: ['admno'],
        //         message: 'Admission Number is required',
        //         code: z.ZodIssueCode.custom
        //     });
        // }

        if (data.radio_val === 'individual' || data.radio_val === 'student_wise' || data.radio_val === 'admCat') {
            if (!data.classId || data.classId === 0) {
                ctx.addIssue({
                    path: ['classId'],
                    message: 'Class is required',
                    code: z.ZodIssueCode.custom
                });
            }

            if (!data.sectionId || data.sectionId === 0) {
                ctx.addIssue({
                    path: ['sectionId'],
                    message: 'Section is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        if (data.radio_val === 'admCat') {
            if (!data.fmcC_Id) {
                ctx.addIssue({
                    path: ['fmcC_Id'],
                    message: 'Category is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }

        if (data.radio_val === 'all' || data.radio_val === 'individual' || data.radio_val === 'unmapped') {
            if (!data.groupIdsNew || data.groupIdsNew.length === 0) {
                ctx.addIssue({
                    path: ['groupIdsNew'],
                    message: 'Fee Groups are required',
                    code: z.ZodIssueCode.custom
                });
            }
        }
        if (data.radio_val === 'student_wise') {
            if (!data.studentids) {
                ctx.addIssue({
                    path: ['studentids'],
                    message: 'Student is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }
    });

export const feeDefaulterreportStthomas = z
    .object({
        academicYearId: z.string().min(1, 'Academic Year is required'),
        classId: z.string().min(1, 'Class is required'),
        sectionId: z.string().min(1, 'Section is required'),
        //    sectionId: z.string().refine(val => val !== 'all', {
        //         message: 'Section is required'
        //     }),
        studentId: z.string().optional(),
        feeTerm: z.string().optional(),
        breakdown: z.string().optional(),
        reportType: z.enum(['All', 'Individual']).default('All'),
        filterdata: z.enum(['NameRegNo', 'RegNoName']).default('NameRegNo'),
        terms: z.array(z.string()).nonempty('Please select at least one Term')
    })
    .superRefine((data, ctx) => {
        if (data.reportType === 'Individual') {
            if (!data.studentId) {
                ctx.addIssue({
                    path: ['studentId'],
                    message: 'Student is required',
                    code: z.ZodIssueCode.custom
                });
            }
        }
    });
