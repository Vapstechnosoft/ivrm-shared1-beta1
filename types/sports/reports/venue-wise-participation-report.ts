import { z } from 'zod';

// Schema for the form
export const VenueWiseParticipationReportSchema = z.object({
    Type: z.enum(['House', 'CS'], { required_error: 'Type is required' }),
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),

    // Conditional fields based on Type
    ASMCL_Id: z.number().optional().nullable(),

    // Multi-select lists (matching legacy payload names)
    selectedSectionlist: z.array(z.object({ asmS_Id: z.number() })).optional(),
    selectedhouselist: z.array(z.object({ spccmH_Id: z.number() })).optional(),
    selectedVenuelist: z.array(z.object({ spccmeV_Id: z.number() })).optional(),
}).refine((data) => {
    if (data.Type === 'CS') {
        return !!data.ASMCL_Id;
    }
    return true;
}, {
    message: 'Class is required',
    path: ['ASMCL_Id'],
}).refine((data) => {
    // If Type is CS, Section is required
    if (data.Type === 'CS') {
        return data.selectedSectionlist && data.selectedSectionlist.length > 0;
    }
    return true;
}, {
    message: 'Section is required',
    path: ['selectedSectionlist'],
}).refine((data) => {
    // House is required if Type is House
    if (data.Type === 'House') {
        return data.selectedhouselist && data.selectedhouselist.length > 0;
    }
    return true;
}, {
    message: 'House is required',
    path: ['selectedhouselist'],
}).refine((data) => {
    // Venue required always
    return data.selectedVenuelist && data.selectedVenuelist.length > 0;
}, {
    message: 'Venue is required',
    path: ['selectedVenuelist'],
});

export type VenueWiseParticipationReportFormSchema = z.infer<typeof VenueWiseParticipationReportSchema>;

export interface IVenueWiseReportDropdowns {
    yearlist: { asmaY_Id: number; asmaY_Year: string }[];
    classList: { asmcL_Id: number; asmcL_ClassName: string }[];
    sectionList: { asmS_Id: number; asmC_SectionName: string }[];
    houseList: { spccmH_Id: number; spccmH_HouseName: string }[];
    venueList: { spccmeV_Id: number; spccmeV_EventVenue: string }[];
}

export interface IVenueWiseReportData {
    SPCCMH_HouseName: string;
    SPCCMEV_EventVenue: string;
    AMST_Name: string;
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCME_EventName: string;
    SPCCMSCC_SportsCCName: string;
    SPCCE_StartDate: string;
}
