export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface IClassDetails {
    asmcL_Id: number;
    asmcL_ClassName: string;
    Selected?: boolean;
}

export interface IAlumniLetterStudent {
    amsT_Id: number;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    amsT_FirstName?: string;
    studentname: string;
    mothername?: string;
    fathername?: string;
    amsT_Date: string;
    amsT_DOB: string;
    asmcL_ClassName: string;
    amsT_MobileNo: string | number;
    amsT_emailId: string;
    amsT_Sex: string;
    amsT_PerStreet: string | null;
    amsT_PerArea: string | null;
    amsT_PerCity: string | null;
    amsT_PerPincode: string | number | null;
    amsT_FatherName?: string;
    selected?: boolean;
    amsT_BloodGroup?: string;
}

export interface IAlumniLettersLoadResponse {
    newuser1: IAcademicYear[];
    newuser2: IClassDetails[];
    logopath: { logoname: string }[];
}

export type IAlumniLettersReportResponse = IAlumniLetterStudent[];

export type IAlumniLettersShowReportResponse = IAlumniLetterStudent[];
