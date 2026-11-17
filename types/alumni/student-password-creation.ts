export interface IStudentPasswordCreationInitialData {
    yearList: IYear[];
    classlist: IClass[];
    sectionlist: ISection[];
}

export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ICredentialStudent {
    studentname: string;
    amsT_AdmNo: string;
    username: string;
    password: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_MobileNo: string;
    amsT_emailId: string;
    amsT_Id: number;
    selected?: boolean;
}

export interface IStudentPasswordCreationReportResponse {
    data: ICredentialStudent[];
}

export interface ICommonResponse {
    success: string;
}
