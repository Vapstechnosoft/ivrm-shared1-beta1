export interface IClgAlumniApprovalDetails {
    alcsreg_id: number;
    membername: string;
    admitted_year: string;
    left_year: string;
    admit_course: string | null;
    left_course: string | null;
    admit_branch: string | null;
    left_branch: string | null;
    isSelected22?: boolean;
    // New fields from JSON
    amcsT_FirstName?: string;
    amcsT_ID?: number;
    amcO_CourseName?: string;
    amB_BranchName?: string;
    alcsreG_AdmittedYear?: number;
    alcsreG_LeftYear?: number;
}

export interface IStudentMatchDetails {
    membername: string;
    alcmsT_AdmNo: string;
    yeardmitted: string;
    courseadmitted: string;
    branchadmitted: string;
    alcmsT_Id: number;
    alcsreG_Id: number;
    isSelected?: boolean;
    // Fallbacks
    amcsT_FirstName?: string;
    amcsT_ID?: number;
}

export interface IClgAlumniApprovalLoadDataResponse {
    retObject: IClgAlumniApprovalDetails[];
    fillyear: any[]; // Or define IAcademicYear if needed
}

export interface ICheckStudentAlumniResponse {
    studentDetails: IStudentMatchDetails[];
}

export interface IApproveClgAlumniResponse {
    returnval?: string;
    success?: boolean;
    message?: string;
}

export interface IClgAlumniSaveData {
    ALCMST_Id: number;
    ALCMST_MobileNo: number;
    ALCMST_emailId: string;
    ALCMST_PerStreet: string;
    ALCMST_PerArea: string;
    ALCMST_PerCity: string;
    ALCMST_PerCountry: number;
    ALCMST_PerState: number;
    ALCMST_PerPincode: number;
    ALCMST_PerAdd3: string;
    ALCMST_DOB: string;
    professionalDetails: {
        ALCSPR_CompanyName: string;
        ALCSPR_CompanyAddress: string;
        ALCSPR_Designation: string;
        ALCSPR_EmailId: string;
        ALCSPR_Phone: number;
        ALCSPR_OtherDetails: string;
        ALCSPR_WorkingSince: string;
    }[];
    achievementsDetails: {
        ALCSAC_Achievement: string;
        ALCSAC_Remarks: string;
    }[];
    qualificationDetails: {
        ALCSQU_Qulification: string;
        ALCSQU_University: string;
        ALCSQU_OtherDetails: string;
        ALCSQU_YearOfPassing: number;
    }[];
}

export interface ISaveClgAlumniResponse {
    returnval: string;
}

export interface IClgAlumniSearchFilter {
    searchfilter: string;
    ASMAY_Id: number;
}

export type ISearchFilterClgAlumniResponse = IClgAlumniApprovalDetails[] | {
    retObject?: IClgAlumniApprovalDetails[];
    data?: IClgAlumniApprovalDetails[];
};
