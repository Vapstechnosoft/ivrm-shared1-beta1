import { z } from 'zod';

// Interfaces for Grid Data
export interface IEventsStudentMappingData {
    spccestR_Id: number;
    spccesT_Id: number;
    asmaY_Year: string;
    studentName: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    spccmH_HouseName: string;
    categoryName: string;
    compitionLevel: string;
    eventName: string;
    spccmsccG_SportsCCGroupName: string;
    sportsName: string;
    spccmeV_EventVenue: string;
    uomName: string;
    spccestR_Rank: string;
    spccestR_Points: number;
    spccestR_Remarks: string;
    spccestR_ActiveFlag: boolean;
}

// Student Dropdown/Selection Item
export interface IStudentValues {
    amsT_Id: number;
    studentName: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    spccmH_HouseName: string;
    spccestR_Points?: number;
    spccestR_Rank?: string;
    spccestR_Remarks?: string;
    spccestR_RecordBrokenFlag?: boolean;
    ivrmgC_SportsPointsDropdownFlg?: number; // 0 for text input, 1 for dropdown
    selected?: boolean;
}

// Interface for the Entry Grid (Temporary list before saving)
export interface IEventsStudentEntry extends IStudentValues {
    // Inherits common fields, ensures consistent handling
}


// Dropdowns
export interface IEventsStudentMappingDropdowns {
    academicYear: { asmaY_Id: number; asmaY_Year: string }[];
    eventsList: { spccmE_Id: number; spccmE_EventName: string }[];
    categoryList: { spccmcC_Id: number; spccmcC_CompitionCategory: string }[];
    houseList: { spccmH_Id: number; spccmH_HouseName: string }[];
    classList: { asmcL_Id: number; asmcL_ClassName: string }[];
    sectionList: { asmS_Id: number; asmC_SectionName: string }[];
    competitionLevelList: { spccmcL_Id: number; spccmcL_CompitionLevel: string }[];
    groupList: { spccmsccG_Id: number; spccmsccG_SportsCCGroupName: string; spccmsccG_SCCFlag: string }[];
    sportsList: { spccmscC_Id: number; spccmscC_SportsCCName: string }[];
    uomList: { spccmuoM_Id: number; spccmuoM_UOMName: string }[];
}

// Filter Object for fetching students
export interface IStudentFilterParams {
    ASMAY_Id: number;
    SPCCMSCCG_SCCFlag?: string; // 'Sports' | 'Co-Curricular'
    SPCCEST_House_Class_Flag?: string; // 'CC' | 'House' | 'CS'
    SPCCMCC_Id?: number; // Competition Category
    SPCCMH_Id?: number[]; // House IDs
    ASMCL_Id?: number[]; // Class IDs
    ASMS_Id?: number[]; // Section IDs
}

// Note: The main form is complex and deals with lists, so we might not use a single simple Zod schema for everything, 
// but we define schemas for the "Common Details" part and the "Student Entry" part.

export const eventsStudentMappingSchema = z.object({
    asmaY_Id: z.coerce.number().min(1, "Academic Year is required"),
    spccmsccG_SCCFlag: z.enum(["Sports", "Co-Curricular"]),
    spccesT_House_Class_Flag: z.enum(["CC", "House", "CS"]),

    // Conditional validations would typically be handled in the component or via superRefine, 
    // but basic structure is:
    spccmcC_Id: z.coerce.number().optional(), // Category
    spccmcL_Id: z.coerce.number().min(1, "Competition Level is required"),
    spccmE_Id: z.coerce.number().min(1, "Event is required"),
    spccmsccG_Id: z.coerce.number().min(1, "Group Name is required"),
    spccmscC_Id: z.coerce.number().min(1, "Sports Name is required"),
    spccmuoM_Id: z.coerce.number().min(1, "UOM is required"),
    spccesT_Remarks: z.string().optional(),
    spccesT_OldRecord: z.string().optional(),

    // Arrays for selected IDs (used for filtering students, not directly saved)
    selectedHouses: z.array(z.number()).optional(),
    selectedClasses: z.array(z.number()).optional(),
    selectedSections: z.array(z.number()).optional(),
});

export type EventsStudentMappingFormSchema = z.infer<typeof eventsStudentMappingSchema>;
