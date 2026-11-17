import { z } from 'zod';

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IEvent {
    spccmE_Id: number;
    spccmE_EventName: string;
}

export interface IVenue {
    spccmeV_Id: number;
    spccmeV_EventVenue: string;
}

export interface ISponsor {
    spccmsP_Id: number;
    spccmsP_SponsorName: string;
    spccmsP_ContactPerson?: string;
    spccmsP_ContactNo?: number;
    spccmsP_SponsorDetails?: string;
    spccmsP_ActiveFlag?: boolean;
    selected?: boolean;
}

export interface IEventMappingDTO {
    ASMAY_Id: number;
    SPCCE_Id?: number | null;
    SPCCMEV_Id: number;
    SPCCME_Id: number;
    SPCCE_StartDate: string | Date;
    SPCCE_StartTime: string;
    SPCCE_EndDate: string | Date;
    SPCCE_EndTime: string;
    SPCCE_Remarks: string;
    SPCCE_SponsorFlag: boolean;
    sponsorData?: ISponsor[];
}

export interface IEventMappingDetails {
    academicYear: IAcademicYear[];
    eventsList: IEvent[];
    venuelist: IVenue[];
    sponsorList: ISponsor[];
    eventmappingList: any[]; // Define specific type if needed for grid
}

export const eventMappingSchema = z.object({
    SPCCE_Id: z.coerce.number().optional().nullable(),
    ASMAY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    SPCCME_Id: z.coerce.number().min(1, 'Event is required'),
    SPCCMEV_Id: z.coerce.number().min(1, 'Venue is required'),
    SPCCE_StartDate: z.date({ required_error: 'Start Date is required' }),
    SPCCE_StartTime: z.string().min(1, 'Start Time is required'),
    SPCCE_EndDate: z.date({ required_error: 'End Date is required' }),
    SPCCE_EndTime: z.string().min(1, 'End Time is required'),
    SPCCE_Remarks: z.string().optional().nullable(),
    SPCCE_SponsorFlag: z.boolean().optional(),
    sponsorData: z.array(z.any()).optional()
});
