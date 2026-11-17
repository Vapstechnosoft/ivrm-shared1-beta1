
export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface StudentInfo {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string | null;
    amsT_LastName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    classname: string;
    sectionname: string;
    amst_mobile: number;
    amst_email_id: string;
    asmcL_ID: number;
    amsT_PerCity?: string;
}

export interface FeeGroup {
    fmgG_Id: number;
    fmgG_GroupName: string;
    checkedgrplst: boolean;
    grpdisable: boolean;
    cantuncheck?: boolean;
}

export interface FeeTerm {
    fmT_Id: number;
    fmT_Name: string;
    fmgG_Id: number;
    checkedheadlst: boolean;
    termdisablechk: boolean;
    cantuncheck?: boolean;
}

export interface FeeStructure {
    fmH_FeeName: string;
    ftI_Name: string;
    fmg_id: number;
    fsS_OBArrearAmount: number;
    fsS_NetAmount: number;
    fsS_TotalToBePaid: number;
    fsS_ConcessionAmount: number;
    fsS_FineAmount: number;
    fsS_ToBePaid: number;
    fsS_WaivedAmount: number;
    fsS_PaidAmount: number;
    isSelected?: boolean;
    ftI_Id?: number;
    fmH_Id?: number;
    Head_Flag?: string;
    // For special head mapping
    fmG_Id?: number;
    fmG_GroupName?: string;
}

export interface PaymentGateway {
    fpgD_PGName: string;
    fpgD_Image: string;
}

export interface FeeOnlinePaymentProps {
    initialData: {
        academicyrlist: AcademicYear[];
        studentInfo: StudentInfo;
        customgrplist: FeeGroup[];
        termlst: FeeTerm[];
        disableterms: any[]; // Need to define strict type if possible
        transnumconfig: any[];
        feeconfiglist: any[];
        specialheadlist: any[];
        specialheaddetails: any[];
    }
}

export interface GroupTermMapping {
    grp: FeeGroup;
    trm_list: FeeTerm[];
}
