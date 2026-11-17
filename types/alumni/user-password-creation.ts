export interface IUserPasswordCreationInitialData {
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

export interface IStudent {
    studentname: string;
    amst_admno: string;
    asmcl_classname: string;
    asmc_sectionname: string;
    amst_id: number;
    selected?: boolean;
}

export interface IUserPasswordCreationReportResponse {
    success: boolean;
    message: string;
    data: IStudent[];
}
