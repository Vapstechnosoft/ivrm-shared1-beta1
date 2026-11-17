export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface ICourse {
    amcO_Id: number;
    courseName: string;
    acayC_Id?: number;
}

export interface IBranch {
    amB_Id: number;
    branchName: string;
    acaycB_Id?: number;
}

export interface ISemester {
    amsE_Id: number;
    semesterName: string;
    acaycbS_Id?: number;
}

export interface ICourseCategory {
    amcoC_Id: number;
    amcoC_Name: string;
}

export interface IAlumniSearchCriteriaRow {
    id: string;
    field: string;
    operator: string;
    value: string;
    condition?: string;
}

export interface IAlumniSearchResult {
    firstname: string;
    middlename?: string;
    lastname?: string;
    admno: string;
    coursename: string;
    branchname: string;
    semname: string;
    dob: string;
    sex: string;
    mothername: string;
    fathername: string;
    emailid: string;
    mobileno: number | string;
    bloodgroup: string;
    alcmst_id?: number; // Optional as it might be missing in some responses
}

export interface IClgAlumniSearchLoadDataResponse {
    fillyear: IAcademicYear[];
    studentCategory?: ICourseCategory[];
}

export type IClgAlumniSearchResponse = any;

export interface IClgAlumniStudentSearchPayload {
    condition: string[];
    field: string[];
    operator: string[];
    value: string[];
    amcO_Id: number;
    amB_Id: number;
    amsE_Id: number;
    asmaY_Id: number;
}
