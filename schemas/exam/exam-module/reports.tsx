import { z } from 'zod';

export const cumulativereportSchema = {
    addOrUpdate: z
        .object({
            emE_ID: z.number().optional(),
            mI_Id: z.number().optional(),

            // Core Dropdowns
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select Academic Year' }),

            asmcL_Id: z.number({ required_error: 'Class  is required' }).min(1, { message: 'Please select Class ' }),

            asmS_Id: z.number({ required_error: 'Section is required' }).min(1, { message: 'Please select  Section' }),

            emE_Id: z.number({ required_error: 'Exam Name is required' }).min(1, { message: 'Please select a Exam Name' }),

            studentList: z
                .array(
                    z.object({
                        amsT_Id: z.number({ required_error: 'Student is required' }).min(1, { message: 'Please select a Students' })
                    })
                )
                .min(1, { message: 'At least one Student must be selected' }),

            // Flags & Remarks
            applicableFlag: z.boolean().default(true).optional(),
            nonApplicableFlag: z.boolean().default(true).optional()
        })
        .superRefine((data, ctx) => {
            // Disallow duplicate subjects
            const studentIds = data.studentList?.map((s) => s.amsT_Id) || [];
            if (new Set(studentIds).size !== studentIds.length) {
                ctx.addIssue({
                    path: ['studentList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Students are not allowed'
                });
            }
        })
};

export const vvehpc_examreportcardSchema = {
    addOrUpdate: z
        .object({
            emE_ID: z.number().optional(),
            mI_Id: z.number().optional(),

            // Core Dropdowns
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select Academic Year' }),

            asmcL_Id: z.number({ required_error: 'Class  is required' }).min(1, { message: 'Please select Class ' }),

            asmS_Id: z.number({ required_error: 'Section is required' }).min(1, { message: 'Please select  Section' }),

            emE_Id: z.number({ required_error: 'Exam Name is required' }).min(1, { message: 'Please select a Exam Name' }),

            studentList: z
                .array(
                    z.object({
                        amsT_Id: z.number({ required_error: 'Student is required' }).min(1, { message: 'Please select a Students' })
                    })
                )
                .min(1, { message: 'At least one Student must be selected' })
        })
        .superRefine((data, ctx) => {
            // Disallow duplicate subjects
            const studentIds = data.studentList?.map((s) => s.amsT_Id) || [];
            if (new Set(studentIds).size !== studentIds.length) {
                ctx.addIssue({
                    path: ['studentList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Students are not allowed'
                });
            }
        })
};

export const examelectivesreportSchema = {
    addOrUpdate: z.object({
        asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select Academic Year' }),

        Type: z.enum(['All', 'Indi', 'subj', 'csw'], {
            required_error: 'Report Type is required'
        }),

        emcA_Id: z.union([z.number(), z.literal('All')]).optional(),

        emG_Id: z.number().optional(),
        ismS_Id: z.number().optional(),
        asmcL_Id: z.number().optional(),
        asmS_Id: z.number().optional(),

        mob_flg: z.boolean().optional(),
        mail_flg: z.boolean().optional(),
        Left_Flag: z.boolean().optional(),
        Deactive_Flag: z.boolean().optional()
    })
};

export const examCategoryReportSchema = z
    .object({
        type: z.enum(['1', '2']), // 1=All, 2=Individual
        asmaY_Id: z.string().min(1, { message: 'Select Academic Year' }),
        emcA_Id: z.string().optional()
    })
    .superRefine((data, ctx) => {
        if (data.type === '2' && (!data.emcA_Id || data.emcA_Id === '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Category',
                path: ['emcA_Id']
            });
        }
    });

export type ExamCategoryReportFormValues = z.infer<typeof examCategoryReportSchema>;

export const examMonthEndReportSchema = z.object({
    ASMAY_Id: z.string().min(1, { message: 'Academic Year is required' }),
    IVRM_Month_Id: z.string().min(1, { message: 'Month is required' }),
    EME_Id: z.string().min(1, { message: 'Exam is required' }),
    iename: z.string().optional(),
    radiodata: z.string().default('All')
});

export type ExamMonthEndReportFormValues = z.infer<typeof examMonthEndReportSchema>;

export const tbs_reportschoolSchema = {
    addOrUpdate: z
        .object({
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select Academic Year' }),
            asmcL_Id: z.number({ required_error: 'Class is required' }).min(1, { message: 'Please select Class' }),
            asmS_Id: z.number({ required_error: 'Section is required' }).min(1, { message: 'Please select Section' }),
            emE_Id: z
                .array(
                    z.object({
                        emE_Id: z.number()
                    })
                )
                .min(1, { message: 'Select at least one Exam' }),
            emgR_Id: z.number({ required_error: 'Grade is required' }).min(1, { message: 'Please select Grade' }),
            studentList: z
                .array(
                    z.object({
                        amsT_Id: z.number()
                    })
                )
                .min(1, { message: 'Select at least one Student' }),
            // Fee-related fields (optional)
            feeGroupIds: z.array(z.number()).optional().default([]),
            feeTermIds: z.array(z.number()).optional().default([]),
            feeClassIds: z.array(z.number()).optional().default([]),
            feeSectionIds: z.array(z.number()).optional().default([]),
            feeBusRouteIds: z.array(z.number()).optional().default([]),
            feeCustomGroupIds: z.array(z.number()).optional().default([])
        })
        .superRefine((data, ctx) => {
            // Validate no duplicate students
            const studentIds = data.studentList?.map((s) => s.amsT_Id) || [];
            if (new Set(studentIds).size !== studentIds.length) {
                ctx.addIssue({
                    path: ['studentList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Students are not allowed'
                });
            }

            // Validate no duplicate exams
            const examIds = data.emE_Id?.map((e) => e.emE_Id) || [];
            if (new Set(examIds).size !== examIds.length) {
                ctx.addIssue({
                    path: ['emE_Id'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Exams are not allowed'
                });
            }

            // Validate no duplicate fee groups
            if (data.feeGroupIds && new Set(data.feeGroupIds).size !== data.feeGroupIds.length) {
                ctx.addIssue({
                    path: ['feeGroupIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Fee Groups are not allowed'
                });
            }

            // Validate no duplicate fee terms
            if (data.feeTermIds && new Set(data.feeTermIds).size !== data.feeTermIds.length) {
                ctx.addIssue({
                    path: ['feeTermIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Fee Terms are not allowed'
                });
            }

            // Validate no duplicate fee classes
            if (data.feeClassIds && new Set(data.feeClassIds).size !== data.feeClassIds.length) {
                ctx.addIssue({
                    path: ['feeClassIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Fee Classes are not allowed'
                });
            }

            // Validate no duplicate fee sections
            if (data.feeSectionIds && new Set(data.feeSectionIds).size !== data.feeSectionIds.length) {
                ctx.addIssue({
                    path: ['feeSectionIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Fee Sections are not allowed'
                });
            }

            // Validate no duplicate bus routes
            if (data.feeBusRouteIds && new Set(data.feeBusRouteIds).size !== data.feeBusRouteIds.length) {
                ctx.addIssue({
                    path: ['feeBusRouteIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Bus Routes are not allowed'
                });
            }

            // Validate no duplicate custom groups
            if (data.feeCustomGroupIds && new Set(data.feeCustomGroupIds).size !== data.feeCustomGroupIds.length) {
                ctx.addIssue({
                    path: ['feeCustomGroupIds'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate Custom Groups are not allowed'
                });
            }
        })
};

export const examLoginPrivilegesReportSchema = z
    .object({
        ASMAY_Id: z.string().min(1, 'Academic Year is required'),
        EMCA_Id: z.string().min(1, 'Category is required'),
        type: z.enum(['all', 'individual']),
        ASMCL_Id: z.string().optional(),
        ASMS_Id: z.string().optional(),
        HRME_Id: z.string().optional(), // Employee
        employeeChecked: z.boolean().default(false),
        selectAllEmployees: z.boolean().default(false)
    })
    .refine(
        (data) => {
            if (data.type === 'individual') {
                return !!data.ASMCL_Id && !!data.ASMS_Id;
            }
            return true;
        },
        {
            message: 'Class and Section are required for Individual report',
            path: ['ASMCL_Id']
        }
    )
    .refine(
        (data) => {
            if (data.employeeChecked && !data.HRME_Id) {
                return false;
            }
            return true;
        },
        {
            message: 'Employee is required when checked',
            path: ['HRME_Id']
        }
    );

export type ExamLoginPrivilegesSchema = z.infer<typeof examLoginPrivilegesReportSchema>;

export const juniorsProgressCardReportSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    EME_Id: z.string().min(1, 'Exam Name is required'),
    superAverage: z.boolean().default(false),
    printLogo: z.boolean().default(false),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type JuniorsProgressCardReportSchema = z.infer<typeof juniorsProgressCardReportSchema>;

export const juniorsProgressCardReportSchemaForPrint = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    EME_Id: z.string().min(1, 'Exam Name is required'),
    superAverage: z.boolean().default(false),
    printLogo: z.boolean().default(false),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export const marksEntryReportSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    EME_Id: z.string().min(1, 'Exam Name is required')
});

export type MarksEntryReportSchema = z.infer<typeof marksEntryReportSchema>;

export const percentageWiseDetailsReportSchema = z
    .object({
        ASMAY_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Academic Year is required')),
        EMCA_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Category is required')),
        ASMCL_Id: z.preprocess((val) => Number(val), z.number().optional()), // Conditional validation logic in component or refine
        ASMS_Id: z.preprocess((val) => Number(val), z.number().optional()), // Conditional validation logic in component or refine
        EME_Id: z.preprocess((val) => Number(val), z.number().min(1, 'Exam is required')),
        percent: z.string().min(1, 'Percentage is required'),
        qualification_type: z.enum(['all', 'individual'])
    })
    .refine(
        (data) => {
            if (data.qualification_type === 'individual') {
                return !!data.ASMCL_Id && data.ASMCL_Id > 0;
            }
            return true;
        },
        {
            message: 'Class is required',
            path: ['ASMCL_Id']
        }
    )
    .refine(
        (data) => {
            if (data.qualification_type === 'individual') {
                // Section can be 0 (All) but generally selected.
                // In the angular code: value="0">All</option> and required if individual.
                // If 0 is valid "All" for section, then we just need it to be present.
                // If the requirement is "Select Section" (validation failure), then it should not be empty.
                // However, the angular code says `value="" label="Select Section"` and `value="0">All`.
                // So if it's 0, it is valid "All". If it's undefined or empty, it's invalid.
                return data.ASMS_Id !== undefined && data.ASMS_Id !== null;
            }
            return true;
        },
        {
            message: 'Section is required',
            path: ['ASMS_Id']
        }
    );

export type PercentageWiseDetailsReportSchema = z.infer<typeof percentageWiseDetailsReportSchema>;

export const promotionDetailsReportSchema = z
    .object({
        ASMAY_Id: z.string().min(1, 'Academic Year is required'),
        ASMCL_Id: z.string().min(1, 'Class is required'),
        ASMS_Id: z.string().min(1, 'Section is required'),
        EMPG_GroupName: z.string().optional(), // Term
        superAverage: z.boolean().default(false),
        selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
    })
    .refine(
        (data) => {
            if (!data.superAverage && !data.EMPG_GroupName) {
                return false;
            }
            return true;
        },
        {
            message: 'Term is required when Super Average is not selected',
            path: ['EMPG_GroupName']
        }
    );

export type PromotionDetailsReportSchema = z.infer<typeof promotionDetailsReportSchema>;

export const toppersListReportSchema = z
    .object({
        type: z.enum(['1', '2']), // 1: All, 2: Individual
        ASMAY_Id: z.string().min(1, 'Academic Year is required'),
        EMCA_Id: z.string().optional().default('0'),
        ASMCL_Id: z.string().optional(), // Class (Required only for Individual type)
        ASMS_Id: z.string().optional().default('0'), // Section
        topper: z
            .string()
            .min(1, 'Top count is required')
            .regex(/^\d+$/, 'Must be a number')
            .refine((val) => Number.parseInt(val) > 0, 'Top count must be greater than 0'),
        EME_Id: z.string().min(1, 'Exam is required'),
        subjectwise: z.boolean().default(false),
        ISMS_Id: z.string().optional(), // Subject (Required only when subjectwise is checked)
        // Hidden fields for API payload
        exm_check_type: z.string().default('0'),
        sub_check_type: z.string().default('0'),
        report_type: z.string().optional() // This will be derived from 'type'
    })
    .superRefine((data, ctx) => {
        // Conditional validation for Class when type is Individual (2)
        if (data.type === '2' && !data.ASMCL_Id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Class is required for Individual type',
                path: ['ASMCL_Id']
            });
        }

        // Conditional validation for Subject when subjectwise is checked
        if (data.subjectwise && !data.ISMS_Id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Subject is required when Subjectwise is checked',
                path: ['ISMS_Id']
            });
        }

        // Set derived report_type based on type
        data.report_type = data.type === '1' ? 'All' : 'Indi';

        // Set exm_check_type based on EME_Id
        data.exm_check_type = data.EME_Id ? '1' : '0';

        // Set sub_check_type based on subjectwise and ISMS_Id
        data.sub_check_type = data.subjectwise && data.ISMS_Id ? '1' : '0';
    });

export type ToppersListSchema = z.infer<typeof toppersListReportSchema>;

export const gradeSlabReportSchema = {
    addOrUpdate: z
        .object({
            type: z.enum(['1', '2'], {
                required_error: 'Please select a report type (All or Individual)'
            }),
            emgR_Id: z.string().optional()
        })
        .superRefine((data, ctx) => {
            if (data.type === '2' && !data.emgR_Id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Select Grade',
                    path: ['emgR_Id']
                });
            }
        })
};

export const reportCardIXSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    brngroup: z.string().min(1, 'Group is required'),
    exmname: z.string().min(1, 'Exam Name is required'),
    printLogo: z.boolean().default(true),
    superAverage: z.boolean().default(true),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type ReportCardIXSchema = z.infer<typeof reportCardIXSchema>;

export const reportCardXSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    brngroup: z.string().min(1, 'Group is required'),
    exmname: z.string().min(1, 'Exam Name is required'),
    printLogo: z.boolean().default(true),
    superAverage: z.boolean().default(true),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type ReportCardXSchema = z.infer<typeof reportCardXSchema>;

export const reportCardXiSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    brngroup: z.string().min(1, 'Group is required'),
    exmname: z.string().min(1, 'Exam Name is required'),
    printLogo: z.boolean().default(true),
    superAverage: z.boolean().default(true),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type ReportCardXiSchema = z.infer<typeof reportCardXiSchema>;

export const reportCardViViiiSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    brngroup: z.string().optional(),
    exmname: z.string().min(1, 'Exam Name is required'),
    superAverage: z.boolean().default(true),
    printLogo: z.boolean().default(true),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type ReportCardViViiiSchema = z.infer<typeof reportCardViViiiSchema>;

export const reportCardXXiiSchema = z.object({
    ASMAY_Id: z.string().min(1, 'Academic Year is required'),
    ASMCL_Id: z.string().min(1, 'Class is required'),
    ASMS_Id: z.string().min(1, 'Section is required'),
    brngroup: z.string().min(1, 'Group is required'),
    exmname: z.string().min(1, 'Exam Name is required'),
    printLogo: z.boolean().default(true),
    superAverage: z.boolean().default(true),
    selectedStudents: z.array(z.string()).min(1, 'Select at least one student')
});

export type ReportCardXXiiSchema = z.infer<typeof reportCardXXiiSchema>;
