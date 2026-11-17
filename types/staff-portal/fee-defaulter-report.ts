
export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
    Selected?: boolean;
}

export interface ISection {
    amsC_Id: number;
    asmc_sectionname: string;
    Selected?: boolean;
}

export interface IInstallment {
    fmI_Id: number;
    fmI_Name: string;
    Selected?: boolean;
}

export interface ICustomGroup {
    fmgG_Id: number;
    fmg_groupname: string;
    fmgG_Id_chk?: boolean;
    fmgG_Id_chk1?: boolean;
}

export interface IFeeGroup {
    fmG_Id: number;
    fmG_GroupName: string;
    fmG_Id_chk?: boolean;
    fmG_Id_chk1?: boolean;
}

export interface IFeeTerm {
    fmT_Id: number;
    fmT_Name: string;
    fmT_Id_chk?: boolean;
}

export interface IFeeDefaulterInitialData {
    adcyear: IAcademicYear[];
    fillinstallment: IInstallment[];
    accountdetails: any[];
}

export interface IFeeDefaulterSearchRequest {
    ASMAY_Id: number;
    radioval: 'FGW' | 'FHW' | 'FCW' | 'FSW';
    reporttype: 'year' | 'date';
    active?: boolean;
    deactive?: boolean;
    left?: boolean;
    ASMCL_Id?: number;
    AMSC_Id?: number;
    FMG_Ids: number[];
    FMT_Ids?: number[];
    From_Date?: string;
    duedate?: string;
    term_group: 'T' | 'G';
    Select_Button: string;
}

export interface IDefaulterStudent {
    StudentName: string;
    AMST_AdmNo: string;
    ClassSection: string;
    AMST_FatherName: string;
    AMST_MobileNo: string;
    AMST_emailId: string;
    totalbalance: number;
    FSDREM_Remarks?: string;
    stdselected?: boolean;
}

export interface IDefaulterGroup {
    FMG_GroupName: string;
    totalbalance: number;
    grpselected?: boolean;
}

export interface IDefaulterHead {
    FMH_FeeName: string;
    totalbalance: number;
    hadselected?: boolean;
}

export interface IDefaulterClass {
    ASMCL_ClassName: string;
    totalbalance: number;
    clsselected?: boolean;
}

export interface IFeeDefaulterSearchResponse {
    radioval: string;
    studentalldata?: IDefaulterStudent[];
    groupalldata?: IDefaulterGroup[];
    headalldata?: IDefaulterHead[];
    classalldata?: IDefaulterClass[];
    mI_ID: number;
    month?: string;
    feesummlist?: any[];
}

export interface ISaveRemarkRequest {
    ASMAY_Id: number;
    remarkarray: IDefaulterStudent[];
}
