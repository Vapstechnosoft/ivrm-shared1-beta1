import { z } from 'zod';

export const noticeBoardSchema = z
    .object({
        intB_Id: z.number().optional().nullable(),
        asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, 'Academic Year is required'),
        ntB_TTSylabusFlg: z.string({ required_error: 'Notice Type is required' }).min(1, 'Notice Type is required'),
        intB_Title: z.string({ required_error: 'Notice Title is required' }).min(1, 'Notice Title is required'),
        intB_Description: z.string().optional().nullable(),
        intB_StartDate: z.date({ required_error: 'Start Date is required' }),
        intB_EndDate: z.date({ required_error: 'End Date is required' }),
        intB_DisplayDate: z.date().optional().nullable(), // Optional based on flag
        intB_DispalyDisableFlg: z.boolean().default(false),
        intB_ActiveFlag: z.boolean().default(true),

        // File Uploads
        intB_FilePath: z.string().optional().nullable(), // Main file
        intB_FilePath_Array: z
            .array(
                z.object({
                    intbfL_FilePath: z.string(),
                    fileName: z.string().optional()
                })
            )
            .optional()
            .default([]), // Additional attachments (files/URLs)

        // Selection Flags (Checkboxes)
        check_student: z.boolean().default(false),
        check_staff: z.boolean().default(false),

        // Student Selection Logic
        asmcL_Id: z
            .array(z.object({ asmcL_Id: z.number() }))
            .optional()
            .default([]), // Selected Classes
        asmS_Id: z
            .array(z.object({ asmS_Id: z.number() }))
            .optional()
            .default([]), // Selected Sections
        amsT_Id: z
            .array(z.object({ amsT_Id: z.number() }))
            .optional()
            .default([]), // Selected Students

        // Staff Selection Logic
        hrmd_Id: z
            .array(z.object({ hrmd_Id: z.number() }))
            .optional()
            .default([]), // Selected Departments
        hrmdeS_Id: z
            .array(z.object({ hrmdeS_Id: z.number() }))
            .optional()
            .default([]), // Selected Designations
        hrmE_Id: z
            .array(z.object({ hrmE_Id: z.number() }))
            .optional()
            .default([]), // Selected Employees

        // Subject Selection Logic
        ismS_Id: z
            .array(z.object({ ismS_Id: z.number() }))
            .optional()
            .default([]), // Selected Subjects

        // Fee Defaulter / Route Logic (if Student selected)
        fee_def: z.boolean().default(false),
        select_route: z.boolean().default(false),

        routeList: z
            .array(z.object({ trmR_Id: z.number() }))
            .optional()
            .default([]), // Selected Routes
        feeGroupList: z
            .array(z.object({ fmg_Id: z.number() }))
            .optional()
            .default([]), // Selected Fee Groups

        // Display/Grid Helpers
        createdDate: z.string().optional(),
        displayDate: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.intB_StartDate && data.intB_EndDate) {
                return data.intB_EndDate >= data.intB_StartDate;
            }
            return true;
        },
        {
            message: 'End Date must be greater than or equal to Start Date',
            path: ['intB_EndDate']
        }
    )
    .refine(
        (data) => {
            if (data.intB_DispalyDisableFlg && data.intB_DisplayDate && data.intB_EndDate) {
                return data.intB_DisplayDate <= data.intB_EndDate;
            }
            return true;
        },
        {
            message: 'Display Date must be less than or equal to End Date',
            path: ['intB_DisplayDate']
        }
    );

export const noticeBoardSchemaNew = {
    addOrUpdate: z
        .object({
            // feeGroupIds: z
            //   .array(z.number())
            //   .min(1, { message: "At least one Group must be selected" }),
            intB_Id: z.number().optional().nullable(),
            asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, 'Academic Year is required'),
            ntB_TTSylabusFlg: z.string({ required_error: 'Notice Type is required' }).min(1, 'Notice Type is required'),
            intB_Title: z.string({ required_error: 'Notice Title is required' }).min(1, 'Notice Title is required'),
            intB_Description: z.string().optional().nullable(),
            intB_StartDate: z.date({ required_error: 'Start Date is required' }),
            intB_EndDate: z.date({ required_error: 'End Date is required' }),
            intB_DisplayDate: z.date().optional().nullable(),
            intB_DispalyDisableFlg: z.boolean().default(false),
            intB_ActiveFlag: z.boolean().default(true),
            intB_FilePath: z.string().optional().nullable(),
            intB_FilePath_Array: z
                .array(
                    z.object({
                        intbfL_FilePath: z.string(),
                        fileName: z.string().optional(),
                        file: z.string().optional(),
                        isUploading: z.boolean().default(false)
                    })
                )
                .optional()
                .default([]),
            intB_UrlPath_Array: z
                .array(
                    z.object({
                        intbfL_FilePath: z.string(),
                        fileName: z.string().optional()
                    })
                )
                .optional()
                .default([]),
            check_student: z.boolean().default(false),
            check_staff: z.boolean().default(false),
            selectedStudent: z.boolean().default(false),
            selectedRoute: z.boolean().default(false),
            feedefaulters: z.boolean().default(false),
            asmcL_Id: z
                .array(z.object({ asmcL_Id: z.number() }))
                .optional()
                .default([]),
            asmS_Id: z
                .array(z.object({ asmS_Id: z.number() }))
                .optional()
                .default([]),
            amsT_Id: z
                .array(z.object({ amsT_Id: z.number() }))
                .optional()
                .default([]),
            hrmd_Id: z
                .array(z.object({ hrmd_Id: z.number() }))
                .optional()
                .default([]),
            hrmdeS_Id: z
                .array(z.object({ hrmdeS_Id: z.number() }))
                .optional()
                .default([]),
            hrmE_Id: z
                .array(z.object({ hrmE_Id: z.number() }))
                .optional()
                .default([]),
            ismS_Id: z
                .array(z.object({ ismS_Id: z.number() }))
                .optional()
                .default([]),
            routeList: z
                .array(z.object({ trmR_Id: z.number() }))
                .optional()
                .default([]),
            feeGroupList: z
                .array(z.object({ fmg_Id: z.number() }))
                .optional()
                .default([]),
            feeTermList: z
                .array(z.object({ fmT_Id: z.number() }))
                .optional()
                .default([]),
            createdDate: z.string().optional(),
            displayDate: z.string().optional()
        })
        .refine(
            (data) => {
                if (data.intB_StartDate && data.intB_EndDate) {
                    return data.intB_EndDate >= data.intB_StartDate;
                }
                return true;
            },
            {
                message: 'End Date must be greater than or equal to Start Date',
                path: ['intB_EndDate']
            }
        )
        .refine(
            (data) => {
                if (data.intB_DispalyDisableFlg && data.intB_DisplayDate && data.intB_EndDate) {
                    return data.intB_DisplayDate <= data.intB_EndDate;
                }
                return true;
            },
            {
                message: 'Display Date must be less than or equal to End Date',
                path: ['intB_DisplayDate']
            }
        )
};

export type INoticeBoard = z.infer<typeof noticeBoardSchema>;
