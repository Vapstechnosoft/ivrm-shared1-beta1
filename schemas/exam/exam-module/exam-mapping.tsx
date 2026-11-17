import { createCustomStringSchema, createStringSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const examLoginPrivilegesSchema = {
    addOrUpdate: z
        .object({
            elp_Id: z.number().optional(),

            // Core Dropdowns
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select an Academic Year' }),

            hrmE_Id: z.number({ required_error: 'Employee is required' }).min(1, { message: 'Please select an Employee' }),

            ivrmulF_Id: z.number({ required_error: 'User Login is required' }).min(1, { message: 'Please select a User Login' }),

            // Make asmcL_Id optional since we're using classList
            asmcL_Id: z.number().optional(),

            /**
             * ✔ Added support for multi-select classList
             * Used when teacher-mapped classes need to be selected automatically.
             */
            classList: z
                .array(
                    z.object({
                        asmcL_Id: z.number(),
                        asmcL_ClassName: z.string().optional()
                    })
                )
                .optional(),

            // Multi selections
            sectionList: z
                .array(
                    z.object({
                        asmS_Id: z.number({ required_error: 'Section is required' }).min(1, { message: 'Please select a Section' })
                    })
                )
                .min(1, { message: 'At least one section must be selected' }),

            subjectList: z
                .array(
                    z.object({
                        ismS_Id: z.number({ required_error: 'Subject is required' }).min(1, { message: 'Please select a Subject' })
                    })
                )
                .min(1, { message: 'At least one subject must be selected' }),

            // FIXED: Changed from issS_Id to emsS_Id
            subSubjectList: z
                .array(
                    z.object({
                        emsS_Id: z.number({ required_error: 'Sub-subject is required' }).min(1, { message: 'Please select a Sub-subject' })
                    })
                )
                .optional(),

            // Type
            entryType: z.string({ required_error: 'Entry Type is required' }).nonempty({ message: 'Please select an Entry Type' }),

            // Flags & Remarks
            elp_ActiveFlag: z.boolean().default(true),

            remarks: z.string().max(250, { message: 'Remarks cannot exceed 250 characters' }).optional()
        })
        .superRefine((data, ctx) => {
            // Cross validation rules

            // Must have at least one class (either via asmcL_Id or classList)
            if (!data.asmcL_Id && (!data.classList || data.classList.length === 0)) {
                ctx.addIssue({
                    path: ['asmcL_Id'],
                    code: z.ZodIssueCode.custom,
                    message: 'Please select at least one Class'
                });
            }

            // Must have at least one section or subject
            if ((!data.sectionList || data.sectionList.length === 0) && (!data.subjectList || data.subjectList.length === 0)) {
                ctx.addIssue({
                    path: ['sectionList'],
                    code: z.ZodIssueCode.custom,
                    message: 'At least one Section or Subject must be selected'
                });
            }

            // Disallow duplicate classes in classList
            if (data.classList) {
                const classIds = data.classList.map((c) => c.asmcL_Id);
                if (new Set(classIds).size !== classIds.length) {
                    ctx.addIssue({
                        path: ['classList'],
                        code: z.ZodIssueCode.custom,
                        message: 'Duplicate classes are not allowed'
                    });
                }
            }

            // Disallow duplicate sections
            const sectionIds = data.sectionList?.map((s) => s.asmS_Id) || [];
            if (new Set(sectionIds).size !== sectionIds.length) {
                ctx.addIssue({
                    path: ['sectionList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate sections are not allowed'
                });
            }

            // Disallow duplicate subjects
            const subjectIds = data.subjectList?.map((s) => s.ismS_Id) || [];
            if (new Set(subjectIds).size !== subjectIds.length) {
                ctx.addIssue({
                    path: ['subjectList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate subjects are not allowed'
                });
            }

            // FIXED: Changed from issS_Id to emsS_Id
            // Disallow duplicate sub-subjects (if present)
            const subIds = data.subSubjectList?.map((s) => s.emsS_Id) || [];
            if (subIds.length > 0 && new Set(subIds).size !== subIds.length) {
                ctx.addIssue({
                    path: ['subSubjectList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate sub-subjects are not allowed'
                });
            }
        }),

    delete: z.object({
        elp_Id: z.number({ required_error: 'elp_Id is required' })
    })
};

const parseDate = (val: unknown) => {
    if (typeof val === 'string' && val.trim() !== '') {
        const t = Date.parse(val);
        return Number.isNaN(t) ? null : new Date(t);
    }
    if (val instanceof Date) return val;
    return null;
};

export const yearlyCategoryDatesMappingSchema = {
    addOrUpdate: z
        .object({
            eyC_Id: z.number().optional().default(0),
            asmaY_Id: z.number().min(1, { message: 'Academic Year is required' }),
            emcA_Id: z.number().min(1, { message: 'Category is required' }),
            mI_Id: z.number().optional(),
            eyC_ExamStartDate: z
                .string()
                .nonempty({ message: 'Exam start date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Exam start date must be valid' }),
            eyC_ExamEndDate: z
                .string()
                .nonempty({ message: 'Exam end date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Exam end date must be valid' }),
            eyC_MarksEntryLastDate: z
                .string()
                .nonempty({ message: 'Marks entry last date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Marks entry last date must be valid' }),
            eyC_MarksProcessLastDate: z
                .string()
                .nonempty({ message: 'Marks process last date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Marks process last date must be valid' }),
            eyC_MarksPublishDate: z
                .string()
                .nonempty({ message: 'Marks publish date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Marks publish date must be valid' })
        })
        .refine(
            (data) => {
                const examStart = parseDate(data.eyC_ExamStartDate);
                const examEnd = parseDate(data.eyC_ExamEndDate);
                if (!examStart || !examEnd) return true;
                return examStart.getTime() <= examEnd.getTime();
            },
            { path: ['eyC_ExamStartDate'], message: 'Exam start date cannot be after exam end date' }
        )
        .refine(
            (data) => {
                const marksEntry = parseDate(data.eyC_MarksEntryLastDate);
                const marksPublish = parseDate(data.eyC_MarksPublishDate);
                if (!marksEntry || !marksPublish) return true;
                return marksEntry.getTime() <= marksPublish.getTime();
            },
            { path: ['eyC_MarksEntryLastDate'], message: 'Marks entry last date cannot be after marks publish date' }
        )
        .refine(
            (data) => {
                const marksProcess = parseDate(data.eyC_MarksProcessLastDate);
                const marksPublish = parseDate(data.eyC_MarksPublishDate);
                if (!marksProcess || !marksPublish) return true;
                return marksProcess.getTime() <= marksPublish.getTime();
            },
            { path: ['eyC_MarksProcessLastDate'], message: 'Marks process last date cannot be after marks publish date' }
        )
};

export const SubjectListItemSchema = z.object({
    ismS_Id: z.number().int().positive({ message: 'Invalid subject id' })
    // Optional name if needed
    // ISMS_SubjectName: z.string().min(1, { message: 'Subject name required' }),
});

/* ----------------------------- Schema Definition ----------------------------- */
export const ExamSubjectGroupSchema = {
    addOrUpdate: z
        .object({
            esG_Id: z.number().int().nonnegative().optional().nullable(),
            mI_Id: z.number().int().nonnegative().optional(),
            asmaY_Id: z.number().int().positive({ message: 'Select Academic Year' }),
            emcA_Id: z.number().int().positive({ message: 'Select Category' }),
            esG_SubjectGroupName: z
                .string()
                .min(1, { message: 'Enter Group Name' })
                .max(50, { message: 'Group name must be at most 50 characters' })
                .regex(/^[A-Za-z\s-]+$/, {
                    message: 'Group name must contain only letters, spaces or hyphens'
                }),
            esG_ExamPromotionFlag: z.enum(['IE', 'PE']),
            emE_Id: z.number().int().nonnegative({ message: 'Invalid Exam id' }),
            esG_GroupMinMarks: z
                .number()
                .int({ message: 'Min marks must be an integer' })
                .min(0, { message: 'Min marks cannot be less than 0' }),
            esG_GroupMaxMarks: z
                .number()
                .int({ message: 'Max marks must be an integer' })
                .min(0, { message: 'Max marks cannot be less than 0' }),
            esG_CompulsoryFlag: z.enum(['Y', 'N']),
            esG_ActiveFlag: z.boolean(),
            subjects_list: z.array(SubjectListItemSchema).min(2, { message: 'Select at least two subjects for a group' })
        })
        .refine(
            (data) => {
                // If Individual Exam, emE_Id must be > 0
                if (data.esG_ExamPromotionFlag === 'IE') return data.emE_Id > 0;
                return true;
            },
            {
                path: ['emE_Id'],
                message: 'Select Exam for Individual Exam type'
            }
        ),

    delete: z.object({
        ESG_Id: z.number().int().positive({ message: 'Invalid Exam Subject Group ID' })
    })
};

// utils/schema/exam/exam-module/exam-mapping.ts

const toNumber = (val: unknown): number => {
    if (val === '' || val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const n = Number(val.trim());
        return Number.isNaN(n) ? 0 : n;
    }
    return 0;
};

export const ExamTermAndExamMappingSchema = {
    addOrUpdate: z
        .object({
            // Core IDs
            ecT_Id: z.preprocess(toNumber, z.number().int().min(0).optional().default(0)),
            mI_Id: z.preprocess(toNumber, z.number().int().min(1).optional()),
            asmaY_Id: z.preprocess(toNumber, z.number().int().min(1, 'Select Academic Year')),
            emcA_Id: z.preprocess(toNumber, z.number().int().min(1, 'Select Category')),
            emgR_Id: z.preprocess(toNumber, z.number().int().min(1, 'Select Grade')),

            // Term Details
            ecT_TermName: z.string().trim().min(1, 'Enter Term Name').max(100),

            ecT_TermStartDate: z.string().min(1, 'Select Start Date'),
            ecT_TermEndDate: z.string().min(1, 'Select End Date'),
            ecT_MarksPublishDate: z.string().min(1, 'Select Publish Date'),

            ecT_Marks: z.preprocess(toNumber, z.number().int().min(1, 'Enter Term Marks')),
            ecT_MinMarks: z.preprocess(toNumber, z.number().int().min(0, 'Min marks ≥ 0')),

            // Exam Term Rows (critical fix here)
            exam_term: z
                .array(
                    z.object({
                        emE_Id: z.preprocess(toNumber, z.number().int().min(1, 'Select Exam')),
                        emE_ExamName: z.string().min(1, 'Exam name missing'),
                        ecteX_MarksPerFlag: z.enum(['M', 'P']),
                        ecteX_MarksPercentValue: z.preprocess(toNumber, z.number().int().min(1, 'Enter Marks/Percentage value')),
                        ecteX_RoundOffReqFlg: z.boolean().default(false),
                        ecteX_ConversionReqFlg: z.boolean().default(false),
                        ecteX_NotApplicableToTotal: z.boolean().default(false)
                    })
                )
                .min(1, 'Add at least one exam')
        })
        // TOTAL MARKS MUST EQUAL TERM MARKS
        .refine(
            (data) => {
                const total = data.exam_term.reduce((sum, item) => sum + item.ecteX_MarksPercentValue, 0);
                return Math.abs(total - data.ecT_Marks) < 0.01; // floating point safe
            },
            {
                message: 'Sum of exam values must equal Term Marks',
                path: ['exam_term']
            }
        )
        // NO DUPLICATE EXAMS
        .refine(
            (data) => {
                const ids = data.exam_term.map((x) => x.emE_Id);
                return new Set(ids).size === ids.length;
            },
            {
                message: 'Duplicate exams not allowed',
                path: ['exam_term']
            }
        )
        // DATE ORDER: Start ≤ End ≤ Publish
        .refine((data) => new Date(data.ecT_TermStartDate) <= new Date(data.ecT_TermEndDate), {
            message: 'Start date cannot be after End date',
            path: ['ecT_TermEndDate']
        })
        .refine((data) => new Date(data.ecT_TermEndDate) <= new Date(data.ecT_MarksPublishDate), {
            message: 'End date cannot be after Publish date',
            path: ['ecT_MarksPublishDate']
        }),

    delete: z.object({
        ecT_Id: z.number().int().min(1),
        asmaY_Id: z.number().int().min(1),
        emcA_Id: z.number().int().min(1)
    })
};

const isoDateString = z.string().refine(
    (s) => {
        // allow empty? YES — require proper ISO-like string only if present
        if (!s || s.trim() === '') return true;
        const d = new Date(s);
        return !Number.isNaN(d.getTime());
    },
    { message: 'Invalid date format (expected ISO date string)' }
);

const ExamItemSchema = z.object({
    EME_Id: z.number().int().nonnegative(), // exam id
    EME_ExamName: z.string().optional(),
    EME_ExamCode: z.string().optional(),
    EME_ExamOrder: z.number().int().nonnegative().optional(),
    EME_FinalExamFlag: z.boolean().optional(),
    EME_ActiveFlag: z.boolean().optional()
});

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const YearlyCategoryExamSubjectSchema = z.object({
    EYCES_Id: z.number().int().nonnegative().optional(),
    EYCE_Id: z.number().int().nonnegative().optional(),
    ISMS_Id: z.number().int().positive({ message: 'ISMS_Id required' }),
    EMGR_Id: z.number().int().positive({ message: 'EMGR_Id required' }),
    EYCES_MaxMarks: z.number().min(0).optional(),
    EYCES_MinMarks: z.number().min(0).optional(),
    EYCES_MarksEntryMax: z.number().min(0).optional(),
    EYCES_SubExamFlg: z.boolean().optional(),
    EYCES_SubSubjectFlg: z.boolean().optional(),
    EYCES_ActiveFlg: z.boolean().optional(),
    EYCES_SubjectOrder: z.number().int().nonnegative().optional(),
    Exam_Subject_PT_GradeList: z.array(z.any()).optional()
});

export const SubSubjectSubExamSchema = z
    .object({
        eycessS_Id: z.number().int().nonnegative().optional(), // Primary key
        eyceS_Id: z.number().int().nonnegative().optional(), // Foreign key to parent subject
        ismS_Id: z.number().int().positive({ message: 'ismS_Id required' }), // Subject Id
        emsS_Id: z.number().int().positive({ message: 'emsS_Id required' }), // SubSubject Id
        emsE_Id: z.number().int().positive({ message: 'emsE_Id required' }), // SubExam Id
        emgR_GradeName: z.string().min(1, { message: 'Grade Name required' }),
        ismS_SubjectName: z.string().min(1, { message: 'Subject Name required' }),
        ismS_SubjectCode: z.string().min(1, { message: 'Subject Code required' }),
        emsS_SubSubjectName: z.string().min(1, { message: 'SubSubject Name required' }),
        emsS_SubSubjectCode: z.string().min(1, { message: 'SubSubject Code required' }),
        emsE_SubExamName: z.string().min(1, { message: 'SubExam Name required' }),
        emsE_SubExamCode: z.string().min(1, { message: 'SubExam Code required' }),
        checkedvalue: z.boolean().optional(),
        eycessS_MaxMarks: z.number({ invalid_type_error: 'Enter Max Marks' }).min(0, 'Max Marks must be 0 or greater'),
        eycessS_MinMarks: z.number({ invalid_type_error: 'Enter Min Marks' }).min(0, 'Min Marks must be 0 or greater'),
        eycessS_MarksEntryMax: z.number({ invalid_type_error: 'Enter Marks Entry Max' }).min(0, 'Marks Entry Max must be 0 or greater'),
        eycessS_ExemptedFlg: z.boolean().optional().default(false),
        eycessS_ExemptedPer: z.number().min(0).max(100).optional(),
        eycessS_SubSubjectOrder: z.number().int().nonnegative().optional(),
        eycessS_ActiveFlg: z.boolean().optional().default(true),
        eycessS_GradesFlg: z.boolean().optional().default(false),
        eycessS_MarksFlg: z.boolean().optional().default(false)
    })
    //Logical validation refinements
    .refine((data) => data.eycessS_MinMarks < data.eycessS_MaxMarks, {
        message: 'Min Marks should be less than Max Marks',
        path: ['eycessS_MinMarks']
    })
    .refine((data) => !data.eycessS_ExemptedFlg || (data.eycessS_ExemptedPer !== undefined && data.eycessS_ExemptedPer > 0), {
        message: 'Exempted Percentage required when Exempted Flag is true',
        path: ['eycessS_ExemptedPer']
    });

const ExmSubjectSubsubjectsSubexamWrapperSchema = z.object({
    ISMS_Id: z.number().int().positive({ message: 'ISMS_Id required' }),
    sub_subject_sub_exam_list: z.array(SubSubjectSubExamSchema).optional()
});
const ExmSubSubjectWrapperSchema = z.object({
    ISMS_Id: z.number().int().positive({ message: 'ISMS_Id required' }),
    exm_subject_subexams_list: z.array(SubSubjectSubExamSchema).optional()
});
const ExmSubSubjectExamWrapperSchema = z.object({
    ISMS_Id: z.number().int().positive({ message: 'ISMS_Id required' }),
    exm_subject_subsubjects_list: z.array(SubSubjectSubExamSchema).optional()
});

/**
 * MAIN updated schema to match your payload plus validations
 */
export const ExamSubjectWizardSchema = {
    addOrUpdate: z
        .object({
            EYCE_Id: z.number().int().nonnegative().optional().default(0),
            EYC_Id: z.number().int().positive({ message: 'EYC_Id required' }),
            EMCA_Id: z.number().int().positive({ message: 'EMCA_Id required' }),
            EMGR_Id: z.number().int().positive({ message: 'EMGR_Id required' }),

            EYCE_SubExamFlg: z.boolean().optional(),
            EYCE_SubSubjectFlg: z.boolean().optional(),
            EYCE_ActiveFlg: z.boolean().optional(),

            EYCE_AttendanceFromDate: z
                .string()
                .min(1, { message: 'Attendance From Date is required' })
                .refine((s) => !Number.isNaN(new Date(s).getTime()), { message: 'Invalid Date Format' }),
            EYCE_AttendanceToDate: z
                .string()
                .min(1, { message: 'Attendance To Date is required' })
                .refine((s) => !Number.isNaN(new Date(s).getTime()), { message: 'Invalid Date Format' }),

            UserId: z.number().int().nonnegative().optional().default(0),
            MI_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Year: z.string().optional().nullable(),

            EYCE_BestOfApplicableFlg: z.boolean().optional(),
            EYCE_BestOf: z.number().int().min(0).optional(),

            exams_list: z.array(ExamItemSchema).optional().default([]),
            // yearly_category_exam_subjects: z
            //     .array(YearlyCategoryExamSubjectSchema)
            //     .min(1, { message: 'At least one yearly_category_exam_subjects is required' }),

            exm_subject_subexams_list: z.array(ExmSubSubjectExamWrapperSchema).optional().default([]),
            exm_subject_subsubjects_list: z.array(ExmSubSubjectWrapperSchema).optional().default([]),
            exm_subject_subsubjects_subexam: z.array(ExmSubjectSubsubjectsSubexamWrapperSchema).optional().default([]),

            Temp_Subject_Order: z.array(z.any()).optional().default([])
        })
        .refine(
            (data) => {
                if (!data.EYCE_AttendanceFromDate || !data.EYCE_AttendanceToDate) return true;
                try {
                    const from = new Date(data.EYCE_AttendanceFromDate).getTime();
                    const to = new Date(data.EYCE_AttendanceToDate).getTime();
                    if (Number.isNaN(from) || Number.isNaN(to)) return true;
                    return to >= from;
                } catch {
                    return true;
                }
            },
            { message: 'Attendance To must be after From Date', path: ['EYCE_AttendanceToDate'] }
        ),

    delete: z.object({
        EYCE_Id: z.number({ required_error: 'EYCE_Id is required' }).int().positive({ message: 'Invalid EYCE_Id' })
    })
};

export const BaseExamSubjectSchema = {
    addOrUpdate: z
        .object({
            // Primary Identifiers
            EYCE_Id: z.number().int().nonnegative().optional().default(0),
            EYC_Id: z.number().int().positive({ message: 'EYC_Id is required' }),
            ISMS_Id: z.number().int().positive({ message: 'ISMS_Id is required' }),
            EMCA_Id: z.number().int().positive({ message: 'EMCA_Id is required' }),
            EMGR_Id: z.number().int().positive({ message: 'EMGR_Id is required' }),

            // Subject Info
            ISMS_SubjectName: z.string().min(1, { message: 'Subject name is required' }),
            ISMS_SubjectCode: z.string().min(1, { message: 'Subject code is required' }),

            // Marks & Grade Info
            EYCES_MaxMarks: z.number().min(0, { message: 'Max marks must be 0 or greater' }).max(1000, { message: 'Max marks too large' }),
            EYCES_MinMarks: z.number().min(0, { message: 'Min marks must be 0 or greater' }).max(1000, { message: 'Min marks too large' }),
            EYCES_MarksEntryMax: z
                .number()
                .min(0, { message: 'Marks entry max must be 0 or greater' })
                .max(1000, { message: 'Marks entry max too large' }),

            // Flags
            EYCES_SubExamFlg: z.boolean().optional().default(false),
            EYCES_SubSubjectFlg: z.boolean().optional().default(false),
            EYCES_MarksGradeEntryFlg: z.enum(['M', 'G'], { message: 'Invalid marks/grade entry flag' }),
            EYCES_MarksDisplayFlg: z.boolean().optional().default(true),
            EYCES_GradeDisplayFlg: z.boolean().optional().default(true),
            EYCES_AplResultFlg: z.boolean().optional().default(true),
            EYCES_ActiveFlg: z.boolean().optional().default(true),

            // Order
            EYCES_SubjectOrder: z.number().int().min(1, { message: 'Subject order must be at least 1' }),

            // Optional info
            PT_Count: z.number().int().nonnegative().optional().default(0),

            // Meta info
            UserId: z.number().int().nonnegative().optional().default(0),
            MI_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Id: z.number().int().nonnegative().optional().default(0),
            ASMAY_Year: z.string().optional().nullable()
        })
        //  Cross-field validations
        .refine((data) => data.EYC_Id > 0 && data.ISMS_Id > 0 && data.EMCA_Id > 0, {
            message: 'Required identifiers are missing',
            path: ['EYC_Id']
        })
        .refine((data) => data.EYC_Id > 0, { message: 'EYC_Id must be positive', path: ['EYC_Id'] })
        .refine((data) => data.EYCES_MinMarks <= data.EYCES_MaxMarks, {
            message: 'Min marks must be less than or equal to Max marks',
            path: ['EYCES_MinMarks']
        })
        .refine((data) => data.EYCES_MarksEntryMax <= data.EYCES_MaxMarks, {
            message: 'Marks entry max cannot exceed Max marks',
            path: ['EYCES_MarksEntryMax']
        }),

    //  Delete schema block
    delete: z.object({
        EYCE_Id: z.number({ required_error: 'EYCE_Id is required' }).int().positive({ message: 'Invalid EYCE_Id' })
    })
};

export const CoScholasticActivityAreaMappingSchema = {
    addOrUpdate: z
        .object({
            mI_Id: z.number().int().nonnegative().optional(),
            ecactAAM_Id: z.number().int().nonnegative().optional(),
            ecactaM_Id: z.number().int().nonnegative().optional(),

            // 🔹 Academic Year
            asmaY_Id: z.number().int().positive({ message: 'Select Academic Year' }),

            // 🔹 Activities Name
            ecacT_Id: z.number().int().positive({ message: 'Select Activities Name' }),

            // 🔹 Activities Area Name
            ecactA_Id: z.number().int().positive({ message: 'Select Activities Area Name' }),

            // 🔹 Master Grade
            emgR_Id: z.number().int().positive({ message: 'Select Master Grade' }),

            // 🔹 Indicators Description (optional but with max length validation)
            ecactaM_IndicatorDescription: z
                .string()
                .trim()
                .max(500, { message: 'Indicator Description cannot exceed 500 characters' })
                .optional()
                .nullable(),

            // 🔹 Active Flag
            ecactaM_ActiveFlag: z.boolean({ required_error: 'Active flag is required' })
        })
        .strict(),

    delete: z.object({
        ecactaM_Id: z.number().int().positive({ message: 'Invalid Mapping ID' }),
        asmaY_Id: z.number().int().positive({ message: 'Invalid Academic Year ID' }),
        ecactA_Id: z.number().int().positive({ message: 'Invalid Activity ID' })
    })
};

export const categorySubjectMappingSchema = {
    addOrUpdate: z
        .object({
            userId: z.number().int().positive({ message: 'User Id is required' }).optional(),
            eycG_Id: z.number().optional(),
            mI_Id: z.number().optional(),
            // Core Dropdowns
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select an Academic Year' }),

            emcA_Id: z.number({ required_error: 'Category  is required' }).min(1, { message: 'Please select an Category ' }),

            emG_Id: z.number({ required_error: 'Subject Group is required' }).min(1, { message: 'Please select a Subject Group' }),

            subjects_list: z
                .array(
                    z.object({
                        ismS_Id: z.number({ required_error: 'Subjects is required' }).min(1, { message: 'Please select a Subjects' })
                    })
                )
                .min(1, { message: 'At least one subject must be selected' }),

            // Flags & Remarks
            eyC_BasedOnPaperTypeFlg: z.boolean().default(true).optional()
        })
        .superRefine((data, ctx) => {
            // Disallow duplicate subjects
            const subjectIds = data.subjects_list?.map((s) => s.ismS_Id) || [];
            if (new Set(subjectIds).size !== subjectIds.length) {
                ctx.addIssue({
                    path: ['subjectList'],
                    code: z.ZodIssueCode.custom,
                    message: 'Duplicate subjects are not allowed'
                });
            }
        }),

    delete: z.object({
        eycG_Id: z.number({ required_error: 'eycG_Id is required' })
    })
};

export const lifeSkillAreaMappingSchema = {
    addOrUpdate: z.object({
        ecS_Id: z.number().default(0),
        mI_Id: z.number().default(30).optional(),
        ecS_SkillName: createCustomStringSchema('Skill Name', 1, 100),
        ecS_SkillCode: createStringSchema('Skill Code', 1, 50),

        subexamDTO: z
            .array(
                z.object({
                    ecsA_Id: z.number().default(0),
                    ecsA_SkillOrder: z
                        .number({
                            required_error: 'Skill Area Order is required',
                            invalid_type_error: 'Skill Area Order must be a number'
                        })
                        .int()
                        .min(1, { message: 'Skill Area Order must be at least 1' }),
                    ecsA_SkillArea: createCustomStringSchema('Skill Area Name', 1, 100)
                })
            )
            .min(1, { message: 'At least one Skill Area entry is required' }),

        mappingDTO: z
            .array(
                z.object({
                    ecsaM_Id: z.number().default(0),
                    asmaY_Id: z.number({ required_error: 'Academic Year is required' }).int({ message: 'Academic Year must be integer' }),
                    mI_Id: z.number().optional(),
                    ecS_Id: z.number({ required_error: 'Life Skill ID is required' }).int(),
                    ecsA_Id: z.number({ required_error: 'Skill Area ID is required' }).int(),
                    ecsaM_IndicatorDescription: createCustomStringSchema('Indicator Description', 1, 300),
                    emgR_Id: z.number({ required_error: 'Grade ID is required' }).int(),
                    ecsaM_ActiveFlag: z.boolean().default(true)
                })
            )
            .min(1, { message: 'At least one mapping record is required' })
    }),

    delete: z.object({
        ecsaM_Id: z.number({ required_error: 'ecsaM_Id is required' })
    })
};

export const examMarksProcessConditionSchema = {
    addOrUpdate: z
        .object({
            mI_Id: z.number().min(1).optional(),
            eyC_Id: z.number().min(1, { message: 'Mapping is required' }),
            eycE_Id: z.number().min(1, { message: 'Mapping is required' }),

            asmaY_Id: z.number().min(1, { message: 'Academic Year is required' }),

            emcA_Id: z.number().min(1, { message: 'Category is required' }),

            emE_Id: z.number().min(1, { message: 'Exam is required' }),
            eycE_ExamStartDate: z
                .string()
                .nonempty({ message: 'Exam start date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Exam start date must be valid' }),

            eycE_ExamEndDate: z
                .string()
                .nonempty({ message: 'Exam end date is required' })
                .refine((v) => parseDate(v) !== null, { message: 'Exam end date must be valid' }),

            eycE_MarksEntryLastDate: z
                .string()
                .nonempty({ message: 'Marks entry last date is required' })
                .refine((v) => parseDate(v) !== null, {
                    message: 'Marks entry last date must be valid'
                }),

            eycE_MarksProcessLastDate: z
                .string()
                .nonempty({ message: 'Marks process last date is required' })
                .refine((v) => parseDate(v) !== null, {
                    message: 'Marks process last date must be valid'
                }),

            eycE_MarksPublishDate: z
                .string()
                .nonempty({ message: 'Marks publish date is required' })
                .refine((v) => parseDate(v) !== null, {
                    message: 'Marks publish date must be valid'
                })
        })

        /** VALIDATIONS */
        .refine(
            (data) => {
                const start = parseDate(data.eycE_ExamStartDate);
                const end = parseDate(data.eycE_ExamEndDate);
                return !start || !end || start <= end;
            },
            {
                path: ['eycE_ExamStartDate'],
                message: 'Exam start date cannot be after exam end date'
            }
        )
        .refine(
            (data) => {
                const entry = parseDate(data.eycE_MarksEntryLastDate);
                const publish = parseDate(data.eycE_MarksPublishDate);
                return !entry || !publish || entry <= publish;
            },
            {
                path: ['eycE_MarksEntryLastDate'],
                message: 'Marks entry last date cannot be after marks publish date'
            }
        )
        .refine(
            (data) => {
                const process = parseDate(data.eycE_MarksProcessLastDate);
                const publish = parseDate(data.eycE_MarksPublishDate);
                return !process || !publish || process <= publish;
            },
            {
                path: ['eycE_MarksProcessLastDate'],
                message: 'Marks process last date cannot be after marks publish date'
            }
        )
};

export const hallTicketGenerationSchema = z
    .object({
        mI_Id: z.number().int().positive().optional().default(30),
        asmaY_Id: z.number().int().positive(),
        asmcL_Id: z.number().int().positive(),
        sectionList: z.array(z.object({ asmS_Id: z.number().int().positive() })).min(1, 'At least one section is required'),
        emE_Id: z.number().int().positive(),
        prefixNo: z.string().optional(),
        leadingzeros: z
            .number()
            .int()
            .nonnegative()
            .optional()
            .default(0)
            .refine((val) => val <= 9, 'Leading zeros must be less than or equal to 9'),
        startingNo: z.string().regex(/^\d+$/, 'Starting No. must be a number').min(1, 'Starting No. is required'),
        increment: z.string().regex(/^\d+$/, 'Increment must be a number').min(1, 'Increment is required'),
        prefixNoFlag: z.enum(['Y', 'N'])
    })
    .superRefine((data, ctx) => {
        if (data.prefixNoFlag === 'Y') {
            if (!data.prefixNo || data.prefixNo.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Prefix No. is required when PrefixNo is Yes',
                    path: ['prefixNo']
                });
            }
        }
    });
export const StudentTransactionSchema = {
    search: z
        .object({
            academicYearId: z.coerce
                .number()
                .min(1, 'Academic Year is required')
                .refine((val) => val !== 0, 'Select Academic Year'),
            classId: z.coerce
                .number()
                .min(1, 'Class is required')
                .refine((val) => val !== 0, 'Select Class'),
            sectionId: z.coerce
                .number()
                .min(1, 'Section is required')
                .refine((val) => val !== 0, 'Select Section'),
            examTermId: z.coerce.number().optional(),
            emE_Id: z.coerce.number().optional(),
            skillActivityType: z.enum(['Skills', 'Activities']).optional(),
            nameId: z.coerce.number().optional(),
            areaId: z.coerce.number().optional(),
            exam_termwise_flag: z.enum(['TermWise', 'ExamWise']).default('TermWise')
        })
        .superRefine((data, ctx) => {
            // Conditional validation for exam term/exam
            if (data.exam_termwise_flag === 'TermWise' && (!data.examTermId || data.examTermId === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Exam Term is required',
                    path: ['examTermId']
                });
            }

            if (data.exam_termwise_flag === 'ExamWise' && (!data.emE_Id || data.emE_Id === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Exam is required',
                    path: ['emE_Id']
                });
            }

            // Conditional validation for skill/activity type
            if (!data.skillActivityType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Skill/Activities type is required',
                    path: ['skillActivityType']
                });
            }

            // Conditional validation for name
            if (data.skillActivityType && (!data.nameId || data.nameId === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: data.skillActivityType === 'Skills' ? 'Skills Name is required' : 'Activities Name is required',
                    path: ['nameId']
                });
            }

            // Conditional validation for area
            if (data.skillActivityType && data.nameId && data.nameId !== 0 && (!data.areaId || data.areaId === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: data.skillActivityType === 'Skills' ? 'Skill Area is required' : 'Activities Area is required',
                    path: ['areaId']
                });
            }
        })
};

export type StudentTransactionFormData = z.infer<typeof StudentTransactionSchema.search>;
