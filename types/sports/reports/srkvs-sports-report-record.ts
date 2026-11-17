import { z } from 'zod';

// Schema for the form
export const SRKVSSportsReportRecordSchema = z.object({
    ASMAY_Id: z.number().min(1, { message: 'Academic Year is required' }),
    SPCCME_Id: z.number().min(1, { message: 'Event is required' }),
    Type: z.enum(['Record', 'Start', 'Finish', 'Consolidated', 'Indoor', 'Outdoor', 'Team', 'Externals', 'Selection'], {
        required_error: 'Report Type is required',
    }),

    // Optional/Conditional Fields
    Meet_Year: z.string().optional(),
    FromDate: z.date({ required_error: 'Date is required' }).optional(), // Legacy HTML has a date picker

    // Multi-select or Single Select based on Type
    // Storing as array of objects for multi-select compatibility
    selectedCompetitionLevels: z.array(z.object({ spccmcL_Id: z.number() })).optional(),
    // Single select ID for some types
    spccmcL_Id: z.number().optional(),

    selectedCategories: z.array(z.object({ spccmcC_Id: z.number() })).optional(),
    spccmcC_Id: z.number().optional(),

    // Specific Event Fields
    spccmsccG_Id: z.number().optional(), // Main Event
    spccmscC_Id: z.number().optional(), // Sub Event
    spccmsccG_Idsub: z.number().optional(), // Sub Sub Event (Single)

    // Sub Sub Event Multi-select
    selectedSubSubEvents: z.array(z.object({ spccmsccG_Id: z.number() })).optional(),
});

export type SRKVSSportsReportRecordFormSchema = z.infer<typeof SRKVSSportsReportRecordSchema>;

// Interface for Report Data
// The legacy code has a complex structure: users (employeeid) -> RecordDetails array
export interface ISRKVSReportRecordDetail {
    AMST_Id: number;
    AMAY_RollNo: string;
    AMST_FirstName: string;
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCESTR_Rank: string; // Place (1, 2, 3)
    SPCCESTR_Value: string; // Time/Distance value
    SPCCMUOM_UOMName: string; // Sec, Meter, etc.
    SPCCME_EventName: string;
    SPCCMSCCG_SportsCCGroupName: string;

    // Roman Letters for Attempts (e.g., I, II, III columns)
    [key: string]: any; // To allow dynamic roman letter keys like 'I', 'II', etc.
}

export interface ISRKVSReportData {
    SPCCMCC_Id: number;
    SPCCMCC_CompitionCategory: string;
    SPCCMCL_Id?: number;
    spccmcL_CompitionLevel?: string;
    SPCCMSCCG_Id?: number;
    SPCCMSCCG_SportsCCGroupName?: string; // Event Name group

    RecordDetails: ISRKVSReportRecordDetail[];
}
