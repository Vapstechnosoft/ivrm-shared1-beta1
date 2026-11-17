import { z } from 'zod';

export const SportPointsAndRecordReportSchema = z.object({
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),
    SPCCMH_Id: z.number().min(1, { message: 'House Name is required' }),
    SPCCE_Id: z.number().min(1, { message: 'Program Master is required' }),
    SPCCME_Id: z.number().min(1, { message: 'Event Name is required' }),
    SPCCMD_Id: z.number().min(1, { message: 'Division Name is required' }),

    // Qualification Type (Radio buttons: ECA, CCA, IH, Others)
    qualification_type: z.enum(['eca', 'cca', 'ih', 'others'], { required_error: 'Activity Type is required' }),
});

export const PointsRecordReportSchema = z.object({
    Type: z.enum(['House', 'CS', 'CC']),
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),
    ASMCL_Id: z.number().optional(),
    SPCCMCC_Id: z.number().optional(),
    selectedhouselist: z.array(z.object({ spccmH_Id: z.number() })).optional(),
    selectedSectionlist: z.array(z.object({ asmS_Id: z.number() })).optional(),
    selectedEventlist: z.array(z.object({ spccmE_Id: z.number() })).optional(),
    selectedSportslist: z.array(z.object({ spccmscC_Id: z.number() })).optional(),
    placListData: z.array(z.object({ spccestR_Rank: z.string() })).optional(),
});

export type PointsRecordReportFormSchema = z.infer<typeof PointsRecordReportSchema>;
export type SportPointsAndRecordReportFormSchema = z.infer<typeof SportPointsAndRecordReportSchema>;

export interface IPointsRecordReportData {
    amst_Id: number;
    AMST_Name: string;
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCMH_HouseName: string;
    SPCCME_EventName: string;
    SPCCMEV_EventVenue: string;
    SPCCMSCC_SportsCCName: string;
    SPCCESTR_Points: number;
    SPCCESTR_Rank: string;
    SPCCESTR_Remarks?: string;

    // Legacy/Alias properties for SportPointsAndRecordReport
    adm_no: string;
    studentname: string;
    spccestR_Place: string;
    spccestR_Points: number;
    spccmD_DivisionName: string;
    spccmH_HouseName: string;
}
