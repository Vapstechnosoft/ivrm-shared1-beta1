import { z } from 'zod';

// Schema for the form
export const EventsMappingSchema = z.object({
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),
    SPCCME_Id: z.number().min(1, { message: 'Event Name is required' }),
    SPCCMEV_Id: z.number().min(1, { message: 'Venue Name is required' }),
    SPCCE_Remarks: z.string().max(250).optional(),
    SPCCE_StartDate: z.date({ required_error: 'Start Date is required' }),
    SPCCE_EndDate: z.date({ required_error: 'End Date is required' }),
    SPCCE_StartTime: z.string().optional(), // HH:mm
    SPCCE_EndTime: z.string().optional(), // HH:mm
    SPCCE_SponsorFlag: z.boolean().default(false),

    // Multi-select for Sponsors, required if Flag is true
    selectedSponsors: z.array(z.object({ spccmsP_Id: z.number() })).optional(),
}).refine((data) => {
    if (data.SPCCE_EndDate < data.SPCCE_StartDate) {
        return false;
    }
    return true;
}, {
    message: 'End Date must be greater than or equal to Start Date',
    path: ['SPCCE_EndDate'],
}).refine((data) => {
    if (data.SPCCE_SponsorFlag) {
        return data.selectedSponsors && data.selectedSponsors.length > 0;
    }
    return true;
}, {
    message: 'Please Select Sponsor Name',
    path: ['selectedSponsors'],
});

export type EventsMappingFormSchema = z.infer<typeof EventsMappingSchema>;

export interface IEventsMappingDropdowns {
    academicYear: { asmaY_Id: number; asmaY_Year: string }[];
    eventsList: { spccmE_Id: number; spccmE_EventName: string }[];
    venueList: { spccmeV_Id: number; spccmeV_EventVenue: string }[];
    sponsorList: { spccmsP_Id: number; spccmsP_SponsorName: string }[];
}

export interface IEventsMappingData {
    spccE_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    spccmE_Id: number;
    spccmE_EventName: string;
    spccmeV_Id: number;
    spccmeV_EventVenue: string;
    spccE_StartDate: string;
    spccE_StartTime: string;
    spccE_EndDate: string;
    spccE_EndTime: string;
    spccE_Remarks: string;
    spccE_SponsorFlag: boolean;
    spccE_ActiveFlag: boolean;
}
